"use client";

import { motion } from "framer-motion";
import { Check, Sparkles, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function PricingSection() {
  const plans = [
    {
      name: "1 Month Kickstart",
      price: "999",
      duration: "/ month",
      description: "Perfect for students looking to understand industry workflows.",
      features: [
        "Daily structured learning sprint content",
        "Interactive mini quizzes & code checks",
        "1 Core portfolio-ready project submission",
        "Discord group peer support channel",
        "Verifiable Internship Certificate"
      ],
      popular: false,
      color: "border-white/5 bg-white/[0.02]",
      buttonColor: "bg-white/10 hover:bg-white/20 text-white",
      badgeColor: "text-gray-400"
    },
    {
      name: "2 Months Immersive",
      price: "1799",
      duration: "/ 2 months total",
      description: "Our recommended comprehensive hands-on engineering track.",
      features: [
        "Everything in 1 Month Kickstart plan",
        "Daily Live classes at 8 PM (with archives)",
        "3 Production-grade portfolio projects",
        "Direct 1-on-1 mentor debug support",
        "Professional resume review session",
        "Letter of Recommendation (performance-based)"
      ],
      popular: true,
      color: "border-blue-500/35 bg-blue-500/[0.02]",
      buttonColor: "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20",
      badgeColor: "text-blue-400"
    },
    {
      name: "3 Months Professional",
      price: "2499",
      duration: "/ 3 months total",
      description: "Advanced program with complete career guidance.",
      features: [
        "Everything in 2 Months Immersive plan",
        "5 Advanced portfolio projects",
        "1-on-1 Mock interview sessions",
        "Curated referral partner guidance",
        "Premium Certificate of Mastery",
        "Lifetime learning portal archieve access"
      ],
      popular: false,
      color: "border-purple-500/25 bg-purple-500/[0.01]",
      buttonColor: "bg-white/10 hover:bg-white/20 text-white",
      badgeColor: "text-purple-400"
    }
  ];

  return (
    <section id="pricing" className="py-28 relative overflow-hidden bg-[var(--background)] border-t border-[var(--nav-border)] transition-colors duration-300">
      {/* Background glow shadow */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-extrabold text-[var(--text-primary)] mb-4 tracking-tight"
          >
            Invest In Your <span className="text-gradient">Tech Career</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[var(--text-secondary)] text-md md:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Transparent, developer-friendly pricing plans. No contracts, no hidden charges.
          </motion.p>
        </div>

        {/* Pricing Layout */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-2xl p-8 border backdrop-blur-xl flex flex-col justify-between ${plan.color} ${plan.popular ? 'md:-translate-y-2 border-blue-500/50 shadow-2xl shadow-blue-500/5' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <span className="bg-blue-600 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-lg shadow-blue-500/20">
                    <Sparkles className="w-3.5 h-3.5" />
                    RECOMMENDED PLAN
                  </span>
                </div>
              )}
              
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">{plan.name}</h3>
                  <p className="text-[var(--text-secondary)] text-xs leading-normal h-8">{plan.description}</p>
                </div>
                
                <div className="mb-8 border-b border-white/5 pb-6">
                  <div className="flex items-baseline text-[var(--text-primary)]">
                    <span className="text-2xl font-bold">₹</span>
                    <span className="text-4xl font-black tracking-tight">{plan.price}</span>
                    <span className="text-gray-500 text-xs ml-1.5 font-mono">{plan.duration}</span>
                  </div>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className={`h-4 w-4 shrink-0 mt-0.5 ${plan.popular ? 'text-blue-400' : 'text-gray-400'}`} />
                      <span className="text-gray-300 text-xs leading-normal">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <Link
                href="/register"
                className={`w-full py-3.5 rounded-xl text-center text-xs font-bold transition-all duration-200 border border-white/5 ${plan.buttonColor}`}
              >
                Enroll in Track
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Pricing Help Note */}
        <div className="mt-12 flex items-center justify-center gap-2 text-xs text-gray-500">
          <AlertCircle className="w-4 h-4" />
          <span>Need custom batch sponsorships or team discounts? Reach out to support.</span>
        </div>

      </div>
    </section>
  );
}
