'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Users, BookOpen, FileText, TrendingUp, LogOut, Plus, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({ totalStudents: 0, totalCourses: 0, pendingRegistrations: 0, approvedRegistrations: 0 });
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async () => {
    try {
      const [studentsRes, coursesRes, registrationsRes] = await Promise.all([
        fetch('/api/students'), fetch('/api/courses'), fetch('/api/registrations'),
      ]);
      if (!studentsRes.ok || !coursesRes.ok || !registrationsRes.ok) { router.push('/admin/login'); return; }
      const [s, c, r] = await Promise.all([studentsRes.json(), coursesRes.json(), registrationsRes.json()]);
      setStats({
        totalStudents: s.students?.length || 0,
        totalCourses: c.courses?.length || 0,
        pendingRegistrations: r.registrations?.filter((x: any) => x.status === 'pending').length || 0,
        approvedRegistrations: r.registrations?.filter((x: any) => x.status === 'approved').length || 0,
      });
      setRegistrations(r.registrations || []);
      setLoading(false);
    } catch { router.push('/admin/login'); }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const statCards = [
    { label: 'Total Students', value: stats.totalStudents, icon: <Users className="w-10 h-10 text-blue-400" />, color: 'from-blue-500 to-cyan-500' },
    { label: 'Total Courses', value: stats.totalCourses, icon: <BookOpen className="w-10 h-10 text-emerald-400" />, color: 'from-emerald-500 to-teal-500' },
    { label: 'Pending', value: stats.pendingRegistrations, icon: <FileText className="w-10 h-10 text-yellow-400" />, color: 'from-yellow-500 to-orange-500' },
    { label: 'Approved', value: stats.approvedRegistrations, icon: <TrendingUp className="w-10 h-10 text-violet-400" />, color: 'from-violet-500 to-purple-500' },
  ];

  const quickActions = [
    { href: '/admin/students', icon: <Users className="w-4 h-4" />, label: 'Manage Students' },
    { href: '/admin/courses', icon: <BookOpen className="w-4 h-4" />, label: 'Manage Courses' },
    { href: '/admin/registrations', icon: <FileText className="w-4 h-4" />, label: 'View Registrations' },
    { href: '/admin/settings', icon: <Settings className="w-4 h-4" />, label: 'Settings' },
    { href: '/admin/admins', icon: <Users className="w-4 h-4" />, label: 'Manage Admins' },
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 right-0 w-96 h-96 rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute bottom-0 -left-40 w-96 h-96 rounded-full bg-blue-600/10 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-1">Admin Dashboard</h1>
            <p className="text-white/40">Manage students, courses, and registrations</p>
          </div>
          <motion.button onClick={handleLogout} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-sm font-medium transition-all">
            <LogOut className="w-4 h-4" /> Logout
          </motion.button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <div className="glass-effect rounded-2xl p-5 flex items-center justify-between hover:border-white/15 transition-colors">
                <div>
                  <p className="text-sm text-white/40 mb-1">{item.label}</p>
                  <p className="text-3xl font-bold text-white">{item.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-linear-to-br ${item.color} opacity-80`}>{item.icon}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Registrations */}
          <div className="lg:col-span-2 glass-effect rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-5">Recent Registrations</h2>
            <div className="space-y-3">
              {registrations.slice(0, 5).map((reg, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.08 }}
                  className="flex items-center justify-between p-4 rounded-xl border border-white/8 bg-white/4 hover:border-white/15 transition-colors">
                  <div className="flex-1">
                    <p className="font-bold text-white">{reg.studentId?.name || 'Unknown Student'}</p>
                    <p className="text-sm text-white/40">
                      {reg.studentId?.matricNumber} · {reg.courses.length} courses · {reg.totalUnits} units
                    </p>
                  </div>
                  <Badge variant={reg.status === 'approved' ? 'success' : reg.status === 'pending' ? 'warning' : 'destructive'}>
                    {reg.status}
                  </Badge>
                </motion.div>
              ))}
              {registrations.length === 0 && (
                <p className="text-white/30 text-center py-8">No registrations yet</p>
              )}
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-5">
            {/* Quick Actions */}
            <div className="glass-effect rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-4">Quick Actions</h3>
              <div className="flex flex-col gap-2">
                {quickActions.map(item => (
                  <Link key={item.href} href={item.href}>
                    <motion.div whileHover={{ x: 4 }}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-white/8 bg-white/4 hover:bg-white/8 text-white/60 hover:text-white text-sm font-medium transition-all cursor-pointer">
                      {item.icon} {item.label}
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Add New */}
            <div className="glass-effect rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-4">Add New</h3>
              <div className="flex flex-col gap-2">
                {[
                  { href: '/admin/students/new', label: 'Add Student' },
                  { href: '/admin/courses/new', label: 'Add Course' },
                ].map(item => (
                  <Link key={item.href} href={item.href}>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm bg-linear-to-r from-blue-500 to-violet-600 text-white">
                      <Plus className="w-4 h-4" /> {item.label}
                    </motion.button>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
