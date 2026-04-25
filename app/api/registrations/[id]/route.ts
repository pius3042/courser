import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Registration from '@/models/Registration';
import Course from '@/models/Course';
import { getSession } from '@/lib/auth';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    // Admin: can only update status
    if (session.role === 'admin') {
      const registration = await Registration.findByIdAndUpdate(
        id,
        { status: body.status },
        { new: true }
      );
      if (!registration) {
        return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
      }
      return NextResponse.json({ registration });
    }

    // Student: can update courses (resets status to pending)
    if (session.role === 'student') {
      const registration = await Registration.findOne({ _id: id, studentId: session.id });
      if (!registration) {
        return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
      }

      const courses = await Course.find({ code: { $in: body.courses } });
      const totalUnits = courses.reduce((sum: number, c: any) => sum + c.units, 0);

      const updated = await Registration.findByIdAndUpdate(
        id,
        { courses: body.courses, totalUnits, status: 'pending' },
        { new: true }
      );
      return NextResponse.json({ registration: updated });
    }

    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  } catch (error) {
    console.error('Update registration error:', error);
    return NextResponse.json({ error: 'Failed to update registration' }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    const registration = await Registration.findById(id)
      .populate('studentId', 'name matricNumber department level');
    
    if (!registration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }
    
    return NextResponse.json({ registration });
  } catch (error) {
    console.error('Get registration error:', error);
    return NextResponse.json(
      { error: 'Failed to get registration' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    const registration = await Registration.findByIdAndDelete(id);
    
    if (!registration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Registration deleted successfully' });
  } catch (error) {
    console.error('Delete registration error:', error);
    return NextResponse.json(
      { error: 'Failed to delete registration' },
      { status: 500 }
    );
  }
}
