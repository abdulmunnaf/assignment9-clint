"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/LoadingSpinner";
import {
  FiUsers,
  FiMapPin,
  FiArrowLeft,
  FiCalendar,
  FiX,
  FiCheck,
  FiActivity,
  FiZap,
  FiSettings,
} from "react-icons/fi";

export default function CarDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [booking, setBooking] = useState(false);

  // Booking form state
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [driverNeeded, setDriverNeeded] = useState(false);
  const [specialNote, setSpecialNote] = useState("");

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";
        const res = await fetch(`${serverUrl}/cars/${id}`);
        if (!res.ok) throw new Error("Vehicle not found");
        const data = await res.json();
        setCar(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchCar();
  }, [id]);

  const carName = car?.car_name || car?.carName || "Unknown Vehicle";
  const imgSrc = car?.image_url || car?.image || "";
  const dailyRate = car?.daily_rate || car?.dailyRentPrice || 0;
  const category = car?.category || car?.carType || "Sedan";
  const seats = car?.seat_capacity || car?.seatCapacity || 5;
  const location = car?.pickup_location || car?.pickupLocation || "N/A";
  const availability = car?.availabilityStatus || "Available";
  const fuelType = car?.fuel_type || car?.fuelType || "Gasoline";
  const transmission = car?.transmission || "Automatic";
  const bookingCount = car?.booking_count || 0;

  // Calculate total price
  const calcTotal = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
    const base = days * dailyRate;
    const driverFee = driverNeeded ? days * 50 : 0;
    return base + driverFee;
  };

  const handleBookNow = async () => {
    if (!session?.user) {
      toast.error("Please sign in to book a vehicle");
      router.push("/login");
      return;
    }
    if (!startDate || !endDate) {
      toast.error("Please select start and end dates");
      return;
    }
    if (new Date(endDate) <= new Date(startDate)) {
      toast.error("End date must be after start date");
      return;
    }

    try {
      setBooking(true);
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";

      // Get JWT from Better-Auth
      const tokenRes = await authClient.getSession();
      let token = "";
      try {
        const jwtRes = await authClient.token();
        token = jwtRes?.data?.token || jwtRes?.token || "";
      } catch (_) {}

      // Sync JWT to Express backend cookie
      await fetch(`${serverUrl}/jwt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: session.user.email, name: session.user.name }),
      });

      const res = await fetch(`${serverUrl}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify({
          car_id: id,
          car_name: carName,
          car_image: imgSrc,
          daily_rate: dailyRate,
          total_price: calcTotal(),
          start_date: startDate,
          end_date: endDate,
          driver_needed: driverNeeded,
          special_note: specialNote,
          user_email: session.user.email,
          user_name: session.user.name,
          pickup_location: location,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Booking failed");
      }

      toast.success("🎉 Reservation confirmed! Check My Bookings.");
      setShowModal(false);
      setStartDate("");
      setEndDate("");
      setDriverNeeded(false);
      setSpecialNote("");
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><LoadingSpinner /></div>;
  if (error) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4 text-slate-300">
      <p className="text-rose-400">{error}</p>
      <Link href="/cars" className="text-sky-400 hover:underline text-sm">← Back to Fleet</Link>
    </div>
  );
  if (!car) return null;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link href="/cars" className="inline-flex items-center gap-2 text-slate-400 hover:text-sky-400 transition-colors text-sm mb-8 group">
          <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Fleet
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Image */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 relative h-80 sm:h-96 lg:h-[26rem]">
              <img
                src={imgSrc || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80"}
                alt={carName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
              <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-900/90 text-sky-400 border border-sky-500/30">
                {category}
              </span>
              <span className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-md ${
                availability === "Available"
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                  : "bg-rose-500/20 text-rose-300 border-rose-500/40"
              }`}>
                {availability}
              </span>
            </div>
          </div>

          {/* Right: Details */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{carName}</h1>
              <p className="mt-1 text-slate-400 text-sm leading-relaxed">{car.description}</p>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: <FiUsers className="w-4 h-4 text-sky-400" />, label: "Seats", value: `${seats} Passengers` },
                { icon: <FiMapPin className="w-4 h-4 text-amber-400" />, label: "Pickup", value: location },
                { icon: <FiZap className="w-4 h-4 text-emerald-400" />, label: "Fuel", value: fuelType },
                { icon: <FiSettings className="w-4 h-4 text-indigo-400" />, label: "Transmission", value: transmission },
              ].map((spec) => (
                <div key={spec.label} className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                  <div className="flex items-center gap-2 mb-1">{spec.icon}<span className="text-xs text-slate-500 font-medium">{spec.label}</span></div>
                  <span className="text-sm font-semibold text-slate-200">{spec.value}</span>
                </div>
              ))}
            </div>

            {/* Popularity */}
            {bookingCount > 0 && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
                <FiActivity className="w-3.5 h-3.5" />
                {bookingCount} successful bookings
              </div>
            )}

            {/* Price + Book Now */}
            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-black text-white">${dailyRate}</span>
                <span className="text-slate-400 text-sm">/day</span>
              </div>
              <button
                id="book-now-btn"
                onClick={() => setShowModal(true)}
                disabled={availability !== "Available"}
                className={`w-full py-3.5 rounded-xl font-bold text-white transition-all duration-200 ${
                  availability === "Available"
                    ? "bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 shadow-lg shadow-sky-500/25 hover:scale-[1.02]"
                    : "bg-slate-800 text-slate-500 cursor-not-allowed"
                }`}
              >
                {availability === "Available" ? "Book Now" : "Currently Unavailable"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Reserve {carName}</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 font-medium mb-1 block">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:border-sky-500/60"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-medium mb-1 block">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    min={startDate || new Date().toISOString().split("T")[0]}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:border-sky-500/60"
                  />
                </div>
              </div>

              {/* Driver Needed Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/60 border border-slate-700">
                <div>
                  <p className="text-sm font-semibold text-slate-200">Add Certified Chauffeur</p>
                  <p className="text-xs text-slate-400 mt-0.5">+$50/day for professional driver</p>
                </div>
                <button
                  id="driver-toggle"
                  onClick={() => setDriverNeeded(!driverNeeded)}
                  className={`w-11 h-6 rounded-full transition-colors duration-200 relative ${driverNeeded ? "bg-sky-500" : "bg-slate-700"}`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${driverNeeded ? "translate-x-5" : "translate-x-0.5"}`} />
                </button>
              </div>

              {/* Special Note */}
              <div>
                <label className="text-xs text-slate-400 font-medium mb-1 block">Special Note (optional)</label>
                <textarea
                  value={specialNote}
                  onChange={(e) => setSpecialNote(e.target.value)}
                  placeholder="Airport pickup, luggage requirements, etc."
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-sm resize-none focus:outline-none focus:border-sky-500/60"
                />
              </div>

              {/* Price Summary */}
              {startDate && endDate && new Date(endDate) > new Date(startDate) && (
                <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-500/20 space-y-1">
                  <div className="flex justify-between text-sm text-slate-300">
                    <span>
                      {Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))} day(s) × ${dailyRate}
                    </span>
                    <span>${Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) * dailyRate}</span>
                  </div>
                  {driverNeeded && (
                    <div className="flex justify-between text-sm text-slate-300">
                      <span>Chauffeur fee</span>
                      <span>+${Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) * 50}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-white border-t border-sky-500/20 pt-2 mt-2">
                    <span>Total</span>
                    <span className="text-sky-400">${calcTotal()}</span>
                  </div>
                </div>
              )}
            </div>

            <button
              id="confirm-booking-btn"
              onClick={handleBookNow}
              disabled={booking}
              className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 shadow-lg shadow-sky-500/25 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {booking ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Confirming...
                </>
              ) : (
                <>
                  <FiCheck className="w-4 h-4" />
                  Confirm Reservation
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
