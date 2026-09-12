"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { FiUser, FiMail, FiLock, FiImage, FiArrowRight, FiShield } from "react-icons/fi";
import { RiCarLine } from "react-icons/ri";

function SignupForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");
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
    if (!name || !email || !password) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      const res = await authClient.signUp.email({
        email,
        password,
        name,
        image: image.trim() || undefined,
      });

      if (res.error) {
        toast.error(res.error.message || "Registration failed");
        return;
      }

      await syncBackendJwt(email, name);
      toast.success("Account created successfully! Welcome to DriveFleet.");
      router.push("/cars");
      router.refresh();
    } catch (err) {
      toast.error(err.message || "Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-3xl p-8 shadow-2xl shadow-black/40">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Full Name <span className="text-rose-400">*</span>
          </label>
          <div className="relative">
            <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alexander Sterling"
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-sky-500/60 focus:ring-1 focus:ring-sky-500/40 transition-all"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Email Address <span className="text-rose-400">*</span>
          </label>
          <div className="relative">
            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alexander@drivefleet.com"
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-sky-500/60 focus:ring-1 focus:ring-sky-500/40 transition-all"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Password <span className="text-rose-400">*</span>
          </label>
          <div className="relative">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-sky-500/60 focus:ring-1 focus:ring-sky-500/40 transition-all"
            />
          </div>
        </div>

        {/* Profile Avatar URL */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Avatar Image URL <span className="text-slate-500 font-normal">(Optional)</span>
          </label>
          <div className="relative">
            <FiImage className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-sky-500/60 focus:ring-1 focus:ring-sky-500/40 transition-all"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 shadow-lg shadow-sky-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4 cursor-pointer"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <span>Create Account</span>
              <FiArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Redirect */}
      <p className="mt-6 text-center text-xs text-slate-400">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-sky-400 hover:text-sky-300 font-semibold underline underline-offset-4"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-24 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
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
          <h1 className="text-2xl font-black text-white">Join DriveFleet</h1>
          <p className="text-sm text-slate-400 mt-1">
            Create an account to book luxury cars or list your own exotic fleet
          </p>
        </div>

        <Suspense fallback={<div className="text-center py-12 text-slate-400">Loading form...</div>}>
          <SignupForm />
        </Suspense>

        {/* Trust Badges */}
        <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <FiShield className="w-4 h-4 text-emerald-400" />
            <span>Encrypted Credentials</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <RiCarLine className="w-4 h-4 text-sky-400" />
            <span>Instant Access</span>
          </div>
        </div>
      </div>
    </main>
  );
}
