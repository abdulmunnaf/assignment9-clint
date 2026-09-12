"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/LoadingSpinner";
import { FiEdit2, FiTrash2, FiX, FiCheck, FiMapPin, FiUsers, FiActivity } from "react-icons/fi";

const CAR_TYPES = ["Luxury", "SUV", "Sedan", "Electric", "Hatchback"];

export default function MyCarsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Update modal state
  const [editCar, setEditCar] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [updating, setUpdating] = useState(false);

  // Delete modal state
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!isPending && !session?.user) {
      toast.error("Please sign in to view your listings");
      router.push("/login");
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

  const fetchMyCars = async () => {
    if (!session?.user?.email) return;
    try {
      setLoading(true);
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";
      const token = await getToken();

      await fetch(`${serverUrl}/jwt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: session.user.email, name: session.user.name }),
      });

      const res = await fetch(`${serverUrl}/cars/user/${encodeURIComponent(session.user.email)}`, {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch your listings");
      const data = await res.json();
      setCars(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user) fetchMyCars();
  }, [session]);

  const openEdit = (car) => {
    setEditCar(car);
    setEditForm({
      car_name: car.car_name || car.carName || "",
      daily_rate: car.daily_rate || car.dailyRentPrice || "",
      category: car.category || car.carType || "Sedan",
      image_url: car.image_url || car.image || "",
      pickup_location: car.pickup_location || car.pickupLocation || "",
      description: car.description || "",
      availabilityStatus: car.availabilityStatus || "Available",
    });
  };

  const handleUpdate = async () => {
    try {
      setUpdating(true);
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";
      const token = await getToken();

      const res = await fetch(`${serverUrl}/cars/${editCar._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify(editForm),
      });

      if (!res.ok) throw new Error("Update failed");
      toast.success("Vehicle updated successfully!");
      setEditCar(null);
      fetchMyCars();
    } catch (err) {
      toast.error(err.message || "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";
      const token = await getToken();

      const res = await fetch(`${serverUrl}/cars/${deleteId}`, {
        method: "DELETE",
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        credentials: "include",
      });

      if (!res.ok) throw new Error("Delete failed");
      toast.success("Vehicle removed from your fleet");
      setDeleteId(null);
      fetchMyCars();
    } catch (err) {
      toast.error(err.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  if (isPending || loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><LoadingSpinner text="Loading your fleet..." /></div>;

  const inputClass = "w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-sky-500/60";

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">My Added Cars</h1>
            <p className="mt-1 text-sm text-slate-400">Manage your vehicle listings — update details or remove from fleet.</p>
          </div>
          <a href="/add-car" className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 shadow-md shadow-sky-500/20 transition-all">
            + Add New Car
          </a>
        </div>

        {error ? (
          <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400">{error}</div>
        ) : cars.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-4">
            <p className="text-lg font-semibold">No vehicles listed yet</p>
            <a href="/add-car" className="text-sky-400 hover:underline text-sm">Add your first car →</a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => {
              const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80";
              const carName = car.car_name || car.carName || "Vehicle";
              const imgSrc = car.image_url || car.image || DEFAULT_IMAGE;
              const dailyRate = car.daily_rate || car.dailyRentPrice || 0;
              const category = car.category || car.carType || "Sedan";
              const location = car.pickup_location || car.pickupLocation || "N/A";

              return (
                <div key={car._id} className="rounded-2xl overflow-hidden bg-slate-900/60 border border-slate-800 flex flex-col">
                  <div className="relative h-44">
                    <img
                      src={imgSrc}
                      alt={carName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        if (e.currentTarget.src !== DEFAULT_IMAGE) {
                          e.currentTarget.src = DEFAULT_IMAGE;
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                    <span className="absolute top-3 left-3 px-2 py-1 text-xs font-semibold bg-slate-900/90 text-sky-400 border border-sky-500/30 rounded-full">
                      {category}
                    </span>
                    <span className={`absolute top-3 right-3 px-2 py-1 text-xs font-semibold border rounded-full ${car.availabilityStatus === "Available" ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" : "bg-rose-500/20 text-rose-300 border-rose-500/40"}`}>
                      {car.availabilityStatus}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="text-base font-bold text-white">{carName}</h3>
                      <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1"><FiMapPin className="w-3.5 h-3.5 text-amber-400" />{location}</span>
                        {(car.booking_count || 0) > 0 && (
                          <span className="flex items-center gap-1 text-amber-400"><FiActivity className="w-3.5 h-3.5" />{car.booking_count} bookings</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-lg font-black text-white">${dailyRate}<span className="text-xs font-normal text-slate-400">/day</span></span>
                      <div className="flex items-center gap-2">
                        <button
                          id={`edit-car-${car._id}`}
                          onClick={() => openEdit(car)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-sky-400 bg-sky-500/10 border border-sky-500/30 hover:bg-sky-500/20 transition-all"
                        >
                          <FiEdit2 className="w-3.5 h-3.5" />
                          Update
                        </button>
                        <button
                          id={`delete-car-${car._id}`}
                          onClick={() => setDeleteId(car._id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 transition-all"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* UPDATE MODAL */}
      {editCar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Update Vehicle</h2>
              <button onClick={() => setEditCar(null)} className="text-slate-400 hover:text-white"><FiX className="w-5 h-5" /></button>
            </div>

            <div className="space-y-3">
              <div><label className="text-xs text-slate-400 font-medium mb-1 block">Car Name</label><input value={editForm.car_name} onChange={(e) => setEditForm(p => ({ ...p, car_name: e.target.value }))} className={inputClass} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-slate-400 font-medium mb-1 block">Daily Rate ($)</label><input type="number" value={editForm.daily_rate} onChange={(e) => setEditForm(p => ({ ...p, daily_rate: e.target.value }))} className={inputClass} /></div>
                <div><label className="text-xs text-slate-400 font-medium mb-1 block">Type</label>
                  <select value={editForm.category} onChange={(e) => setEditForm(p => ({ ...p, category: e.target.value }))} className={inputClass}>
                    {CAR_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div><label className="text-xs text-slate-400 font-medium mb-1 block">Availability</label>
                <select value={editForm.availabilityStatus} onChange={(e) => setEditForm(p => ({ ...p, availabilityStatus: e.target.value }))} className={inputClass}>
                  <option value="Available">Available</option>
                  <option value="Unavailable">Unavailable</option>
                </select>
              </div>
              <div><label className="text-xs text-slate-400 font-medium mb-1 block">Image URL</label><input value={editForm.image_url} onChange={(e) => setEditForm(p => ({ ...p, image_url: e.target.value }))} className={inputClass} /></div>
              <div><label className="text-xs text-slate-400 font-medium mb-1 block">Pickup Location</label><input value={editForm.pickup_location} onChange={(e) => setEditForm(p => ({ ...p, pickup_location: e.target.value }))} className={inputClass} /></div>
              <div><label className="text-xs text-slate-400 font-medium mb-1 block">Description</label><textarea value={editForm.description} onChange={(e) => setEditForm(p => ({ ...p, description: e.target.value }))} rows={3} className={`${inputClass} resize-none`} /></div>
            </div>

            <button onClick={handleUpdate} disabled={updating} className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
              {updating ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Updating...</> : <><FiCheck className="w-4 h-4" />Save Changes</>}
            </button>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-5 text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
              <FiTrash2 className="w-6 h-6 text-rose-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Remove Vehicle?</h3>
              <p className="text-sm text-slate-400 mt-1">This will permanently delete this listing from the DriveFleet marketplace. This action cannot be undone.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-300 bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-all">Cancel</button>
              <button id="confirm-delete-btn" onClick={handleDelete} disabled={deleting} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-rose-600 hover:bg-rose-500 transition-all disabled:opacity-60">
                {deleting ? "Removing..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
