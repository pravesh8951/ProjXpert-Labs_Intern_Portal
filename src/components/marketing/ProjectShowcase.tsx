"use client";

import { motion } from "framer-motion";
import { Code, ExternalLink, Bot, ScanLine, FileText, Lock, Activity, Eye, Play } from "lucide-react";
import { useState } from "react";

export default function ProjectShowcase() {
  const [activeTab, setActiveTab] = useState("ai");

  const projects = {
    ai: [
      {
        title: "Intelligent AI Chatbot",
        description: "An NLP-powered conversational agent that keeps context window states, parses sentiment, and provides automated custom answers.",
        tags: ["Python", "NLP", "TensorFlow", "React"],
        graphic: (
          <div className="bg-[#0b0b1a] rounded-lg p-3.5 border border-white/5 font-mono text-[9px] h-28 flex flex-col justify-between">
            <div className="space-y-1.5 overflow-hidden">
              <div className="text-blue-400 font-bold">&gt; user: explain neural nets</div>
              <div className="text-gray-400 bg-white/5 p-1.5 rounded leading-normal">
                Neural networks are computational models inspired by biological brain structures...
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-white/5 pt-2 text-gray-500">
              <span>status: ready</span>
              <span className="text-green-400 animate-pulse">● online</span>
            </div>
          </div>
        )
      },
      {
        title: "Resume Parser & Analyzer",
        description: "Extract skills, experience, and contact metadata from PDF resumes using NER, ranking profiles against job descriptions.",
        tags: ["Spacy", "Scikit-Learn", "Flask", "PDFminer"],
        graphic: (
          <div className="bg-[#0b0b1a] rounded-lg p-4 border border-white/5 h-28 flex items-center justify-between">
            <div className="space-y-1.5">
              <p className="text-[10px] text-gray-300 font-semibold">resume_candidate.pdf</p>
              <p className="text-[8px] text-gray-500">Size: 1.4 MB · NER Analysis</p>
              <div className="flex gap-1">
                <span className="text-[7px] bg-blue-500/20 text-blue-400 px-1 py-0.5 rounded">Python</span>
                <span className="text-[7px] bg-purple-500/20 text-purple-400 px-1 py-0.5 rounded">NLP</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full border-2 border-blue-500 flex items-center justify-center text-[10px] font-bold text-white bg-blue-500/10">
              94%
            </div>
          </div>
        )
      },
      {
        title: "Deep Learning Object Detector",
        description: "Build a custom CNN pipeline in PyTorch to detect and classify multi-class real-time video frames with high frames-per-second rates.",
        tags: ["PyTorch", "CNN", "OpenCV", "YOLOv8"],
        graphic: (
          <div className="bg-[#0b0b1a] rounded-lg p-3 border border-white/5 h-28 flex flex-col justify-between font-mono text-[9px]">
            <div className="relative border border-dashed border-blue-500/30 rounded h-16 flex items-center justify-center bg-blue-500/[0.02] overflow-hidden">
              <ScanLine className="w-4 h-4 text-blue-400 absolute top-2 right-2 animate-pulse" />
              <span className="text-gray-400">frame_input.mp4</span>
              <div className="absolute bottom-1 left-1 bg-blue-500 text-slate-900 text-[6px] font-extrabold px-1 rounded">
                OBJECT_DETECTED: CAR [98%]
              </div>
            </div>
            <div className="text-gray-500 flex justify-between">
              <span>FPS: 45.2</span>
              <span>Model: custom_yolo_v8</span>
            </div>
          </div>
        )
      }
    ],
    cyber: [
      {
        title: "Automated Vuln Scanner",
        description: "Scans active endpoints to map network topography and check for open CVEs, Path Traversal flaws, and configuration mistakes.",
        tags: ["Python", "Socket", "BeautifulSoup", "CVE-API"],
        graphic: (
          <div className="bg-[#0b0b1a] rounded-lg p-3 border border-white/5 h-28 flex flex-col justify-between font-mono text-[8px] leading-normal">
            <div className="space-y-1">
              <p className="text-purple-400 font-bold">$ python scanner.py --target 10.0.0.4</p>
              <p className="text-gray-400">[i] Port 80 Open: Apache/2.4.41</p>
              <p className="text-red-400 font-bold">[!] VULNERABLE: CVE-2021-41773</p>
            </div>
            <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
              <div className="bg-purple-500 w-full h-full animate-pulse" />
            </div>
          </div>
        )
      },
      {
        title: "Robust Secure Auth System",
        description: "A production-grade session manager incorporating JWT, salted password hashing, rate limiting, and cookie validations.",
        tags: ["Node.js", "JWT", "Bcrypt", "Redis", "MFA"],
        graphic: (
          <div className="bg-[#0b0b1a] rounded-lg p-3 border border-white/5 h-28 flex flex-col justify-center space-y-2 select-none">
            <div className="bg-white/5 border border-white/10 rounded px-2.5 py-1 text-[8px] text-gray-500 flex justify-between">
              <span>Email</span>
              <span className="text-gray-300">admin@projxpert.com</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded px-2.5 py-1 text-[8px] text-gray-500 flex justify-between">
              <span>Password</span>
              <span className="text-gray-300">••••••••••••</span>
            </div>
            <button className="w-full py-1.5 bg-purple-600 text-white rounded text-[8px] font-bold">
              Sign In
            </button>
          </div>
        )
      },
      {
        title: "SIEM & Log Aggregator Dashboard",
        description: "Collects system auth event logs, detects brute-force ssh spikes, and builds visual alerts in elasticsearch dashboard widgets.",
        tags: ["ELK Stack", "React", "Python", "Syslog"],
        graphic: (
          <div className="bg-[#0b0b1a] rounded-lg p-3 border border-white/5 h-28 flex flex-col justify-between font-mono text-[8px]">
            <div className="flex justify-between items-center text-gray-500 border-b border-white/5 pb-1">
              <span>Log Analyzer</span>
              <span className="text-red-400 animate-pulse">● 3 Alerts</span>
            </div>
            <div className="flex items-end gap-1.5 h-12 px-1">
              {[30, 45, 25, 90, 40, 20, 15, 80].map((h, i) => (
                <div key={i} className="flex-1 bg-white/5 rounded-t relative overflow-hidden h-full">
                  <div className={`absolute bottom-0 left-0 right-0 ${h > 75 ? "bg-red-500" : "bg-purple-500"}`} style={{ height: `${h}%` }} />
                </div>
              ))}
            </div>
            <p className="text-[7px] text-gray-500">Alert: SSH Brute force threshold exceeded</p>
          </div>
        )
      }
    ]
  };

  return (
    <section id="projects" className="py-28 relative bg-[var(--background)] border-y border-[var(--nav-border)] transition-colors duration-300">
      {/* Background radial gradient */}
      <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-extrabold text-[var(--text-primary)] mb-4 tracking-tight"
          >
            Real Projects You Will <span className="text-gradient">Build</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[var(--text-secondary)] text-md md:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Stop learning theoretical definitions. Start engineering functioning code platforms that companies actually want to hire you for.
          </motion.p>
        </div>

        {/* Tab Controls */}
        <div className="flex justify-center space-x-3 mb-16">
          <button
            onClick={() => setActiveTab("ai")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 border ${
              activeTab === "ai" 
                ? "bg-blue-600/10 border-blue-500 text-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.15)]" 
                : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:border-white/10"
            }`}
          >
            Artificial Intelligence
          </button>
          <button
            onClick={() => setActiveTab("cyber")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 border ${
              activeTab === "cyber" 
                ? "bg-purple-600/10 border-purple-500 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.15)]" 
                : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:border-white/10"
            }`}
          >
            Cybersecurity
          </button>
        </div>

        {/* Projects Grid */}
        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {projects[activeTab as keyof typeof projects].map((project, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Visual Graphics Container */}
                <div className="mb-6 overflow-hidden rounded-xl bg-black/40 border border-white/5">
                  {project.graphic}
                </div>
                
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {project.title}
                </h3>
                
                <p className="text-gray-400 text-xs mb-6 leading-relaxed">
                  {project.description}
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag, i) => (
                    <span key={i} className="text-[10px] font-semibold text-gray-500 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-white/5 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> Project Specs</span>
                  <span className="text-blue-400 font-semibold group-hover:underline flex items-center gap-1">
                    Deploy <Play className="w-3 h-3 fill-current" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
