"use client";

import React from "react";
import Link from "next/link";
import { RiCarLine } from "react-icons/ri";
import { FaXTwitter, FaGithub, FaLinkedinIn, FaInstagram } from "react-icons/fa6";
import { FiPhone, FiMail, FiMapPin, FiClock } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400">
      {/* Top Banner Accent */}
      <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-indigo-500 to-amber-400" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 p-[2px] shadow-lg shadow-sky-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <RiCarLine className="w-5 h-5 text-sky-400" />
                </div>
              </div>
              <span className="text-xl font-extrabold tracking-wider text-slate-100">
                Drive<span className="text-sky-400">Fleet</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              DriveFleet delivers the ultimate car rental experience. From high-performance
              exotics to comfortable family SUVs, rent with confidence backed by full insurance
              and 24/7 concierge assistance.
            </p>
            {/* Social Icons with modern X logo */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X (formerly Twitter)"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 hover:border-sky-500/50 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200"
              >
                <FaXTwitter className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 hover:border-sky-500/50 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200"
              >
                <FaGithub className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 hover:border-sky-500/50 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200"
              >
                <FaLinkedinIn className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 hover:border-sky-500/50 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200"
              >
                <FaInstagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Fleet & Categories */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Explore Fleets
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/cars?type=Luxury"
                  className="hover:text-sky-400 transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  Luxury & Exotics
                </Link>
              </li>
              <li>
                <Link
                  href="/cars?type=Electric"
                  className="hover:text-sky-400 transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  Electric & Hybrids
                </Link>
              </li>
              <li>
                <Link
                  href="/cars?type=SUV"
                  className="hover:text-sky-400 transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  Premium SUVs
                </Link>
              </li>
              <li>
                <Link
                  href="/cars?type=Sedan"
                  className="hover:text-sky-400 transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  Executive Sedans
                </Link>
              </li>
              <li>
                <Link
                  href="/cars?type=Hatchback"
                  className="hover:text-sky-400 transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  Sport Hatchbacks
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Useful Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Useful Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/cars" className="hover:text-sky-400 transition-colors">
                  All Available Vehicles
                </Link>
              </li>
              <li>
                <Link href="/add-car" className="hover:text-sky-400 transition-colors">
                  Host Your Vehicle
                </Link>
              </li>
              <li>
                <Link href="/my-bookings" className="hover:text-sky-400 transition-colors">
                  Trip Management
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-sky-400 transition-colors">
                  Renter Login & Portal
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-sky-400 transition-colors">
                  Create Membership
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact Information */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Contact Information
            </h3>
            <div className="flex items-start gap-3 text-sm">
              <FiMapPin className="w-4 h-4 text-sky-400 shrink-0 mt-1" />
              <span>742 Evergreen Way, Suite 400, Beverly Hills, CA 90210</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <FiPhone className="w-4 h-4 text-sky-400 shrink-0" />
              <a href="tel:+18005553533" className="hover:text-sky-400 transition-colors">
                +1 (800) 555-FLEET (3533)
              </a>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <FiMail className="w-4 h-4 text-sky-400 shrink-0" />
              <a href="mailto:support@drivefleet.com" className="hover:text-sky-400 transition-colors">
                concierge@drivefleet.com
              </a>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <FiClock className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>24/7 Roadside Concierge Service</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-900/90 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} DriveFleet Car Rental Platform. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 transition-colors cursor-pointer">
              Privacy Policy
            </span>
            <span className="hover:text-slate-400 transition-colors cursor-pointer">
              Terms of Service
            </span>
            <span className="hover:text-slate-400 transition-colors cursor-pointer">
              Insurance Protection
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
