'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import GlassCard from '@/components/GlassCard';
import AnimatedCounter from '@/components/AnimatedCounter';
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

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/dashboard/stats');
      if (!res.ok) { router.push('/login'); return; }
      const data = await res.json();
      setStats(data);
      setLoading(false);
    } catch {
      router.push('/login');
    }
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
        if (res.ok) {
          fetchStats();
          toast('success', 'Registration deleted successfully');
        } else {
          const data = await res.json();
          toast('error', data.error || 'Failed to delete registration');
        }
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const student = stats?.student;
  const currentReg = stats?.currentRegistration;
  const totalUnits = stats?.stats?.currentUnits || 0;
  const maxUnits = 24;
  const progress = Math.round((totalUnits / maxUnits) * 100);

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {student?.name?.charAt(0) || 'S'}
            </div>
            <div>
              <h1 className="text-3xl font-bold">Welcome back, {student?.name?.split(' ')[0]}!</h1>
              <p className="text-gray-600">{student?.matricNumber} · {student?.department} · {student?.level} Level</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="max-w-7xl mx-auto grid gap-5 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {[
          { label: 'Current Session', value: '2025/2026', icon: <Calendar className="w-9 h-9 text-blue-500" />, bg: 'bg-blue-50' },
          { label: 'Registered Units', value: `${totalUnits} / ${maxUnits}`, icon: <Award className="w-9 h-9 text-green-500" />, bg: 'bg-green-50' },
          { label: 'Courses Selected', value: currentReg?.courses?.length || 0, icon: <BookOpen className="w-9 h-9 text-purple-500" />, bg: 'bg-purple-50' },
          { label: 'Completed Courses', value: student?.completedCourses?.length || 0, icon: <CheckCircle className="w-9 h-9 text-indigo-500" />, bg: 'bg-indigo-50' },
        ].map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="glass-effect hover:shadow-xl transition-all">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{item.label}</p>
                    <p className="text-2xl font-bold">{item.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${item.bg}`}>{item.icon}</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto grid gap-6 lg:grid-cols-3">
        {/* Progress Card */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                Registration Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between mb-2 text-sm font-medium">
                  <span>Credit Units Used</span>
                  <span className={totalUnits > 20 ? 'text-orange-600 font-bold' : 'text-blue-600 font-bold'}>
                    {totalUnits} / {maxUnits} Units
                  </span>
                </div>
                <Progress value={progress} />
                <p className="text-xs text-gray-500 mt-1">{maxUnits - totalUnits} units remaining</p>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                {[
                  { label: 'Courses', value: currentReg?.courses?.length || 0, color: 'blue', icon: <BookOpen className="w-7 h-7 text-blue-600 mx-auto mb-2" /> },
                  { label: 'Units', value: totalUnits, color: 'green', icon: <Award className="w-7 h-7 text-green-600 mx-auto mb-2" /> },
                  { label: 'Status', value: currentReg?.status || 'None', color: 'purple', icon: <CheckCircle className="w-7 h-7 text-purple-600 mx-auto mb-2" /> },
                ].map((item, i) => (
                  <motion.div key={i} whileHover={{ scale: 1.05 }}
                    className={`text-center p-4 rounded-xl bg-${item.color}-50`}>
                    {item.icon}
                    <p className={`text-2xl font-bold text-${item.color}-600 capitalize`}>{item.value}</p>
                    <p className="text-xs text-gray-600">{item.label}</p>
                  </motion.div>
                ))}
              </div>

              <Link href="/register">
                <Button className="w-full" size="lg">
                  <BookOpen className="w-5 h-5 mr-2" />
                  {currentReg ? 'Modify Registration' : 'Start Registration'}
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Current Registration Courses */}
          {currentReg?.courses?.length > 0 && (
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-6 h-6 text-indigo-600" />
                  Current Registered Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {currentReg.courses.map((code: string, i: number) => (
                    <motion.div key={code} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }} whileHover={{ scale: 1.05 }}
                      className="p-3 rounded-xl border-2 border-blue-100 bg-blue-50 text-center font-bold text-blue-700">
                      {code}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Student Info */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" /> Student Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {[
                { label: 'Name', value: student?.name },
                { label: 'Matric No.', value: student?.matricNumber },
                { label: 'Department', value: student?.department },
                { label: 'Level', value: `${student?.level} Level` },
                { label: 'Semester', value: `Semester ${student?.semester}` },
              ].map((item) => (
                <div key={item.label} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                  <span className="text-gray-500">{item.label}</span>
                  <span className="font-semibold text-right">{item.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Link href="/register">
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="w-4 h-4 mr-2" /> Register Courses
                </Button>
              </Link>
              <Link href="/history">
                <Button variant="outline" className="w-full justify-start">
                  <Clock className="w-4 h-4 mr-2" /> View History
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="outline" className="w-full justify-start">
                  <User className="w-4 h-4 mr-2" /> Profile Settings
                </Button>
              </Link>
              {currentReg && (
                <Link href="/slip">
                  <Button variant="outline" className="w-full justify-start">
                    <Sparkles className="w-4 h-4 mr-2" /> Print Reg. Slip
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {stats?.registrations?.length > 0 ? (
                <div className="space-y-3">
                  {stats.registrations.slice(0, 3).map((reg: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{reg.session} — Sem {reg.semester}</p>
                        <p className="text-xs text-gray-500">{reg.courses.length} courses · {reg.totalUnits} units</p>
                      </div>
                      <Badge variant={reg.status === 'approved' ? 'success' : reg.status === 'pending' ? 'warning' : 'destructive'}>
                        {reg.status}
                      </Badge>
                      {reg.status !== 'approved' && (
                        <button
                          onClick={() => handleDeleteRegistration(reg._id)}
                          className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete registration"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No registration history yet</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
