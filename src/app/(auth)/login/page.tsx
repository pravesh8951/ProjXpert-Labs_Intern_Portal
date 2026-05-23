"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Loader2, CheckCircle2, ArrowRight } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
    setError("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      const { testStatus, paymentStatus } = data.user;
      if (paymentStatus === "completed") {
        router.push("/dashboard");
      } else if (testStatus === "passed") {
        router.push("/select-course");
      } else {
        router.push("/test");
      }
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070714] relative flex items-center justify-center px-4 py-24 overflow-hidden">
      {/* Decorative premium grids & gradients */}
      <div className="absolute inset-0 dot-grid opacity-[0.25] pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_20%,#070714_85%] pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg">
        {/* Brand mark */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-black text-white tracking-tight">Welcome back</h2>
          <p className="text-gray-400 text-sm mt-2">Log in to your ProjXpert account</p>
        </div>

        {/* Form Card */}
        <div className="bg-[#0e0e1e]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle top glow */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

          <div className="mb-6">
            <span className="text-xs uppercase tracking-wider text-blue-400 font-bold">Candidate Log In</span>

            {registered && (
              <div className="mt-3 p-3 rounded-lg bg-green-500/10 border border-green-500/30 flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-green-400 font-bold text-xs">Account Created!</h4>
                  <p className="text-green-400/70 text-[10px] mt-0.5">Please log in with your credentials.</p>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                {error}
              </div>
            )}
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-3.5 w-3.5 rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500/50"
                />
                <label htmlFor="rememberMe">Remember me</label>
              </div>
              <Link href="/forgot-password" className="text-blue-400 hover:text-blue-300 hover:underline transition-colors">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-all flex items-center justify-center mt-4 disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-[0_0_20px_rgba(37,99,235,0.3)] group"
            >
              {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                <>Log In <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-500">
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-400 hover:text-blue-300 font-bold hover:underline transition-colors">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex justify-center items-center bg-[var(--background)]">
        <Loader2 className="w-8 h-8 animate-spin text-[#ffc107]" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
