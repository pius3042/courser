'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Search,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Trash2,
  Filter,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { useToast } from '@/components/ui/toast';

export default function AdminRegistrationsPage() {
  const router = useRouter();
  const { toast, confirm } = useToast();
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  useEffect(() => {
    filterRegistrations();
  }, [registrations, searchQuery, statusFilter]);

  const fetchRegistrations = async () => {
    try {
      const res = await fetch('/api/registrations');
      if (!res.ok) {
        router.push('/admin/login');
        return;
      }
      const data = await res.json();
      setRegistrations(data.registrations || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching registrations:', error);
      setLoading(false);
    }
  };

  const filterRegistrations = () => {
    let filtered = registrations;

    if (searchQuery) {
      filtered = filtered.filter(
        (reg) =>
          reg.studentId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          reg.studentId?.matricNumber?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'All') {
      filtered = filtered.filter((reg) => reg.status === statusFilter.toLowerCase());
    }

    setFilteredRegistrations(filtered);
  };

  const handleApprove = async (registrationId: string) => {
    try {
      const res = await fetch(`/api/registrations/${registrationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' }),
      });
      if (res.ok) {
        setRegistrations(registrations.map(reg =>
          reg._id === registrationId ? { ...reg, status: 'approved' } : reg
        ));
        toast('success', 'Registration approved');
      } else {
        toast('error', 'Failed to approve registration');
      }
    } catch {
      toast('error', 'Error approving registration');
    }
  };

  const handleReject = async (registrationId: string) => {
    confirm({
      message: 'Are you sure you want to reject this registration?',
      confirmLabel: 'Reject',
      destructive: true,
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/registrations/${registrationId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'rejected' }),
          });
          if (res.ok) {
            setRegistrations(registrations.map(reg =>
              reg._id === registrationId ? { ...reg, status: 'rejected' } : reg
            ));
            toast('success', 'Registration rejected');
          } else {
            toast('error', 'Failed to reject registration');
          }
        } catch {
          toast('error', 'Error rejecting registration');
        }
      },
    });
  };

  const handleDelete = async (registrationId: string) => {
    confirm({
      message: 'Are you sure you want to permanently delete this registration?',
      confirmLabel: 'Delete',
      destructive: true,
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/registrations?id=${registrationId}`, { method: 'DELETE' });
          if (res.ok) {
            setRegistrations(registrations.filter(reg => reg._id !== registrationId));
            toast('success', 'Registration deleted');
          } else {
            const data = await res.json();
            toast('error', data.error || 'Failed to delete registration');
          }
        } catch {
          toast('error', 'Error deleting registration');
        }
      },
    });
  };

  const stats = {
    total: registrations.length,
    pending: registrations.filter((r) => r.status === 'pending').length,
    approved: registrations.filter((r) => r.status === 'approved').length,
    rejected: registrations.filter((r) => r.status === 'rejected').length,
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
              <h1 className="text-4xl font-bold mb-2">Registration Management</h1>
              <p className="text-gray-600">Review and approve student registrations</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass-effect">
            <CardContent className="p-4 text-center">
              <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-gray-600">Total</div>
            </CardContent>
          </Card>
          <Card className="glass-effect">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </CardContent>
          </Card>
          <Card className="glass-effect">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
              <div className="text-sm text-gray-600">Approved</div>
            </CardContent>
          </Card>
          <Card className="glass-effect">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
              <div className="text-sm text-gray-600">Rejected</div>
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
                  placeholder="Search by student name or matric number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option>All</option>
                <option>Pending</option>
                <option>Approved</option>
                <option>Rejected</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Registrations List */}
        <div className="space-y-4">
          {filteredRegistrations.map((registration, index) => (
            <motion.div
              key={registration._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="glass-effect hover:shadow-xl transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl">
                          {registration.studentId?.name?.charAt(0) || '?'}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">
                            {registration.studentId?.name || 'Unknown Student'}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {registration.studentId?.matricNumber} •{' '}
                            {registration.studentId?.department}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Session</p>
                          <p className="font-semibold">{registration.session}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Semester</p>
                          <p className="font-semibold">Semester {registration.semester}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Courses</p>
                          <p className="font-semibold">{registration.courses.length} courses</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Total Units</p>
                          <p className="font-semibold">{registration.totalUnits} units</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">Registered Courses:</p>
                        <div className="flex flex-wrap gap-2">
                          {registration.courses.map((course: string) => (
                            <Badge key={course} variant="secondary">
                              {course}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-gray-500">
                        Submitted on {new Date(registration.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <Badge
                        variant={
                          registration.status === 'approved'
                            ? 'success'
                            : registration.status === 'pending'
                            ? 'warning'
                            : 'destructive'
                        }
                      >
                        {registration.status.toUpperCase()}
                      </Badge>

                      <div className="flex gap-2">
                        {registration.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleApprove(registration._id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReject(registration._id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Reject
                            </Button>
                          </>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(registration._id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredRegistrations.length === 0 && (
          <Card className="glass-effect">
            <CardContent className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No registrations found</h3>
              <p className="text-gray-600">
                {searchQuery || statusFilter !== 'All'
                  ? 'Try adjusting your search or filters'
                  : 'No student registrations yet'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}