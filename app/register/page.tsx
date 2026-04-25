'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import SmartWarnings from '@/components/SmartWarnings';
import RegistrationStepper from '@/components/RegistrationStepper';
import AnimatedCounter from '@/components/AnimatedCounter';
import {
  Search, CheckCircle, ArrowRight, ArrowLeft,
  Sparkles, BookOpen, Award, AlertTriangle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [courses, setCourses] = useState<any[]>([]);
  const [student, setStudent] = useState<any>(null);
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
  const [existingRegistration, setExistingRegistration] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'compulsory' | 'elective'>('all');
  const [warnings, setWarnings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      const [suggestRes, regRes] = await Promise.all([
        fetch('/api/courses/suggest'),
        fetch('/api/registrations'),
      ]);
      if (!suggestRes.ok) { router.push('/login'); return; }
      const suggestData = await suggestRes.json();
      setCourses(suggestData.suggested || []);
      setStudent(suggestData.student);

      // Pre-fill existing registration if any
      if (regRes.ok) {
        const regData = await regRes.json();
        const current = regData.registrations?.[0];
        if (current) {
          setExistingRegistration(current);
          setSelectedCodes(current.courses || []);
        }
      }
      setLoading(false);
    } catch {
      router.push('/login');
    }
  };

  const toggleCourse = (code: string) => {
    setSelectedCodes(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
    setWarnings([]);
  };

  const selectedCourseObjects = courses.filter(c => selectedCodes.includes(c.code));
  const totalUnits = selectedCourseObjects.reduce((s, c) => s + c.units, 0);
  const maxUnits = 24;
  const progress = Math.min(100, (totalUnits / maxUnits) * 100);

  const validate = () => {
    const newWarnings: any[] = [];

    const missingCompulsory = courses
      .filter(c => c.compulsory && !selectedCodes.includes(c.code));

    if (missingCompulsory.length > 0) {
      newWarnings.push({
        type: 'error',
        title: 'Missing Compulsory Courses',
        message: 'You must register all compulsory courses for your level and semester.',
        courses: missingCompulsory.map(c => c.code),
      });
    }

    if (totalUnits > maxUnits) {
      newWarnings.push({
        type: 'error',
        title: `Exceeded Maximum Units (${totalUnits}/${maxUnits})`,
        message: 'Remove some elective courses to stay within the 24-unit limit.',
      });
    }

    if (selectedCodes.length === 0) {
      newWarnings.push({
        type: 'warning',
        title: 'No Courses Selected',
        message: 'Please select at least one course to continue.',
      });
    }

    // Client-side prerequisite check — counts selected courses as satisfying prereqs
    const completedOrSelected = [...(student?.completedCourses || []), ...selectedCodes];
    for (const course of selectedCourseObjects) {
      if (course.prerequisites?.length > 0) {
        const missing = course.prerequisites.filter(
          (p: string) => !completedOrSelected.includes(p)
        );
        if (missing.length > 0) {
          newWarnings.push({
            type: 'error',
            title: `Prerequisite Missing for ${course.code}`,
            message: `You need to complete: ${missing.join(', ')} first.`,
          });
        }
      }
    }

    setWarnings(newWarnings);
    return newWarnings.filter(w => w.type === 'error').length === 0;
  };

  const handleNext = () => {
    if (validate()) setStep(1);
  };

  const handleSubmit = async () => {
    if (!validate()) { setStep(0); return; }
    setSubmitting(true);
    try {
      const isModifying = !!existingRegistration;
      const url = isModifying
        ? `/api/registrations/${existingRegistration._id}`
        : '/api/registrations';
      const method = isModifying ? 'PUT' : 'POST';
      const body = isModifying
        ? { courses: selectedCodes }
        : { session: '2025/2026', semester: student?.semester || 1, courses: selectedCodes };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        const msgs: any[] = [];
        if (data.missingCourses) msgs.push({ type: 'error', title: 'Missing Compulsory Courses', message: 'You must include all compulsory courses.', courses: data.missingCourses });
        else if (data.missingPrerequisites) msgs.push({ type: 'error', title: `Prerequisite Missing for ${data.course}`, message: `You need to complete: ${data.missingPrerequisites.join(', ')} first.` });
        else msgs.push({ type: 'error', title: 'Registration Failed', message: data.error || 'Please try again.' });
        setWarnings(msgs);
        setStep(0);
        return;
      }
      router.push('/success');
    } catch {
      setWarnings([{ type: 'error', title: 'Network Error', message: 'Could not connect. Please try again.' }]);
      setStep(0);
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = courses.filter(c => {
    const matchSearch = c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFilter = filter === 'all' || (filter === 'compulsory' && c.compulsory) || (filter === 'elective' && !c.compulsory);
    return matchSearch && matchFilter;
  });

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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-3">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-1">Course Registration</h1>
          <p className="text-gray-600">
            {student?.department} · {student?.level} Level · Semester {student?.semester}
          </p>
        </div>

        {/* Stepper */}
        <div className="mb-8">
          <RegistrationStepper
            steps={[
              { title: 'Select Courses', description: 'Choose your courses' },
              { title: 'Review & Confirm', description: 'Verify your selection' },
            ]}
            currentStep={step}
          />
        </div>

        <AnimatePresence mode="wait">
          {/* ── STEP 1: SELECT ── */}
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              className="grid lg:grid-cols-3 gap-6">

              {/* Left: Course List */}
              <div className="lg:col-span-2 space-y-5">
                {/* Warnings */}
                <SmartWarnings warnings={warnings} onDismiss={i => setWarnings(prev => prev.filter((_, idx) => idx !== i))} />

                {/* Smart Suggestion Banner */}
                <Card className="glass-effect border-2 border-yellow-200 bg-yellow-50/40">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold mb-2">Smart Suggestions for {student?.level} Level · Semester {student?.semester}</p>
                        <div className="flex flex-wrap gap-2">
                          {courses.filter(c => c.compulsory).map(c => (
                            <Badge key={c.code} variant="destructive">{c.code}</Badge>
                          ))}
                          {courses.filter(c => !c.compulsory).map(c => (
                            <Badge key={c.code} variant="default">{c.code}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Search + Filter */}
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input placeholder="Search courses..." value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
                  </div>
                  {(['all', 'compulsory', 'elective'] as const).map(f => (
                    <Button key={f} variant={filter === f ? 'default' : 'outline'}
                      onClick={() => setFilter(f)} className="capitalize">{f}</Button>
                  ))}
                </div>

                {/* Course Cards */}
                <div className="space-y-3">
                  {filtered.map((course, i) => {
                    const selected = selectedCodes.includes(course.code);
                    return (
                      <motion.div key={course.code} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }} whileHover={{ scale: 1.01, y: -2 }}
                        onClick={() => toggleCourse(course.code)}
                        className={`rounded-xl border-2 p-5 cursor-pointer transition-all ${
                          selected ? 'border-blue-500 bg-blue-50/60 shadow-lg' : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
                        }`}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            {/* Custom checkbox */}
                            <div className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                              selected ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-white'
                            }`}>
                              {selected && <CheckCircle className="w-3 h-3 text-white" />}
                            </div>
                            <div>
                              <h3 className="font-bold text-lg">{course.code}</h3>
                              <p className="text-sm text-gray-600 mt-0.5">{course.title}</p>
                              {course.prerequisites?.length > 0 && (
                                <p className="text-xs text-gray-400 mt-1">
                                  Prerequisites: {course.prerequisites.join(', ')}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2 ml-4">
                            <Badge variant={course.compulsory ? 'destructive' : 'default'}>
                              {course.compulsory ? 'Compulsory' : 'Elective'}
                            </Badge>
                            <div className="flex items-center gap-1 text-blue-600">
                              <Award className="w-4 h-4" />
                              <span className="font-semibold text-sm">{course.units} Units</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Right: Summary Sidebar */}
              <div>
                <Card className="glass-effect sticky top-6">
                  <CardHeader>
                    <CardTitle>Registration Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Unit progress */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium">Credit Units</span>
                        <motion.span key={totalUnits} initial={{ scale: 1.4 }} animate={{ scale: 1 }}
                          className={`font-bold ${totalUnits > maxUnits ? 'text-red-600' : 'text-blue-600'}`}>
                          <AnimatedCounter value={totalUnits} /> / {maxUnits}
                        </motion.span>
                      </div>
                      <Progress value={progress} />
                      {totalUnits > maxUnits && (
                        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Exceeds maximum by {totalUnits - maxUnits} units
                        </p>
                      )}
                    </div>

                    <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50">
                      <span className="text-sm font-medium">Courses Selected</span>
                      <span className="text-xl font-bold text-blue-600">{selectedCodes.length}</span>
                    </div>

                    {/* Selected list */}
                    {selectedCodes.length > 0 && (
                      <div className="max-h-56 overflow-y-auto space-y-2 pt-2 border-t">
                        {selectedCodes.map(code => {
                          const c = courses.find(x => x.code === code);
                          return (
                            <div key={code} className="flex justify-between items-center text-sm p-2 rounded-lg bg-blue-50">
                              <span className="font-semibold text-blue-700">{code}</span>
                              <span className="text-gray-500">{c?.units} units</span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <Button className="w-full" size="lg" onClick={handleNext} disabled={selectedCodes.length === 0}>
                      Review Selection <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {/* ── STEP 2: CONFIRM ── */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="max-w-3xl mx-auto">
              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    Confirm Registration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Student + session info */}
                  <div className="grid grid-cols-2 gap-4 p-5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
                    {[
                      { label: 'Student', value: student?.name || '—' },
                      { label: 'Session', value: '2025/2026' },
                      { label: 'Department', value: student?.department },
                      { label: 'Semester', value: `Semester ${student?.semester}` },
                      { label: 'Total Courses', value: selectedCodes.length },
                      { label: 'Total Units', value: `${totalUnits} / ${maxUnits}` },
                    ].map(item => (
                      <div key={item.label}>
                        <p className="text-xs text-gray-500">{item.label}</p>
                        <p className="font-bold">{item.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Course list */}
                  <div>
                    <h3 className="font-bold mb-3 flex items-center gap-2">
                      <BookOpen className="w-5 h-5" /> Selected Courses
                    </h3>
                    <div className="space-y-2">
                      {selectedCourseObjects.map(course => (
                        <motion.div key={course.code} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                          className="flex justify-between items-center p-4 rounded-xl border-2 border-gray-100 hover:border-blue-200 transition-all">
                          <div>
                            <p className="font-bold">{course.code}</p>
                            <p className="text-sm text-gray-600">{course.title}</p>
                          </div>
                          <div className="text-right space-y-1">
                            <Badge variant={course.compulsory ? 'destructive' : 'default'}>
                              {course.compulsory ? 'Compulsory' : 'Elective'}
                            </Badge>
                            <p className="text-sm text-gray-500">{course.units} units</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4 pt-2">
                    <Button variant="outline" className="flex-1" onClick={() => setStep(0)}>
                      <ArrowLeft className="w-5 h-5 mr-2" /> Back
                    </Button>
                    <Button className="flex-1" size="lg" onClick={handleSubmit} disabled={submitting}>
                      {submitting ? (
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                      ) : (
                        <CheckCircle className="w-5 h-5 mr-2" />
                      )}
                      {submitting ? 'Submitting...' : 'Confirm Registration'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
