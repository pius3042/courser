'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Clock,
  ArrowLeft,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function HistoryPage() {
  const router = useRouter();
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const res = await fetch('/api/registrations');
      if (!res.ok) {
        router.push('/login');
        return;
      }
      const data = await res.json();
      setRegistrations(data.registrations || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching registrations:', error);
      router.push('/login');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    }
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
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold">Registration History</h1>
          </div>
          <p className="text-gray-600">View all your past course registrations</p>
        </div>

        {/* Registrations Timeline */}
        <div className="space-y-6">
          {registrations.length > 0 ? (
            registrations.map((registration, index) => (
              <motion.div
                key={registration._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-effect hover:shadow-xl transition-all">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-3">
                        {getStatusIcon(registration.status)}
                        <div>
                          <div className="text-xl">
                            {registration.session} - Semester {registration.semester}
                          </div>
                          <div className="text-sm font-normal text-gray-600 mt-1">
                            Registered on{' '}
                            {new Date(registration.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </div>
                        </div>
                      </CardTitle>
                      <Badge
                        variant={
                          registration.status === 'approved'
                            ? 'success'
                            : registration.status === 'pending'
                            ? 'warning'
                            : 'destructive'
                        }
                        className="text-sm px-4 py-2"
                      >
                        {registration.status.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                      <div className="p-4 rounded-lg bg-blue-50">
                        <p className="text-sm text-gray-600 mb-1">Total Courses</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {registration.courses.length}
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-green-50">
                        <p className="text-sm text-gray-600 mb-1">Total Units</p>
                        <p className="text-2xl font-bold text-green-600">
                          {registration.totalUnits}
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-purple-50">
                        <p className="text-sm text-gray-600 mb-1">Status</p>
                        <p className="text-lg font-bold text-purple-600 capitalize">
                          {registration.status}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Registered Courses
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {registration.courses.map((course: string) => (
                          <motion.div
                            key={course}
                            whileHover={{ scale: 1.05 }}
                            className="p-3 rounded-lg border-2 border-gray-200 bg-white text-center font-medium hover:border-blue-400 transition-all"
                          >
                            {course}
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {registration.status === 'rejected' && (
                      <div className="mt-6 p-4 rounded-lg bg-red-50 border border-red-200">
                        <p className="text-sm text-red-800">
                          <strong>Note:</strong> This registration was rejected. Please contact your
                          department for more information or register again with the correct courses.
                        </p>
                      </div>
                    )}

                    {registration.status === 'pending' && (
                      <div className="mt-6 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                        <p className="text-sm text-yellow-800">
                          <strong>Note:</strong> This registration is pending approval from your
                          department. You will be notified once it has been reviewed.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <Card className="glass-effect">
              <CardContent className="p-12 text-center">
                <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">No Registration History</h3>
                <p className="text-gray-600 mb-6">
                  You haven't registered for any courses yet. Start your registration now!
                </p>
                <Link href="/register">
                  <Button>
                    <FileText className="w-4 h-4 mr-2" />
                    Register Courses
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}