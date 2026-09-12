"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { FiUploadCloud, FiCheck } from "react-icons/fi";

const CAR_TYPES = ["Luxury", "SUV", "Sedan", "Electric", "Hatchback"];
const FUEL_TYPES = ["Gasoline", "Hybrid", "Electric", "Diesel", "Turbo Gas", "Premium Gas"];
const TRANSMISSION_TYPES = ["Automatic", "Manual", "PDK", "DSG", "CVT", "Direct Drive"];

export default function AddCarPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  const [form, setForm] = useState({
    car_name: "",
    daily_rate: "",
    category: "Sedan",
    image_url: "",
    seat_capacity: "",
    pickup_location: "",
    description: "",
    availabilityStatus: "Available",
    fuel_type: "Gasoline",
    transmission: "Automatic",
  });

  // Redirect unauthenticated users
  useEffect(() => {
    if (!isPending && !session?.user) {
      toast.error("Please sign in to add a vehicle");
      router.push("/login");
    }
  }, [session, isPending, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "image_url") setImagePreview(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session?.user) {
      toast.error("Please sign in first");
      return;
    }
    if (!form.car_name || !form.daily_rate || !form.pickup_location || !form.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setSubmitting(true);
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";

      // Sync cookie JWT
      await fetch(`${serverUrl}/jwt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: session.user.email, name: session.user.name }),
      });

      // Get token
      let token = "";
      try {
        const jwtRes = await authClient.token();
        token = jwtRes?.data?.token || jwtRes?.token || "";
      } catch (_) {}

      const res = await fetch(`${serverUrl}/cars`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify({
          ...form,
          daily_rate: Number(form.daily_rate),
          seat_capacity: Number(form.seat_capacity) || 5,
          owner_email: session.user.email,
          owner_name: session.user.name,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to add vehicle");
      }

      toast.success("Vehicle listing created successfully!");
      router.push("/my-cars");
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (isPending) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">Loading...</div>;
  if (!session?.user) return null;

  const inputClass = "w-full px-4 py-3 rounded-xl bg-slate-800/70 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-sky-500/60 focus:ring-1 focus:ring-sky-500/30 transition-all";
  const labelClass = "block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5";

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-400">
              Host Portal
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Add New Vehicle</h1>
          <p className="mt-2 text-sm text-slate-400">
            List your vehicle in the DriveFleet marketplace. Fill in accurate details to attract renters.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
          {/* Car Name */}
          <div>
            <label className={labelClass}>Car Name *</label>
            <input name="car_name" value={form.car_name} onChange={handleChange} placeholder="e.g. Porsche 911 Carrera S" className={inputClass} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Daily Rate */}
            <div>
              <label className={labelClass}>Daily Rent Price ($) *</label>
              <input type="number" name="daily_rate" value={form.daily_rate} onChange={handleChange} placeholder="e.g. 250" min="1" className={inputClass} required />
            </div>

            {/* Seat Capacity */}
            <div>
              <label className={labelClass}>Seat Capacity</label>
              <input type="number" name="seat_capacity" value={form.seat_capacity} onChange={handleChange} placeholder="e.g. 5" min="1" max="15" className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Car Type */}
            <div>
              <label className={labelClass}>Car Type *</label>
              <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
                {CAR_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* Availability */}
            <div>
              <label className={labelClass}>Availability Status</label>
              <select name="availabilityStatus" value={form.availabilityStatus} onChange={handleChange} className={inputClass}>
                <option value="Available">Available</option>
                <option value="Unavailable">Unavailable</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Fuel Type */}
            <div>
              <label className={labelClass}>Fuel Type</label>
              <select name="fuel_type" value={form.fuel_type} onChange={handleChange} className={inputClass}>
                {FUEL_TYPES.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>

            {/* Transmission */}
            <div>
              <label className={labelClass}>Transmission</label>
              <select name="transmission" value={form.transmission} onChange={handleChange} className={inputClass}>
                {TRANSMISSION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Pickup Location */}
          <div>
            <label className={labelClass}>Pickup Location *</label>
            <input name="pickup_location" value={form.pickup_location} onChange={handleChange} placeholder="e.g. Beverly Hills, CA" className={inputClass} required />
          </div>

          {/* Image URL */}
          <div>
            <label className={labelClass}>Image URL (imgbb/postimage)</label>
            <input name="image_url" value={form.image_url} onChange={handleChange} placeholder="https://i.ibb.co/..." className={inputClass} />
            {imagePreview && (
              <div className="mt-3 rounded-xl overflow-hidden border border-slate-700 h-40">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = "none"; }} />
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className={labelClass}>Description *</label>
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe the vehicle — powertrain, features, experience..." rows={4} className={`${inputClass} resize-none`} required />
          </div>

          {/* Submit */}
          <button
            id="add-car-submit-btn"
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 shadow-lg shadow-sky-500/25 transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <FiCheck className="w-4 h-4" />
                Publish Vehicle Listing
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
