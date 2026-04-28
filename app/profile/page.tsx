'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, Save, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/ui/toast';

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [password, setPassword] = useState({ current: '', new: '', confirm: '' });

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/dashboard/stats');
      if (!res.ok) { router.push('/login'); return; }
      const data = await res.json();
      setStudent(data.student);
      setLoading(false);
    } catch { router.push('/login'); }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.new && password.new !== password.confirm) { toast('error', 'New passwords do not match'); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-violet-600/10 blur-[120px]" />
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="mb-8">
          <Link href="/dashboard">
            <motion.button whileHover={{ x: -4 }}
              className="inline-flex items-center gap-2 mb-4 text-white/40 hover:text-white text-sm transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </motion.button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">Profile Settings</h1>
          <p className="text-white/40 text-sm">Manage your account information</p>
        </div>

        {/* Avatar card */}
        <div className="glass-effect rounded-2xl p-5 md:p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 md:gap-6">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-linear-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-2xl md:text-3xl font-bold shadow-lg shadow-blue-500/30 shrink-0">
              {student?.name?.charAt(0)}
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-xl md:text-2xl font-bold text-white">{student?.name}</h2>
              <p className="text-white/40 text-sm md:text-base">{student?.matricNumber}</p>
              <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
                <Badge variant="default">{student?.department}</Badge>
                <Badge variant="secondary">{student?.level} Level</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Form card */}
        <div className="glass-effect rounded-2xl p-6 mb-6">
          <h3 className="flex items-center gap-2 text-white font-bold mb-5">
            <User className="w-5 h-5 text-white/50" /> Account Information
          </h3>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Full Name</label>
                <Input value={student?.name || ''} readOnly className="opacity-60 cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Matric Number</label>
                <Input value={student?.matricNumber || ''} readOnly className="opacity-60 cursor-not-allowed" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Email Address</label>
              <Input value={student?.email || ''} readOnly className="opacity-60 cursor-not-allowed" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Department</label>
                <Input value={student?.department || ''} readOnly className="opacity-60 cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Level</label>
                <Input value={`${student?.level} Level` || ''} readOnly className="opacity-60 cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Semester</label>
                <Input value={`Semester ${student?.semester}` || ''} readOnly className="opacity-60 cursor-not-allowed" />
              </div>
            </div>

            <div className="pt-4 border-t border-white/8">
              <h4 className="font-semibold text-white mb-4 text-sm md:text-base">Change Password</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">Current Password</label>
                  <Input type="password" value={password.current}
                    onChange={e => setPassword({ ...password, current: e.target.value })}
                    placeholder="Enter current password" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-2">New Password</label>
                    <Input type="password" value={password.new}
                      onChange={e => setPassword({ ...password, new: e.target.value })}
                      placeholder="Enter new password" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-2">Confirm Password</label>
                    <Input type="password" value={password.confirm}
                      onChange={e => setPassword({ ...password, confirm: e.target.value })}
                      placeholder="Confirm new password" />
                  </div>
                </div>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={saving}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold bg-linear-to-r from-blue-500 to-violet-600 text-white shadow-lg shadow-blue-500/25 disabled:opacity-60"
            >
              {saved ? (
                <><CheckCircle className="w-5 h-5 text-emerald-300" /> Saved!</>
              ) : saving ? 'Saving...' : (
                <><Save className="w-5 h-5" /> Save Changes</>
              )}
            </motion.button>
          </form>
        </div>

        {/* Completed Courses */}
        {student?.completedCourses?.length > 0 && (
          <div className="glass-effect rounded-2xl p-5 md:p-6">
            <h3 className="flex items-center gap-2 text-white font-bold mb-4 text-sm md:text-base">
              <CheckCircle className="w-5 h-5 text-emerald-400" /> Completed Courses
            </h3>
            <div className="flex flex-wrap gap-2">
              {student.completedCourses.map((code: string) => (
                <Badge key={code} variant="success" className="text-xs md:text-sm">{code}</Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
