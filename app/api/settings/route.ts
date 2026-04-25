import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Settings from '@/models/Settings';
import Student from '@/models/Student';
import Registration from '@/models/Registration';
import { getSession } from '@/lib/auth';

async function getOrCreateSettings() {
  let s = await Settings.findOne();
  if (!s) s = await Settings.create({});
  return s;
}

export async function GET() {
  try {
    await dbConnect();
    const settings = await getOrCreateSettings();
    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Get settings error:', error);
    return NextResponse.json({ error: 'Failed to get settings' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    const current = await getOrCreateSettings();

    const newSession = body.currentSession ?? current.currentSession;
    const newSemester = Number(body.currentSemester ?? current.currentSemester);
    const sessionChanged = newSession !== current.currentSession;
    const semesterChanged = newSemester !== current.currentSemester;

    // SESSION CHANGE: bump student levels + close stale registrations
    if (sessionChanged) {
      // Close all pending registrations from the old session
      await Registration.updateMany(
        { session: current.currentSession, status: { $in: ['pending', 'rejected'] } },
        { status: 'closed' }
      );

      // Bump every student's level (cap at 400), reset semester to 1
      await Student.updateMany(
        { level: { $lt: 400 } },
        [{ $set: { level: { $add: ['$level', 100] }, semester: 1 } }]
      );
      // Students already at 400 just reset semester
      await Student.updateMany({ level: 400 }, { semester: 1 });
    }

    // SEMESTER CHANGE: update all students' semester + close stale registrations
    if (semesterChanged && !sessionChanged) {
      await Student.updateMany({}, { semester: newSemester });

      // If late registration is NOT allowed, close pending registrations from previous semester
      const lateAllowed = body.allowLateRegistration ?? current.allowLateRegistration;
      if (!lateAllowed) {
        await Registration.updateMany(
          {
            session: current.currentSession,
            semester: current.currentSemester,
            status: { $in: ['pending', 'rejected'] },
          },
          { status: 'closed' }
        );
      }
    }

    // Save updated settings
    const updated = await Settings.findOneAndUpdate(
      {},
      {
        ...body,
        currentSemester: newSemester,
        currentSession: newSession,
        updatedAt: new Date(),
      },
      { new: true, upsert: true }
    );

    return NextResponse.json({ settings: updated, sessionChanged, semesterChanged });
  } catch (error) {
    console.error('Update settings error:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
