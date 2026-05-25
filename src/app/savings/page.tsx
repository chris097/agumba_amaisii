"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { activitiesInfo, previousActivitiesInfo, members, validRegNumbers } from "@/lib/data";
import { Shield, Lock, AlertCircle, X, Wallet, TrendingUp, PiggyBank, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const allActivities = { ...activitiesInfo, ...previousActivitiesInfo };

const getNumericAmount = (amountStr?: string) => {
  if (!amountStr) return 0;
  const match = amountStr.match(/₦([\d,]+)/);
  if (match) {
    return parseInt(match[1].replace(/,/g, ''), 10);
  }
  return 0;
};

export default function SavingsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [regNo, setRegNo] = useState("");
  const [regError, setRegError] = useState(false);
  const [totalSavings, setTotalSavings] = useState(0);

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

  useEffect(() => {
    // Organisational Savings strictly comprise: Deductions, Fines, Donations, and Give.
    // Here we compute their mock totals (or real if they exist).
    let total = 0;
    
    // Example breakdown data
    const categories = [
      { id: "donations", title: "Donations (Free Donations)", amount: 50000 },
      { id: "fines", title: "Fines", amount: 15500 },
      { id: "deductions", title: "Deductions", amount: 20000 },
      { id: "give", title: "Give / Special Contributions", amount: 35000 }
    ];
    
    total = categories.reduce((acc, cat) => acc + cat.amount, 0);
    setTotalSavings(total);
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
                <p className="text-peach-600 text-sm font-semibold mb-1 tracking-wide uppercase">Organisational Savings</p>
                <p className="text-black-100/70 mb-8">
                  Enter your Registration Number to view the organisation's financial savings details.
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
                    Unlock Savings Overview
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
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-peach-500/15 blur-3xl" />
              <div className="absolute bottom-0 -left-20 w-80 h-80 rounded-full bg-peach-700/15 blur-3xl" />
            </div>

            <div className="relative max-w-5xl mx-auto z-10 text-center">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-peach-300 mb-6">
                <Shield className="w-4 h-4 mr-2" />
                <span className="text-xs font-semibold tracking-wider uppercase">Official Financial Record</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-white">Organisational Savings</h1>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
                A transparent overview of total contributions collected across all our social and general activities.
              </p>
            </div>
          </section>

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-2 flex items-center">
                  <Wallet className="w-4 h-4 mr-2 text-peach-500" />
                  Total Funds Collected
                </p>
                <h2 className="text-5xl md:text-7xl font-extrabold text-black-900 tracking-tight">
                  <span className="text-peach-500 mr-2">₦</span>
                  {totalSavings.toLocaleString()}
                </h2>
                <p className="text-green-600 font-semibold mt-4 flex items-center bg-green-50 px-3 py-1.5 rounded-full inline-flex text-sm border border-green-100">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Consolidated across 4 categories
                </p>
              </div>
              <div className="w-32 h-32 md:w-48 md:h-48 bg-peach-50 rounded-full flex items-center justify-center border-4 border-peach-100 shrink-0 shadow-inner">
                <PiggyBank className="w-16 h-16 md:w-24 md:h-24 text-peach-500" />
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-md p-8">
              <h3 className="text-2xl font-bold text-black-900 mb-6 border-b border-gray-100 pb-4">Savings Breakdown</h3>
              <div className="space-y-6">
                {[
                  { id: "donations", title: "Donations (Free Donations)", amount: 50000, desc: "Voluntary contributions" },
                  { id: "fines", title: "Fines", amount: 15500, desc: "Disciplinary and lateness fines" },
                  { id: "deductions", title: "Deductions", amount: 20000, desc: "Standard organisational deductions" },
                  { id: "give", title: "Give / Special Contributions", amount: 35000, desc: "Special gifts and give contributions" }
                ].map((cat) => {
                  return (
                    <div key={cat.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group">
                      <div className="flex items-center gap-4 mb-4 sm:mb-0">
                        <div className="w-12 h-12 rounded-xl bg-peach-100 text-peach-600 flex items-center justify-center">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-bold text-black-900">{cat.title}</p>
                          <p className="text-sm text-gray-500">{cat.desc}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-6">
                        <div className="text-right">
                          <p className="font-bold text-xl text-black-900">₦{cat.amount.toLocaleString()}</p>
                          <p className="text-xs text-gray-400">Total collected</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
