import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Student from '@/models/Student';
import Course from '@/models/Course';
import Registration from '@/models/Registration';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    if (session.role === 'student') {
      // Student dashboard stats
      const student = await Student.findById(session.id);
      const registrations = await Registration.find({ studentId: session.id })
        .sort({ createdAt: -1 });
      
      const currentRegistration = registrations[0];
      const availableCourses = await Course.find({
        department: student?.department,
        level: student?.level,
        semester: student?.semester,
      });

      return NextResponse.json({
        student: {
          name: student?.name,
          matricNumber: student?.matricNumber,
          department: student?.department,
          level: student?.level,
          semester: student?.semester,
          completedCourses: student?.completedCourses || [],
        },
        currentRegistration,
        registrations,
        availableCourses: availableCourses.length,
        stats: {
          totalRegistrations: registrations.length,
          currentUnits: currentRegistration?.totalUnits || 0,
          maxUnits: 24,
          completedCourses: student?.completedCourses?.length || 0,
        },
      });
    } else {
      // Admin dashboard stats
      const [totalStudents, totalCourses, allRegistrations] = await Promise.all([
        Student.countDocuments(),
        Course.countDocuments(),
        Registration.find().populate('studentId', 'name matricNumber department level'),
      ]);

      const pendingRegistrations = allRegistrations.filter(r => r.status === 'pending').length;
      const approvedRegistrations = allRegistrations.filter(r => r.status === 'approved').length;

      return NextResponse.json({
        stats: {
          totalStudents,
          totalCourses,
          pendingRegistrations,
          approvedRegistrations,
          totalRegistrations: allRegistrations.length,
        },
        recentRegistrations: allRegistrations.slice(0, 10),
      });
    }
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}