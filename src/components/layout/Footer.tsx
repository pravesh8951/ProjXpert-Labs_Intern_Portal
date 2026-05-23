import Link from "next/link";
import { Shield, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[var(--background)] border-t border-[var(--nav-border)] pt-16 pb-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-secondary">
                <Shield className="h-4 w-4 text-white absolute" />
              </div>
              <span className="self-center text-xl font-bold whitespace-nowrap text-[var(--text-primary)]">
                ProjXpert <span className="text-primary">Labs</span>
              </span>
            </Link>
            <p className="text-[var(--text-secondary)] text-sm mb-6">
              Empowering the next generation of AI and Cybersecurity experts with real-world projects and industry mentorship.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-[var(--text-secondary)] hover:text-primary transition-colors">
                <span className="text-sm font-semibold">TW</span>
              </a>
              <a href="#" className="text-[var(--text-secondary)] hover:text-primary transition-colors">
                <span className="text-sm font-semibold">IN</span>
              </a>
              <a href="#" className="text-[var(--text-secondary)] hover:text-primary transition-colors">
                <span className="text-sm font-semibold">GH</span>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-[var(--text-primary)] font-semibold mb-4">Internships</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-[var(--text-secondary)] hover:text-primary text-sm transition-colors">AI & Machine Learning</Link>
              </li>
              <li>
                <Link href="#" className="text-[var(--text-secondary)] hover:text-primary text-sm transition-colors">Cybersecurity & Ethical Hacking</Link>
              </li>
              <li>
                <Link href="#" className="text-[var(--text-secondary)] hover:text-primary text-sm transition-colors">Data Science</Link>
              </li>
              <li>
                <Link href="#" className="text-[var(--text-secondary)] hover:text-primary text-sm transition-colors">Cloud Security</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[var(--text-primary)] font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-[var(--text-secondary)] hover:text-primary text-sm transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="#" className="text-[var(--text-secondary)] hover:text-primary text-sm transition-colors">Contact</Link>
              </li>
              <li>
                <Link href="#" className="text-[var(--text-secondary)] hover:text-primary text-sm transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="#" className="text-[var(--text-secondary)] hover:text-primary text-sm transition-colors">Terms of Service</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[var(--text-primary)] font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-[var(--text-secondary)] text-sm">
                <Mail className="h-4 w-4 mr-2 text-primary" />
                support@projxpertlabs.com
              </li>
              <li className="text-[var(--text-secondary)] text-sm">
                123 Innovation Drive, Tech Park<br />
                Bangalore, Karnataka 560001
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-[var(--nav-border)] text-center text-sm text-[var(--text-muted)]">
          <p>&copy; {new Date().getFullYear()} ProjXpert Labs. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
