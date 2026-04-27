'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectItem } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save, BookOpen } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/ui/toast';

export default function EditCoursePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    code: '',
    title: '',
    units: '3',
    department: '',
    level: '300',
    semester: '1',
    compulsory: false,
    prerequisites: [] as string[],
  });
  const [prerequisiteInput, setPrerequisiteInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/courses/${id}`)
      .then(res => {
        if (!res.ok) { router.push('/admin/courses'); return null; }
        return res.json();
      })
      .then(data => {
        if (!data) return;
        const c = data.course;
        setFormData({
          code: c.code,
          title: c.title,
          units: String(c.units),
          department: c.department,
          level: String(c.level),
          semester: String(c.semester),
          compulsory: c.compulsory,
          prerequisites: c.prerequisites || [],
        });
        setLoading(false);
      })
      .catch(() => router.push('/admin/courses'));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/courses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          units: parseInt(formData.units),
          level: parseInt(formData.level),
          semester: parseInt(formData.semester),
        }),
      });
      if (res.ok) {
        toast('success', 'Course updated successfully');
        router.push('/admin/courses');
      } else {
        toast('error', 'Failed to update course');
      }
    } catch {
      toast('error', 'Error updating course');
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
          <h1 className="text-4xl font-bold text-white mb-2">Edit Course</h1>
          <p className="text-white/40">Update course information</p>
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
                  <Select value={formData.units} onValueChange={v => setFormData({ ...formData, units: v })}>
                    {['1','2','3','4','5','6'].map(u => <SelectItem key={u} value={u}>{u} Unit{u !== '1' ? 's' : ''}</SelectItem>)}
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Course Title</label>
                <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g., Data Structures and Algorithms" required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Department</label>
                  <Select value={formData.department} onValueChange={v => setFormData({ ...formData, department: v })} placeholder="Select Department">
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="Physics">Physics</SelectItem>
                    <SelectItem value="Chemistry">Chemistry</SelectItem>
                    <SelectItem value="General Studies">General Studies</SelectItem>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Level</label>
                  <Select value={formData.level} onValueChange={v => setFormData({ ...formData, level: v })}>
                    <SelectItem value="100">100 Level</SelectItem>
                    <SelectItem value="200">200 Level</SelectItem>
                    <SelectItem value="300">300 Level</SelectItem>
                    <SelectItem value="400">400 Level</SelectItem>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Semester</label>
                  <Select value={formData.semester} onValueChange={v => setFormData({ ...formData, semester: v })}>
                    <SelectItem value="1">First Semester</SelectItem>
                    <SelectItem value="2">Second Semester</SelectItem>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox id="compulsory" checked={formData.compulsory}
                  onCheckedChange={v => setFormData({ ...formData, compulsory: v as boolean })} />
                <label htmlFor="compulsory" className="text-sm font-medium text-white/70">Compulsory Course</label>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Prerequisites</label>
                <div className="flex gap-2 mb-3">
                  <Input value={prerequisiteInput} onChange={e => setPrerequisiteInput(e.target.value.toUpperCase())}
                    placeholder="e.g., CSC201"
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
                  {saving ? 'Saving...' : 'Save Changes'}
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
