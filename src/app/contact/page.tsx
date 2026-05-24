import { Mail, MapPin, X } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] pt-32 pb-16 relative">
      <Link href="/" className="absolute top-24 right-8 md:right-12 text-gray-400 hover:text-white transition-colors bg-white/5 p-2 rounded-full border border-white/10 hover:bg-white/10">
        <X className="w-6 h-6" />
      </Link>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-white mb-8 text-center">Contact Us</h1>
        <div className="max-w-2xl mx-auto bg-white/5 border border-white/10 p-8 md:p-12 rounded-3xl space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-white">Get in Touch</h2>
            <p className="text-gray-400">Have questions about our internship programs? We're here to help.</p>
          </div>
          
          <div className="space-y-6 max-w-sm mx-auto pt-4">
            <div className="flex items-center gap-6 text-gray-300 bg-black/20 p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
              <div className="p-4 bg-blue-500/10 text-blue-400 rounded-xl">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-white text-sm">Email Support</p>
                <p className="text-sm mt-1">projxpertlabs@gmail.com</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-gray-300 bg-black/20 p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
              <div className="p-4 bg-purple-500/10 text-purple-400 rounded-xl">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-white text-sm">Our Office</p>
                <p className="text-sm mt-1">Maria Plaza, Frazer town</p>
                <p className="text-sm">Bangalore 560005</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
