"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { FiMail, FiLock, FiArrowRight, FiShield, FiCheckCircle } from "react-icons/fi";
import { RiCarLine } from "react-icons/ri";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/cars";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const syncBackendJwt = async (userEmail, userName) => {
    try {
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";
      await fetch(`${serverUrl}/jwt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: userEmail, name: userName || "Valued Renter" }),
      });
    } catch (err) {
      console.error("JWT sync error:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please provide both email and password");
      return;
    }

    try {
      setLoading(true);
      const res = await authClient.signIn.email({
        email,
        password,
      });

      if (res.error) {
        toast.error(res.error.message || "Invalid email or password");
        return;
      }

      await syncBackendJwt(email, res.data?.user?.name);
      toast.success("Welcome back to DriveFleet!");
      router.push(callbackUrl);
      router.refresh();
    } catch (err) {
      toast.error(err.message || "Sign in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail("admin@drivefleet.com");
    setPassword("DriveFleet@2026");
    try {
      setLoading(true);
      // Try login first
      const res = await authClient.signIn.email({
        email: "admin@drivefleet.com",
        password: "DriveFleet@2026",
      });

      if (res.error) {
        // If not registered yet, auto sign up the demo account
        const signupRes = await authClient.signUp.email({
          email: "admin@drivefleet.com",
          password: "DriveFleet@2026",
          name: "DriveFleet Flagship Host",
        });
        if (signupRes.error) {
          toast.error(signupRes.error.message || "Demo account creation failed");
          return;
        }
      }

      await syncBackendJwt("admin@drivefleet.com", "DriveFleet Flagship Host");
      toast.success("Logged in with Demo Account!");
      router.push(callbackUrl);
      router.refresh();
    } catch (err) {
      toast.error(err.message || "Demo login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-3xl p-8 shadow-2xl shadow-black/40">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email Field */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Email Address
          </label>
          <div className="relative">
            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-sky-500/60 focus:ring-1 focus:ring-sky-500/40 transition-all"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Password
          </label>
          <div className="relative">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-sky-500/60 focus:ring-1 focus:ring-sky-500/40 transition-all"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 shadow-lg shadow-sky-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2 cursor-pointer"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Signing In...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <FiArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Quick Demo Login Option */}
      <div className="mt-6 pt-6 border-t border-slate-800/80">
        <button
          type="button"
          onClick={handleDemoLogin}
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-sky-400 bg-sky-500/10 border border-sky-500/25 hover:bg-sky-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <FiCheckCircle className="w-4 h-4 text-sky-400" />
          <span>One-Click Demo Account Login</span>
        </button>
      </div>

      {/* Sign Up Redirect */}
      <p className="mt-6 text-center text-xs text-slate-400">
        Don't have an account?{" "}
        <Link
          href="/signup"
          className="text-sky-400 hover:text-sky-300 font-semibold underline underline-offset-4"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-24 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Header Badge & Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-amber-400 p-[2px] shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <RiCarLine className="w-6 h-6 text-sky-400" />
              </div>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-2xl font-extrabold tracking-wider bg-gradient-to-r from-sky-400 via-slate-100 to-indigo-300 bg-clip-text text-transparent">
                Drive<span className="text-sky-400">Fleet</span>
              </span>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-slate-400">
                Exotic & Luxury Rentals
              </span>
            </div>
          </Link>
          <h1 className="text-2xl font-black text-white">Sign In to Your Account</h1>
          <p className="text-sm text-slate-400 mt-1">
            Access live car availability, make reservations, or manage your fleet
          </p>
        </div>

        <Suspense fallback={<div className="text-center py-12 text-slate-400">Loading form...</div>}>
          <LoginForm />
        </Suspense>

        {/* Trust Badges */}
        <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <FiShield className="w-4 h-4 text-emerald-400" />
            <span>256-Bit Encrypted</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <RiCarLine className="w-4 h-4 text-sky-400" />
            <span>DriveFleet Verified</span>
          </div>
        </div>
      </div>
    </main>
  );
}
