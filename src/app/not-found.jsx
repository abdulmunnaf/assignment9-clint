"use client";

import Link from "next/link";
import { FiAlertTriangle, FiHome, FiCompass } from "react-icons/fi";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="max-w-md w-full text-center space-y-6 p-8 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-2xl">
        <div className="w-20 h-20 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
          <FiAlertTriangle className="w-10 h-10 text-amber-400 animate-bounce" />
        </div>

        <div className="space-y-2">
          <span className="text-6xl font-extrabold tracking-tight bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            404
          </span>
          <h1 className="text-2xl font-bold text-slate-100">
            Roadblock Ahead! Route Not Found
          </h1>
          <p className="text-sm text-slate-400">
            Looks like this road leads nowhere or the requested vehicle listing has been relocated.
            Let&apos;s navigate back to safety.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-medium hover:from-sky-400 hover:to-indigo-500 transition-all duration-200 shadow-lg shadow-sky-500/25"
          >
            <FiHome className="w-4 h-4" />
            Back to Home
          </Link>
          <Link
            href="/cars"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 font-medium hover:bg-slate-700 hover:text-white transition-all duration-200"
          >
            <FiCompass className="w-4 h-4" />
            Explore Fleet
          </Link>
        </div>
      </div>
    </div>
  );
}
