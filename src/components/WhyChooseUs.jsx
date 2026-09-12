"use client";

import React from "react";
import { FiShield, FiClock, FiDollarSign, FiAward, FiCheck } from "react-icons/fi";
import { RiGasStationLine, RiCustomerService2Line } from "react-icons/ri";

export default function WhyChooseUs() {
  const features = [
    {
      icon: <FiShield className="w-6 h-6 text-sky-400" />,
      title: "Comprehensive Coverage Included",
      description:
        "Every vehicle comes equipped with full liability and collision damage waiver options, ensuring total peace of mind on every journey.",
    },
    {
      icon: <FiDollarSign className="w-6 h-6 text-emerald-400" />,
      title: "Transparent, Zero-Hidden-Fee Pricing",
      description:
        "What you see is what you pay. No surprising airport surcharges, no hidden cleaning fees, and clear daily mileage limits.",
    },
    {
      icon: <RiCustomerService2Line className="w-6 h-6 text-amber-400" />,
      title: "24/7 Roadside Concierge",
      description:
        "Whether you need tire assistance in the Rockies or battery recharge support in Silicon Valley, our concierge is a one-touch call away.",
    },
    {
      icon: <FiAward className="w-6 h-6 text-indigo-400" />,
      title: "Certified 150-Point Multi-Check",
      description:
        "Prior to every pickup, our mechanics perform meticulous diagnostics covering braking, tire tread, fluid levels, and digital software.",
    },
  ];

  return (
    <section className="py-20 bg-slate-950 border-t border-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-sky-400 bg-sky-500/10 border border-sky-500/20 px-3 py-1 rounded-full">
            The DriveFleet Standard
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-3">
            Why Discerning Drivers Choose DriveFleet
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400">
            We bridge the gap between exotic car thrills and seamless digital convenience.
            Here is why over 10,000 renters trust us each month.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-500/5 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mb-5">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center gap-2 text-xs font-semibold text-sky-400">
                <FiCheck className="w-4 h-4 text-emerald-400" />
                <span>Standard on all rentals</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
