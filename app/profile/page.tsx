'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, Save, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { useToast } from '@/components/ui/toast';

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [password, setPassword] = useState({ current: '', new: '', confirm: '' });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/dashboard/stats');
      if (!res.ok) { router.push('/login'); return; }
      const data = await res.json();
      setStudent(data.student);
      setLoading(false);
    } catch {
      router.push('/login');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.new && password.new !== password.confirm) {
      toast('error', 'New passwords do not match');
      return;
    }
    setSaving(true);
    // Simulate save
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
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
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-1">Profile Settings</h1>
          <p className="text-gray-600">Manage your account information</p>
        </div>

        {/* Avatar */}
        <Card className="glass-effect mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {student?.name?.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{student?.name}</h2>
                <p className="text-gray-600">{student?.matricNumber}</p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="default">{student?.department}</Badge>
                  <Badge variant="secondary">{student?.level} Level</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Form */}
        <Card className="glass-effect mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" /> Account Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <Input value={student?.name || ''} readOnly className="bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Matric Number</label>
                  <Input value={student?.matricNumber || ''} readOnly className="bg-gray-50" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <Input value={student?.email || ''} readOnly className="bg-gray-50" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Department</label>
                  <Input value={student?.department || ''} readOnly className="bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Level</label>
                  <Input value={`${student?.level} Level` || ''} readOnly className="bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Semester</label>
                  <Input value={`Semester ${student?.semester}` || ''} readOnly className="bg-gray-50" />
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-4">Change Password</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">Current Password</label>
                    <Input type="password" value={password.current}
                      onChange={e => setPassword({ ...password, current: e.target.value })}
                      placeholder="Enter current password" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">New Password</label>
                      <Input type="password" value={password.new}
                        onChange={e => setPassword({ ...password, new: e.target.value })}
                        placeholder="Enter new password" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Confirm Password</label>
                      <Input type="password" value={password.confirm}
                        onChange={e => setPassword({ ...password, confirm: e.target.value })}
                        placeholder="Confirm new password" />
                    </div>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={saving}>
                {saved ? (
                  <><CheckCircle className="w-5 h-5 mr-2 text-green-300" /> Saved!</>
                ) : saving ? 'Saving...' : (
                  <><Save className="w-5 h-5 mr-2" /> Save Changes</>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Completed Courses */}
        {student?.completedCourses?.length > 0 && (
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" /> Completed Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {student.completedCourses.map((code: string) => (
                  <Badge key={code} variant="success">{code}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
