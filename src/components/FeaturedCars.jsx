"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FiArrowRight, FiUsers, FiMapPin, FiZap, FiActivity } from "react-icons/fi";
import { RiCarLine } from "react-icons/ri";
import LoadingSpinner from "./LoadingSpinner";

export default function FeaturedCars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";
        const res = await fetch(`${serverUrl}/featured-cars`);
        if (!res.ok) {
          throw new Error("Failed to load featured fleet");
        }
        const data = await res.json();
        setCars(data);
      } catch (err) {
        console.error("Error fetching featured vehicles:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <section className="py-20 bg-slate-950/90 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 mb-3">
              <RiCarLine className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-sky-400">
                Live Inventory
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Available Vehicles Fleet
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-xl">
              Discover top-rated vehicles ready for immediate reservation. Inspected, sanitized,
              and prepared for your next journey.
            </p>
          </div>

          <Link
            href="/cars"
            className="inline-flex items-center gap-2 text-sm font-semibold text-sky-400 hover:text-sky-300 group"
          >
            <span>View Complete Fleet</span>
            <FiArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Dynamic Cards Grid */}
        {loading ? (
          <LoadingSpinner text="Retrieving live MongoDB fleet availability..." />
        ) : error ? (
          <div className="p-8 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-center">
            <p className="text-rose-400 font-medium">{error}</p>
            <p className="text-xs text-slate-400 mt-2">
              Ensure the backend server is running on port 8000.
            </p>
          </div>
        ) : cars.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <p>No available vehicles at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cars.slice(0, 6).map((car) => {
              const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80";
              const carName = car.car_name || car.carName || "Unknown Vehicle";
              const imgSrc = car.image_url || car.image || DEFAULT_IMAGE;
              const dailyRate = car.daily_rate || car.dailyRentPrice || 0;
              const category = car.category || car.carType || "Sedan";
              const seats = car.seat_capacity || car.seatCapacity || 5;
              const location = car.pickup_location || car.pickupLocation || "N/A";
              const bookingCount = car.booking_count || 0;
              const availability = car.availabilityStatus || "Available";

              return (
              <div
                key={car._id}
                className="group rounded-2xl overflow-hidden bg-slate-900/60 border border-slate-800 hover:border-sky-500/40 transition-all duration-300 flex flex-col justify-between hover:shadow-2xl hover:shadow-sky-500/10"
              >
                {/* Image & Badges */}
                <div className="relative h-56 w-full overflow-hidden bg-slate-950">
                  <img
                    src={imgSrc}
                    alt={carName}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      if (e.currentTarget.src !== DEFAULT_IMAGE) {
                        e.currentTarget.src = DEFAULT_IMAGE;
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                  {/* Category Pill */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-900/90 text-sky-400 border border-sky-500/30 backdrop-blur-md">
                    {category}
                  </span>

                  {/* Availability Badge */}
                  <span
                    className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md border ${
                      availability === "Available"
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                        : "bg-rose-500/20 text-rose-300 border-rose-500/40"
                    }`}
                  >
                    {availability}
                  </span>

                  {/* Popularity / Booking Count */}
                  {bookingCount > 0 && (
                    <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-md">
                      <FiActivity className="w-3 h-3" />
                      {bookingCount} Bookings
                    </span>
                  )}
                </div>

                {/* Body Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-xl font-bold text-white group-hover:text-sky-400 transition-colors line-clamp-1">
                        {carName}
                      </h3>
                    </div>

                    <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {car.description}
                    </p>
                  </div>

                  {/* Vehicle Spec Badges */}
                  <div className="pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <FiUsers className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span>{seats} Seats</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <FiMapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">{location}</span>
                    </div>
                  </div>

                  {/* Price & View Details Action */}
                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400 block">Daily Rate</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-white">${dailyRate}</span>
                        <span className="text-xs text-slate-400">/day</span>
                      </div>
                    </div>

                    <Link
                      href={`/cars/${car._id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 shadow-md shadow-sky-600/20 transition-all duration-200 hover:scale-105"
                    >
                      <span>View Details</span>
                      <FiArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
