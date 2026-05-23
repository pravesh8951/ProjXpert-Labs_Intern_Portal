"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Brain, Shield, ArrowRight, Check, Loader2 } from "lucide-react";

const domains = [
  {
    id: "ai",
    label: "Artificial Intelligence",
    subtitle: "Machine Learning & AI Systems",
    icon: Brain,
    color: "from-[#00d4ff] to-[#0077ff]",
    border: "border-[#00d4ff]",
    glow: "shadow-[0_0_40px_rgba(0,212,255,0.25)]",
    tags: ["Python & ML", "Deep Learning", "NLP", "Generative AI", "AI Deployment"],
    description:
      "Build real AI models, train neural networks, and deploy intelligent systems. Go from Python basics to production-grade AI applications.",
  },
  {
    id: "cybersecurity",
    label: "Cybersecurity",
    subtitle: "Ethical Hacking & Defense",
    icon: Shield,
    color: "from-[#7c3aed] to-[#a855f7]",
    border: "border-[#7c3aed]",
    glow: "shadow-[0_0_40px_rgba(124,58,237,0.25)]",
    tags: ["Network Security", "Ethical Hacking", "CTF Challenges", "Malware Analysis", "Penetration Testing"],
    description:
      "Master offensive and defensive security techniques. Learn real-world hacking, vulnerability analysis, and how to protect systems.",
  },
];

export default function SelectCoursePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleContinue = async () => {
    if (!selected) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/user/select-domain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: selected }),
      });
      if (!res.ok) throw new Error("Failed to save selection");
      router.push("/plans");
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a] pt-28 pb-16 px-4 relative overflow-hidden">
      {/* BG glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#7c3aed]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-gray-400 mb-6">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Step 2 of 3 — Choose Your Domain
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4">
            What do you want to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] to-[#7c3aed]">
              master?
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Choose your internship domain. Your daily learning, projects, and mentorship will be
            customized entirely around your choice.
          </p>
        </motion.div>

        {/* Domain Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {domains.map((domain, i) => {
            const Icon = domain.icon;
            const isSelected = selected === domain.id;
            return (
              <motion.button
                key={domain.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelected(domain.id)}
                className={`relative text-left p-8 rounded-3xl border-2 transition-all duration-300 bg-white/5 backdrop-blur-xl ${
                  isSelected
                    ? `${domain.border} ${domain.glow} bg-white/8`
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                {/* Selected checkmark */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-5 right-5 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center"
                  >
                    <Check className="w-4 h-4 text-white" />
                  </motion.div>
                )}

                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${domain.color} flex items-center justify-center mb-6`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>

                <h2 className="text-2xl font-extrabold text-white mb-1">{domain.label}</h2>
                <p className="text-sm text-gray-400 mb-4">{domain.subtitle}</p>
                <p className="text-gray-300 text-sm leading-relaxed mb-6">{domain.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {domain.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1 rounded-full bg-white/10 border border-white/10 text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.button>
            );
          })}
        </div>

        {error && (
          <p className="text-center text-red-400 text-sm mb-4">{error}</p>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center"
        >
          <button
            onClick={handleContinue}
            disabled={!selected || loading}
            className="px-12 py-4 bg-gradient-to-r from-[#7c3aed] to-[#00d4ff] text-white font-bold text-lg rounded-2xl hover:shadow-[0_0_30px_rgba(124,58,237,0.4)] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-3"
          >
            {loading ? (
              <><Loader2 className="animate-spin w-5 h-5" /> Saving...</>
            ) : (
              <>Continue to Plans <ArrowRight className="w-5 h-5" /></>
            )}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
