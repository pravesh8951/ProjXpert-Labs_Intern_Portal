"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Brain, BookOpen, Layers, Terminal, Trophy } from "lucide-react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import RoadmapViewer from "@/components/courses/RoadmapViewer";
import PlanCard from "@/components/courses/PlanCard";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface ICoursePlan {
  duration: number;
  level: string;
  price: number;
  certificateName: string;
}

interface IRoadmapModule {
  week: number;
  title: string;
  topics: string[];
  tools: string[];
  assignment: string;
  miniProject: string;
}

interface ICourse {
  title: string;
  domain: string;
  plans: ICoursePlan[];
  roadmap: IRoadmapModule[];
}

export default function PlansPage() {
  const router = useRouter();
  const [course, setCourse] = useState<ICourse | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<number>(2); // Default to 2 months
  const [loading, setLoading] = useState(true);
  const [domain, setDomain] = useState<string>("cybersecurity");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        // First get user's domain
        const authRes = await fetch("/api/auth/me", { cache: "no-store" });
        let userDomain = "cybersecurity";
        if (authRes.ok) {
          const authData = await authRes.json();
          if (authData.user?.domain) {
            userDomain = authData.user.domain;
          }
        }
        setDomain(userDomain);

        // Then fetch course for that domain
        const res = await fetch(`/api/courses?domain=${userDomain}`);
        const data = await res.json();
        if (data && data.length > 0) {
          setCourse(data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch course:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, []);

  const handlePayment = async (plan: ICoursePlan) => {
    try {
      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          plan: `${plan.duration}m`, 
          amount: plan.price   // actual plan price in ₹
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create order");
      }

      const { orderId, amount } = await res.json();

      if (!orderId || !amount) {
        throw new Error("Invalid order response from server");
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount,        // amount is already in paise from the server
        currency: "INR",
        name: "ProjXpert Labs",
        description: `${plan.level} – ${plan.duration} Month Internship`,
        order_id: orderId,
        handler: async function (response: any) {
          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          const result = await verifyRes.json();
          if (result.success) {
            router.push("/dashboard");
          } else {
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {},
        theme: { color: "#06b6d4" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error: any) {
      console.error("Payment error:", error);
      alert(error?.message || "Something went wrong. Please try again.");
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Fallback plans if DB seeding hasn't finished
  const fallbackPlans = domain === "ai" ? [
    { duration: 1, level: "Beginner Foundation", price: 999, certificateName: "AI Foundations Certificate" },
    { duration: 2, level: "Intermediate + Practical", price: 1799, certificateName: "AI Developer Certificate" },
    { duration: 3, level: "Advanced + Real Projects", price: 2499, certificateName: "Advanced AI Engineer Certificate" },
  ] : [
    { duration: 1, level: "Beginner Foundation", price: 999, certificateName: "Cybersecurity Foundations Certificate" },
    { duration: 2, level: "Intermediate + Practical", price: 1799, certificateName: "Cybersecurity Analyst Certificate" },
    { duration: 3, level: "Advanced + Real Projects", price: 2499, certificateName: "Advanced Cybersecurity Certificate" },
  ];
  const plans = course?.plans || fallbackPlans;

  const currentPlan = plans.find(p => p.duration === selectedPlan) || plans[1];

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)]">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1),transparent_70%)] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-6 ${
              domain === "ai"
                ? "bg-blue-500/10 border border-blue-500/20 text-blue-400"
                : "bg-cyan-500/10 border border-cyan-500/20 text-cyan-400"
            }`}
          >
            {domain === "ai" ? <Brain size={16} /> : <ShieldCheck size={16} />}
            {domain === "ai" ? "Next-Gen AI Training" : "Next-Gen Cybersecurity Training"}
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight"
          >
            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Expertise Level</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto mb-16"
          >
            {domain === "ai"
              ? "From zero to AI engineer. Select a duration that fits your career goals and unlock the full potential of ProjXpert Labs."
              : "From zero to penetration tester. Select a duration that fits your career goals and unlock the full potential of ProjXpert Labs."}
          </motion.p>

          <div className="grid md:grid-cols-3 gap-8 mb-24">
            {plans.map((plan, i) => (
              <PlanCard
                key={plan.duration}
                plan={plan}
                isSelected={selectedPlan === plan.duration}
                onSelect={() => setSelectedPlan(plan.duration)}
                onEnroll={() => handlePayment(plan)}
                isPopular={plan.duration === 2}
              />
            ))}
          </div>


        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-20 border-t border-[var(--nav-border)] bg-[var(--background)]">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: BookOpen, label: "Structured Learning" },
            { icon: Terminal, label: "Hands-on Labs" },
            { icon: Layers, label: "Real Projects" },
            { icon: Trophy, label: "Global Certificates" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-3 text-center">
              <div className="w-12 h-12 rounded-2xl bg-[var(--nav-border)] flex items-center justify-center text-primary border border-white/5">
                <item.icon size={24} />
              </div>
              <span className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-widest">{item.label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
