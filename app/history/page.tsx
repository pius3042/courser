'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Clock, ArrowLeft, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function HistoryPage() {
  const router = useRouter();
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchRegistrations(); }, []);

  const fetchRegistrations = async () => {
    try {
      const res = await fetch('/api/registrations');
      if (!res.ok) { router.push('/login'); return; }
      const data = await res.json();
      setRegistrations(data.registrations || []);
      setLoading(false);
    } catch { router.push('/login'); }
  };

  const getStatusIcon = (status: string) => {
    if (status === 'approved') return <CheckCircle className="w-5 h-5 text-emerald-400" />;
    if (status === 'rejected') return <XCircle className="w-5 h-5 text-red-400" />;
    return <AlertCircle className="w-5 h-5 text-yellow-400" />;
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
        <div className="absolute -top-40 right-0 w-96 h-96 rounded-full bg-blue-600/10 blur-[120px]" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="mb-8">
          <Link href="/dashboard">
            <motion.button whileHover={{ x: -4 }}
              className="inline-flex items-center gap-2 mb-4 text-white/40 hover:text-white text-sm transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </motion.button>
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-blue-500/20 border border-blue-500/30">
              <Clock className="w-7 h-7 text-blue-400" />
            </div>
            <h1 className="text-4xl font-bold text-white">Registration History</h1>
          </div>
          <p className="text-white/40">View all your past course registrations</p>
        </div>

        <div className="space-y-5">
          {registrations.length > 0 ? registrations.map((reg, i) => (
            <motion.div key={reg._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
              <div className="glass-effect rounded-2xl p-6 hover:border-white/15 transition-colors">
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(reg.status)}
                    <div>
                      <p className="text-lg font-bold text-white">{reg.session} — Semester {reg.semester}</p>
                      <p className="text-sm text-white/40">
                        Registered on {new Date(reg.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <Badge variant={reg.status === 'approved' ? 'success' : reg.status === 'pending' ? 'warning' : 'destructive'}
                    className="text-sm px-4 py-2 uppercase">
                    {reg.status}
                  </Badge>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/15 text-center">
                    <p className="text-xs text-white/40 mb-1">Total Courses</p>
                    <p className="text-2xl font-bold text-blue-400">{reg.courses.length}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/15 text-center">
                    <p className="text-xs text-white/40 mb-1">Total Units</p>
                    <p className="text-2xl font-bold text-emerald-400">{reg.totalUnits}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/15 text-center">
                    <p className="text-xs text-white/40 mb-1">Status</p>
                    <p className="text-lg font-bold text-violet-400 capitalize">{reg.status}</p>
                  </div>
                </div>

                {/* Course chips */}
                <div>
                  <h4 className="font-semibold text-white/60 text-sm mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Registered Courses
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {reg.courses.map((code: string) => (
                      <span key={code}
                        className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-white/70 text-sm font-medium hover:border-blue-500/40 hover:text-blue-300 transition-colors">
                        {code}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Status notes */}
                {reg.status === 'rejected' && (
                  <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-300">
                    <strong>Note:</strong> This registration was rejected. Please contact your department or register again.
                  </div>
                )}
                {reg.status === 'pending' && (
                  <div className="mt-4 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-sm text-yellow-300">
                    <strong>Note:</strong> Pending approval from your department. You will be notified once reviewed.
                  </div>
                )}
              </div>
            </motion.div>
          )) : (
            <div className="glass-effect rounded-2xl p-12 text-center">
              <Clock className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Registration History</h3>
              <p className="text-white/40 mb-6">You haven&apos;t registered for any courses yet.</p>
              <Link href="/register">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-linear-to-r from-blue-500 to-violet-600 text-white">
                  <FileText className="w-4 h-4" /> Register Courses
                </motion.button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
