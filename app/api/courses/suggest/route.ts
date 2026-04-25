import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Course from '@/models/Course';
import Student from '@/models/Student';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'student') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const student = await Student.findById(session.id);
    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const suggestedCourses = await Course.find({
      department: student.department,
      level: student.level,
      semester: student.semester,
      code: { $nin: student.completedCourses },
    }).sort({ compulsory: -1, code: 1 });

    return NextResponse.json({
      suggested: suggestedCourses,
      student: {
        name: student.name,
        matricNumber: student.matricNumber,
        email: student.email,
        department: student.department,
        level: student.level,
        semester: student.semester,
        completedCourses: student.completedCourses || [],
      },
    });
  } catch (error) {
    console.error('Suggest courses error:', error);
    return NextResponse.json({ error: 'Failed to suggest courses' }, { status: 500 });
  }
}
