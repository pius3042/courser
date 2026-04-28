'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectItem } from '@/components/ui/select';
import { GraduationCap, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const DEPARTMENTS = [
  'Computer Science', 'Mathematics', 'Physics', 'Chemistry',
  'Biology', 'Engineering', 'Medicine', 'Law', 'Business Administration', 'Economics',
];

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '', email: '', matricNumber: '',
    department: 'Computer Science', level: '100', semester: '1', password: '', confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name, email: form.email, matricNumber: form.matricNumber,
          department: form.department, level: parseInt(form.level),
          semester: parseInt(form.semester), password: form.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Registration failed'); return; }
      setStep('success');
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-2">Account Created!</h2>
          <p className="text-white/50 mb-6">Your student account has been created successfully. You can now log in.</p>
          <motion.button
            onClick={() => router.push('/login')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 rounded-xl font-semibold bg-linear-to-r from-blue-500 to-violet-600 text-white"
          >
            Go to Login
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-blue-600/15 blur-[100px]" />
        <div className="absolute -bottom-20 right-0 w-96 h-96 rounded-full bg-violet-600/15 blur-[100px]" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="w-full max-w-lg relative z-10">
        <div className="text-center mb-8">
          <Link href="/">
            <motion.div whileHover={{ scale: 1.05 }} className="inline-flex p-4 rounded-2xl bg-linear-to-br from-blue-500 to-violet-600 mb-4 shadow-lg shadow-blue-500/30">
              <GraduationCap className="w-12 h-12 text-white" />
            </motion.div>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-1">Student Registration</h1>
          <p className="text-white/40">University of Port Harcourt</p>
        </div>

        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <UserPlus className="w-5 h-5" /> Create Account
            </CardTitle>
            <CardDescription className="text-white/40">Fill in your details to create a student account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span className="text-sm">{error}</span>
                </motion.div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium text-white/70 mb-2">Full Name</label>
                  <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g., John Doe" required />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium text-white/70 mb-2">Email Address</label>
                  <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@uniport.edu.ng" required />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium text-white/70 mb-2">Matric Number</label>
                  <Input value={form.matricNumber} onChange={e => setForm({ ...form, matricNumber: e.target.value })} placeholder="e.g., 2024/123456" required />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium text-white/70 mb-2">Department</label>
                  <Select value={form.department} onValueChange={v => setForm({ ...form, department: v })} placeholder="Select Department">
                    {DEPARTMENTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Level</label>
                  <Select value={form.level} onValueChange={v => setForm({ ...form, level: v })}>
                    <SelectItem value="100">100 Level</SelectItem>
                    <SelectItem value="200">200 Level</SelectItem>
                    <SelectItem value="300">300 Level</SelectItem>
                    <SelectItem value="400">400 Level</SelectItem>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Semester</label>
                  <Select value={form.semester} onValueChange={v => setForm({ ...form, semester: v })}>
                    <SelectItem value="1">First Semester</SelectItem>
                    <SelectItem value="2">Second Semester</SelectItem>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Password</label>
                  <Input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Min. 6 characters" required minLength={6} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Confirm Password</label>
                  <Input type="password" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} placeholder="Repeat password" required />
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold bg-linear-to-r from-blue-500 to-violet-600 text-white shadow-lg shadow-blue-500/25 disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : <><UserPlus className="w-5 h-5" /> Create Account</>}
              </motion.button>
            </form>

            <div className="mt-6 text-center text-sm text-white/40">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium">Login here</Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
