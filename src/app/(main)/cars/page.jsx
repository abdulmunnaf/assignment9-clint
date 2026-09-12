"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import LoadingSpinner from "@/components/LoadingSpinner";
import {
  FiSearch,
  FiFilter,
  FiArrowRight,
  FiUsers,
  FiMapPin,
  FiActivity,
  FiX,
} from "react-icons/fi";

const CAR_TYPES = ["All", "Luxury", "SUV", "Sedan", "Electric", "Hatchback"];
const STATUS_OPTIONS = ["All", "Available", "Unavailable"];
const SORT_OPTIONS = [
  { label: "Latest", value: "latest" },
  { label: "Price: Low → High", value: "price_asc" },
  { label: "Price: High → Low", value: "price_desc" },
  { label: "Most Popular", value: "popular" },
];

export default function CarsPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedSort, setSelectedSort] = useState("latest");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchCars = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";
      const params = new URLSearchParams();
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (selectedType !== "All") params.set("type", selectedType);
      if (selectedStatus !== "All") params.set("status", selectedStatus);
      if (selectedSort !== "latest") params.set("sort", selectedSort);

      const res = await fetch(`${serverUrl}/cars?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load vehicles");
      const data = await res.json();
      setCars(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, selectedType, selectedStatus, selectedSort]);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  const clearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setSelectedType("All");
    setSelectedStatus("All");
    setSelectedSort("latest");
  };

  const hasActiveFilters =
    search || selectedType !== "All" || selectedStatus !== "All" || selectedSort !== "latest";

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-400">
              Live Inventory
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Explore Our Full Fleet
          </h1>
          <p className="mt-2 text-sm text-slate-400 max-w-xl">
            Browse every available and upcoming vehicle in the DriveFleet collection. Filter by
            category, status, or search by name.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 mb-8 space-y-4">
          {/* Search Input */}
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              id="car-search-input"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by car name, location, or description..."
              className="w-full pl-12 pr-12 py-3 rounded-xl bg-slate-800/70 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-sky-500/60 focus:ring-1 focus:ring-sky-500/40 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                <FiX className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Row */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Type Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <FiFilter className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-xs text-slate-400 font-medium shrink-0">Type:</span>
              {CAR_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    selectedType === type
                      ? "bg-sky-600 text-white shadow-sm shadow-sky-600/30"
                      : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2 flex-wrap ml-auto">
              {STATUS_OPTIONS.map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    selectedStatus === st
                      ? st === "Available"
                        ? "bg-emerald-600 text-white"
                        : st === "Unavailable"
                        ? "bg-rose-600 text-white"
                        : "bg-sky-600 text-white"
                      : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
                  }`}
                >
                  {st}
                </button>
              ))}

              {/* Sort Dropdown */}
              <select
                id="car-sort-select"
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 border border-slate-700 text-slate-300 focus:outline-none focus:border-sky-500/60 cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30 hover:bg-rose-500/25 transition-all flex items-center gap-1"
                >
                  <FiX className="w-3.5 h-3.5" />
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Count */}
        {!loading && !error && (
          <p className="text-xs text-slate-500 mb-6">
            Showing{" "}
            <span className="font-semibold text-slate-300">{cars.length}</span> vehicle
            {cars.length !== 1 ? "s" : ""}
            {hasActiveFilters ? " matching your filters" : " in the fleet"}
          </p>
        )}

        {/* Grid / Loading / Error States */}
        {loading ? (
          <LoadingSpinner text="Querying DriveFleet live inventory..." />
        ) : error ? (
          <div className="p-8 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-center">
            <p className="text-rose-400 font-medium">{error}</p>
            <button
              onClick={fetchCars}
              className="mt-3 text-xs text-sky-400 hover:underline"
            >
              Try again
            </button>
          </div>
        ) : cars.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-4">
            <FiSearch className="w-12 h-12 text-slate-700" />
            <p className="text-lg font-semibold">No vehicles found</p>
            <p className="text-sm">Try adjusting your search or filters.</p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-sky-400 hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cars.map((car) => {
              const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80";
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
                  className="group rounded-2xl overflow-hidden bg-slate-900/60 border border-slate-800 hover:border-sky-500/40 transition-all duration-300 flex flex-col hover:shadow-2xl hover:shadow-sky-500/10"
                >
                  {/* Image */}
                  <div className="relative h-52 w-full overflow-hidden bg-slate-900">
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
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                    {/* Badges */}
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-900/90 text-sky-400 border border-sky-500/30 backdrop-blur-md">
                      {category}
                    </span>
                    <span
                      className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md border ${
                        availability === "Available"
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                          : "bg-rose-500/20 text-rose-300 border-rose-500/40"
                      }`}
                    >
                      {availability}
                    </span>
                    {bookingCount > 0 && (
                      <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-md">
                        <FiActivity className="w-3 h-3" />
                        {bookingCount} bookings
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h2 className="text-lg font-bold text-white group-hover:text-sky-400 transition-colors line-clamp-1">
                        {carName}
                      </h2>
                      <p className="mt-1.5 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {car.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 pt-3 border-t border-slate-800/80">
                      <div className="flex items-center gap-1.5">
                        <FiUsers className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                        <span>{seats} Seats</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <FiMapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="truncate">{location}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                          Daily Rate
                        </span>
                        <p className="text-xl font-black text-white">
                          ${dailyRate}
                          <span className="text-xs font-normal text-slate-400">/day</span>
                        </p>
                      </div>
                      <Link
                        href={`/cars/${car._id}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 shadow-md shadow-sky-600/20 transition-all duration-200 hover:scale-105"
                      >
                        Details
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
    </main>
  );
}
