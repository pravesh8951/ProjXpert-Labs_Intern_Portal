import { X } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] pt-32 pb-16 relative">
      <Link href="/" className="absolute top-24 right-8 md:right-12 text-gray-400 hover:text-white transition-colors bg-white/5 p-2 rounded-full border border-white/10 hover:bg-white/10">
        <X className="w-6 h-6" />
      </Link>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-white mb-8 text-center">Terms of Service</h1>
        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl space-y-6 text-gray-300 leading-relaxed">
          <p>
            Welcome to ProjXpert Labs. By accessing our platform, internship programs, and services, you agree to comply with the following terms and conditions.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Internship Structure</h2>
          <p>
            The internship provided by ProjXpert Labs is conducted in the form of a structured learning program consisting of:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Daily reading content</li>
            <li>Daily quizzes</li>
            <li>Assignments</li>
            <li>Projects and evaluations</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Student Responsibility</h2>
          <p>
            Students voluntarily join the internship program and are responsible for:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Completing learning modules</li>
            <li>Submitting assignments within deadlines</li>
            <li>Participating in quizzes and evaluations</li>
            <li>Maintaining professional conduct</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Evaluation & Certification</h2>
          <p>
            Based on assignment submissions, quiz performance, attendance, and project evaluations, students may receive:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Internship Completion Certificate</li>
            <li>Evaluation Report</li>
            <li>Letter of Recommendation (based on performance)</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">No Salary or Payment</h2>
          <p>
            ProjXpert Labs does not provide salary, stipend, or payment for internship activities unless explicitly mentioned in a separate written agreement.
          </p>
          <p>
            The internship is intended as an industry-oriented learning opportunity to help students gain practical knowledge, technical exposure, and real-world experience.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Job Opportunities</h2>
          <p>
            Participation in the internship does not guarantee employment. However, students may receive guidance, mentorship, and exposure to industry practices that can help improve career opportunities.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Academic Integrity</h2>
          <p>
            Students are expected to submit original work. Any plagiarism, misconduct, or misuse of the platform may lead to termination of internship access.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Changes to Services</h2>
          <p>
            ProjXpert Labs reserves the right to modify internship content, platform features, schedules, or policies at any time.
          </p>
        </div>
      </div>
    </div>
  );
}
