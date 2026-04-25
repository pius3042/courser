'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, BookOpen, CheckCircle, TrendingUp, Users, Shield } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const features = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: 'Smart Course Suggestions',
      description: 'AI-powered recommendations based on your department, level, and academic history',
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: 'Intelligent Validation',
      description: 'Automatic checks for prerequisites, compulsory courses, and credit limits',
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Real-time Progress',
      description: 'Track your registration progress with beautiful animated dashboards',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with encrypted data and secure authentication',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 opacity-10" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto text-center relative z-10"
        >
          <div className="flex justify-center mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="p-4 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600"
            >
              <GraduationCap className="w-16 h-16 text-white" />
            </motion.div>
          </div>
          
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Smart Course Registration Portal
          </h1>
          
          <p className="text-2xl text-gray-700 mb-4">
            University of Port Harcourt
          </p>
          
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Experience the future of course registration with intelligent suggestions, 
            real-time validation, and a beautiful modern interface
          </p>
          
          <div className="flex gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="text-lg px-8 py-6">
                Student Login
              </Button>
            </Link>
            <Link href="/admin/login">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                Admin Portal
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600">
              Everything you need for a seamless registration experience
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-2xl transition-all">
                  <CardContent className="p-8">
                    <div className="text-blue-600 mb-4">{feature.icon}</div>
                    <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center text-white">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Users className="w-12 h-12 mx-auto mb-4" />
              <div className="text-5xl font-bold mb-2">10,000+</div>
              <div className="text-xl">Active Students</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <BookOpen className="w-12 h-12 mx-auto mb-4" />
              <div className="text-5xl font-bold mb-2">500+</div>
              <div className="text-xl">Available Courses</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <CheckCircle className="w-12 h-12 mx-auto mb-4" />
              <div className="text-5xl font-bold mb-2">99.9%</div>
              <div className="text-xl">Success Rate</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <GraduationCap className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold mb-2">University of Port Harcourt</h3>
          <p className="text-gray-400 mb-6">Smart Course Registration Portal</p>
          <p className="text-sm text-gray-500">
            © 2026. All rights reserved. | Developed for Academic Excellence
          </p>
        </div>
      </footer>
    </div>
  );
}
