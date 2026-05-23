"use client";

import { motion } from "framer-motion";
import { Brain, Shield, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function DomainSection() {
  const domains = [
    {
      id: "ai",
      title: "Artificial Intelligence",
      description: "Master Machine Learning, Deep Learning, NLP, and Computer Vision. Build real-world AI applications from scratch and deploy them to the cloud.",
      icon: <Brain className="w-10 h-10 text-blue-400" />,
      technologies: ["Python", "TensorFlow", "PyTorch", "OpenAI API", "HuggingFace"],
      color: "from-blue-500/10 to-transparent",
      borderColor: "border-blue-500/20 group-hover:border-blue-500/50",
      glowColor: "group-hover:shadow-[0_0_30px_rgba(37,99,235,0.15)]",
      badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      bullets: ["Neural Network Architecture", "Natural Language Processing", "LLM Fine-Tuning & Prompt Ops"]
    },
    {
      id: "cyber",
      title: "Cybersecurity",
      description: "Learn Ethical Hacking, Penetration Testing, Web Security, and Cryptography. Protect systems from modern threat vectors using enterprise tools.",
      icon: <Shield className="w-10 h-10 text-purple-400" />,
      technologies: ["Linux", "Burp Suite", "Metasploit", "Wireshark", "Nmap"],
      color: "from-purple-500/10 to-transparent",
      borderColor: "border-purple-500/20 group-hover:border-purple-500/50",
      glowColor: "group-hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]",
      badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      bullets: ["Vulnerability Audits", "Penetration Testing", "Security Operations (SIEM)"]
    },
  ];

  return (
    <section id="programs" className="py-28 relative overflow-hidden bg-[var(--background)] transition-colors duration-300">
      {/* Subtle grid background */}
      <div className="absolute inset-0 dot-grid opacity-[0.15] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 text-xs font-semibold uppercase tracking-wider mb-4"
          >
            <span>INTERNSHIP TRACKS</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-extrabold text-[var(--text-primary)] mb-5 tracking-tight"
          >
            Choose Your <span className="text-gradient">Domain</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[var(--text-secondary)] text-md md:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Specialized curriculum mapped directly to in-demand industry roles. Learn by building, not just watching.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {domains.map((domain, index) => (
            <motion.div
              key={domain.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className={`relative group rounded-2xl p-8 bg-white/[0.02] border ${domain.borderColor} transition-all duration-300 ${domain.glowColor} overflow-hidden`}
            >
              {/* Inner card hover gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${domain.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="mb-6 p-3 bg-white/5 border border-white/10 rounded-xl inline-block group-hover:scale-105 transition-transform duration-300">
                    {domain.icon}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">
                    {domain.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                    {domain.description}
                  </p>

                  {/* Bullet points */}
                  <ul className="space-y-3 mb-8">
                    {domain.bullets.map((bullet, i) => (
                      <li key={i} className="flex items-center text-xs text-gray-300 gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-6">
                  <div className="border-t border-white/5 pt-6">
                    <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3">Core Stack</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {domain.technologies.map((tech) => (
                        <span 
                          key={tech} 
                          className={`px-2.5 py-1 text-xs border rounded-md font-medium tracking-wide ${domain.badgeColor}`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <Link href="/register" className="inline-flex items-center gap-1.5 text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                      Learn More
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
