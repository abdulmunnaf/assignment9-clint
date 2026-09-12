"use client";

import React from "react";
import Link from "next/link";
import { FiArrowRight, FiShield, FiZap, FiCheckCircle } from "react-icons/fi";
import { RiCarLine } from "react-icons/ri";

export default function Banner() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-slate-950">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-sky-500/20 via-indigo-500/15 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Decorative Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)",
          backgroundSize: "36px 36px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
              <span className="text-xs font-semibold uppercase tracking-wider text-sky-400">
                Premium Exotic & Everyday Fleet
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
              Experience Pure Luxury &{" "}
              <span className="bg-gradient-to-r from-sky-400 via-indigo-400 to-amber-300 bg-clip-text text-transparent">
                Freedom on Wheels
              </span>
            </h1>

            {/* Subtitle / Short Description */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Unlock access to hand-selected luxury sedans, electric supercars, and capable
              all-terrain SUVs. Seamless instant reservations, transparent pricing, and
              complimentary 24/7 roadside assistance.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/cars"
                id="explore-cars-banner-btn"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-sky-500 via-indigo-600 to-indigo-700 hover:from-sky-400 hover:to-indigo-600 shadow-xl shadow-sky-500/25 transition-all duration-300 hover:scale-[1.03] group"
              >
                <span>Explore Cars</span>
                <FiArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/add-car"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-slate-200 bg-slate-900/90 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 transition-all duration-200"
              >
                <RiCarLine className="w-5 h-5 text-sky-400" />
                <span>Host Your Car</span>
              </Link>
            </div>

            {/* Key Value Points */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4">
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">100+</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Verified Vehicles</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-sky-400 tracking-tight">24/7</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Roadside Support</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-amber-400 tracking-tight">4.9★</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Renter Satisfaction</p>
              </div>
            </div>
          </div>

          {/* Right Showcase Image Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto rounded-2xl overflow-hidden border border-slate-800/80 bg-slate-900/50 shadow-2xl backdrop-blur-xl group">
              <img
                src="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1000&q=80"
                alt="Porsche 911 Carrera Luxury Rental"
                className="w-full h-80 sm:h-96 object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

              {/* Floating Featured Badge */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-900/90 border border-slate-700/60 backdrop-blur-md flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                    Featured Vehicle
                  </span>
                  <h3 className="text-base font-bold text-white">Porsche 911 Carrera S</h3>
                  <p className="text-xs text-slate-400">Beverly Hills, CA</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-extrabold text-sky-400">$350</span>
                  <span className="text-xs text-slate-400">/day</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
