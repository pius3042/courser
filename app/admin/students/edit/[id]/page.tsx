"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import { ArrowLeft, Save, User } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/components/ui/toast";

export default function EditStudentPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    matricNumber: "",
    email: "",
    department: "",
    level: "100",
    semester: "1",
    password: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/students/${id}`)
      .then(res => {
        if (!res.ok) { router.push("/admin/students"); return null; }
        return res.json();
      })
      .then(data => {
        if (!data) return;
        const s = data.student;
        setFormData({
          name: s.name,
          matricNumber: s.matricNumber,
          email: s.email,
          department: s.department,
          level: String(s.level),
          semester: String(s.semester),
          password: "",
        });
        setLoading(false);
      })
      .catch(() => router.push("/admin/students"));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/students/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          level: parseInt(formData.level),
          semester: parseInt(formData.semester),
        }),
      });
      if (res.ok) {
        toast("success", "Student updated successfully");
        router.push("/admin/students");
      } else {
        toast("error", "Failed to update student");
      }
    } catch {
      toast("error", "Error updating student");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-violet-600/10 blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="mb-8">
          <Link href="/admin/students">
            <motion.button whileHover={{ x: -4 }}
              className="inline-flex items-center gap-2 mb-4 text-white/40 hover:text-white text-sm transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Students
            </motion.button>
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">Edit Student</h1>
          <p className="text-white/40">Update student information</p>
        </div>

        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <User className="w-6 h-6 text-blue-400" /> Student Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Full Name</label>
                  <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., John Doe" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Matric Number</label>
                  <Input value={formData.matricNumber} onChange={e => setFormData({ ...formData, matricNumber: e.target.value })} placeholder="e.g., u2022/5570025" required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Email Address</label>
                <Input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="e.g., john@uniport.edu.ng" required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Department</label>
                  <Select value={formData.department} onValueChange={v => setFormData({ ...formData, department: v })} placeholder="Select Department">
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="Physics">Physics</SelectItem>
                    <SelectItem value="Chemistry">Chemistry</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
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

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  New Password <span className="text-white/30 font-normal">(leave blank to keep current)</span>
                </label>
                <Input type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} placeholder="Enter new password or leave blank" />
              </div>

              <div className="flex gap-4 pt-6 border-t border-white/10">
                <motion.button type="submit" disabled={saving} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl font-semibold bg-linear-to-r from-blue-500 to-violet-600 text-white disabled:opacity-50">
                  <Save className="w-4 h-4" />
                  {saving ? "Saving..." : "Save Changes"}
                </motion.button>
                <Link href="/admin/students" className="flex-1">
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
