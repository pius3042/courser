'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { FileText, Search, ArrowLeft, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/ui/toast';

export default function AdminRegistrationsPage() {
  const router = useRouter();
  const { toast, confirm } = useToast();
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchRegistrations(); }, []);
  useEffect(() => { filterRegistrations(); }, [registrations, searchQuery, statusFilter]);

  const fetchRegistrations = async () => {
    try {
      const res = await fetch('/api/registrations');
      if (!res.ok) { router.push('/admin/login'); return; }
      const data = await res.json();
      setRegistrations(data.registrations || []);
      setLoading(false);
    } catch { setLoading(false); }
  };

  const filterRegistrations = () => {
    let filtered = registrations;
    if (searchQuery) filtered = filtered.filter(r =>
      r.studentId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.studentId?.matricNumber?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (statusFilter !== 'All') filtered = filtered.filter(r => r.status === statusFilter.toLowerCase());
    setFilteredRegistrations(filtered);
  };

  const handleApprove = async (id: string) => {
    const res = await fetch(`/api/registrations/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'approved' }) });
    if (res.ok) { setRegistrations(prev => prev.map(r => r._id === id ? { ...r, status: 'approved' } : r)); toast('success', 'Registration approved'); }
    else toast('error', 'Failed to approve');
  };

  const handleReject = async (id: string) => {
    confirm({ message: 'Reject this registration?', confirmLabel: 'Reject', destructive: true, onConfirm: async () => {
      const res = await fetch(`/api/registrations/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'rejected' }) });
      if (res.ok) { setRegistrations(prev => prev.map(r => r._id === id ? { ...r, status: 'rejected' } : r)); toast('success', 'Registration rejected'); }
      else toast('error', 'Failed to reject');
    }});
  };

  const handleDelete = async (id: string) => {
    confirm({ message: 'Permanently delete this registration?', confirmLabel: 'Delete', destructive: true, onConfirm: async () => {
      const res = await fetch(`/api/registrations?id=${id}`, { method: 'DELETE' });
      if (res.ok) { setRegistrations(prev => prev.filter(r => r._id !== id)); toast('success', 'Registration deleted'); }
      else { const d = await res.json(); toast('error', d.error || 'Failed to delete'); }
    }});
  };

  const stats = {
    total: registrations.length,
    pending: registrations.filter(r => r.status === 'pending').length,
    approved: registrations.filter(r => r.status === 'approved').length,
    rejected: registrations.filter(r => r.status === 'rejected').length,
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="min-h-screen p-6">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 right-0 w-96 h-96 rounded-full bg-violet-600/10 blur-[120px]" />
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-8">
          <Link href="/admin/dashboard">
            <motion.button whileHover={{ x: -4 }}
              className="inline-flex items-center gap-2 mb-4 text-white/40 hover:text-white text-sm transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </motion.button>
          </Link>
          <h1 className="text-4xl font-bold text-white mb-1">Registration Management</h1>
          <p className="text-white/40">Review and approve student registrations</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total', value: stats.total, color: 'text-blue-400' },
            { label: 'Pending', value: stats.pending, color: 'text-yellow-400' },
            { label: 'Approved', value: stats.approved, color: 'text-emerald-400' },
            { label: 'Rejected', value: stats.rejected, color: 'text-red-400' },
          ].map((s, i) => (
            <div key={i} className="glass-effect rounded-2xl p-4 text-center">
              <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-sm text-white/40 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Search + Filter */}
        <div className="glass-effect rounded-2xl p-5 mb-6 flex flex-col md:flex-row gap-3 md:gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <Input placeholder="Search by name or matric number..." value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-white text-sm">
            <option value="All" className="bg-[#06091a]">All</option>
            <option value="Pending" className="bg-[#06091a]">Pending</option>
            <option value="Approved" className="bg-[#06091a]">Approved</option>
            <option value="Rejected" className="bg-[#06091a]">Rejected</option>
          </select>
        </div>

        {/* List */}
        <div className="space-y-4">
          {filteredRegistrations.map((reg, i) => (
            <motion.div key={reg._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <div className="glass-effect rounded-2xl p-4 md:p-6 hover:border-white/15 transition-colors">
                <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-2 md:gap-3 mb-4">
                      <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-linear-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-base md:text-lg shrink-0">
                        {reg.studentId?.name?.charAt(0) || '?'}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base md:text-lg font-bold text-white truncate">{reg.studentId?.name || 'Unknown Student'}</h3>
                        <p className="text-xs md:text-sm text-white/40 truncate">{reg.studentId?.matricNumber} · {reg.studentId?.department}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-4">
                      {[
                        { label: 'Session', value: reg.session },
                        { label: 'Semester', value: `Semester ${reg.semester}` },
                        { label: 'Courses', value: `${reg.courses.length} courses` },
                        { label: 'Units', value: `${reg.totalUnits} units` },
                      ].map(item => (
                        <div key={item.label}>
                          <p className="text-xs text-white/30">{item.label}</p>
                          <p className="font-semibold text-white/80 text-xs md:text-sm">{item.value}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mb-3">
                      <p className="text-xs text-white/30 mb-2">Registered Courses</p>
                      <div className="flex flex-wrap gap-1.5">
                        {reg.courses.map((c: string) => (
                          <span key={c} className="px-2 py-1 rounded-lg border border-white/10 bg-white/5 text-white/60 text-xs">{c}</span>
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-white/25">
                      Submitted {new Date(reg.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  <div className="flex md:flex-col items-start md:items-end gap-3 w-full md:w-auto">
                    <Badge variant={reg.status === 'approved' ? 'success' : reg.status === 'pending' ? 'warning' : 'destructive'} className="text-xs">
                      {reg.status.toUpperCase()}
                    </Badge>
                    <div className="flex flex-wrap gap-2">
                      {reg.status === 'pending' && (
                        <>
                          <motion.button whileHover={{ scale: 1.05 }} onClick={() => handleApprove(reg._id)}
                            className="flex items-center gap-1 md:gap-1.5 px-2 md:px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs md:text-sm font-medium hover:bg-emerald-500/30 transition-colors">
                            <CheckCircle className="w-3 h-3 md:w-4 md:h-4" /> <span className="hidden md:inline">Approve</span><span className="md:hidden">✓</span>
                          </motion.button>
                          <motion.button whileHover={{ scale: 1.05 }} onClick={() => handleReject(reg._id)}
                            className="flex items-center gap-1 md:gap-1.5 px-2 md:px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs md:text-sm font-medium hover:bg-red-500/20 transition-colors">
                            <XCircle className="w-3 h-3 md:w-4 md:h-4" /> <span className="hidden md:inline">Reject</span><span className="md:hidden">✕</span>
                          </motion.button>
                        </>
                      )}
                      <motion.button whileHover={{ scale: 1.05 }} onClick={() => handleDelete(reg._id)}
                        className="p-1.5 rounded-lg border border-white/10 bg-white/5 text-white/30 hover:text-red-400 hover:border-red-500/30 transition-colors">
                        <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredRegistrations.length === 0 && (
          <div className="glass-effect rounded-2xl p-12 text-center">
            <FileText className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No registrations found</h3>
            <p className="text-white/40">{searchQuery || statusFilter !== 'All' ? 'Try adjusting your filters' : 'No student registrations yet'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
