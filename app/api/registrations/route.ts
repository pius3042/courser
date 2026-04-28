import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Registration from '@/models/Registration';
import Course from '@/models/Course';
import Student from '@/models/Student';
import Settings from '@/models/Settings';
import { getSession } from '@/lib/auth';
import { z } from 'zod';

const registrationSchema = z.object({
  session: z.string(),
  semester: z.number(),
  courses: z.array(z.string()),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'student') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    const body = await req.json();
    const { session: academicSession, semester, courses: selectedCourses } = registrationSchema.parse(body);

    // Fetch system settings
    const settings = await Settings.findOne();
    const requirePrerequisiteCheck = settings?.requirePrerequisiteCheck ?? true;

    const student = await Student.findById(session.id);
    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Fetch course details
    const courses = await Course.find({ code: { $in: selectedCourses } });
    
    // Validation: Check compulsory courses
    const availableCourses = await Course.find({
      department: student.department,
      level: student.level,
      semester: student.semester,
    });
    
    const compulsoryCourses = availableCourses.filter(c => c.compulsory);
    const missingCompulsory = compulsoryCourses.filter(
      c => !selectedCourses.includes(c.code)
    );

    if (missingCompulsory.length > 0) {
      return NextResponse.json({
        error: 'Missing compulsory courses',
        missingCourses: missingCompulsory.map(c => c.code),
      }, { status: 400 });
    }

    // Validation: Check prerequisites (only if enabled in settings)
    if (requirePrerequisiteCheck) {
      for (const course of courses) {
        if (course.prerequisites && course.prerequisites.length > 0) {
          const missingPrereqs = course.prerequisites.filter(
            (prereq: string) =>
              !student.completedCourses.includes(prereq) &&
              !selectedCourses.includes(prereq)
          );
          
          if (missingPrereqs.length > 0) {
            return NextResponse.json({
              error: `Missing prerequisites for ${course.code}`,
              course: course.code,
              missingPrerequisites: missingPrereqs,
            }, { status: 400 });
          }
        }
      }
    }

    // Validation: Check duplicate semester registration
    const existingRegistration = await Registration.findOne({
      studentId: student._id,
      session: academicSession,
      semester,
    });

    if (existingRegistration) {
      return NextResponse.json({
        error: `You have already registered for ${academicSession} Semester ${semester}. You cannot register twice for the same semester.`,
      }, { status: 400 });
    }

    // Validation: Check duplicate courses
    const duplicates = selectedCourses.filter(code =>
      student.completedCourses.includes(code)
    );

    if (duplicates.length > 0) {
      return NextResponse.json({
        error: 'Cannot register for already completed courses',
        duplicateCourses: duplicates,
      }, { status: 400 });
    }

    // Calculate total units
    const totalUnits = courses.reduce((sum, course) => sum + course.units, 0);

    // Validation: Check maximum units (24)
    if (totalUnits > 24) {
      return NextResponse.json({
        error: 'Exceeded maximum credit units',
        totalUnits,
        maxUnits: 24,
      }, { status: 400 });
    }

    // Create registration
    const registration = await Registration.create({
      studentId: student._id,
      session: academicSession,
      semester,
      courses: selectedCourses,
      totalUnits,
      status: 'pending',
    });

    return NextResponse.json({
      success: true,
      registration,
      totalUnits,
    }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    let registrations;
    if (session.role === 'student') {
      registrations = await Registration.find({ studentId: session.id })
        .sort({ createdAt: -1 });
    } else {
      registrations = await Registration.find()
        .populate('studentId', 'name matricNumber department level')
        .sort({ createdAt: -1 });
    }

    return NextResponse.json({ registrations });
  } catch (error) {
    console.error('Fetch registrations error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch registrations' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Registration ID required' }, { status: 400 });
    }

    const query = session.role === 'admin'
      ? { _id: id }
      : { _id: id, studentId: session.id };

    const registration = await Registration.findOne(query);

    if (!registration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    // Students cannot delete approved registrations; admins can delete any
    if (session.role !== 'admin' && registration.status === 'approved') {
      return NextResponse.json(
        { error: 'Cannot delete an approved registration' },
        { status: 403 }
      );
    }

    await Registration.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete registration error:', error);
    return NextResponse.json({ error: 'Failed to delete registration' }, { status: 500 });
  }
}
