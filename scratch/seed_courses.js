import mongoose from "mongoose";
import Course from "./src/models/Course.js"; // Note: might need to adjust extension or use a ts-node setup
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env.local") });

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected.");

    const cyberRoadmap = {
      title: "Cybersecurity Internship",
      domain: "cybersecurity",
      plans: [
        {
          duration: 1,
          level: "Beginner Foundation",
          price: 999,
          certificateName: "Cybersecurity Foundations Internship Certificate",
        },
        {
          duration: 2,
          level: "Intermediate + Practical",
          price: 1799,
          certificateName: "Cybersecurity Analyst Internship Certificate",
        },
        {
          duration: 3,
          level: "Advanced + Real Projects",
          price: 2499,
          certificateName: "Advanced Cybersecurity Internship Certificate",
        },
      ],
      roadmap: [
        {
          week: 1,
          title: "Cybersecurity Foundations",
          topics: ["Introduction to Cybersecurity", "Types of Hackers", "CIA Triad", "Networking Basics", "IP Addressing", "DNS", "HTTP vs HTTPS", "Ports & Protocols", "Linux Basics", "Virtual Machines"],
          tools: ["Kali Linux", "VirtualBox", "Terminal Basics"],
          assignment: "Install Kali Linux & Configure VM",
          miniProject: "Build personal cybersecurity lab",
        },
        {
          week: 2,
          title: "Web Security Basics",
          topics: ["Web Application Basics", "Client vs Server", "Cookies & Sessions", "Authentication Basics", "OWASP Top 10 Overview", "Burp Suite Introduction", "SQL Injection Intro", "XSS Intro", "CSRF Intro"],
          tools: ["Burp Suite Community", "DVWA", "PortSwigger Labs"],
          assignment: "Solve beginner PortSwigger labs",
          miniProject: "Basic vulnerability testing report",
        },
        {
          week: 3,
          title: "Vulnerability Testing",
          topics: ["Reconnaissance", "Information Gathering", "Subdomain Enumeration", "Directory Bruteforce", "Parameter Discovery"],
          tools: ["Nmap", "Gobuster", "Whois", "Nslookup"],
          assignment: "Scan local test environment",
          miniProject: "Recon report generation",
        },
        {
          week: 4,
          title: "Final Practical + Assessment",
          topics: ["Secure Coding Basics", "Password Security", "MFA", "Intro to API Security", "Career Guidance"],
          tools: ["Password Strength Checkers", "MFA Tools"],
          assignment: "MCQ Test + Practical Lab",
          miniProject: "Secure Login Page or Vulnerability Scanner",
        },
        {
          week: 5,
          title: "Advanced Web Vulnerabilities",
          topics: ["Advanced SQL Injection", "Authentication Vulnerabilities", "JWT Attacks", "File Upload Vulnerabilities", "IDOR"],
          tools: ["Burp Suite Professional (Trial)", "Custom Scripts"],
          assignment: "Exploit vulnerable app safely",
          miniProject: "Advanced Exploitation Report",
        },
        {
          week: 6,
          title: "API Security",
          topics: ["REST APIs", "API Authentication", "Broken Access Control", "API Rate Limiting", "Token Security"],
          tools: ["Postman", "Burp Repeater"],
          assignment: "Secure API Testing Assignment",
          miniProject: "API Vulnerability Scanner",
        },
        {
          week: 7,
          title: "Automation & Security Tools",
          topics: ["SQLMap", "Nikto", "FFUF", "XSStrike", "Automated Recon"],
          tools: ["SQLMap", "Nikto", "FFUF"],
          assignment: "Automated vulnerability scanning task",
          miniProject: "Recon Automation Script",
        },
        {
          week: 8,
          title: "Real-World Assessment",
          topics: ["Report Writing", "Vulnerability Severity", "CVSS Basics", "Responsible Disclosure"],
          tools: ["CVSS Calculator", "Reporting Templates"],
          assignment: "Practical testing lab",
          miniProject: "Web Security Testing Toolkit",
        },
        {
          week: 9,
          title: "Advanced Attacks",
          topics: ["SSRF", "XXE", "Deserialization", "Prototype Pollution", "Web Cache Poisoning", "Race Conditions"],
          tools: ["Advanced PortSwigger Labs"],
          assignment: "Advanced Labs Completion",
          miniProject: "Complex Attack Simulation",
        },
        {
          week: 10,
          title: "Authentication & Access Control",
          topics: ["OAuth Security", "Session Management", "MFA Bypass", "Privilege Escalation", "CORS Misconfigurations"],
          tools: ["OAuth Debuggers", "Session Managers"],
          assignment: "Authentication testing scenarios",
          miniProject: "Auth Security Analyzer",
        },
        {
          week: 11,
          title: "Real-World Pentesting Workflow",
          topics: ["Methodology", "Recon Workflow", "Exploitation Chain", "Reporting", "Scope Handling"],
          tools: ["Pentesting Frameworks"],
          assignment: "Internal pentest simulation",
          miniProject: "Full Web App Audit",
        },
        {
          week: 12,
          title: "Capstone Project",
          topics: ["AI-Powered Vulnerability Scanner", "Secure Internship Portal", "Bug Bounty Automation Toolkit"],
          tools: ["All previous tools", "AI APIs"],
          assignment: "Documentation & Demo Video",
          miniProject: "Final Capstone Presentation",
        },
      ],
    };

    await Course.findOneAndUpdate(
      { domain: "cybersecurity" },
      cyberRoadmap,
      { upsert: true, new: true }
    );

    console.log("Cybersecurity Roadmap seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();
