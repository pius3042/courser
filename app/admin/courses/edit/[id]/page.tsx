'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
          className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/admin/courses">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Courses
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-2">Edit Course</h1>
          <p className="text-gray-600">Update course information</p>
        </div>

        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-6 h-6" /> Course Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Course Code</label>
                  <Input value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })} placeholder="e.g., CSC301" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Units</label>
                  <Select value={formData.units} onValueChange={v => setFormData({ ...formData, units: v })}>
                    {['1','2','3','4','5','6'].map(u => <SelectItem key={u} value={u}>{u} Unit{u !== '1' ? 's' : ''}</SelectItem>)}
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Course Title</label>
                <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g., Data Structures and Algorithms" required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Department</label>
                  <Select value={formData.department} onValueChange={v => setFormData({ ...formData, department: v })} placeholder="Select Department">
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="Physics">Physics</SelectItem>
                    <SelectItem value="Chemistry">Chemistry</SelectItem>
                    <SelectItem value="General Studies">General Studies</SelectItem>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Level</label>
                  <Select value={formData.level} onValueChange={v => setFormData({ ...formData, level: v })}>
                    <SelectItem value="100">100 Level</SelectItem>
                    <SelectItem value="200">200 Level</SelectItem>
                    <SelectItem value="300">300 Level</SelectItem>
                    <SelectItem value="400">400 Level</SelectItem>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Semester</label>
                  <Select value={formData.semester} onValueChange={v => setFormData({ ...formData, semester: v })}>
                    <SelectItem value="1">First Semester</SelectItem>
                    <SelectItem value="2">Second Semester</SelectItem>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox id="compulsory" checked={formData.compulsory}
                  onCheckedChange={v => setFormData({ ...formData, compulsory: v as boolean })} />
                <label htmlFor="compulsory" className="text-sm font-medium">Compulsory Course</label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Prerequisites</label>
                <div className="flex gap-2 mb-3">
                  <Input value={prerequisiteInput} onChange={e => setPrerequisiteInput(e.target.value.toUpperCase())}
                    placeholder="e.g., CSC201"
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addPrerequisite())} />
                  <Button type="button" onClick={addPrerequisite}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.prerequisites.map(prereq => (
                    <Badge key={prereq} variant="secondary" className="cursor-pointer" onClick={() => removePrerequisite(prereq)}>
                      {prereq} ×
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-6 border-t">
                <Button type="submit" disabled={saving} className="flex-1">
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Link href="/admin/courses" className="flex-1">
                  <Button type="button" variant="outline" className="w-full">Cancel</Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
