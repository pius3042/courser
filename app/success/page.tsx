'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Download, Home } from 'lucide-react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

export default function SuccessPage() {
  useEffect(() => {
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    setTimeout(() => confetti({ particleCount: 80, angle: 60, spread: 55, origin: { x: 0 } }), 300);
    setTimeout(() => confetti({ particleCount: 80, angle: 120, spread: 55, origin: { x: 1 } }), 500);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-emerald-600/10 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full relative z-10"
      >
        <div className="glass-effect rounded-2xl text-center p-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex p-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 mb-6"
          >
            <CheckCircle className="w-20 h-20 text-emerald-400" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl font-bold text-white mb-4"
          >
            Registration Successful!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-lg text-white/50 mb-8"
          >
            Your course registration has been submitted successfully.
            You will receive a confirmation email shortly.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 mb-8 text-left"
          >
            <h3 className="font-bold text-white mb-3">What&apos;s Next?</h3>
            <ul className="space-y-2 text-white/50">
              {[
                'Your registration is pending approval from the department',
                'Download your registration slip below and keep it safe',
                'Check your dashboard for updates on approval status',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex gap-4 justify-center"
          >
            <Link href="/slip">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold border border-white/15 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all"
              >
                <Download className="w-5 h-5" /> Download Slip
              </motion.button>
            </Link>
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-linear-to-r from-blue-500 to-violet-600 text-white shadow-lg shadow-blue-500/25"
              >
                <Home className="w-5 h-5" /> Go to Dashboard
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
