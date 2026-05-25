"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { previousActivitiesInfo, validRegNumbers, aboutInfo } from "@/lib/data";
import { Shield, ArrowLeft, ArrowRight, Lock, AlertCircle, X, Coins, Users, Heart, BookOpen } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
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
        <div className="absolute inset-0 z-0">
          <Image
            src="/heritage_banner.png"
            alt="Heritage Banner"
            fill
            className="object-cover opacity-40 object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black-900/40 to-black-900/15" />
        </div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
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

      {/* History About Us */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto relative z-20 -mt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-100 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-peach-50 opacity-50 blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
            <div className="w-16 h-16 rounded-2xl bg-peach-100 flex items-center justify-center shrink-0">
              <BookOpen className="w-8 h-8 text-peach-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-black-900 mb-4">About Agumba Age Grade</h2>
              <p className="text-lg text-black-100/80 leading-relaxed">{aboutInfo.history}</p>
              <div className="mt-6 inline-flex items-center text-peach-600 font-semibold italic border-l-4 border-peach-500 pl-4 py-1">
                &quot;{aboutInfo.motto}&quot;
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
