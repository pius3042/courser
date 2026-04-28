'use client';

import { motion } from 'framer-motion';
import { GraduationCap, BookOpen, CheckCircle, TrendingUp, Users, Shield, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const features = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: 'Smart Course Suggestions',
      description: 'AI-powered recommendations based on your department, level, and academic history',
      color: 'from-blue-500 to-cyan-500',
      glow: 'group-hover:shadow-blue-500/25',
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: 'Intelligent Validation',
      description: 'Automatic checks for prerequisites, compulsory courses, and credit limits',
      color: 'from-violet-500 to-purple-500',
      glow: 'group-hover:shadow-violet-500/25',
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Real-time Progress',
      description: 'Track your registration progress with beautiful animated dashboards',
      color: 'from-emerald-500 to-teal-500',
      glow: 'group-hover:shadow-emerald-500/25',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with encrypted data and secure authentication',
      color: 'from-rose-500 to-pink-500',
      glow: 'group-hover:shadow-rose-500/25',
    },
  ];

  const stats = [
    { icon: <Users className="w-8 h-8" />, value: '10,000+', label: 'Active Students' },
    { icon: <BookOpen className="w-8 h-8" />, value: '500+', label: 'Available Courses' },
    { icon: <CheckCircle className="w-8 h-8" />, value: '99.9%', label: 'Success Rate' },
  ];

  return (
    <div className="min-h-screen bg-[#06091a] text-white overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-24">

        {/* Background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-blue-600/20 blur-[120px]" />
          <div className="absolute -top-20 right-0 w-[500px] h-[500px] rounded-full bg-violet-600/20 blur-[120px]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-indigo-600/10 blur-[100px]" />
        </div>

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="relative z-10 max-w-5xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-sm text-blue-300 mb-8"
          >
            <Sparkles className="w-4 h-4" />
            University of Port Harcourt — Department of Computer Science
          </motion.div>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-blue-500 to-violet-600 blur-xl opacity-60" />
              <div className="relative p-5 rounded-2xl bg-linear-to-br from-blue-500 to-violet-600">
                <GraduationCap className="w-14 h-14 text-white" />
              </div>
            </div>
          </motion.div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
            <span className="bg-linear-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
              Smart Course
            </span>
            <br />
            <span className="bg-linear-to-r from-blue-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
              Registration Portal
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-white/50 mb-12 max-w-2xl mx-auto leading-relaxed px-4">
            Intelligent course selection, real-time validation, and prerequisite enforcement —
            built to make registration effortless for every student.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold bg-linear-to-r from-blue-500 to-violet-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-shadow"
              >
                Student Login
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
            <Link href="/admin/login">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold border border-white/15 bg-white/5 hover:bg-white/10 backdrop-blur-sm text-white/80 hover:text-white transition-all"
              >
                Admin Portal
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30"
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-px h-8 bg-linear-to-b from-white/30 to-transparent"
          />
        </motion.div>
      </section>

      {/* ── FEATURES ── */}
      <section className="relative py-28 px-4">
        <div className="absolute inset-0 bg-linear-to-b from-[#06091a] via-[#080d22] to-[#06091a]" />

        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <p className="text-blue-400 text-sm font-semibold tracking-widest uppercase mb-3">Features</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Everything you need
            </h2>
            <p className="text-white/40 text-lg max-w-xl mx-auto">
              A complete registration experience, from selection to submission
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-5">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`group relative p-6 rounded-2xl border border-white/8 bg-white/4 hover:bg-white/7 backdrop-blur-sm hover:shadow-2xl ${feature.glow} transition-all duration-300 cursor-default`}
              >
                {/* Icon */}
                <div className={`inline-flex p-3 rounded-xl bg-linear-to-br ${feature.color} mb-5 text-white`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-white/45 leading-relaxed">{feature.description}</p>

                {/* Subtle gradient border on hover */}
                <div className={`absolute inset-0 rounded-2xl bg-linear-to-br ${feature.color} opacity-0 group-hover:opacity-[0.06] transition-opacity pointer-events-none`} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="relative py-24 px-4 overflow-hidden">
        {/* Rich background */}
        <div className="absolute inset-0 bg-linear-to-br from-blue-600/90 via-indigo-600/90 to-violet-700/90" />
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-black/20 blur-3xl" />
        </div>
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-4xl font-bold text-white">Trusted by students</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative p-8 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md text-center"
              >
                <div className="flex justify-center mb-4 text-white/70">{stat.icon}</div>
                <div className="text-5xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-white/60 text-sm uppercase tracking-widest">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-28 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to register?
            </h2>
            <p className="text-white/40 text-base md:text-lg mb-10 px-4">
              Log in with your student credentials and complete your course registration in minutes.
            </p>
            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="inline-flex items-center gap-2 px-8 md:px-10 py-3 md:py-4 rounded-xl text-sm md:text-base font-semibold bg-linear-to-r from-blue-500 to-violet-600 text-white shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-shadow"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/8 py-10 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-white/30 text-sm">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="p-2 rounded-lg bg-linear-to-br from-blue-500 to-violet-600">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div className="text-center md:text-left">
              <span className="text-white/60 font-semibold">University of Port Harcourt</span>
              <span className="mx-2 hidden md:inline">·</span>
              <span className="block md:inline">Smart Course Registration Portal</span>
            </div>
          </div>
          <p className="text-center md:text-right">© 2026. Developed for Academic Excellence.</p>
        </div>
      </footer>
    </div>
  );
}
