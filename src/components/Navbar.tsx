"use client";

import { useAuth } from "@/context/authContext";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X, LogOut } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const navLinks = [
    { href: "/applications", label: "Postulaciones" },
    { href: "/analytics", label: "Analytics" },
    { href: "/cvs", label: "CVs" },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="bg-blue-50 dark:bg-blue-950/40 border-b border-blue-200 dark:border-blue-800 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/applications" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-500/40">
              <span className="text-white font-bold text-lg">J</span>
            </div>
            <span className="font-bold text-xl text-ink-black-500 dark:text-alabaster-grey-500 hidden sm:inline">
              Joblyst
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isActive(link.href)
                    ? "bg-blue-600 text-white dark:bg-blue-600 dark:text-white font-medium"
                    : "text-slate-700 dark:text-slate-300 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* User Info & Logout */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end text-sm">
              <p className="font-medium text-slate-800 dark:text-slate-200">
                {user?.name || user?.email?.split("@")[0] || "Usuario"}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {user?.email}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="px-2 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors text-sm flex items-center justify-center border-2 border-red-600 cursor-pointer"
              title="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-slate-700 dark:text-slate-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg"
            >
              {isOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex flex-col gap-2 mt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    isActive(link.href)
                      ? "bg-prussian-blue-600 text-alabaster-grey-900 dark:bg-dusk-blue-600 dark:text-alabaster-grey-900 font-medium"
                      : "text-dusk-blue-500 dark:text-dusty-denim-600 hover:bg-alabaster-grey-800 dark:hover:bg-prussian-blue-600"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
