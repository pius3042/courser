import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import Student from '@/models/Student';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { name, email, matricNumber, department, level, semester, password } = body;

    if (!name || !email || !matricNumber || !department || !level || !semester || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const existing = await Student.findOne({ $or: [{ email }, { matricNumber }] });
    if (existing) {
      return NextResponse.json(
        { error: existing.email === email ? 'Email already registered' : 'Matric number already registered' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const student = await Student.create({
      name, email, matricNumber, department,
      level: parseInt(level), semester: parseInt(semester),
      password: hashedPassword,
      completedCourses: [],
    });

    return NextResponse.json({ success: true, matricNumber: student.matricNumber }, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ error: 'Email or matric number already exists' }, { status: 400 });
    }
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
