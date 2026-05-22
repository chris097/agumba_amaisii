"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { activitiesInfo, previousActivitiesInfo, members, paymentAccountDetails, validRegNumbers, type Member } from "@/lib/data";
import { ArrowLeft, ArrowRight, CreditCard, Lock, AlertCircle, X, Shield, Coins, Users, Heart, Baby, HeartHandshake, Sparkles, UserCheck, Calendar, XCircle, CheckCircle, Copy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const allActivities = { ...activitiesInfo, ...previousActivitiesInfo };

const getIcon = (slug: string) => {
  if (slug.includes("meeting")) return <Coins className="w-6 h-6 text-peach-500" />;
  if (slug.includes("burial")) return <Users className="w-6 h-6 text-peach-500" />;
  if (slug.includes("marriage")) return <Heart className="w-6 h-6 text-peach-500" />;
  if (slug.includes("child")) return <Baby className="w-6 h-6 text-peach-500" />;
  if (slug.includes("donation")) return <HeartHandshake className="w-6 h-6 text-peach-500" />;
  return <Users className="w-6 h-6 text-peach-500" />;
};

export default function ActivityPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const activity = allActivities[slug as keyof typeof allActivities];

  const [currentUser, setCurrentUser] = useState<Member | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [regNo, setRegNo] = useState("");
  const [regError, setRegError] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedRegNo = sessionStorage.getItem("userRegNo");
      if (savedRegNo && validRegNumbers.includes(savedRegNo.trim())) {
        const user = members.find(m => m.regNumber === savedRegNo.trim());
        if (user) setCurrentUser(user);
      }
    }
  }, []);

  if (!activity) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-3xl border border-gray-100 shadow-xl max-w-md">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-black-900 mb-2">Activity Not Found</h2>
          <p className="text-gray-500 mb-6">The activity you are looking for does not exist in our system.</p>
          <Link href="/" className="px-6 py-3 bg-black-900 text-white rounded-xl font-bold hover:bg-peach-500 transition-colors">
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  const isPrevious = Object.keys(previousActivitiesInfo).includes(slug);
  const backLink = isPrevious ? "/our-heritage" : "/";

  const checkAuthAndNavigate = () => {
    if (typeof window !== "undefined") {
      const savedRegNo = sessionStorage.getItem("userRegNo");
      if (savedRegNo && validRegNumbers.includes(savedRegNo.trim())) {
        router.push(`/activities/${slug}/list`);
      } else {
        setAuthModalOpen(true);
      }
    }
  };

  const handleRegSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = regNo.trim();
    if (validRegNumbers.includes(entered)) {
      setRegError(false);
      setAuthModalOpen(false);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("userRegNo", entered);
      }
      const user = members.find(m => m.regNumber === entered);
      if (user) setCurrentUser(user);
      router.push(`/activities/${slug}/list`);
    } else {
      setRegError(true);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(paymentAccountDetails.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasUserPaid = currentUser ? currentUser.payments[activity.paymentKey] : false;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 relative">
      {/* Header Banner */}
      <section className="bg-black-900 text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-peach-500/15 blur-3xl" />
          <div className="absolute bottom-0 -left-20 w-80 h-80 rounded-full bg-peach-700/15 blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto z-10">
          <Link
            href={backLink}
            className="inline-flex items-center text-peach-300 hover:text-peach-100 transition-colors mb-8 group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to {isPrevious ? "Heritage Archive" : "Homepage"}
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-peach-300">
              <Shield className="w-4 h-4 mr-2" />
              <span className="text-xs font-semibold tracking-wider uppercase">Public Space</span>
            </div>
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-peach-500/20 border border-peach-500/30 text-peach-300">
              {getIcon(slug)}
              <span className="text-xs font-semibold tracking-wider uppercase ml-2">
                {activity.type === "event" ? "Ceremony" : "Contribution"}
              </span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">{activity.title}</h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl leading-relaxed">
            {activity.description}
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        
        {/* Dynamic Top Section: Member Cards / Celebrant Cards BEFORE showing full paid/unpaid lists */}
        {activity.type === "event" && activity.hosts ? (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-black-900 mb-6 flex items-center">
              <Sparkles className="w-6 h-6 text-peach-500 mr-2 shrink-0 animate-pulse" />
              Members Hosting This Ceremony ({activity.hosts.length})
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activity.hosts.map((host, i) => {
                const hostDetails = members.find(m => m.name === host);
                return (
                  <motion.div
                    key={host}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="relative overflow-hidden rounded-3xl bg-white p-8 border border-gray-100 shadow-md hover:shadow-xl hover:border-peach-200 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-peach-50 opacity-40 blur-2xl" />
                    <div>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-peach-50 flex items-center justify-center text-peach-600 font-bold text-xl border border-peach-100/50">
                          {host.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-black-900 leading-tight">{host}</h3>
                          <p className="text-sm font-semibold text-peach-500 mt-0.5 uppercase tracking-wider">Celebrant Host</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3 mb-8">
                        <div className="flex items-center text-sm text-black-100/60">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          <span>Ceremony Scheduled: Active Season</span>
                        </div>
                        <div className="flex items-center text-sm text-black-100/60">
                          <UserCheck className="w-4 h-4 mr-2 text-gray-400" />
                          <span>Registry: {hostDetails?.regNumber || "Verified Member"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 mt-auto">
                      <button
                        onClick={() => setPayModalOpen(true)}
                        className="w-full flex items-center justify-center px-4 py-3 rounded-xl bg-peach-500 text-white font-bold text-sm hover:bg-peach-700 hover:shadow-lg hover:shadow-peach-500/10 transition-all duration-300"
                      >
                        <CreditCard className="w-4 h-4 mr-2 animate-bounce-slow" />
                        Pay your levy for {host.split(" ")[0]}
                      </button>
                      
                      <button
                        onClick={checkAuthAndNavigate}
                        className="w-full flex items-center justify-center px-4 py-3 rounded-xl bg-black-900 text-white font-bold text-sm hover:bg-black-100 transition-colors"
                      >
                        <Users className="w-4 h-4 mr-2" />
                        View Contribution List
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ) : (
          // GENERAL Activities (e.g. Meeting Levy, Free Donation): Show Logged-in User profile card first!
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-black-900 mb-6 flex items-center">
              <UserCheck className="w-6 h-6 text-peach-500 mr-2 shrink-0" />
              Member Levy & Actions
            </h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-3xl bg-white p-8 border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row items-center justify-between gap-6"
            >
              <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 rounded-full bg-peach-50 opacity-40 blur-3xl pointer-events-none" />
              <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl border bg-peach-50 text-peach-600 border-peach-100">
                  {currentUser?.name.split(" ").map(n => n[0]).join("") || "AG"}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-black-900 mb-1">{currentUser ? `Hello, ${currentUser.name}` : "Member Profile"}</h3>
                  <p className="text-sm text-black-100/60 font-semibold tracking-wide">
                    {currentUser ? `Registration Number: ${currentUser.regNumber}` : "Access official financial audits and clear outstanding balances."}
                  </p>
                  {currentUser && (
                    <div className="mt-3 flex flex-wrap gap-2 items-center justify-center md:justify-start">
                      {hasUserPaid ? (
                        <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold bg-green-50 text-green-800 border border-green-200">
                          Verified Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-800 border border-red-200">
                          Levy Outstanding
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
                <button
                  onClick={() => setPayModalOpen(true)}
                  className="px-6 py-4 bg-peach-500 text-white font-bold rounded-2xl shadow-lg shadow-peach-500/20 hover:bg-peach-700 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center"
                >
                  <CreditCard className="w-5 h-5 mr-2 animate-bounce-slow" />
                  Pay your levy
                </button>
                <button
                  onClick={checkAuthAndNavigate}
                  className="px-6 py-4 bg-black-900 text-white font-bold rounded-2xl hover:bg-black-100 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center"
                >
                  <Users className="w-5 h-5 mr-2" />
                  View Contribution List
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* Verification Reg No Modal */}
      <AnimatePresence>
        {authModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black-900/70 backdrop-blur-sm"
              onClick={() => setAuthModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 text-center overflow-hidden z-10"
            >
              <button
                onClick={() => setAuthModalOpen(false)}
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
                <p className="text-peach-600 text-sm font-semibold mb-1 tracking-wide uppercase">{activity.title}</p>
                <p className="text-black-100/70 mb-8">
                  Enter your Registration Number to view the community contribution lists.
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
                    Verify & View list
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Pay Your Levy Modal */}
      <AnimatePresence>
        {payModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black-900/60 backdrop-blur-sm"
              onClick={() => setPayModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 overflow-hidden z-10"
            >
              <button
                onClick={() => setPayModalOpen(false)}
                className="absolute top-5 right-5 p-2 text-gray-400 hover:text-black-900 hover:bg-gray-100 rounded-full transition-colors z-20"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute top-0 right-0 w-32 h-32 bg-peach-100 rounded-full blur-3xl opacity-50 -mr-16 -mt-16 pointer-events-none" />

              <div className="relative z-10">
                <div className="mx-auto w-16 h-16 bg-peach-100 text-peach-500 rounded-full flex items-center justify-center mb-6">
                  <CreditCard className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-black-900 mb-1 text-center">Pay Your Levy</h2>
                <p className="text-peach-500 text-sm font-semibold mb-6 text-center">{activity?.title}</p>

                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Bank Name</p>
                    <p className="font-semibold text-black-900">{paymentAccountDetails.bankName}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Account Name</p>
                    <p className="font-semibold text-black-900">{paymentAccountDetails.accountName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Account Number</p>
                    <div className="flex items-center justify-between bg-white rounded-xl p-3 border border-gray-100">
                      <p className="font-mono text-xl text-peach-500 tracking-wider font-bold">
                        {paymentAccountDetails.accountNumber}
                      </p>
                      <button
                        onClick={copyToClipboard}
                        className="text-gray-400 hover:text-peach-500 transition-colors"
                      >
                        {copied ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <p className="text-center text-sm text-black-100/60 mt-6">
                  Please use your <span className="font-semibold text-black-900">Registration Number</span> as the transfer reference to verify payment.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
