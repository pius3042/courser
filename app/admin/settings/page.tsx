'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectItem } from '@/components/ui/select';
import { useToast } from '@/components/ui/toast';
import { ArrowLeft, Save, School, Calendar, Database } from 'lucide-react';
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
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 right-0 w-96 h-96 rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-0 -left-40 w-96 h-96 rounded-full bg-violet-600/10 blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-8">
          <Link href="/admin/dashboard">
            <motion.button whileHover={{ x: -4 }}
              className="inline-flex items-center gap-2 mb-4 text-white/40 hover:text-white text-sm transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </motion.button>
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">System Settings</h1>
          <p className="text-white/40">Configure system-wide settings and preferences</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Academic Period */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <School className="w-6 h-6 text-blue-400" /> Academic Period
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Current Session</label>
                <Input
                  value={settings.currentSession}
                  onChange={e => setSettings({ ...settings, currentSession: e.target.value })}
                  placeholder="e.g., 2025/2026"
                />
                {sessionChanged && (
                  <p className="text-xs text-orange-400 mt-1">⚠️ Changing session will bump all student levels</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Current Semester</label>
                <Select value={settings.currentSemester} onValueChange={v => setSettings({ ...settings, currentSemester: v })}>
                  <SelectItem value="1">First Semester</SelectItem>
                  <SelectItem value="2">Second Semester</SelectItem>
                </Select>
                {semesterChanged && (
                  <p className="text-xs text-orange-400 mt-1">⚠️ Changing semester will update all students</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Max Units Per Semester</label>
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
              <CardTitle className="flex items-center gap-2 text-white">
                <Calendar className="w-6 h-6 text-emerald-400" /> Registration Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { id: 'regOpen', label: 'Registration is currently open', key: 'registrationOpen' },
                { id: 'lateReg', label: 'Allow late registration', key: 'allowLateRegistration' },
                { id: 'autoApprove', label: 'Auto-approve registrations', key: 'autoApproveRegistrations' },
                { id: 'prereq', label: 'Enforce prerequisite checking', key: 'requirePrerequisiteCheck' },
              ].map(item => (
                <div key={item.id} className="flex items-center gap-2">
                  <Checkbox id={item.id} checked={(settings as any)[item.key]}
                    onCheckedChange={v => setSettings({ ...settings, [item.key]: v as boolean })} />
                  <label htmlFor={item.id} className="text-sm font-medium text-white/80">{item.label}</label>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <Card className="glass-effect mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Database className="w-6 h-6 text-indigo-400" /> System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: 'Database', status: 'Connected', ok: true },
                { label: 'Registration', status: settings.registrationOpen ? 'Open' : 'Closed', ok: settings.registrationOpen },
                { label: 'Late Registration', status: settings.allowLateRegistration ? 'Enabled' : 'Disabled', ok: settings.allowLateRegistration },
              ].map(item => (
                <div key={item.label} className={`text-center p-4 rounded-xl border ${item.ok ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-white/5 border-white/10'}`}>
                  <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${item.ok ? 'bg-emerald-400' : 'bg-white/20'}`} />
                  <p className="text-sm font-medium text-white">{item.label}</p>
                  <p className={`text-xs ${item.ok ? 'text-emerald-400' : 'text-white/30'}`}>{item.status}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 flex justify-end">
          <motion.button onClick={handleSave} disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold bg-linear-to-r from-blue-500 to-violet-600 text-white disabled:opacity-50">
            {loading ? 'Saving...' : <><Save className="w-5 h-5" />Save Settings</>}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
