"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { activitiesInfo, previousActivitiesInfo, members, validRegNumbers } from "@/lib/data";
import { ArrowLeft, CheckCircle2, XCircle, Shield, Coins, Users, Heart, Baby, HeartHandshake, Lock, AlertCircle, X } from "lucide-react";
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

export default function ContributionListPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const activity = allActivities[slug as keyof typeof allActivities];

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

  const paidMembers = members.filter((m) => m.payments[activity.paymentKey]);
  const unpaidMembers = members.filter((m) => !m.payments[activity.paymentKey]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 relative">
      {/* Locked State Modal Overlay */}
      <AnimatePresence>
        {authModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black-900/80 backdrop-blur-md"
              onClick={() => router.push(`/activities/${slug}`)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 text-center overflow-hidden z-10"
            >
              <button
                onClick={() => router.push(`/activities/${slug}`)}
                className="absolute top-5 right-5 p-2 text-gray-400 hover:text-black-900 hover:bg-gray-100 rounded-full transition-colors z-20"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute top-0 right-0 w-32 h-32 bg-peach-100 rounded-full blur-3xl opacity-50 -mr-16 -mt-16 pointer-events-none" />

              <div className="relative z-10">
                <div className="mx-auto w-16 h-16 bg-peach-50 text-peach-500 rounded-full flex items-center justify-center mb-6">
                  <Lock className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-black-900 mb-2">Access Locked</h2>
                <p className="text-peach-600 text-sm font-semibold mb-1 tracking-wide uppercase">{activity.title}</p>
                <p className="text-black-100/70 mb-8">
                  Enter your Registration Number to view the community list page.
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
                    Unlock Contribution List
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {isAuthenticated && (
        <div className="animate-fade-in">
          {/* Header Banner */}
          <section className="bg-black-900 text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-peach-500/15 blur-3xl" />
              <div className="absolute bottom-0 -left-20 w-80 h-80 rounded-full bg-peach-700/15 blur-3xl" />
            </div>

            <div className="relative max-w-5xl mx-auto z-10">
              <Link
                href={`/activities/${slug}`}
                className="inline-flex items-center text-peach-300 hover:text-peach-100 transition-colors mb-8 group"
              >
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Details
              </Link>

              <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-peach-300">
                  <Shield className="w-4 h-4 mr-2" />
                  <span className="text-xs font-semibold tracking-wider uppercase">Audit Log Verified</span>
                </div>
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-peach-500/20 border border-peach-500/30 text-peach-300">
                  {getIcon(slug)}
                  <span className="text-xs font-semibold tracking-wider uppercase ml-2">
                    Official Ledger
                  </span>
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">{activity.title}</h1>
              <p className="text-lg md:text-xl text-gray-300 max-w-3xl leading-relaxed">
                Official paid & outstanding status ledger lists for all Agumba Age Grade members under this active contribution.
              </p>
            </div>
          </section>

          {/* Table Content */}
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
            {/* General Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100/50 flex flex-col group hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-black-100/60 mb-1">Total Paid Members</p>
                    <p className="text-4xl font-extrabold text-green-600">{paidMembers.length}</p>
                  </div>
                  <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center border border-green-100">
                    <span className="text-green-600 font-extrabold text-lg">
                      {Math.round((paidMembers.length / members.length) * 100)}%
                    </span>
                  </div>
                </div>
                {activity.amount && (
                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-sm text-gray-500 font-medium">Total Paid Amount:</span>
                    <span className="text-lg font-bold text-green-600">
                      {`₦${((activity.amount ? parseInt((activity.amount.match(/₦([\d,]+)/) || ['0', '0'])[1].replace(/,/g, ''), 10) : 0) * paidMembers.length).toLocaleString()}`}
                    </span>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100/50 flex flex-col group hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-black-100/60 mb-1">Members Yet to Pay</p>
                    <p className="text-4xl font-extrabold text-red-600">{unpaidMembers.length}</p>
                  </div>
                  <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center border border-red-100">
                    <span className="text-red-600 font-extrabold text-lg">
                      {Math.round((unpaidMembers.length / members.length) * 100)}%
                    </span>
                  </div>
                </div>
                {activity.amount && (
                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-sm text-gray-500 font-medium">Total Not Paid Amount:</span>
                    <span className="text-lg font-bold text-red-600">
                      {`₦${((activity.amount ? parseInt((activity.amount.match(/₦([\d,]+)/) || ['0', '0'])[1].replace(/,/g, ''), 10) : 0) * unpaidMembers.length).toLocaleString()}`}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Paid Members Section */}
            {paidMembers.length > 0 && (
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-black-900 mb-4 flex items-center tracking-tight">
                  <CheckCircle2 className="w-6 h-6 text-green-500 mr-2 shrink-0" />
                  Members who have contributed ({paidMembers.length})
                </h3>
                <div className="bg-white rounded-3xl border border-gray-100/50 shadow-md overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                          <th className="py-4 px-6 font-bold text-black-900 text-sm">Member Name</th>
                          <th className="py-4 px-6 font-bold text-black-900 text-sm">Reg. Number</th>
                          {activity.amount && <th className="py-4 px-6 font-bold text-black-900 text-sm">Amount</th>}
                          <th className="py-4 px-6 font-bold text-black-900 text-sm text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paidMembers.map((member) => (
                          <tr key={member.id} className="border-b border-gray-50 last:border-0 hover:bg-peach-50/20 transition-colors duration-200">
                            <td className="py-4 px-6 font-semibold text-black-900 text-base">{member.name}</td>
                            <td className="py-4 px-6 text-black-100/70 font-mono text-sm tracking-wide">{member.regNumber}</td>
                            {activity.amount && (
                              <td className="py-4 px-6 font-semibold text-black-900 text-sm">{activity.amount}</td>
                            )}
                            <td className="py-4 px-6 text-center">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-800 border border-green-200">
                                Paid & Verified
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Unpaid Members Section */}
            {unpaidMembers.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-black-900 mb-4 flex items-center tracking-tight">
                  <XCircle className="w-6 h-6 text-red-500 mr-2 shrink-0" />
                  Members yet to contribute ({unpaidMembers.length})
                </h3>
                <div className="bg-white rounded-3xl border border-gray-100/50 shadow-md overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                          <th className="py-4 px-6 font-bold text-black-900 text-sm">Member Name</th>
                          <th className="py-4 px-6 font-bold text-black-900 text-sm">Reg. Number</th>
                          <th className="py-4 px-6 font-bold text-black-900 text-sm text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {unpaidMembers.map((member) => (
                          <tr key={member.id} className="border-b border-gray-50 last:border-0 hover:bg-peach-50/20 transition-colors duration-200">
                            <td className="py-4 px-6 font-semibold text-black-900 text-base">{member.name}</td>
                            <td className="py-4 px-6 text-black-100/70 font-mono text-sm tracking-wide">{member.regNumber}</td>
                            <td className="py-4 px-6 text-center">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-800 border border-red-200">
                                Pending Levy
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
