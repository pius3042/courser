'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Users, Plus, Search, Edit, Trash2, ArrowLeft, GraduationCap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/ui/toast';

export default function AdminStudentsPage() {
  const router = useRouter();
  const { toast, confirm } = useToast();
  const [students, setStudents] = useState<any[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStudents(); }, []);
  useEffect(() => { filterStudents(); }, [students, searchQuery]);

  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/students');
      if (!res.ok) { router.push('/admin/login'); return; }
      const data = await res.json();
      setStudents(data.students || []);
      setLoading(false);
    } catch { setLoading(false); }
  };

  const filterStudents = () => {
    if (!searchQuery) { setFilteredStudents(students); return; }
    setFilteredStudents(students.filter(s =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.matricNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase())
    ));
  };

  const handleDelete = async (id: string) => {
    confirm({ message: 'Delete this student? This will also remove all their registrations.', confirmLabel: 'Delete', destructive: true, onConfirm: async () => {
      const res = await fetch(`/api/students/${id}`, { method: 'DELETE' });
      if (res.ok) { setStudents(prev => prev.filter(s => s._id !== id)); toast('success', 'Student deleted'); }
      else toast('error', 'Failed to delete student');
    }});
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
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-blue-600/10 blur-[120px]" />
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-8">
          <Link href="/admin/dashboard">
            <motion.button whileHover={{ x: -4 }}
              className="inline-flex items-center gap-2 mb-4 text-white/40 hover:text-white text-sm transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </motion.button>
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-white mb-1">Student Management</h1>
              <p className="text-white/40">Manage student accounts and information</p>
            </div>
            <Link href="/admin/students/new">
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-linear-to-r from-blue-500 to-violet-600 text-white">
                <Plus className="w-4 h-4" /> Add Student
              </motion.button>
            </Link>
          </div>
        </div>

        {/* Stat */}
        <div className="glass-effect rounded-2xl p-6 flex items-center gap-4 mb-8 max-w-xs">
          <div className="p-3 rounded-xl bg-linear-to-br from-blue-500 to-violet-600">
            <Users className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className="text-3xl font-bold text-white">{students.length}</div>
            <div className="text-sm text-white/40">Total Students</div>
          </div>
        </div>

        {/* Search */}
        <div className="glass-effect rounded-2xl p-5 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <Input placeholder="Search by name, matric number, or email..." value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
        </div>

        {/* Table */}
        <div className="glass-effect rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-white/8">
            <h2 className="flex items-center gap-2 text-white font-bold">
              <Users className="w-5 h-5 text-white/40" /> Students ({filteredStudents.length})
            </h2>
          </div>
          {filteredStudents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/8">
                    {['Name', 'Matric Number', 'Email', 'Department', 'Level', 'Semester', 'Actions'].map(h => (
                      <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-white/40 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student, i) => (
                    <motion.tr key={student._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                      className="border-b border-white/5 hover:bg-white/3 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-linear-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                            {student.name.charAt(0)}
                          </div>
                          <span className="font-medium text-white/80">{student.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-mono text-sm text-white/60">{student.matricNumber}</td>
                      <td className="py-4 px-4 text-sm text-white/50">{student.email}</td>
                      <td className="py-4 px-4"><Badge variant="default">{student.department}</Badge></td>
                      <td className="py-4 px-4 text-sm text-white/70 font-semibold">{student.level} Level</td>
                      <td className="py-4 px-4 text-sm text-white/50">Sem {student.semester}</td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2 justify-center">
                          <Link href={`/admin/students/edit/${student._id}`}>
                            <motion.button whileHover={{ scale: 1.1 }}
                              className="p-1.5 rounded-lg border border-white/10 bg-white/5 text-white/40 hover:text-blue-400 hover:border-blue-500/30 transition-colors">
                              <Edit className="w-4 h-4" />
                            </motion.button>
                          </Link>
                          <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleDelete(student._id)}
                            className="p-1.5 rounded-lg border border-white/10 bg-white/5 text-white/40 hover:text-red-400 hover:border-red-500/30 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <GraduationCap className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No students found</h3>
              <p className="text-white/40 mb-6">{searchQuery ? 'Try adjusting your search' : 'Add your first student to get started'}</p>
              <Link href="/admin/students/new">
                <motion.button whileHover={{ scale: 1.03 }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-linear-to-r from-blue-500 to-violet-600 text-white">
                  <Plus className="w-4 h-4" /> Add Student
                </motion.button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
