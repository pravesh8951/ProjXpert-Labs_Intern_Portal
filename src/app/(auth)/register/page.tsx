"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { User, Mail, Phone, Building, Lock, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send OTP");
      setStep(2);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      router.push("/login?registered=true");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#070714] relative flex items-center justify-center px-4 py-24 overflow-hidden">
      {/* Decorative premium grids & gradients */}
      <div className="absolute inset-0 dot-grid opacity-[0.25] pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_20%,#f8fafc_85%] dark:bg-radial-[circle_at_center,transparent_20%,#070714_85%] pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl">
        {/* Brand mark */}
        <div className="mb-8 text-center flex flex-col items-center">
          <Image src="/logo.png" alt="ProjXpert Labs" width={200} height={40} className="w-auto h-10 mb-6 object-contain" />
          <h2 className="text-3xl font-black text-white tracking-tight">Create your account</h2>
          <p className="text-gray-400 text-sm mt-2">Join ProjXpert Labs and start building</p>
        </div>

        {/* Form Card */}
        <div className="bg-[#0e0e1e]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle top glow */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

          <div className="mb-5">
            <span className="text-xs uppercase tracking-wider text-blue-400 font-bold">Candidate Sign Up</span>
            {error && (
              <div className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                {error}
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.form
                key="step-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSendOTP}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                      type="text" name="name" placeholder="Full Name" required
                      value={formData.name} onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                      type="email" name="email" placeholder="Email Address" required
                      value={formData.email} onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                      type="tel" name="phone" placeholder="Phone Number" required
                      value={formData.phone} onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                      type="text" name="college" placeholder="College Name" required
                      value={formData.college} onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                      type="password" name="password" placeholder="Password" required
                      value={formData.password} onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <div className="relative">
                    <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                      type="password" name="confirmPassword" placeholder="Confirm Password" required
                      value={formData.confirmPassword} onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit" disabled={isLoading}
                  className="w-full py-3.5 px-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-all flex items-center justify-center mt-4 disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-[0_0_20px_rgba(37,99,235,0.3)] group"
                >
                  {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                    <>Get OTP to Verify <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" /></>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="step-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleRegister}
                className="space-y-4"
              >
                <div className="text-center mb-4">
                  <p className="text-gray-400 text-xs">We've sent a 6-digit code to</p>
                  <p className="font-bold text-blue-400 text-sm mt-1">{formData.email}</p>
                </div>

                <input
                  type="text" name="otp" placeholder="Enter 6-digit OTP" maxLength={6} required
                  value={formData.otp} onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-center text-xl tracking-[0.5em] text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono placeholder-gray-600"
                />

                <button
                  type="submit" disabled={isLoading || formData.otp.length !== 6}
                  className="w-full py-3.5 px-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-all flex items-center justify-center mt-4 disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                >
                  {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Verify & Create Account"}
                </button>

                <button
                  type="button" onClick={() => setStep(1)}
                  className="w-full py-2 text-xs text-gray-500 hover:text-gray-300 transition-colors"
                >
                  Back to edit details
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="mt-6 text-center text-xs text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-400 hover:text-blue-300 font-bold hover:underline transition-colors">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
