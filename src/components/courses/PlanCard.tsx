"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, ShieldCheck, Trophy, Zap, Clock } from "lucide-react";

interface ICoursePlan {
  duration: number;
  level: string;
  price: number;
  certificateName: string;
}

interface PlanCardProps {
  plan: ICoursePlan;
  isSelected: boolean;
  onSelect: () => void;
  onEnroll?: () => void;
  isPopular?: boolean;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, isSelected, onSelect, onEnroll, isPopular }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      onClick={onSelect}
      className={`relative cursor-pointer p-6 rounded-3xl border-2 transition-all duration-300 overflow-hidden ${
        isSelected
          ? "border-cyan-500 bg-slate-900 shadow-[0_0_30px_rgba(6,182,212,0.15)]"
          : "border-slate-800 bg-slate-900/50 hover:border-slate-700"
      }`}
    >
      {isPopular && (
        <div className="absolute top-0 right-0 bg-cyan-500 text-slate-900 text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-bl-xl">
          Most Popular
        </div>
      )}

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Clock size={16} className="text-cyan-400" />
          <span className="text-sm font-bold text-cyan-400 uppercase tracking-widest">
            {plan.duration} Month Internship
          </span>
        </div>
        <h3 className="text-2xl font-bold text-white leading-tight mb-1">{plan.level}</h3>
        <p className="text-slate-400 text-sm">{plan.certificateName}</p>
      </div>

      <div className="mb-8">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-black text-white">₹{plan.price}</span>
          <span className="text-slate-500 text-sm">/ total</span>
        </div>
      </div>

      <ul className="space-y-3 mb-8">
        {[
          `${plan.duration * 4} Weeks of Training`,
          "Guided Projects",
          "Certificate of Completion",
          plan.duration >= 2 ? "Intermediate API Security" : null,
          plan.duration >= 3 ? "Advanced Penetration Testing" : null,
        ].filter(Boolean).map((feature, i) => (
          <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-cyan-500/10 flex items-center justify-center">
              <Check size={12} className="text-cyan-400" />
            </div>
            {feature}
          </li>
        ))}
      </ul>

      <button
        onClick={(e) => {
          e.stopPropagation();
          if (onEnroll) onEnroll();
        }}
        className={`w-full py-4 rounded-xl font-bold transition-all ${
          isSelected
            ? "bg-cyan-500 text-slate-900 shadow-[0_0_20px_rgba(6,182,212,0.4)]"
            : "bg-slate-800 text-white hover:bg-slate-700"
        }`}
      >
        {isSelected ? "Enroll Now" : "Choose Plan"}
      </button>

      {isSelected && (
        <motion.div
          layoutId="selection-border"
          className="absolute inset-0 border-2 border-cyan-500 rounded-3xl pointer-events-none"
        />
      )}
    </motion.div>
  );
};

export default PlanCard;
