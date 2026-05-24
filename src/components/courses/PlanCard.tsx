"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, Clock } from "lucide-react";

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
      className={`relative cursor-pointer p-8 rounded-2xl border backdrop-blur-xl flex flex-col justify-between transition-all duration-300 overflow-visible ${
        isSelected
          ? "border-blue-500/50 bg-blue-500/[0.02] shadow-2xl shadow-blue-500/5 -translate-y-2"
          : "border-white/5 bg-white/[0.02] hover:border-white/10"
      }`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-0 right-0 flex justify-center">
          <span className="bg-blue-600 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-lg shadow-blue-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            RECOMMENDED PLAN
          </span>
        </div>
      )}

      <div>
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={14} className={isSelected ? "text-blue-400" : "text-gray-400"} />
            <span className={`text-xs font-bold uppercase tracking-widest ${isSelected ? "text-blue-400" : "text-gray-400"}`}>
              {plan.duration} Month Internship
            </span>
          </div>
          <h3 className="text-xl font-bold text-[var(--text-primary)] leading-tight mb-2">{plan.level}</h3>
          <p className="text-[var(--text-secondary)] text-xs h-8">{plan.certificateName}</p>
        </div>

        <div className="mb-8 border-b border-white/5 pb-6">
          <div className="flex items-baseline gap-1 text-[var(--text-primary)]">
            <span className="text-2xl font-bold">₹</span>
            <span className="text-4xl font-black tracking-tight">{plan.price}</span>
            <span className="text-gray-500 text-xs ml-1.5 font-mono">/ total</span>
          </div>
        </div>

        <ul className="space-y-4 mb-8">
          {[
            `${plan.duration * 4} Weeks of Training`,
            "Guided Projects",
            "Certificate of Completion",
            plan.duration >= 2 ? "Intermediate API Security" : null,
            plan.duration >= 3 ? "Advanced Penetration Testing" : null,
          ].filter(Boolean).map((feature, i) => (
            <li key={i} className="flex items-start gap-3">
              <Check className={`h-4 w-4 shrink-0 mt-0.5 ${isSelected ? "text-blue-400" : "text-gray-400"}`} />
              <span className="text-gray-300 text-xs leading-normal">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          if (onEnroll) onEnroll();
        }}
        className={`w-full py-3.5 rounded-xl text-center text-xs font-bold transition-all duration-200 border border-white/5 ${
          isSelected
            ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20"
            : "bg-white/10 hover:bg-white/20 text-white"
        }`}
      >
        {isSelected ? "Enroll Now" : "Choose Plan"}
      </button>

      {isSelected && (
        <motion.div
          layoutId="selection-border"
          className="absolute inset-0 border-2 border-blue-500/50 rounded-2xl pointer-events-none"
        />
      )}
    </motion.div>
  );
};

export default PlanCard;
