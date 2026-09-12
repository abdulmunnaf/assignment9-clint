"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/LoadingSpinner";
import {
  FiCalendar,
  FiMapPin,
  FiClock,
  FiTrash2,
  FiCheckCircle,
  FiArrowRight,
  FiUserCheck,
  FiAlertCircle,
  FiDollarSign,
} from "react-icons/fi";
import { RiCarLine } from "react-icons/ri";

const DEFAULT_CAR_IMG =
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80";

export default function MyBookingsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Redirect unauthenticated user
  useEffect(() => {
    if (!isPending && !session?.user) {
      toast.error("Please sign in to view your bookings");
      router.push("/login?callbackUrl=/my-bookings");
    }
  }, [session, isPending, router]);

  const getToken = async () => {
    try {
      const jwtRes = await authClient.token();
      return jwtRes?.data?.token || jwtRes?.token || "";
    } catch (_) {
      return "";
    }
  };

  const fetchBookings = useCallback(async () => {
    if (!session?.user?.email) return;

    try {
      setLoading(true);
      setError(null);
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";
      const token = await getToken();

      // Ensure cookie token is synced
      await fetch(`${serverUrl}/jwt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: session.user.email, name: session.user.name }),
      });

      const res = await fetch(
        `${serverUrl}/bookings/user/${encodeURIComponent(session.user.email)}`,
        {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error("Failed to load your reservations");
      }

      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, [session?.user?.email, session?.user?.name]);

  useEffect(() => {
    if (session?.user?.email) {
      fetchBookings();
    }
  }, [session?.user?.email, fetchBookings]);

  const handleCancelBooking = async () => {
    if (!selectedBooking?._id) return;

    try {
      setCancellingId(selectedBooking._id);
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";
      const token = await getToken();

      const res = await fetch(`${serverUrl}/bookings/${selectedBooking._id}`, {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to cancel reservation");
      }

      toast.success("Reservation cancelled successfully");
      setShowCancelModal(false);
      setSelectedBooking(null);
      setBookings((prev) => prev.filter((b) => b._id !== selectedBooking._id));
    } catch (err) {
      toast.error(err.message || "Failed to cancel");
    } finally {
      setCancellingId(null);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <LoadingSpinner text="Authenticating user session..." />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-3">
              <FiCheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Reservation Manager
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              My Fleet Bookings
            </h1>
            <p className="mt-2 text-sm text-slate-400 max-w-xl">
              Track and manage all your confirmed vehicle reservations, pickup schedules, and
              trip receipts.
            </p>
          </div>

          <Link
            href="/cars"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 shadow-md shadow-sky-600/20 transition-all self-start md:self-auto cursor-pointer"
          >
            <RiCarLine className="w-4 h-4" />
            <span>Browse More Cars</span>
          </Link>
        </div>

        {/* Loading State */}
        {loading ? (
          <LoadingSpinner text="Retrieving your reservation records..." />
        ) : error ? (
          <div className="p-8 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-center max-w-xl mx-auto">
            <FiAlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
            <p className="text-rose-300 font-semibold">{error}</p>
            <button
              onClick={fetchBookings}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 transition-all cursor-pointer"
            >
              Try Again
            </button>
          </div>
        ) : bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-900/40 border border-slate-800 rounded-3xl text-center px-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-800/80 flex items-center justify-center mb-4 text-slate-500">
              <FiCalendar className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white">No active reservations found</h2>
            <p className="text-sm text-slate-400 mt-2 max-w-md">
              You haven’t reserved any luxury vehicles yet. Explore our high-performance fleet and
              book your next drive today!
            </p>
            <Link
              href="/cars"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 shadow-lg shadow-sky-500/20 transition-all duration-200"
            >
              <span>Explore Available Fleet</span>
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-xs text-slate-400 mb-2">
              Showing <span className="font-semibold text-slate-200">{bookings.length}</span>{" "}
              reservation{bookings.length !== 1 ? "s" : ""}
            </div>

            <div className="grid grid-cols-1 gap-5">
              {bookings.map((booking) => {
                const img = booking.car_image || DEFAULT_CAR_IMG;
                const carName = booking.car_name || "Luxury Vehicle";
                const total = booking.total_price || 0;
                const dailyRate = booking.daily_rate || 0;
                const startDate = booking.start_date || "N/A";
                const endDate = booking.end_date || "N/A";
                const location = booking.pickup_location || "Standard Hub";
                const driver = booking.driver_needed;
                const status = booking.status || "Confirmed";

                return (
                  <div
                    key={booking._id}
                    className="bg-slate-900/70 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden p-5 transition-all flex flex-col md:flex-row gap-6 items-center justify-between shadow-lg"
                  >
                    {/* Left: Car Image & Basic Info */}
                    <div className="flex flex-col sm:flex-row items-center gap-5 w-full md:w-auto">
                      <div className="relative w-full sm:w-44 h-28 rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-slate-800">
                        <img
                          src={img}
                          alt={carName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = DEFAULT_CAR_IMG;
                          }}
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/90 text-white backdrop-blur-md">
                          {status}
                        </span>
                      </div>

                      <div className="space-y-1.5 text-center sm:text-left">
                        <h2 className="text-lg font-bold text-white line-clamp-1">{carName}</h2>
                        <div className="flex items-center justify-center sm:justify-start gap-3 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <FiMapPin className="w-3.5 h-3.5 text-amber-400" />
                            {location}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <FiDollarSign className="w-3.5 h-3.5 text-sky-400" />
                            ${dailyRate}/day
                          </span>
                        </div>

                        {driver && (
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 text-[11px] font-medium border border-sky-500/20">
                            <FiUserCheck className="w-3 h-3" />
                            Professional Chauffeur Included
                          </div>
                        )}

                        {booking.special_note && (
                          <p className="text-xs text-slate-400 italic line-clamp-1">
                            Note: "{booking.special_note}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Middle: Schedule Dates */}
                    <div className="flex items-center gap-6 text-xs text-slate-300 bg-slate-950/60 border border-slate-800/80 px-4 py-3 rounded-xl w-full sm:w-auto justify-around sm:justify-start">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                          Start Date
                        </span>
                        <span className="font-semibold text-white">{startDate}</span>
                      </div>
                      <span className="text-slate-600">→</span>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                          End Date
                        </span>
                        <span className="font-semibold text-white">{endDate}</span>
                      </div>
                    </div>

                    {/* Right: Total Price & Actions */}
                    <div className="flex items-center justify-between md:justify-end gap-5 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
                      <div className="text-left md:text-right">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                          Total Amount
                        </span>
                        <span className="text-2xl font-black text-white">${total}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {booking.car_id && (
                          <Link
                            href={`/cars/${booking.car_id}`}
                            className="p-2.5 rounded-xl text-slate-400 hover:text-sky-400 hover:bg-slate-800 transition-colors"
                            title="View Vehicle Details"
                          >
                            <RiCarLine className="w-5 h-5" />
                          </Link>
                        )}

                        <button
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowCancelModal(true);
                          }}
                          className="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/25 hover:bg-rose-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Cancellation Confirmation Modal */}
        {showCancelModal && selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-2">
                <FiAlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Cancel Reservation?</h3>
              <p className="text-sm text-slate-400">
                Are you sure you want to cancel your booking for{" "}
                <span className="font-semibold text-slate-200">
                  {selectedBooking.car_name || "this vehicle"}
                </span>
                ? This action cannot be undone.
              </p>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  onClick={() => {
                    setShowCancelModal(false);
                    setSelectedBooking(null);
                  }}
                  disabled={Boolean(cancellingId)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
                >
                  Keep Reservation
                </button>
                <button
                  onClick={handleCancelBooking}
                  disabled={Boolean(cancellingId)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-600/30 transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2"
                >
                  {cancellingId ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Cancelling...</span>
                    </>
                  ) : (
                    <span>Yes, Cancel Booking</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
