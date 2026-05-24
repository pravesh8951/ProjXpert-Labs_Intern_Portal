"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Brain, ArrowRight, Code, Terminal, TerminalSquare, AlertTriangle, ShieldCheck, Cpu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  const [textIndex, setTextIndex] = useState(0);
  const texts = ["Real Projects", "Live Mentorship", "AI Internships", "Cybersecurity"];

  // Terminal state simulation
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [activeLab, setActiveLab] = useState<"ai" | "cyber">("cyber");

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % texts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [texts.length]);

  // Terminal output simulation
  useEffect(() => {
    let logs: string[] = [];
    if (activeLab === "cyber") {
      logs = [
        "root@projxpert-lab:~# nmap -sV 192.168.1.1",
        "Starting Nmap 7.92 ( https://nmap.org )",
        "Nmap scan report for local-target (192.168.1.1)",
        "PORT    STATE SERVICE     VERSION",
        "22/tcp  open  ssh         OpenSSH 8.2p1",
        "80/tcp  open  http        Apache httpd 2.4.41",
        "443/tcp open  ssl/http    Apache httpd 2.4.41",
        "|__ vulnerability found: CVE-2021-41773 (Path Traversal)",
        "root@projxpert-lab:~# exploit -t cve-2021-41773",
        "[+] Launching Reverse Shell payload...",
        "[+] Shell connection established from 192.168.1.1",
        "uid=33(www-data) gid=33(www-data) groups=33(www-data)",
        "root@projxpert-lab:~# _"
      ];
    } else {
      logs = [
        ">>> import tensorflow as tf",
        ">>> model = tf.keras.models.Sequential()",
        ">>> model.add(tf.keras.layers.Dense(128, activation='relu'))",
        ">>> model.compile(optimizer='adam', loss='sparse_categorical')",
        ">>> model.fit(x_train, y_train, epochs=5)",
        "Epoch 1/5 - loss: 0.2841 - accuracy: 0.912",
        "Epoch 2/5 - loss: 0.1205 - accuracy: 0.963",
        "Epoch 3/5 - loss: 0.0842 - accuracy: 0.975",
        "Epoch 4/5 - loss: 0.0610 - accuracy: 0.981",
        "Epoch 5/5 - loss: 0.0435 - accuracy: 0.988",
        "[+] Model successfully trained. Saved to model.h5",
        ">>> _"
      ];
    }

    setTerminalLines([]);
    let currentLineIndex = 0;
    const interval = setInterval(() => {
      if (currentLineIndex < logs.length) {
        setTerminalLines((prev) => [...prev, logs[currentLineIndex]]);
        currentLineIndex++;
      } else {
        clearInterval(interval);
      }
    }, 450);

    return () => clearInterval(interval);
  }, [activeLab]);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16 bg-[#070714]">
      {/* Decorative premium grids & gradients */}
      <div className="absolute inset-0 dot-grid opacity-[0.25] pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Radial overlay to blend dot-grid and light blobs */}
      <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_20%,#070714_85%] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Premium Pitch & Call-to-actions */}
          <div className="lg:col-span-7 text-left space-y-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-blue-400 text-xs font-semibold uppercase tracking-wider"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span>Admissions Open for Next Batch</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl sm:text-6xl font-black tracking-tight text-[var(--text-primary)] leading-[1.1]"
            >
              Build Real Projects With
              <span className="block mt-4">
                <Image src="/logo.png" alt="ProjXpert Labs" width={400} height={80} className="w-auto h-12 sm:h-16 object-contain" priority />
              </span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-lg md:text-xl font-medium text-gray-400 flex items-center space-x-2.5"
            >
              <span>Learn through</span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={textIndex}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="text-blue-400 font-extrabold"
                >
                  {texts[textIndex]}
                </motion.span>
              </AnimatePresence>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="max-w-2xl text-[var(--text-secondary)] text-md md:text-lg leading-relaxed font-normal"
            >
              Skip the dry theory. Build market-ready artificial intelligence products and perform real cyber intrusion defense audits inside our interactive cloud sandboxes.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center gap-4 pt-4"
            >
              <Link href="/register" className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-all flex items-center justify-center group shadow-[0_0_25px_rgba(37,99,235,0.45)]">
                Get Started
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#pricing" className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all flex items-center justify-center">
                View Plans
              </a>
            </motion.div>
          </div>

          {/* Right Column: Premium Mock Lab Interface */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative rounded-2xl border border-white/10 bg-[#0e0e1e]/80 backdrop-blur-xl overflow-hidden shadow-2xl z-10"
            >
              {/* Sandbox Window Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#0d0d18] border-b border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex bg-[#16162a] border border-white/5 rounded-lg p-0.5">
                  <button
                    onClick={() => setActiveLab("cyber")}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                      activeLab === "cyber" ? "bg-purple-600/30 text-purple-400 border border-purple-500/20" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <Shield className="w-3 h-3" /> Cyber Lab
                  </button>
                  <button
                    onClick={() => setActiveLab("ai")}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                      activeLab === "ai" ? "bg-blue-600/30 text-blue-400 border border-blue-500/20" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <Brain className="w-3 h-3" /> AI Lab
                  </button>
                </div>
                <span className="text-[10px] text-gray-500 font-mono">sandbox_session_active</span>
              </div>

              {/* Sandbox Terminal Content */}
              <div className="p-6 h-[280px] overflow-y-auto font-mono text-xs space-y-2 select-none scrollbar-thin">
                {terminalLines.map((line, i) => {
                  if (!line) return null;
                  return (
                    <div key={i} className={`leading-relaxed ${
                      line.startsWith("root@") || line.startsWith(">>>") ? "text-gray-300 font-bold" :
                      line.startsWith("[+]") ? "text-green-400 font-semibold" :
                      line.startsWith("|__") ? "text-red-400" : "text-gray-400"
                    }`}>
                      {line}
                    </div>
                  );
                })}
              </div>

              {/* Live Session Telemetry Panel */}
              <div className="grid grid-cols-3 gap-0.5 bg-white/5 border-t border-white/5 text-center font-mono">
                <div className="p-4 bg-[#0d0d1a]">
                  <p className="text-[10px] text-gray-500 uppercase">Connection</p>
                  <p className="text-sm font-bold text-green-400 flex items-center justify-center gap-1 mt-1">
                    <ShieldCheck className="w-4 h-4 text-green-400" /> SECURE
                  </p>
                </div>
                <div className="p-4 bg-[#0d0d1a]">
                  <p className="text-[10px] text-gray-500 uppercase">Lab Latency</p>
                  <p className="text-sm font-bold text-blue-400 mt-1">12 ms</p>
                </div>
                <div className="p-4 bg-[#0d0d1a]">
                  <p className="text-[10px] text-gray-500 uppercase">VM Status</p>
                  <p className="text-sm font-bold text-yellow-500 flex items-center justify-center gap-1 mt-1">
                    <Cpu className="w-4 h-4 text-yellow-500 animate-pulse" /> ACTIVE
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Glowing background shadows for the mock window */}
            <div className={`absolute inset-0 blur-[60px] opacity-35 rounded-full -z-10 transition-colors duration-500 ${
              activeLab === "cyber" ? "bg-purple-600/30" : "bg-blue-600/30"
            }`} />
          </div>

        </div>
      </div>
    </div>
  );
}
