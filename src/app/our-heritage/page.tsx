"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { previousActivitiesInfo, validRegNumbers } from "@/lib/data";
import { Shield, ArrowLeft, ArrowRight, Lock, AlertCircle, X, Coins, Users, Heart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const getIcon = (slug: string) => {
  if (slug.includes("meeting")) return <Coins className="w-8 h-8 text-peach-500" />;
  if (slug.includes("burial")) return <Users className="w-8 h-8 text-peach-500" />;
  if (slug.includes("marriage")) return <Heart className="w-8 h-8 text-peach-500" />;
  return <Users className="w-8 h-8 text-peach-500" />;
};

export default function PreviousActivities() {
  const router = useRouter();
  const [regModalOpen, setRegModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<{ slug: string; title: string } | null>(null);
  const [regNo, setRegNo] = useState("");
  const [regError, setRegError] = useState(false);

  const activitiesList = Object.entries(previousActivitiesInfo).map(([slug, info]) => ({
    slug,
    ...info
  }));

  const handleViewDetails = (activity: typeof activitiesList[0]) => {
    if (typeof window !== "undefined") {
      const savedRegNo = sessionStorage.getItem("userRegNo");
      if (savedRegNo && validRegNumbers.includes(savedRegNo.trim())) {
        router.push(`/activities/${activity.slug}`);
        return;
      }
    }
    setSelectedActivity(activity);
    setRegNo("");
    setRegError(false);
    setRegModalOpen(true);
  };

  const handleRegSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = regNo.trim();
    if (validRegNumbers.includes(entered)) {
      setRegError(false);
      setRegModalOpen(false);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("userRegNo", entered);
      }
      if (selectedActivity) {
        router.push(`/activities/${selectedActivity.slug}`);
      }
    } else {
      setRegError(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 animate-fade-in">
      {/* Header */}
      <section className="relative pt-32 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden bg-black-900 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-peach-500/20 blur-3xl" />
          <div className="absolute bottom-0 -left-20 w-80 h-80 rounded-full bg-peach-700/20 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto z-10">
          <Link
            href="/"
            className="inline-flex items-center text-peach-300 hover:text-peach-100 transition-colors mb-8 group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Homepage
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-peach-300">
              <Shield className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium tracking-wide">Heritage Archive</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6"
          >
            Our Heritage
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl text-xl text-gray-300 leading-relaxed"
          >
            Browse the archives of past activities, historical levies, and social rights from previous years.
          </motion.p>
        </div>
      </section>

      {/* Activities Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto -mt-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activitiesList.map((activity, index) => (
            <motion.div
              key={activity.slug}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="relative overflow-hidden rounded-3xl bg-white p-8 border border-gray-100 shadow-md hover:shadow-2xl hover:border-peach-300 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group min-h-[340px]"
            >
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-peach-50 opacity-40 blur-3xl group-hover:bg-peach-200 transition-colors duration-500" />
              <div className="relative z-10">
                <div className="mb-6 inline-flex items-center justify-center p-4 rounded-2xl bg-peach-100/50 group-hover:scale-110 transition-transform duration-300">
                  {getIcon(activity.slug)}
                </div>
                <h3 className="text-2xl font-bold text-black-900 mb-3 tracking-tight">{activity.title}</h3>
                <p className="text-black-100/70 leading-relaxed mb-8">{activity.description}</p>
              </div>
              <div className="relative z-10 mt-auto">
                <button
                  onClick={() => handleViewDetails(activity)}
                  className="w-full flex items-center justify-center px-6 py-4 rounded-2xl bg-black-900 text-white font-bold tracking-wide hover:bg-peach-500 hover:shadow-lg hover:shadow-peach-500/20 transition-all duration-300 group/btn"
                >
                  View Details
                  <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-2 transition-transform duration-300" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Registration Number Modal */}
      <AnimatePresence>
        {regModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black-900/70 backdrop-blur-md"
              onClick={() => setRegModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 text-center overflow-hidden z-10"
            >
              <button
                onClick={() => setRegModalOpen(false)}
                className="absolute top-5 right-5 p-2 text-gray-400 hover:text-black-900 hover:bg-gray-100 rounded-full transition-colors z-20"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute top-0 right-0 w-32 h-32 bg-peach-100 rounded-full blur-3xl opacity-50 -mr-16 -mt-16 pointer-events-none" />
              <div className="relative z-10">
                <div className="mx-auto w-16 h-16 bg-peach-50 text-peach-500 rounded-full flex items-center justify-center mb-6">
                  <Lock className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-black-900 mb-2">Verification Required</h2>
                <p className="text-peach-600 text-sm font-semibold mb-1 tracking-wide uppercase">{selectedActivity?.title}</p>
                <p className="text-black-100/70 mb-8">Enter your Registration Number to securely access this activity details page.</p>
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
                    Authenticate & View Details
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
