'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Printer, GraduationCap, CheckCircle, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegistrationSlipPage() {
  const router = useRouter();
  const slipRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [allRegistrations, setAllRegistrations] = useState<any[]>([]);
  const [selectedRegistrationId, setSelectedRegistrationId] = useState<string>('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, coursesRes, registrationsRes] = await Promise.all([
        fetch('/api/dashboard/stats'),
        fetch('/api/courses'),
        fetch('/api/registrations'),
      ]);
      if (!statsRes.ok) { router.push('/login'); return; }
      const stats = await statsRes.json();
      const coursesData = await coursesRes.json();
      const registrationsData = await registrationsRes.json();

      const courseMap: Record<string, any> = {};
      (coursesData.courses || []).forEach((c: any) => { courseMap[c.code] = c; });

      const registrations = registrationsData.registrations || [];
      setAllRegistrations(registrations);
      
      // Set the current registration as default
      if (stats.currentRegistration) {
        setSelectedRegistrationId(stats.currentRegistration._id);
      } else if (registrations.length > 0) {
        setSelectedRegistrationId(registrations[0]._id);
      }

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
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const student = data?.stats?.student;
  const courseMap = data?.courseMap || {};
  
  // Get the selected registration or fall back to current
  const reg = allRegistrations.find(r => r._id === selectedRegistrationId) || data?.stats?.currentRegistration;

  if (!reg) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <GraduationCap className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">No Registration Found</h2>
          <p className="text-white/50 mb-6">You haven't registered for any courses yet.</p>
          <Link href="/register">
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-linear-to-r from-blue-500 to-violet-600 text-white">
              Register Now
            </motion.button>
          </Link>
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
      <style>{`
        @media print {
          body > * { display: none !important; }
          #print-slip { display: block !important; position: fixed; inset: 0; background: white !important; }
          #print-controls { display: none !important; }
        }
      `}</style>

      <div className="min-h-screen p-6">
        {/* Background orbs */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute -top-40 right-0 w-96 h-96 rounded-full bg-blue-600/10 blur-[120px]" />
          <div className="absolute bottom-0 -left-40 w-96 h-96 rounded-full bg-violet-600/10 blur-[120px]" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Controls — hidden on print */}
          <div id="print-controls" className="mb-6">
            <Link href="/dashboard">
              <motion.button whileHover={{ x: -4 }}
                className="inline-flex items-center gap-2 mb-4 text-white/40 hover:text-white text-sm transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Dashboard
              </motion.button>
            </Link>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">Registration Slip</h1>
                <p className="text-white/40">Your official course registration document</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                {/* Session/Semester Selector */}
                {allRegistrations.length > 1 && (
                  <div className="relative">
                    <select
                      value={selectedRegistrationId}
                      onChange={(e) => setSelectedRegistrationId(e.target.value)}
                      className="appearance-none w-full sm:w-auto px-4 py-2.5 pr-10 rounded-xl font-semibold text-sm bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/15 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {allRegistrations.map((registration) => (
                        <option 
                          key={registration._id} 
                          value={registration._id}
                          className="bg-gray-900 text-white"
                        >
                          {registration.session} - Semester {registration.semester}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
                  </div>
                )}
                <motion.button onClick={handlePrint} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-blue-500 to-violet-600 text-white">
                  <Printer className="w-5 h-5" /> Print / Save as PDF
                </motion.button>
              </div>
            </div>
          </div>

          {/* The actual slip — stays white for print */}
          <div id="print-slip">
            <motion.div ref={slipRef} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-white/10">

              {/* Header */}
              <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white p-4 md:p-8">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                      <GraduationCap className="w-8 h-8 md:w-10 md:h-10 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg md:text-2xl font-bold">University of Port Harcourt</h2>
                      <p className="text-blue-200 text-xs md:text-sm">Office of the Registrar — Course Registration Slip</p>
                      <p className="text-blue-200 text-xs md:text-sm mt-1">Academic Session: {reg.session}</p>
                    </div>
                  </div>
                  <div className="text-left md:text-right w-full md:w-auto">
                    <div className={`inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-bold ${
                      reg.status === 'approved' ? 'bg-green-500' :
                      reg.status === 'pending'  ? 'bg-yellow-500' : 'bg-red-500'
                    }`}>
                      <CheckCircle className="w-3 h-3 md:w-4 md:h-4" />
                      {reg.status.toUpperCase()}
                    </div>
                    <p className="text-blue-200 text-xs mt-2">Issued: {issueDate}</p>
                  </div>
                </div>
              </div>

              {/* Student Info */}
              <div className="p-4 md:p-8 border-b-2 border-dashed border-gray-200">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Student Information</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
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
                      <p className="font-bold text-gray-900 text-sm md:text-base break-words">{item.value || '—'}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Courses Table */}
              <div className="p-4 md:p-8">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Registered Courses</h3>
                <div className="overflow-x-auto -mx-4 md:mx-0">
                  <table className="w-full border-collapse text-sm min-w-[600px]">
                    <thead>
                      <tr className="bg-gray-100">
                        {['S/N', 'Course Code', 'Course Title', 'Units', 'Type'].map(h => (
                          <th key={h} className="text-left py-3 px-2 md:px-4 font-semibold text-gray-600 border border-gray-200 text-xs md:text-sm">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {registeredCourses.map((course: any, i: number) => (
                        <tr key={course.code} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="py-3 px-2 md:px-4 border border-gray-200 text-gray-400 text-xs md:text-sm">{i + 1}</td>
                          <td className="py-3 px-2 md:px-4 border border-gray-200 font-bold text-gray-900 text-xs md:text-sm">{course.code}</td>
                          <td className="py-3 px-2 md:px-4 border border-gray-200 text-gray-700 text-xs md:text-sm">{course.title}</td>
                          <td className="py-3 px-2 md:px-4 border border-gray-200 text-center font-semibold text-gray-900 text-xs md:text-sm">{course.units}</td>
                          <td className="py-3 px-2 md:px-4 border border-gray-200 text-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              course.compulsory ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {course.compulsory ? 'Compulsory' : 'Elective'}
                            </span>
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-blue-50 font-bold">
                        <td colSpan={3} className="py-3 px-2 md:px-4 text-right border border-gray-200 text-gray-700 text-xs md:text-sm">Total Credit Units</td>
                        <td className="py-3 px-2 md:px-4 text-center text-blue-700 text-base md:text-lg border border-gray-200">{totalUnits}</td>
                        <td className="border border-gray-200" />
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Signatures */}
              <div className="px-4 md:px-8 pb-6 md:pb-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 pt-6 md:pt-8 border-t-2 border-dashed border-gray-200">
                  {["Student's Signature", "HOD's Signature", "Registrar's Signature"].map(label => (
                    <div key={label} className="text-center">
                      <div className="h-14 border-b-2 border-gray-400 mb-2" />
                      <p className="text-xs text-gray-500">{label}</p>
                    </div>
                  ))}
                </div>
                <p className="text-center text-xs text-gray-400 mt-6 px-2">
                  This slip is computer-generated and valid without a physical stamp. ·
                  University of Port Harcourt · {new Date().getFullYear()}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
