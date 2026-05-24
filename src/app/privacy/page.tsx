import { X } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] pt-32 pb-16 relative">
      <Link href="/" className="absolute top-24 right-8 md:right-12 text-gray-400 hover:text-white transition-colors bg-white/5 p-2 rounded-full border border-white/10 hover:bg-white/10">
        <X className="w-6 h-6" />
      </Link>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-white mb-8 text-center">Privacy Policy</h1>
        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl space-y-6 text-gray-300 leading-relaxed">
          <p>
            At ProjXpert Labs, we value your privacy and are committed to protecting your personal information.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Information We Collect</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Name and contact details</li>
            <li>Email address</li>
            <li>Course and internship information</li>
            <li>Assignment submissions</li>
            <li>Uploaded documents and project files</li>
            <li>Quiz and progress data</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">How We Use Information</h2>
          <p>The collected information is used for:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Managing internship programs</li>
            <li>Providing course access</li>
            <li>Tracking progress and assignments</li>
            <li>Generating evaluation reports</li>
            <li>Issuing certificates and recommendation letters</li>
            <li>Improving platform services</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">File Uploads</h2>
          <p>
            Assignment documents uploaded by students may be securely stored in authorized cloud storage systems such as Google Drive for evaluation and management purposes.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Data Security</h2>
          <p>
            We implement reasonable security measures to protect user information from unauthorized access, disclosure, or misuse.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Third-Party Services</h2>
          <p>
            We may use trusted third-party services for authentication, cloud storage, analytics, and communication purposes.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">User Consent</h2>
          <p>
            By using our platform and services, users consent to the collection and use of information as described in this Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
