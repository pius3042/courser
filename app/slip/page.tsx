'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Printer, GraduationCap, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegistrationSlipPage() {
  const router = useRouter();
  const slipRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, coursesRes] = await Promise.all([
        fetch('/api/dashboard/stats'),
        fetch('/api/courses'),
      ]);
      if (!statsRes.ok) { router.push('/login'); return; }
      const stats = await statsRes.json();
      const coursesData = await coursesRes.json();

      const courseMap: Record<string, any> = {};
      (coursesData.courses || []).forEach((c: any) => { courseMap[c.code] = c; });

      setData({ stats, courseMap });
      setLoading(false);
    } catch {
      router.push('/login');
    }
  };

  const handlePrint = () => window.print();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const student = data?.stats?.student;
  const reg = data?.stats?.currentRegistration;
  const courseMap = data?.courseMap || {};

  if (!reg) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <GraduationCap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">No Registration Found</h2>
          <p className="text-gray-600 mb-6">You haven't registered for any courses yet.</p>
          <Link href="/register"><Button>Register Now</Button></Link>
        </div>
      </div>
    );
  }

  const registeredCourses = reg.courses.map((code: string) =>
    courseMap[code] || { code, title: 'Unknown Course', units: 0, compulsory: false }
  );
  const totalUnits = registeredCourses.reduce((s: number, c: any) => s + c.units, 0);
  const issueDate = new Date(reg.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <>
      {/* Print styles injected globally */}
      <style>{`
        @media print {
          body > * { display: none !important; }
          #print-slip { display: block !important; position: fixed; inset: 0; }
          #print-controls { display: none !important; }
        }
      `}</style>

      {/* Controls — hidden on print */}
      <div id="print-controls" className="p-6 max-w-4xl mx-auto">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Button>
        </Link>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Registration Slip</h1>
            <p className="text-gray-600">Your official course registration document</p>
          </div>
          <Button onClick={handlePrint} size="lg">
            <Printer className="w-5 h-5 mr-2" /> Print / Save as PDF
          </Button>
        </div>
      </div>

      {/* The actual slip */}
      <div id="print-slip" className="max-w-4xl mx-auto px-6 pb-12">
        <motion.div ref={slipRef} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">

          {/* Header */}
          <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                  <GraduationCap className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">University of Port Harcourt</h2>
                  <p className="text-blue-200 text-sm">Office of the Registrar — Course Registration Slip</p>
                  <p className="text-blue-200 text-sm mt-1">Academic Session: {reg.session}</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
                  reg.status === 'approved' ? 'bg-green-500' :
                  reg.status === 'pending'  ? 'bg-yellow-500' : 'bg-red-500'
                }`}>
                  <CheckCircle className="w-4 h-4" />
                  {reg.status.toUpperCase()}
                </div>
                <p className="text-blue-200 text-xs mt-2">Issued: {issueDate}</p>
              </div>
            </div>
          </div>

          {/* Student Info */}
          <div className="p-8 border-b-2 border-dashed border-gray-200">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Student Information</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[
                { label: 'Full Name',     value: student?.name },
                { label: 'Matric Number', value: student?.matricNumber },
                { label: 'Department',    value: student?.department },
                { label: 'Level',         value: `${student?.level} Level` },
                { label: 'Semester',      value: `Semester ${student?.semester}` },
                { label: 'Session',       value: reg.session },
              ].map(item => (
                <div key={item.label}>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{item.label}</p>
                  <p className="font-bold text-gray-900">{item.value || '—'}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Courses Table */}
          <div className="p-8">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Registered Courses</h3>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100">
                  {['S/N', 'Course Code', 'Course Title', 'Units', 'Type'].map(h => (
                    <th key={h} className="text-left py-3 px-4 font-semibold text-gray-600 border border-gray-200">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {registeredCourses.map((course: any, i: number) => (
                  <tr key={course.code} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="py-3 px-4 border border-gray-200 text-gray-400">{i + 1}</td>
                    <td className="py-3 px-4 border border-gray-200 font-bold">{course.code}</td>
                    <td className="py-3 px-4 border border-gray-200">{course.title}</td>
                    <td className="py-3 px-4 border border-gray-200 text-center font-semibold">{course.units}</td>
                    <td className="py-3 px-4 border border-gray-200 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        course.compulsory ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {course.compulsory ? 'Compulsory' : 'Elective'}
                      </span>
                    </td>
                  </tr>
                ))}
                <tr className="bg-blue-50 font-bold">
                  <td colSpan={3} className="py-3 px-4 text-right border border-gray-200 text-gray-700">Total Credit Units</td>
                  <td className="py-3 px-4 text-center text-blue-700 text-lg border border-gray-200">{totalUnits}</td>
                  <td className="border border-gray-200" />
                </tr>
              </tbody>
            </table>
          </div>

          {/* Signatures */}
          <div className="px-8 pb-10">
            <div className="grid grid-cols-3 gap-8 pt-8 border-t-2 border-dashed border-gray-200">
              {["Student's Signature", "HOD's Signature", "Registrar's Signature"].map(label => (
                <div key={label} className="text-center">
                  <div className="h-14 border-b-2 border-gray-400 mb-2" />
                  <p className="text-xs text-gray-500">{label}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-xs text-gray-400 mt-6">
              This slip is computer-generated and valid without a physical stamp. ·
              University of Port Harcourt · {new Date().getFullYear()}
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
}
