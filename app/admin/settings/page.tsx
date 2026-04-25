'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectItem } from '@/components/ui/select';
import { useToast } from '@/components/ui/toast';
import { ArrowLeft, Settings, Save, School, Calendar, Shield, BookOpen, Database, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  const { toast, confirm } = useToast();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [settings, setSettings] = useState({
    currentSession: '2025/2026',
    currentSemester: '1',
    maxUnitsPerSemester: '24',
    registrationOpen: true,
    allowLateRegistration: false,
    requirePrerequisiteCheck: true,
    autoApproveRegistrations: false,
  });
  const [original, setOriginal] = useState(settings);

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => {
        if (data.settings) {
          const s = {
            currentSession: data.settings.currentSession,
            currentSemester: String(data.settings.currentSemester),
            maxUnitsPerSemester: String(data.settings.maxUnitsPerSemester),
            registrationOpen: data.settings.registrationOpen,
            allowLateRegistration: data.settings.allowLateRegistration,
            requirePrerequisiteCheck: data.settings.requirePrerequisiteCheck ?? true,
            autoApproveRegistrations: data.settings.autoApproveRegistrations ?? false,
          };
          setSettings(s);
          setOriginal(s);
        }
        setFetching(false);
      })
      .catch(() => setFetching(false));
  }, []);

  const sessionChanged = settings.currentSession !== original.currentSession;
  const semesterChanged = settings.currentSemester !== original.currentSemester;

  const handleSave = async () => {
    const doSave = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...settings, currentSemester: parseInt(settings.currentSemester) }),
        });
        const data = await res.json();
        if (!res.ok) {
          toast('error', data.error || 'Failed to save settings');
          return;
        }
        setOriginal(settings);
        if (data.sessionChanged) {
          toast('success', 'Session updated — student levels bumped and stale registrations closed');
        } else if (data.semesterChanged) {
          toast('success', 'Semester updated — all students moved to new semester');
        } else {
          toast('success', 'Settings saved successfully');
        }
      } catch {
        toast('error', 'Failed to save settings');
      } finally {
        setLoading(false);
      }
    };

    if (sessionChanged) {
      confirm({
        message: `Changing session to "${settings.currentSession}" will bump ALL student levels by 100 (capped at 400) and close all pending registrations from the current session. This cannot be undone.`,
        confirmLabel: 'Yes, change session',
        destructive: true,
        onConfirm: doSave,
      });
    } else if (semesterChanged) {
      confirm({
        message: `Changing to Semester ${settings.currentSemester} will update all students' semester. Pending registrations from the current semester will be closed (unless late registration is enabled).`,
        confirmLabel: 'Yes, change semester',
        destructive: false,
        onConfirm: doSave,
      });
    } else {
      doSave();
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link href="/admin/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-2">System Settings</h1>
          <p className="text-gray-600">Configure system-wide settings and preferences</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* University / Academic Period */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <School className="w-6 h-6 text-blue-600" /> Academic Period
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Current Session</label>
                <Input
                  value={settings.currentSession}
                  onChange={e => setSettings({ ...settings, currentSession: e.target.value })}
                  placeholder="e.g., 2025/2026"
                />
                {sessionChanged && (
                  <p className="text-xs text-orange-600 mt-1">⚠️ Changing session will bump all student levels</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Current Semester</label>
                <Select value={settings.currentSemester} onValueChange={v => setSettings({ ...settings, currentSemester: v })}>
                  <SelectItem value="1">First Semester</SelectItem>
                  <SelectItem value="2">Second Semester</SelectItem>
                </Select>
                {semesterChanged && (
                  <p className="text-xs text-orange-600 mt-1">⚠️ Changing semester will update all students</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Max Units Per Semester</label>
                <Input
                  type="number"
                  value={settings.maxUnitsPerSemester}
                  onChange={e => setSettings({ ...settings, maxUnitsPerSemester: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Registration Settings */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-6 h-6 text-green-600" /> Registration Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Checkbox id="regOpen" checked={settings.registrationOpen}
                  onCheckedChange={v => setSettings({ ...settings, registrationOpen: v as boolean })} />
                <label htmlFor="regOpen" className="text-sm font-medium">Registration is currently open</label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="lateReg" checked={settings.allowLateRegistration}
                  onCheckedChange={v => setSettings({ ...settings, allowLateRegistration: v as boolean })} />
                <label htmlFor="lateReg" className="text-sm font-medium">Allow late registration</label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="autoApprove" checked={settings.autoApproveRegistrations}
                  onCheckedChange={v => setSettings({ ...settings, autoApproveRegistrations: v as boolean })} />
                <label htmlFor="autoApprove" className="text-sm font-medium">Auto-approve registrations</label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="prereq" checked={settings.requirePrerequisiteCheck}
                  onCheckedChange={v => setSettings({ ...settings, requirePrerequisiteCheck: v as boolean })} />
                <label htmlFor="prereq" className="text-sm font-medium">Enforce prerequisite checking</label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <Card className="glass-effect mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-6 h-6 text-indigo-600" /> System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: 'Database', status: 'Connected', ok: true },
                { label: 'Registration', status: settings.registrationOpen ? 'Open' : 'Closed', ok: settings.registrationOpen },
                { label: 'Late Registration', status: settings.allowLateRegistration ? 'Enabled' : 'Disabled', ok: settings.allowLateRegistration },
              ].map(item => (
                <div key={item.label} className={`text-center p-4 rounded-lg ${item.ok ? 'bg-green-50' : 'bg-gray-50'}`}>
                  <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${item.ok ? 'bg-green-500' : 'bg-gray-400'}`} />
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-gray-600">{item.status}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 flex justify-end">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button onClick={handleSave} disabled={loading} size="lg" className="px-8">
              {loading ? <span>Saving...</span> : <><Save className="w-5 h-5 mr-2" />Save Settings</>}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
