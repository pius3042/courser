'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  Plus,
  Search,
  Edit,
  Trash2,
  ArrowLeft,
  Filter,
} from 'lucide-react';
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

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [courses, searchQuery, levelFilter, typeFilter]);

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/courses');
      if (!res.ok) {
        router.push('/admin/login');
        return;
      }
      const data = await res.json();
      setCourses(data.courses || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setLoading(false);
    }
  };

  const filterCourses = () => {
    let filtered = courses;

    if (searchQuery) {
      filtered = filtered.filter(
        (course) =>
          course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (levelFilter !== 'All Levels') {
      filtered = filtered.filter((course) => course.level.toString() === levelFilter);
    }

    if (typeFilter !== 'All Types') {
      filtered = filtered.filter((course) =>
        typeFilter === 'Required' ? course.compulsory : !course.compulsory
      );
    }

    setFilteredCourses(filtered);
  };

  const handleDelete = async (courseId: string) => {
    confirm({
      message: 'Are you sure you want to delete this course?',
      confirmLabel: 'Delete',
      destructive: true,
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/courses/${courseId}`, { method: 'DELETE' });
          if (res.ok) {
            setCourses(courses.filter(c => c._id !== courseId));
            toast('success', 'Course deleted successfully');
          } else {
            toast('error', 'Failed to delete course');
          }
        } catch {
          toast('error', 'Error deleting course');
        }
      },
    });
  };

  const stats = {
    total: courses.length,
    required: courses.filter((c) => c.compulsory).length,
    optional: courses.filter((c) => !c.compulsory).length,
    levels: [...new Set(courses.map((c) => c.level))].length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">Course Management</h1>
              <p className="text-gray-600">Manage course information and settings</p>
            </div>
            <Link href="/admin/courses/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Course
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass-effect">
            <CardContent className="p-4 text-center">
              <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Courses</div>
            </CardContent>
          </Card>
          <Card className="glass-effect">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.required}</div>
              <div className="text-sm text-gray-600">Required</div>
            </CardContent>
          </Card>
          <Card className="glass-effect">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.optional}</div>
              <div className="text-sm text-gray-600">Optional</div>
            </CardContent>
          </Card>
          <Card className="glass-effect">
            <CardContent className="p-4 text-center">
              <Filter className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.levels}</div>
              <div className="text-sm text-gray-600">Levels</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="glass-effect mb-6">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search courses by code or title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option>All Levels</option>
                <option>100</option>
                <option>200</option>
                <option>300</option>
                <option>400</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option>All Types</option>
                <option>Required</option>
                <option>Optional</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Courses Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass-effect hover:shadow-xl transition-all">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{course.code}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{course.title}</p>
                    </div>
                    <Badge variant={course.compulsory ? 'destructive' : 'default'}>
                      {course.compulsory ? 'Compulsory' : 'Elective'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Units:</span>
                        <span className="font-bold ml-2">{course.units}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Level:</span>
                        <span className="font-bold ml-2">{course.level}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Semester:</span>
                        <span className="font-bold ml-2">{course.semester}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Department:</span>
                        <span className="font-bold ml-2 text-xs">{course.department}</span>
                      </div>
                    </div>

                    {course.prerequisites && course.prerequisites.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Prerequisites:</p>
                        <div className="flex flex-wrap gap-1">
                          {course.prerequisites.map((prereq: string) => (
                            <Badge key={prereq} variant="secondary" className="text-xs">
                              {prereq}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-4 border-t">
                      <Link href={`/admin/courses/edit/${course._id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(course._id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <Card className="glass-effect">
            <CardContent className="p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No courses found</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || levelFilter !== 'All Levels' || typeFilter !== 'All Types'
                  ? 'Try adjusting your search or filters'
                  : 'Get started by adding your first course'}
              </p>
              <Link href="/admin/courses/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Course
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}