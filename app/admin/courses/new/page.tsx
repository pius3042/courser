'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/ui/toast';

export default function NewCoursePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    units: 3,
    department: '',
    level: 300,
    semester: 1,
    compulsory: false,
    prerequisites: [] as string[],
  });
  const [prerequisiteInput, setPrerequisiteInput] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        router.push('/admin/courses');
      } else {
        toast('error', 'Failed to create course');
      }
    } catch {
      toast('error', 'Error creating course');
    } finally {
      setSaving(false);
    }
  };

  const addPrerequisite = () => {
    const val = prerequisiteInput.trim().toUpperCase();
    if (val && !formData.prerequisites.includes(val)) {
      setFormData({ ...formData, prerequisites: [...formData.prerequisites, val] });
      setPrerequisiteInput('');
    }
  };

  const removePrerequisite = (prereq: string) => {
    setFormData({ ...formData, prerequisites: formData.prerequisites.filter(p => p !== prereq) });
  };

  const selectClass = "w-full px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-white";

  return (
    <div className="min-h-screen p-6">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-emerald-600/10 blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="mb-8">
          <Link href="/admin/courses">
            <motion.button whileHover={{ x: -4 }}
              className="inline-flex items-center gap-2 mb-4 text-white/40 hover:text-white text-sm transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Courses
            </motion.button>
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">Add New Course</h1>
          <p className="text-white/40">Create a new course in the system</p>
        </div>

        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <BookOpen className="w-6 h-6 text-emerald-400" /> Course Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Course Code</label>
                  <Input value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })} placeholder="e.g., CSC301" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Units</label>
                  <Input type="number" min="1" max="6" value={formData.units}
                    onChange={e => setFormData({ ...formData, units: parseInt(e.target.value) })} required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Course Title</label>
                <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g., Data Structures and Algorithms" required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Department</label>
                  <select value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })}
                    className={selectClass} required>
                    <option value="" className="bg-[#06091a]">Select Department</option>
                    <option value="Computer Science" className="bg-[#06091a]">Computer Science</option>
                    <option value="Mathematics" className="bg-[#06091a]">Mathematics</option>
                    <option value="Physics" className="bg-[#06091a]">Physics</option>
                    <option value="Chemistry" className="bg-[#06091a]">Chemistry</option>
                    <option value="General Studies" className="bg-[#06091a]">General Studies</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Level</label>
                  <select value={formData.level} onChange={e => setFormData({ ...formData, level: parseInt(e.target.value) })}
                    className={selectClass} required>
                    <option value={100} className="bg-[#06091a]">100 Level</option>
                    <option value={200} className="bg-[#06091a]">200 Level</option>
                    <option value={300} className="bg-[#06091a]">300 Level</option>
                    <option value={400} className="bg-[#06091a]">400 Level</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Semester</label>
                  <select value={formData.semester} onChange={e => setFormData({ ...formData, semester: parseInt(e.target.value) })}
                    className={selectClass} required>
                    <option value={1} className="bg-[#06091a]">First Semester</option>
                    <option value={2} className="bg-[#06091a]">Second Semester</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.compulsory}
                    onChange={e => setFormData({ ...formData, compulsory: e.target.checked })}
                    className="rounded accent-emerald-500" />
                  <span className="text-sm font-medium text-white/70">Compulsory Course</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Prerequisites</label>
                <div className="flex gap-2 mb-3">
                  <Input value={prerequisiteInput} onChange={e => setPrerequisiteInput(e.target.value)}
                    placeholder="Enter prerequisite course code"
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addPrerequisite())} />
                  <motion.button type="button" onClick={addPrerequisite} whileHover={{ scale: 1.02 }}
                    className="px-4 py-2 rounded-xl text-sm font-semibold border border-white/10 text-white/60 hover:text-white transition-colors">
                    Add
                  </motion.button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.prerequisites.map(prereq => (
                    <Badge key={prereq} variant="secondary" className="cursor-pointer" onClick={() => removePrerequisite(prereq)}>
                      {prereq} ×
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-6 border-t border-white/10">
                <motion.button type="submit" disabled={saving} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl font-semibold bg-linear-to-r from-emerald-500 to-teal-600 text-white disabled:opacity-50">
                  <Save className="w-4 h-4" />
                  {saving ? 'Creating...' : 'Create Course'}
                </motion.button>
                <Link href="/admin/courses" className="flex-1">
                  <motion.button type="button" whileHover={{ scale: 1.02 }}
                    className="w-full py-3 rounded-xl font-semibold border border-white/10 text-white/60 hover:text-white transition-colors">
                    Cancel
                  </motion.button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
