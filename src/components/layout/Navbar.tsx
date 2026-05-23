"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, Shield, Brain, ChevronDown, LogOut, User,
  LayoutDashboard, FlaskConical, ArrowRight
} from "lucide-react";

interface AuthUser {
  name: string;
  email: string;
  role: string;
  testStatus: string;
  paymentStatus: string;
}

export default function Navbar() {
  return (
    <Suspense fallback={<div className="h-16 bg-white border-b border-gray-200" />}>
      <NavbarContent />
    </Suspense>
  );
}

function NavbarContent() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "home";

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const fetchUser = async () => {
      if (!user) setLoading(true);
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store", signal: controller.signal });
        const data = await res.json();
        if (isMounted) setUser(data.user);
      } catch {
        if (isMounted) setUser(null);
      } finally {
        clearTimeout(timeoutId);
        if (isMounted) setLoading(false);
      }
    };

    fetchUser();
    return () => { isMounted = false; controller.abort(); clearTimeout(timeoutId); };
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setDropdownOpen(false);
    router.push("/");
    router.refresh();
  };

  const isEnrolled = user?.paymentStatus === "completed";

  const marketingLinks = [
    { label: "Home", href: "/" },
    { label: "Programs", href: "/#programs" },
    { label: "Pricing", href: "/#pricing" },
    { label: "About", href: "/#about" },
  ];

  const dashboardLinks = [
    { label: "Home", href: "/dashboard?tab=home" },
    { label: "Learning", href: "/dashboard?tab=learn" },
    { label: "Progress", href: "/dashboard?tab=progress" },
    { label: "Assignments", href: "/dashboard?tab=assignments" },
  ];

  const currentLinks = (pathname.startsWith("/dashboard") || isEnrolled) ? dashboardLinks : marketingLinks;
  const initial = user?.name?.charAt(0).toUpperCase() || "?";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--nav-bg)] border-b border-[var(--nav-border)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-[var(--text-primary)] tracking-tight">
              Proj<span className="text-blue-600">X</span>pert
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {currentLinks.map((link) => {
              const isDashboard = pathname === "/dashboard";
              const linkTab = link.href.split("tab=")[1];
              const isActive = isDashboard ? linkTab === currentTab : pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium px-4 py-2 rounded-md transition-all duration-150 ${
                    isActive
                      ? "bg-blue-500/20 text-blue-600 dark:text-blue-400 font-semibold"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-2">


            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-[0_0_10px_rgba(37,99,235,0.5)]">
                    {initial}
                  </div>
                  <span className="text-sm text-white font-medium max-w-[100px] truncate">
                    {user.name.split(" ")[0]}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.97 }}
                      transition={{ duration: 0.12 }}
                      className="absolute right-0 mt-2 w-60 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            {initial}
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-gray-900 font-semibold text-sm truncate">{user.name}</p>
                            <p className="text-gray-500 text-xs truncate">{user.email}</p>
                          </div>
                        </div>
                        <div className="mt-2.5 flex gap-1.5">
                          <span className={`badge ${user.testStatus === "passed" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                            {user.testStatus === "passed" ? "✓ Passed" : "Test pending"}
                          </span>
                          <span className={`badge ${user.paymentStatus === "completed" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>
                            {user.paymentStatus === "completed" ? "Enrolled" : "Not enrolled"}
                          </span>
                        </div>
                      </div>
                      <div className="p-1.5">
                        {user.paymentStatus === "completed" && (
                          <Link href="/dashboard" onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-all text-sm">
                            <LayoutDashboard className="w-4 h-4 text-blue-600" /> My Dashboard
                          </Link>
                        )}
                        {user.testStatus !== "passed" && (
                          <Link href="/test" onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-all text-sm">
                            <FlaskConical className="w-4 h-4 text-violet-600" /> Take Eligibility Test
                          </Link>
                        )}
                        <Link href="/plans" onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-all text-sm">
                          <User className="w-4 h-4 text-gray-400" /> View Plans
                        </Link>
                        <hr className="border-gray-100 my-1" />
                        <button onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all text-sm">
                          <LogOut className="w-4 h-4" /> Log Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : loading ? (
              <div className="w-28 h-9 rounded-lg bg-black/5 dark:bg-gray-100 animate-pulse" />
            ) : (
              <>
                <Link href="/login" className="text-sm font-semibold px-4 py-2 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-[var(--text-primary)] rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-all">
                  Log in
                </Link>
                <Link href="/register"
                  className="text-sm font-semibold px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all shadow-[0_0_15px_rgba(37,99,235,0.45)] flex items-center gap-1 group">
                  Get Started
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile buttons */}
          <div className="flex md:hidden items-center gap-2">
            <button onClick={() => setMenuOpen((prev) => !prev)}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-2 rounded-md hover:bg-[var(--surface)] transition-all">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="md:hidden bg-[var(--nav-bg)] border-b border-[var(--nav-border)] shadow-md transition-colors duration-300"
          >
            <div className="px-4 py-4 space-y-1">
              {currentLinks.map((link) => {
                const isDashboard = pathname === "/dashboard";
                const linkTab = link.href.split("tab=")[1];
                const isActive = isDashboard ? linkTab === currentTab : pathname === link.href;
                return (
                  <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
                    className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive ? "bg-blue-500/15 text-blue-600 dark:text-blue-400" : "text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)]"
                    }`}>
                    {link.label}
                  </Link>
                );
              })}
            </div>
            <div className="px-4 py-4 border-t border-[var(--nav-border)]">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--surface)] border border-[var(--card-border)]">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold">
                      {initial}
                    </div>
                    <div>
                      <p className="text-[var(--text-primary)] font-semibold text-sm">{user.name}</p>
                      <p className="text-[var(--text-muted)] text-xs">{user.email}</p>
                    </div>
                  </div>
                  <button onClick={handleLogout}
                    className="w-full py-2.5 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all">
                    <LogOut className="w-4 h-4" /> Log Out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/login" onClick={() => setMenuOpen(false)}
                    className="py-2.5 text-center bg-[var(--surface)] text-[var(--text-primary)] rounded-lg text-sm font-semibold hover:bg-[var(--surface-hover)] transition-all">
                    Log in
                  </Link>
                  <Link href="/register" onClick={() => setMenuOpen(false)}
                    className="py-2.5 text-center bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-500 transition-all">
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
