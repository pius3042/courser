"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { GraduationCap, LogIn, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role: "student" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }
      router.push("/dashboard");
    } catch {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-blue-600/15 blur-[100px]" />
        <div className="absolute -bottom-20 right-0 w-96 h-96 rounded-full bg-violet-600/15 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-flex p-4 rounded-2xl bg-linear-to-br from-blue-500 to-violet-600 mb-4 shadow-lg shadow-blue-500/30"
            >
              <GraduationCap className="w-12 h-12 text-white" />
            </motion.div>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-1">Student Login</h1>
          <p className="text-white/40">University of Port Harcourt</p>
        </div>

        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="text-white">Welcome Back</CardTitle>
            <CardDescription className="text-white/40">
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400"
                >
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm">{error}</span>
                </motion.div>
              )}

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Matric Number or Email
                </label>
                <Input
                  type="text"
                  placeholder="e.g., U2022/5570023 or student@uniport.edu.ng"
                  value={formData.identifier}
                  onChange={(e) =>
                    setFormData({ ...formData, identifier: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold bg-linear-to-r from-blue-500 to-violet-600 text-white shadow-lg shadow-blue-500/25 disabled:opacity-60 transition-opacity"
              >
                {loading ? (
                  "Logging in..."
                ) : (
                  <>
                    <LogIn className="w-5 h-5" /> Login
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-sm">
              <p className="font-medium text-blue-400 mb-1">Demo Credentials</p>
              <p className="text-white/50">
                <span className="font-medium text-white/70">Matric:</span>
                u2022/5570123{" "}
              </p>
              <p className="text-white/50">
                <span className="font-medium text-white/70">Password:</span>{" "}
                student123
              </p>
            </div>

            <div className="mt-4 text-center text-sm text-white/40">
              <p>
                New student?{" "}
                <Link
                  href="/signup"
                  className="text-blue-400 hover:text-blue-300 font-medium"
                >
                  Create an account
                </Link>
              </p>
              <p className="mt-2">
                Admin?{" "}
                <Link
                  href="/admin/login"
                  className="text-blue-400 hover:text-blue-300 font-medium"
                >
                  Login here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-white/30 hover:text-white/60 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
