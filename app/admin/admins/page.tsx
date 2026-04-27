'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectItem } from '@/components/ui/select';
import { useToast } from '@/components/ui/toast';
import { ArrowLeft, Shield, Plus, Trash2, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminsPage() {
  const router = useRouter();
  const { toast, confirm } = useToast();
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'admin' });

  useEffect(() => { fetchAdmins(); }, []);

  const fetchAdmins = async () => {
    const res = await fetch('/api/admins');
    if (!res.ok) { router.push('/admin/login'); return; }
    const data = await res.json();
    setAdmins(data.admins || []);
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { toast('error', data.error || 'Failed to create admin'); return; }
      toast('success', 'Admin created successfully');
      setAdmins(prev => [data.admin, ...prev]);
      setForm({ name: '', email: '', password: '', role: 'admin' });
      setShowForm(false);
    } catch {
      toast('error', 'Error creating admin');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: string, name: string) => {
    confirm({
      message: `Delete admin "${name}"? They will lose all access immediately.`,
      confirmLabel: 'Delete',
      destructive: true,
      onConfirm: async () => {
        const res = await fetch(`/api/admins/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (res.ok) {
          setAdmins(prev => prev.filter(a => a._id !== id));
          toast('success', 'Admin deleted');
        } else {
          toast('error', data.error || 'Failed to delete admin');
        }
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

  return (
    <div className="min-h-screen p-6">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 right-0 w-96 h-96 rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute bottom-0 -left-40 w-96 h-96 rounded-full bg-blue-600/10 blur-[120px]" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="mb-8">
          <Link href="/admin/dashboard">
            <motion.button whileHover={{ x: -4 }}
              className="inline-flex items-center gap-2 mb-4 text-white/40 hover:text-white text-sm transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </motion.button>
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Admin Management</h1>
              <p className="text-white/40">Manage administrator accounts</p>
            </div>
            <motion.button onClick={() => setShowForm(!showForm)} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-linear-to-r from-violet-500 to-purple-600 text-white">
              <Plus className="w-4 h-4" /> Add Admin
            </motion.button>
          </div>
        </div>

        {/* Create Form */}
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <Card className="glass-effect border border-violet-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Shield className="w-5 h-5 text-violet-400" /> New Administrator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreate} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">Full Name</label>
                      <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g., Jane Admin" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">Email</label>
                      <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="admin@uniport.edu.ng" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">Password</label>
                      <Input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Minimum 6 characters" required minLength={6} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">Role</label>
                      <Select value={form.role} onValueChange={v => setForm({ ...form, role: v })}>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="super-admin">Super Admin</SelectItem>
                      </Select>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <motion.button type="submit" disabled={saving} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="px-5 py-2 rounded-xl font-semibold text-sm bg-linear-to-r from-violet-500 to-purple-600 text-white disabled:opacity-50">
                      {saving ? 'Creating...' : 'Create Admin'}
                    </motion.button>
                    <motion.button type="button" onClick={() => setShowForm(false)} whileHover={{ scale: 1.02 }}
                      className="px-5 py-2 rounded-xl font-semibold text-sm border border-white/10 text-white/60 hover:text-white transition-colors">
                      Cancel
                    </motion.button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Admins List */}
        <div className="space-y-3">
          {admins.map((admin, i) => (
            <motion.div key={admin._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="glass-effect">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-linear-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                        {admin.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-lg text-white">{admin.name}</p>
                        <p className="text-sm text-white/40">{admin.email}</p>
                        <p className="text-xs text-white/25">
                          Created {new Date(admin.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={admin.role === 'super-admin' ? 'destructive' : 'default'}>
                        {admin.role}
                      </Badge>
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(admin._id, admin.name)}
                        className="p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          {admins.length === 0 && (
            <Card className="glass-effect">
              <CardContent className="py-12 text-center">
                <User className="w-12 h-12 text-white/10 mx-auto mb-3" />
                <p className="text-white/40">No admins found</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
