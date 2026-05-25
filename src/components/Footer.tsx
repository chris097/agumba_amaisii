import Link from "next/link";
import { Shield, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black-900 text-white py-12 border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="inline-flex items-center mb-4">
              <Shield className="w-6 h-6 text-peach-500 mr-2" />
              <span className="text-xl font-bold tracking-tight">Agumba Age Grade</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Official portal for Agumba Age Grade (Amaisii Community) to manage and track social events, levies, and social rights. Unity, Progress, and Brotherhood.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-peach-400 transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/our-heritage" className="text-gray-400 hover:text-peach-400 transition-colors text-sm">
                  Our Heritage
                </Link>
              </li>
              <li>
                <Link href="/savings" className="text-gray-400 hover:text-peach-400 transition-colors text-sm flex items-center">
                  Organisational Savings <span className="ml-2 text-xs bg-peach-500/20 text-peach-300 px-2 py-0.5 rounded-full border border-peach-500/30">Members Only</span>
                </Link>
              </li>
              <li>
                <Link href="/members" className="text-gray-400 hover:text-peach-400 transition-colors text-sm flex items-center">
                  Member Directory <span className="ml-2 text-xs bg-peach-500/20 text-peach-300 px-2 py-0.5 rounded-full border border-peach-500/30">Members Only</span>
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start text-sm text-gray-400">
                <MapPin className="w-4 h-4 text-peach-500 mr-2 mt-0.5 shrink-0" />
                <span>Amaisii Community Center, Abia State, Nigeria</span>
              </li>
              <li className="flex items-center text-sm text-gray-400">
                <Phone className="w-4 h-4 text-peach-500 mr-2 shrink-0" />
                <span>+234 (0) 800 000 0000</span>
              </li>
              <li className="flex items-center text-sm text-gray-400">
                <Mail className="w-4 h-4 text-peach-500 mr-2 shrink-0" />
                <span>info@agumba-amaisii.org</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} Agumba Age Grade, Amaisii. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-xs">Secure Platform Verified</span>
            <Shield className="w-4 h-4 text-gray-600" />
          </div>
        </div>
      </div>
    </footer>
  );
}
