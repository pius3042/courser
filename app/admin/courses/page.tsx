'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { BookOpen, Plus, Search, Edit, Trash2, ArrowLeft, Filter } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/ui/toast';

export default function AdminCoursesPage() {
  const router = useRouter();
  const { toast, confirm } = useToast();
  const [courses, setCourses] = useState<any[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('All Levels');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchCourses(); }, []);
  useEffect(() => { filterCourses(); }, [courses, searchQuery, levelFilter, typeFilter]);

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/courses');
      if (!res.ok) { router.push('/admin/login'); return; }
      const data = await res.json();
      setCourses(data.courses || []);
      setLoading(false);
    } catch { setLoading(false); }
  };

  const filterCourses = () => {
    let filtered = courses;
    if (searchQuery) filtered = filtered.filter(c =>
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (levelFilter !== 'All Levels') filtered = filtered.filter(c => c.level.toString() === levelFilter);
    if (typeFilter !== 'All Types') filtered = filtered.filter(c => typeFilter === 'Required' ? c.compulsory : !c.compulsory);
    setFilteredCourses(filtered);
  };

  const handleDelete = async (courseId: string) => {
    confirm({ message: 'Delete this course?', confirmLabel: 'Delete', destructive: true, onConfirm: async () => {
      const res = await fetch(`/api/courses/${courseId}`, { method: 'DELETE' });
      if (res.ok) { setCourses(courses.filter(c => c._id !== courseId)); toast('success', 'Course deleted'); }
      else toast('error', 'Failed to delete course');
    }});
  };

  const stats = {
    total: courses.length,
    required: courses.filter(c => c.compulsory).length,
    optional: courses.filter(c => !c.compulsory).length,
    levels: [...new Set(courses.map(c => c.level))].length,
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full" />
    </div>
  );

  const selectClass = "px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-white text-sm";

  return (
    <div className="min-h-screen p-6">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-blue-600/10 blur-[120px]" />
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
              <h1 className="text-4xl font-bold text-white mb-1">Course Management</h1>
              <p className="text-white/40">Manage course information and settings</p>
            </div>
            <Link href="/admin/courses/new">
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-linear-to-r from-blue-500 to-violet-600 text-white">
                <Plus className="w-4 h-4" /> Add Course
              </motion.button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Courses', value: stats.total, icon: <BookOpen className="w-6 h-6 text-blue-400" />, color: 'text-blue-400' },
            { label: 'Required', value: stats.required, icon: null, color: 'text-red-400' },
            { label: 'Optional', value: stats.optional, icon: null, color: 'text-emerald-400' },
            { label: 'Levels', value: stats.levels, icon: <Filter className="w-6 h-6 text-violet-400" />, color: 'text-violet-400' },
          ].map((s, i) => (
            <div key={i} className="glass-effect rounded-2xl p-4 text-center">
              {s.icon && <div className="flex justify-center mb-2">{s.icon}</div>}
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-sm text-white/40 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Search + Filter */}
        <div className="glass-effect rounded-2xl p-5 mb-6 flex gap-4 flex-wrap">
          <div className="flex-1 min-w-48 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <Input placeholder="Search by code or title..." value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
          <select value={levelFilter} onChange={e => setLevelFilter(e.target.value)} className={selectClass}>
            {['All Levels', '100', '200', '300', '400'].map(o => <option key={o} className="bg-[#06091a]">{o}</option>)}
          </select>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className={selectClass}>
            {['All Types', 'Required', 'Optional'].map(o => <option key={o} className="bg-[#06091a]">{o}</option>)}
          </select>
        </div>

        {/* Grid */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course, i) => (
            <motion.div key={course._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <div className="glass-effect rounded-2xl p-5 hover:border-white/15 transition-colors h-full flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-white">{course.code}</h3>
                    <p className="text-sm text-white/40 mt-0.5">{course.title}</p>
                  </div>
                  <Badge variant={course.compulsory ? 'destructive' : 'default'}>
                    {course.compulsory ? 'Compulsory' : 'Elective'}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm mb-3 flex-1">
                  {[
                    { label: 'Units', value: course.units },
                    { label: 'Level', value: course.level },
                    { label: 'Semester', value: course.semester },
                    { label: 'Dept', value: course.department?.slice(0, 10) + (course.department?.length > 10 ? '…' : '') },
                  ].map(item => (
                    <div key={item.label}>
                      <span className="text-white/30">{item.label}: </span>
                      <span className="font-bold text-white/80">{item.value}</span>
                    </div>
                  ))}
                </div>

                {course.prerequisites?.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-white/30 mb-1.5">Prerequisites</p>
                    <div className="flex flex-wrap gap-1">
                      {course.prerequisites.map((p: string) => (
                        <Badge key={p} variant="secondary" className="text-xs">{p}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-3 border-t border-white/8 mt-auto">
                  <Link href={`/admin/courses/edit/${course._id}`} className="flex-1">
                    <motion.button whileHover={{ scale: 1.02 }}
                      className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-sm transition-all">
                      <Edit className="w-4 h-4" /> Edit
                    </motion.button>
                  </Link>
                  <motion.button whileHover={{ scale: 1.05 }} onClick={() => handleDelete(course._id)}
                    className="p-2 rounded-lg border border-white/10 bg-white/5 text-white/30 hover:text-red-400 hover:border-red-500/30 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="glass-effect rounded-2xl p-12 text-center">
            <BookOpen className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No courses found</h3>
            <p className="text-white/40 mb-6">{searchQuery ? 'Try adjusting your search' : 'Add your first course to get started'}</p>
            <Link href="/admin/courses/new">
              <motion.button whileHover={{ scale: 1.03 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-linear-to-r from-blue-500 to-violet-600 text-white">
                <Plus className="w-4 h-4" /> Add Course
              </motion.button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
