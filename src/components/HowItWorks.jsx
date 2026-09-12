"use client";

import React from "react";
import { FiSearch, FiCalendar, FiKey, FiArrowRight } from "react-icons/fi";
import Link from "next/link";

export default function HowItWorks() {
  const steps = [
    {
      step: "01",
      icon: <FiSearch className="w-7 h-7 text-sky-400" />,
      title: "Discover Your Dream Vehicle",
      description:
        "Filter by category, powertrain, seat capacity, or location. Explore high-res photos and transparent daily pricing without surprises.",
    },
    {
      step: "02",
      icon: <FiCalendar className="w-7 h-7 text-indigo-400" />,
      title: "Customize & Reserve",
      description:
        "Select your rental duration, choose optional certified chauffeur service, leave any special delivery notes, and secure instant confirmation.",
    },
    {
      step: "03",
      icon: <FiKey className="w-7 h-7 text-amber-400" />,
      title: "Pick Up & Hit the Road",
      description:
        "Collect your sanitized vehicle from designated pickup hubs or request direct airport concierge handoff. Drive with total freedom.",
    },
  ];

  return (
    <section className="py-20 bg-slate-900/40 border-t border-slate-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
            Effortless Journey
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-3">
            How DriveFleet Works
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400">
            Booking a high-end luxury or electric car takes under two minutes. Here is the
            streamlined 3-step rental journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, index) => (
            <div
              key={index}
              className="relative p-8 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/40 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <span className="text-3xl font-black text-slate-800 group-hover:text-indigo-500/30 transition-colors">
                    {item.step}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/50 flex items-center text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 transition-colors">
                <span>Step {item.step} Complete</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/cars"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-slate-800 border border-slate-700 hover:bg-slate-700 hover:border-slate-600 transition-all duration-200"
          >
            <span>Start Your Reservation</span>
            <FiArrowRight className="w-4 h-4 text-sky-400" />
          </Link>
        </div>
      </div>
    </section>
  );
}
