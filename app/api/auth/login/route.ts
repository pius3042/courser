import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import Student from '@/models/Student';
import Admin from '@/models/Admin';
import { createToken } from '@/lib/auth';
import { z } from 'zod';

const loginSchema = z.object({
  identifier: z.string().min(1),
  password: z.string().min(1),
  role: z.enum(['student', 'admin']),
});

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const body = await req.json();
    const { identifier, password, role } = loginSchema.parse(body);

    let user;
    if (role === 'student') {
      user = await Student.findOne({
        $or: [{ matricNumber: identifier }, { email: identifier }]
      });
    } else {
      user = await Admin.findOne({ email: identifier });
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = await createToken({
      id: user._id,
      role,
      ...(role === 'student' && {
        matricNumber: user.matricNumber,
        department: user.department,
        level: user.level,
        semester: user.semester,
      }),
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        ...(role === 'student' && {
          matricNumber: user.matricNumber,
          department: user.department,
          level: user.level,
          semester: user.semester,
        }),
      },
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400,
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
