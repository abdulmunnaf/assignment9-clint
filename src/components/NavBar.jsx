"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import ThemeToggle from "./ThemeToggle";
import toast from "react-hot-toast";
import {
  FiMenu,
  FiX,
  FiUser,
  FiLogOut,
  FiPlusCircle,
  FiCalendar,
  FiGrid,
  FiChevronDown,
  FiCompass,
} from "react-icons/fi";
import { RiCarLine } from "react-icons/ri";

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle scroll blur effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";
      // Clear server cookie
      fetch(`${serverUrl}/logout`, {
        method: "POST",
        credentials: "include",
      }).catch(() => {});

      await authClient.signOut();
      toast.success("Successfully logged out");
      router.push("/login");
      router.refresh();
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Explore Cars", href: "/cars" },
    ...(session?.user
      ? [
          { name: "Add Car", href: "/add-car" },
          { name: "My Bookings", href: "/my-bookings" },
        ]
      : []),
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-slate-950/85 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 shadow-lg shadow-black/20"
          : "bg-slate-950/60 dark:bg-slate-950/60 backdrop-blur-sm border-b border-slate-800/40"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-amber-400 p-[2px] shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <RiCarLine className="w-6 h-6 text-sky-400 group-hover:text-sky-300 transition-colors" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-sky-400 via-slate-100 to-indigo-300 bg-clip-text text-transparent">
                Drive<span className="text-sky-400">Fleet</span>
              </span>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-slate-400">
                Exotic & Luxury Rentals
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "text-sky-400 bg-sky-500/10 border border-sky-500/20 shadow-sm shadow-sky-500/10"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions: Theme Toggle + Auth Buttons / Profile Dropdown */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />

            {isPending ? (
              <div className="w-9 h-9 rounded-full bg-slate-800/60 animate-pulse" />
            ) : session?.user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pl-3 rounded-full bg-slate-900 border border-slate-700 hover:border-slate-600 transition-all text-slate-200 text-sm focus:outline-none"
                  aria-expanded={dropdownOpen}
                >
                  <span className="font-medium truncate max-w-[120px]">
                    {session.user.name || "My Account"}
                  </span>
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User Avatar"}
                      className="w-8 h-8 rounded-full object-cover border border-sky-400/50"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow">
                      {session.user.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}
                  <FiChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 mr-1 ${
                      dropdownOpen ? "rotate-180 text-sky-400" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-2xl backdrop-blur-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2 border-b border-slate-800/80">
                      <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                      <p className="text-sm font-semibold text-slate-200 truncate">
                        {session.user.email}
                      </p>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/add-car"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
                      >
                        <FiPlusCircle className="w-4 h-4 text-sky-400" />
                        Add Car
                      </Link>
                      <Link
                        href="/my-bookings"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
                      >
                        <FiCalendar className="w-4 h-4 text-emerald-400" />
                        My Bookings
                      </Link>
                      <Link
                        href="/my-cars"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
                      >
                        <FiGrid className="w-4 h-4 text-amber-400" />
                        My Added Cars
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-slate-800/80">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors text-left"
                      >
                        <FiLogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-200 hover:text-white hover:bg-slate-800/50 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 shadow-md shadow-sky-500/20 transition-all duration-200 hover:scale-[1.02]"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950/95 border-b border-slate-800 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`block px-4 py-2.5 rounded-xl text-base font-medium transition-colors ${
                    isActive
                      ? "text-sky-400 bg-sky-500/10 border border-sky-500/20"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {session?.user ? (
            <div className="pt-3 border-t border-slate-800/80 space-y-2">
              <div className="px-4 py-1 text-xs text-slate-400">
                Logged in as <span className="font-semibold text-slate-200">{session.user.email}</span>
              </div>
              <Link
                href="/my-cars"
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800/50"
              >
                <FiGrid className="w-4 h-4 text-amber-400" />
                My Added Cars
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-base font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 text-left"
              >
                <FiLogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-800/80 flex flex-col gap-2">
              <Link
                href="/login"
                className="w-full py-2.5 text-center rounded-xl text-base font-medium text-slate-200 bg-slate-900 border border-slate-800 hover:bg-slate-800"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="w-full py-2.5 text-center rounded-xl text-base font-medium text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 shadow-md shadow-sky-500/20"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
