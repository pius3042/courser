'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen, CheckCircle, Clock, TrendingUp, LogOut,
  User, Calendar, Award, GraduationCap, Sparkles, Trash2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/ui/toast';

export default function DashboardPage() {
  const router = useRouter();
  const { toast, confirm } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/dashboard/stats');
      if (!res.ok) { router.push('/login'); return; }
      const data = await res.json();
      setStats(data);
      setLoading(false);
    } catch { router.push('/login'); }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const handleDeleteRegistration = async (id: string) => {
    confirm({
      message: 'Are you sure you want to delete this registration?',
      confirmLabel: 'Delete',
      destructive: true,
      onConfirm: async () => {
        const res = await fetch(`/api/registrations?id=${id}`, { method: 'DELETE' });
        if (res.ok) { fetchStats(); toast('success', 'Registration deleted successfully'); }
        else { const data = await res.json(); toast('error', data.error || 'Failed to delete'); }
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const student = stats?.student;
  const currentReg = stats?.currentRegistration;
  const totalUnits = stats?.stats?.currentUnits || 0;
  const maxUnits = 24;
  const progress = Math.round((totalUnits / maxUnits) * 100);

  const statCards = [
    { label: 'Current Session', value: '2025/2026', icon: <Calendar className="w-8 h-8 text-white" />, color: 'from-blue-500 to-cyan-500' },
    { label: 'Registered Units', value: `${totalUnits} / ${maxUnits}`, icon: <Award className="w-8 h-8 text-white" />, color: 'from-emerald-500 to-teal-500' },
    { label: 'Courses Selected', value: currentReg?.courses?.length || 0, icon: <BookOpen className="w-8 h-8 text-white" />, color: 'from-violet-500 to-purple-500' },
    { label: 'Completed Courses', value: student?.completedCourses?.length || 0, icon: <CheckCircle className="w-8 h-8 text-white" />, color: 'from-indigo-500 to-blue-500' },
  ];

  return (
    <div className="min-h-screen p-6">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute top-1/2 right-0 w-96 h-96 rounded-full bg-violet-600/10 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-linear-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-xl md:text-2xl font-bold shadow-lg shadow-blue-500/30 shrink-0">
              {student?.name?.charAt(0) || 'S'}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Welcome back, {student?.name?.split(' ')[0]}!</h1>
              <p className="text-white/40 text-xs md:text-sm">{student?.matricNumber} · {student?.department} · {student?.level} Level</p>
            </div>
          </div>
          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-sm font-medium transition-all"
          >
            <LogOut className="w-4 h-4" /> Logout
          </motion.button>
        </div>

        {/* Stat Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {statCards.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <div className="glass-effect rounded-2xl p-5 flex items-center justify-between hover:border-white/15 transition-colors">
                <div>
                  <p className="text-sm text-white/40 mb-1">{item.label}</p>
                  <p className="text-2xl font-bold text-white">{item.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-linear-to-br ${item.color} opacity-80`}>
                  {item.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Card */}
            <div className="glass-effect rounded-2xl p-6">
              <h2 className="flex items-center gap-2 text-lg font-bold text-white mb-6">
                <TrendingUp className="w-5 h-5 text-blue-400" /> Registration Progress
              </h2>
              <div className="mb-6">
                <div className="flex justify-between mb-2 text-sm font-medium">
                  <span className="text-white/60">Credit Units Used</span>
                  <span className={`font-bold ${totalUnits > 20 ? 'text-orange-400' : 'text-blue-400'}`}>
                    {totalUnits} / {maxUnits} Units
                  </span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className={`h-full rounded-full ${totalUnits > 20 ? 'bg-linear-to-r from-orange-500 to-red-500' : 'bg-linear-to-r from-blue-500 to-violet-500'}`}
                  />
                </div>
                <p className="text-xs text-white/30 mt-1">{maxUnits - totalUnits} units remaining</p>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/8">
                {[
                  { label: 'Courses', value: currentReg?.courses?.length || 0, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                  { label: 'Units', value: totalUnits, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                  { label: 'Status', value: currentReg?.status || 'None', color: 'text-violet-400', bg: 'bg-violet-500/10' },
                ].map((item, i) => (
                  <div key={i} className={`text-center p-3 md:p-4 rounded-xl ${item.bg}`}>
                    <p className={`text-xl md:text-2xl font-bold capitalize ${item.color} break-words`}>{item.value}</p>
                    <p className="text-xs text-white/40 mt-1">{item.label}</p>
                  </div>
                ))}
              </div>

              <Link href="/register" className="block mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold bg-linear-to-r from-blue-500 to-violet-600 text-white shadow-lg shadow-blue-500/25"
                >
                  <BookOpen className="w-5 h-5" />
                  {currentReg ? 'Modify Registration' : 'Start Registration'}
                </motion.button>
              </Link>
            </div>

            {/* Registered Courses */}
            {currentReg?.courses?.length > 0 && (
              <div className="glass-effect rounded-2xl p-5 md:p-6">
                <h2 className="flex items-center gap-2 text-base md:text-lg font-bold text-white mb-4">
                  <GraduationCap className="w-5 h-5 text-indigo-400" /> Current Registered Courses
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
                  {currentReg.courses.map((code: string, i: number) => (
                    <motion.div key={code} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }} whileHover={{ scale: 1.05 }}
                      className="p-2 md:p-3 rounded-xl border border-blue-500/30 bg-blue-500/10 text-center font-bold text-blue-300 text-sm md:text-base">
                      {code}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Student Info */}
            <div className="glass-effect rounded-2xl p-5">
              <h3 className="flex items-center gap-2 text-sm font-bold text-white mb-4">
                <User className="w-4 h-4 text-white/50" /> Student Info
              </h3>
              <div className="space-y-3 text-sm">
                {[
                  { label: 'Name', value: student?.name },
                  { label: 'Matric No.', value: student?.matricNumber },
                  { label: 'Department', value: student?.department },
                  { label: 'Level', value: `${student?.level} Level` },
                  { label: 'Semester', value: `Semester ${student?.semester}` },
                ].map(item => (
                  <div key={item.label} className="flex justify-between py-2 border-b border-white/5 last:border-0">
                    <span className="text-white/40">{item.label}</span>
                    <span className="font-semibold text-white/80 text-right">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="glass-effect rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-4">Quick Actions</h3>
              <div className="flex flex-col gap-2">
                {[
                  { href: '/register', icon: <BookOpen className="w-4 h-4" />, label: 'Register Courses' },
                  { href: '/history', icon: <Clock className="w-4 h-4" />, label: 'View History' },
                  { href: '/profile', icon: <User className="w-4 h-4" />, label: 'Profile Settings' },
                  ...(currentReg ? [{ href: '/slip', icon: <Sparkles className="w-4 h-4" />, label: 'Print Reg. Slip' }] : []),
                ].map(item => (
                  <Link key={item.href} href={item.href}>
                    <motion.div whileHover={{ x: 4 }}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-white/8 bg-white/4 hover:bg-white/8 text-white/60 hover:text-white text-sm font-medium transition-all cursor-pointer">
                      {item.icon} {item.label}
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="glass-effect rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-4">Recent Activity</h3>
              {stats?.registrations?.length > 0 ? (
                <div className="space-y-3">
                  {stats.registrations.slice(0, 3).map((reg: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-white/4 border border-white/8">
                      <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white/80">{reg.session} — Sem {reg.semester}</p>
                        <p className="text-xs text-white/40">{reg.courses.length} courses · {reg.totalUnits} units</p>
                      </div>
                      <Badge variant={reg.status === 'approved' ? 'success' : reg.status === 'pending' ? 'warning' : 'destructive'}>
                        {reg.status}
                      </Badge>
                      {reg.status !== 'approved' && (
                        <button onClick={() => handleDeleteRegistration(reg._id)}
                          className="p-1.5 rounded-md text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-white/30 text-center py-4">No registration history yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
