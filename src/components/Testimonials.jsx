"use client";

import React from "react";
import { FiStar } from "react-icons/fi";
import { FaQuoteLeft } from "react-icons/fa6";

export default function Testimonials() {
  const reviews = [
    {
      name: "Alexander Hayes",
      role: "Venture Capitalist, San Francisco",
      carRented: "Porsche 911 Carrera S",
      comment:
        "The vehicle was delivered in immaculate showroom condition straight to my hotel. Seamless digital check-in and instantaneous acceleration made my weekend trip through Big Sur unforgettable.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    },
    {
      name: "Elena Rostova",
      role: "Architectural Designer, Miami",
      carRented: "Mercedes-Benz G 63 AMG",
      comment:
        "DriveFleet is head and shoulders above traditional rental agencies. Transparent pricing, zero hidden deposits, and prompt concierge service when I needed to extend my reservation.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    },
    {
      name: "Marcus Vance",
      role: "Tech Executive, Austin",
      carRented: "Tesla Model S Plaid",
      comment:
        "Booking took less than 60 seconds. The Model S Plaid exceeded every expectation. The optional chauffeur add-on for our corporate summit was worth every penny.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    },
  ];

  return (
    <section className="py-20 bg-slate-950 border-t border-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
            Driver Experiences
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-3">
            Trusted by Leaders & Enthusiasts
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400">
            Real feedback from verified renters who demanded unmatched performance,
            immaculate luxury, and flawless service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, index) => (
            <div
              key={index}
              className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <FiStar key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <FaQuoteLeft className="w-5 h-5 text-slate-700" />
                </div>

                <p className="text-sm text-slate-300 italic leading-relaxed mb-6">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center gap-3">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-11 h-11 rounded-full object-cover border border-slate-700"
                />
                <div>
                  <h4 className="text-sm font-bold text-white">{rev.name}</h4>
                  <p className="text-[11px] text-slate-400">{rev.role}</p>
                  <span className="text-[10px] text-sky-400 font-medium">
                    Rented: {rev.carRented}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
