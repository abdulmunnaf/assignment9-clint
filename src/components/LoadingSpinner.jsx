"use client";

import React from "react";
import { FiCompass } from "react-icons/fi";

export default function LoadingSpinner({ text = "Loading DriveFleet vehicles..." }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] w-full p-8">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing pulsing ring */}
        <div className="w-16 h-16 rounded-full border-4 border-sky-500/20 border-t-sky-500 animate-spin" />
        {/* Inner reverse spinner */}
        <div className="absolute w-10 h-10 rounded-full border-4 border-indigo-500/20 border-b-indigo-400 animate-spin [animation-direction:reverse]" />
        <FiCompass className="absolute w-5 h-5 text-sky-400 animate-pulse" />
      </div>
      <p className="mt-4 text-sm font-medium text-neutral-400 tracking-wide animate-pulse">
        {text}
      </p>
    </div>
  );
}
