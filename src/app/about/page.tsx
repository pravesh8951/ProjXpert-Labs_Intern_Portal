import { X } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] pt-32 pb-16 relative">
      <Link href="/" className="absolute top-24 right-8 md:right-12 text-gray-400 hover:text-white transition-colors bg-white/5 p-2 rounded-full border border-white/10 hover:bg-white/10">
        <X className="w-6 h-6" />
      </Link>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-white mb-8 text-center">About ProjXpert Labs</h1>
        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl space-y-6 text-gray-300 leading-relaxed">
          <p>
            ProjXpert Labs is an innovative startup company established on <strong className="text-white">01/11/2025</strong> with a mission to bridge the gap between industry and students by providing practical technology solutions, real-world project experience, internships, and digital transformation services.
          </p>
          <p>
            We are officially registered under the Government of India MSME Udyam Portal.
          </p>
          <p>
            <strong className="text-white">MSME Udyam Registration ID:</strong> UDYAM-KR-03-0685882
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Our Expertise</h2>
          <p>
            At ProjXpert Labs, we work on both software and hardware-based solutions across multiple domains including:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Artificial Intelligence & Machine Learning</li>
            <li>Cybersecurity Solutions</li>
            <li>Full Stack Web Development</li>
            <li>IoT & Embedded Systems</li>
            <li>Cloud & API Integration</li>
            <li>Automation Systems</li>
            <li>Digital Transformation Services</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Hardware Technologies</h2>
          <p>
            We have successfully developed projects involving hardware platforms such as:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Arduino</li>
            <li>Raspberry Pi</li>
            <li>IoT Sensors & Modules</li>
            <li>Automation Systems</li>
            <li>AI-based Embedded Applications</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Projects & Services</h2>
          <p>
            ProjXpert Labs has worked on multiple real-world industry projects and services including:
          </p>
          <ul className="list-disc pl-6 space-y-4">
            <li>Data Management Services for Mirasham, a small-scale eCommerce application.</li>
            <li>Complete Full Stack Application Development for a Turkish sweets business “Baklava”, including cybersecurity and digital management services.</li>
            <li>Mess Management System development and technical services for Coimbatore Marine College.</li>
            <li>
              AI-based healthcare solutions including:
              <ul className="list-circle pl-6 mt-2 space-y-1 text-gray-400">
                <li>Lung Disease Management System</li>
                <li>MedChatBot</li>
                <li>Digitalized Hospital Management System</li>
              </ul>
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Our Vision</h2>
          <p>
            Our vision is to empower students, startups, and businesses with practical, scalable, and industry-oriented technology solutions while creating opportunities for learning, innovation, and growth.
          </p>
        </div>
      </div>
    </div>
  );
}
