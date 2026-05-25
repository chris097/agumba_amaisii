"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { members, validRegNumbers } from "@/lib/data";
import { Shield, Lock, AlertCircle, X, MapPin, Heart, Users, User, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function MembersDirectoryPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [regNo, setRegNo] = useState("");
  const [regError, setRegError] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedRegNo = sessionStorage.getItem("userRegNo");
      if (savedRegNo && validRegNumbers.includes(savedRegNo.trim())) {
        setIsAuthenticated(true);
      } else {
        setAuthModalOpen(true);
      }
    }
  }, []);

  const handleRegSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = regNo.trim();
    if (validRegNumbers.includes(entered)) {
      setRegError(false);
      setAuthModalOpen(false);
      setIsAuthenticated(true);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("userRegNo", entered);
      }
    } else {
      setRegError(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 relative">
      <AnimatePresence>
        {authModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black-900/80 backdrop-blur-md"
              onClick={() => router.push("/")}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 text-center overflow-hidden z-10"
            >
              <button
                onClick={() => router.push("/")}
                className="absolute top-5 right-5 p-2 text-gray-400 hover:text-black-900 hover:bg-gray-100 rounded-full transition-colors z-20"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute top-0 right-0 w-32 h-32 bg-peach-100 rounded-full blur-3xl opacity-50 -mr-16 -mt-16 pointer-events-none" />

              <div className="relative z-10">
                <div className="mx-auto w-16 h-16 bg-peach-50 text-peach-500 rounded-full flex items-center justify-center mb-6">
                  <Lock className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-black-900 mb-2">Members Only Area</h2>
                <p className="text-peach-600 text-sm font-semibold mb-1 tracking-wide uppercase">Member Directory</p>
                <p className="text-black-100/70 mb-8">
                  Enter your Registration Number to view the Agumba Age Grade member profiles.
                </p>

                <form onSubmit={handleRegSubmit}>
                  <div className="relative">
                    <input
                      type="text"
                      value={regNo}
                      onChange={(e) => { setRegNo(e.target.value); setRegError(false); }}
                      placeholder="e.g. AG-2023-001"
                      className={`w-full px-5 py-4 rounded-xl border text-center font-semibold text-lg outline-none transition-all ${
                        regError
                          ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                          : "border-gray-200 focus:border-peach-500 focus:ring-4 focus:ring-peach-500/10"
                      }`}
                    />
                    {regError && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute -bottom-7 left-0 right-0 mx-auto flex items-center justify-center text-red-500 text-sm font-medium"
                      >
                        <AlertCircle className="w-4 h-4 mr-1 shrink-0" /> Invalid Registration Number
                      </motion.p>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="w-full mt-10 bg-black-900 hover:bg-peach-500 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-peach-500/10 transition-all duration-300 flex items-center justify-center group"
                  >
                    Unlock Directory
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {isAuthenticated && (
        <div className="animate-fade-in">
          <section className="bg-black-900 text-white pt-24 pb-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-peach-500/15 blur-3xl" />
              <div className="absolute bottom-0 -left-20 w-80 h-80 rounded-full bg-peach-700/15 blur-3xl" />
            </div>

            <div className="relative max-w-7xl mx-auto z-10 text-center">
              <div className="flex justify-center mb-8">
                <Link
                  href="/"
                  className="inline-flex items-center text-peach-300 hover:text-peach-100 transition-colors group bg-white/5 px-4 py-2 rounded-full border border-white/10"
                >
                  <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                  Back to Homepage
                </Link>
              </div>
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-peach-300 mb-6">
                <Shield className="w-4 h-4 mr-2" />
                <span className="text-xs font-semibold tracking-wider uppercase">Official Member Directory</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-white">Our Members</h1>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Meet the brothers of the Agumba Age Grade. Unified by purpose, bound by heritage.
              </p>
            </div>
          </section>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {members.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-3xl p-6 border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-peach-50 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  
                  <div className="flex items-start gap-4 mb-6 relative z-10">
                    <div className="w-20 h-20 rounded-2xl bg-gray-100 overflow-hidden border border-gray-200 shrink-0 relative flex items-center justify-center">
                      {member.photo ? (
                        <Image src={member.photo} alt={member.name} fill className="object-cover" />
                      ) : (
                        <User className="w-10 h-10 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-black-900 leading-tight mb-1">{member.name}</h3>
                      <p className="text-xs font-mono text-gray-400 mb-2">{member.regNumber}</p>
                      {member.status === "Married" ? (
                        <span className="inline-flex items-center px-2 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-md border border-green-100">
                          <Heart className="w-3 h-3 mr-1" /> Married
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 bg-gray-50 text-gray-600 text-xs font-semibold rounded-md border border-gray-200">
                          <User className="w-3 h-3 mr-1" /> {member.status || "Single"}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 relative z-10 border-t border-gray-50 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Age</p>
                        <p className="font-medium text-black-900 text-sm">{member.age || "—"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Kindred</p>
                        <p className="font-medium text-black-900 text-sm">{member.kindred || "—"}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" /> Place of Birth
                      </p>
                      <p className="font-medium text-black-900 text-sm">{member.placeOfBirth || "—"}</p>
                    </div>
                    
                    {member.status === "Married" && (
                      <div className="bg-peach-50/50 p-3 rounded-xl border border-peach-100">
                        <div className="mb-2">
                          <p className="text-xs text-peach-600 uppercase tracking-wider mb-0.5 font-semibold">Spouse</p>
                          <p className="font-medium text-black-900 text-sm">{member.spouseName || "—"}</p>
                        </div>
                        {member.kidsCount && member.kidsCount > 0 && (
                          <div className="pt-2 border-t border-peach-200/50">
                            <p className="text-xs text-peach-600 uppercase tracking-wider mb-0.5 font-semibold flex items-center">
                              <Users className="w-3 h-3 mr-1" /> Kids ({member.kidsCount})
                            </p>
                            <p className="font-medium text-black-900 text-sm">Ages: {member.kidsAges || "—"}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
