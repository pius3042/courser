"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
      .then((res) => {
        if (!res.ok) {
          router.push("/admin/students");
          return null;
        }
        return res.json();
      })
      .then((data) => {
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
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/admin/students">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Students
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-2">Edit Student</h1>
          <p className="text-gray-600">Update student information</p>
        </div>

        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-6 h-6" /> Student Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Matric Number
                  </label>
                  <Input
                    value={formData.matricNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, matricNumber: e.target.value })
                    }
                    placeholder="e.g., u2022/5570025"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="e.g., john@uniport.edu.ng"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Department
                  </label>
                  <Select
                    value={formData.department}
                    onValueChange={(v) =>
                      setFormData({ ...formData, department: v })
                    }
                    placeholder="Select Department"
                  >
                    <SelectItem value="Computer Science">
                      Computer Science
                    </SelectItem>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="Physics">Physics</SelectItem>
                    <SelectItem value="Chemistry">Chemistry</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Level
                  </label>
                  <Select
                    value={formData.level}
                    onValueChange={(v) =>
                      setFormData({ ...formData, level: v })
                    }
                  >
                    <SelectItem value="100">100 Level</SelectItem>
                    <SelectItem value="200">200 Level</SelectItem>
                    <SelectItem value="300">300 Level</SelectItem>
                    <SelectItem value="400">400 Level</SelectItem>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Semester
                  </label>
                  <Select
                    value={formData.semester}
                    onValueChange={(v) =>
                      setFormData({ ...formData, semester: v })
                    }
                  >
                    <SelectItem value="1">First Semester</SelectItem>
                    <SelectItem value="2">Second Semester</SelectItem>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  New Password{" "}
                  <span className="text-gray-400 font-normal">
                    (leave blank to keep current)
                  </span>
                </label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Enter new password or leave blank"
                />
              </div>

              <div className="flex gap-4 pt-6 border-t">
                <Button type="submit" disabled={saving} className="flex-1">
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
                <Link href="/admin/students" className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
