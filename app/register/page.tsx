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
  const [requirePrerequisiteCheck, setRequirePrerequisiteCheck] = useState(true);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      const [suggestRes, regRes, settingsRes] = await Promise.all([
        fetch('/api/courses/suggest'),
        fetch('/api/registrations'),
        fetch('/api/settings'),
      ]);
      if (!suggestRes.ok) { router.push('/login'); return; }
      const suggestData = await suggestRes.json();
      setCourses(suggestData.suggested || []);
      setStudent(suggestData.student);

      // Fetch prerequisite check setting
      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        setRequirePrerequisiteCheck(settingsData.settings?.requirePrerequisiteCheck ?? true);
      }

      // Pre-fill existing registration ONLY if it's for the current semester
      if (regRes.ok) {
        const regData = await regRes.json();
        const currentSemesterReg = regData.registrations?.find(
          (r: any) => r.semester === suggestData.student?.semester
        );
        if (currentSemesterReg) {
          setExistingRegistration(currentSemesterReg);
          setSelectedCodes(currentSemesterReg.courses || []);
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
    if (requirePrerequisiteCheck) {
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
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-violet-600/10 blur-[120px]" />
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-6 md:mb-8">
          <Link href="/dashboard">
            <motion.button whileHover={{ x: -4 }}
              className="inline-flex items-center gap-2 mb-3 md:mb-4 text-white/40 hover:text-white text-sm transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </motion.button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">Course Registration</h1>
          <p className="text-white/40 text-sm">
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
                <Card className="glass-effect border border-yellow-500/20 bg-yellow-500/5">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-6 h-6 text-yellow-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-white mb-2">Smart Suggestions for {student?.level} Level · Semester {student?.semester}</p>
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
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                    <Input placeholder="Search courses..." value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
                  </div>
                  <div className="flex gap-2 md:gap-3">
                    {(['all', 'compulsory', 'elective'] as const).map(f => (
                      <Button key={f} variant={filter === f ? 'default' : 'outline'}
                        onClick={() => setFilter(f)} className="capitalize flex-1 md:flex-none text-sm">{f}</Button>
                    ))}
                  </div>
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
                          selected ? 'border-blue-500 bg-blue-500/15 shadow-lg shadow-blue-500/10' : 'border-white/10 bg-white/4 hover:border-blue-500/40 hover:bg-white/7'
                        }`}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            {/* Custom checkbox */}
                            <div className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                              selected ? 'bg-blue-600 border-blue-600' : 'border-white/20 bg-white/5'
                            }`}>
                              {selected && <CheckCircle className="w-3 h-3 text-white" />}
                            </div>
                            <div>
                              <h3 className="font-bold text-lg text-white">{course.code}</h3>
                              <p className="text-sm text-white/50 mt-0.5">{course.title}</p>
                              {course.prerequisites?.length > 0 && (
                                <p className="text-xs text-white/30 mt-1">
                                  Prerequisites: {course.prerequisites.join(', ')}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2 ml-4">
                            <Badge variant={course.compulsory ? 'destructive' : 'default'}>
                              {course.compulsory ? 'Compulsory' : 'Elective'}
                            </Badge>
                            <div className="flex items-center gap-1 text-blue-400">
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
                    <CardTitle className="text-white">Registration Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Unit progress */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium text-white/60">Credit Units</span>
                        <motion.span key={totalUnits} initial={{ scale: 1.4 }} animate={{ scale: 1 }}
                          className={`font-bold ${totalUnits > maxUnits ? 'text-red-400' : 'text-blue-400'}`}>
                          <AnimatedCounter value={totalUnits} /> / {maxUnits}
                        </motion.span>
                      </div>
                      <Progress value={progress} />
                      {totalUnits > maxUnits && (
                        <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Exceeds maximum by {totalUnits - maxUnits} units
                        </p>
                      )}
                    </div>

                    <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/8">
                      <span className="text-sm font-medium text-white/60">Courses Selected</span>
                      <span className="text-xl font-bold text-blue-400">{selectedCodes.length}</span>
                    </div>

                    {/* Selected list */}
                    {selectedCodes.length > 0 && (
                      <div className="max-h-56 overflow-y-auto space-y-2 pt-2 border-t border-white/8">
                        {selectedCodes.map(code => {
                          const c = courses.find(x => x.code === code);
                          return (
                            <div key={code} className="flex justify-between items-center text-sm p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                              <span className="font-semibold text-blue-300">{code}</span>
                              <span className="text-white/40">{c?.units} units</span>
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
                  <CardTitle className="flex items-center gap-2 text-white">
                    <CheckCircle className="w-6 h-6 text-emerald-400" />
                    Confirm Registration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Student + session info */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 p-4 md:p-5 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    {[
                      { label: 'Student', value: student?.name || '—' },
                      { label: 'Session', value: '2025/2026' },
                      { label: 'Department', value: student?.department },
                      { label: 'Semester', value: `Semester ${student?.semester}` },
                      { label: 'Total Courses', value: selectedCodes.length },
                      { label: 'Total Units', value: `${totalUnits} / ${maxUnits}` },
                    ].map(item => (
                      <div key={item.label}>
                        <p className="text-xs text-white/30">{item.label}</p>
                        <p className="font-bold text-white text-sm md:text-base break-words">{item.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Course list */}
                  <div>
                    <h3 className="font-bold mb-3 flex items-center gap-2 text-white text-sm md:text-base">
                      <BookOpen className="w-5 h-5" /> Selected Courses
                    </h3>
                    <div className="space-y-2">
                      {selectedCourseObjects.map(course => (
                        <motion.div key={course.code} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                          className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-3 md:p-4 rounded-xl border border-white/10 bg-white/4 hover:border-blue-500/30 transition-all">
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-white text-sm md:text-base">{course.code}</p>
                            <p className="text-xs md:text-sm text-white/50 truncate">{course.title}</p>
                          </div>
                          <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-1 sm:text-right shrink-0">
                            <Badge variant={course.compulsory ? 'destructive' : 'default'} className="text-xs">
                              {course.compulsory ? 'Compulsory' : 'Elective'}
                            </Badge>
                            <p className="text-xs md:text-sm text-white/40">{course.units} units</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-2">
                    <Button variant="outline" className="flex-1 order-2 sm:order-1" onClick={() => setStep(0)}>
                      <ArrowLeft className="w-5 h-5 mr-2" /> Back
                    </Button>
                    <Button className="flex-1 order-1 sm:order-2" size="lg" onClick={handleSubmit} disabled={submitting}>
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
