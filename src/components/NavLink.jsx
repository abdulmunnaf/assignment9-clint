"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NavLink = ({ href, children, className }) => {
  const pathname = usePathname();

  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`${className} ${
        isActive
          ? "bg-white/10 backdrop-blur-lg border border-white/20 rounded-full px-5 py-2"
          : ""
      }`}
    >
      {children}
    </Link>
  );
};

export default NavLink;