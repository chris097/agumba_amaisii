"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  activitiesInfo,
  previousActivitiesInfo,
  members,
  paymentAccountDetails,
  validRegNumbers,
  type Member,
} from "@/lib/data";
import {
  ArrowLeft,
  CreditCard,
  Lock,
  AlertCircle,
  X,
  Shield,
  Coins,
  Users,
  Heart,
  Baby,
  HeartHandshake,
  Sparkles,
  UserCheck,
  Calendar,
  XCircle,
  CheckCircle,
  Copy,
  Clock,
  BadgeCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const allActivities = { ...activitiesInfo, ...previousActivitiesInfo };

const MONTH_COLORS: Record<string, { bg: string; border: string; badge: string; text: string }> = {
  June: { bg: "bg-amber-50", border: "border-amber-100", badge: "bg-amber-100 text-amber-800", text: "text-amber-600" },
  September: { bg: "bg-blue-50", border: "border-blue-100", badge: "bg-blue-100 text-blue-800", text: "text-blue-600" },
  December: { bg: "bg-violet-50", border: "border-violet-100", badge: "bg-violet-100 text-violet-800", text: "text-violet-600" },
};

const getIcon = (slug: string) => {
  if (slug.includes("meeting")) return <Coins className="w-6 h-6 text-peach-500" />;
  if (slug.includes("burial")) return <Users className="w-6 h-6 text-peach-500" />;
  if (slug.includes("marriage")) return <Heart className="w-6 h-6 text-peach-500" />;
  if (slug.includes("child")) return <Baby className="w-6 h-6 text-peach-500" />;
  if (slug.includes("donation")) return <HeartHandshake className="w-6 h-6 text-peach-500" />;
  return <Users className="w-6 h-6 text-peach-500" />;
};

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

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
      const saved = sessionStorage.getItem("userRegNo");
      if (saved && validRegNumbers.includes(saved.trim())) {
        const user = members.find(m => m.regNumber === saved.trim());
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
          <p className="text-gray-500 mb-6">The activity does not exist in our system.</p>
          <Link href="/" className="px-6 py-3 bg-black-900 text-white rounded-xl font-bold hover:bg-peach-500 transition-colors">
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  const isPrevious = Object.keys(previousActivitiesInfo).includes(slug);
  const backLink = isPrevious ? "/our-heritage" : "/";

  const goToList = () => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("userRegNo");
      if (saved && validRegNumbers.includes(saved.trim())) {
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
      if (typeof window !== "undefined") sessionStorage.setItem("userRegNo", entered);
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

      {/* ── Header ─────────────────────────────── */}
      <section className="bg-black-900 text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-peach-500/15 blur-3xl" />
          <div className="absolute bottom-0  -left-20 w-80 h-80 rounded-full bg-peach-700/15 blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto z-10">
          <Link href={backLink} className="inline-flex items-center text-peach-300 hover:text-peach-100 transition-colors mb-8 group">
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to {isPrevious ? "Heritage Archive" : "Homepage"}
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-peach-300">
              <Shield className="w-4 h-4 mr-2" />
              <span className="text-xs font-semibold tracking-wider uppercase">Official Portal</span>
            </div>
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-peach-500/20 border border-peach-500/30 text-peach-300">
              {getIcon(slug)}
              <span className="text-xs font-semibold tracking-wider uppercase ml-2">
                {activity.type === "event" ? "Ceremony" : "Contribution"}
              </span>
            </div>
            {activity.amount && (
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-green-500/20 border border-green-500/30 text-green-300">
                <span className="text-xs font-bold tracking-wider">{activity.amount} per member</span>
              </div>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">{activity.title}</h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl leading-relaxed">{activity.description}</p>
        </div>
      </section>

      {/* ── Main Content ────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10 space-y-12">

        {/* ── Levy Schedule Cards (meeting-levy only) ── */}
        {activity.levySchedule && activity.levySchedule.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-black-900 mb-6 flex items-center">
              <Calendar className="w-6 h-6 text-peach-500 mr-2 shrink-0" />
              Quarterly Levy Schedule
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {activity.levySchedule.map((entry, i) => {
                const colors = MONTH_COLORS[entry.month] ?? MONTH_COLORS["June"];
                return (
                  <motion.div
                    key={entry.regNumber}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`relative overflow-hidden rounded-3xl bg-white p-6 border shadow-md hover:shadow-xl transition-all duration-300 flex flex-col gap-4 ${colors.border}`}
                  >
                    {/* month badge */}
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${colors.badge}`}>
                        {entry.month}
                      </span>
                      {entry.received ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
                          <BadgeCheck className="w-3.5 h-3.5" /> Received
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
                          <Clock className="w-3.5 h-3.5" /> Pending
                        </span>
                      )}
                    </div>

                    {/* avatar + name */}
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg ${colors.bg} ${colors.text} border ${colors.border}`}>
                        {entry.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-bold text-black-900 text-base leading-tight">{entry.name}</p>
                        <p className="text-xs text-black-100/60 font-mono mt-0.5">{entry.regNumber}</p>
                      </div>
                    </div>

                    {/* received date */}
                    {entry.received && entry.receivedDate && (
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0" />
                        Funds disbursed: {fmtDate(entry.receivedDate)}
                      </p>
                    )}

                    {/* action */}
                    <button
                      onClick={() => setPayModalOpen(true)}
                      className="mt-auto w-full flex items-center justify-center px-4 py-3 rounded-xl bg-peach-500 text-white font-bold text-sm hover:bg-peach-700 transition-all duration-300"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Pay ₦3,000 levy
                    </button>
                    <button
                      onClick={goToList}
                      className="px-4 py-3 bg-black-900 text-white font-bold rounded-2xl hover:bg-black-100 transition-all duration-300 flex items-center justify-center"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      View Contribution List
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Event celebrant cards ── */}
        {activity.type === "event" && activity.hosts && (
          <div>
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
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-peach-50 flex items-center justify-center text-peach-600 font-bold text-xl border border-peach-100/50">
                        {host.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-black-900 leading-tight">{host}</h3>
                        <p className="text-sm font-semibold text-peach-500 mt-0.5 uppercase tracking-wider">Celebrant Host</p>
                        <p className="text-xs text-black-100/60 font-mono mt-1">{hostDetails?.regNumber}</p>
                      </div>
                    </div>
                    {activity.amount && (
                      <div className="mb-6 px-4 py-3 rounded-2xl bg-peach-50 border border-peach-100 flex items-center justify-between">
                        <span className="text-sm text-black-100/70 font-medium">Levy per member</span>
                        <span className="font-extrabold text-peach-600 text-lg">{activity.amount}</span>
                      </div>
                    )}
                    <div className="space-y-3">
                      <button
                        onClick={() => setPayModalOpen(true)}
                        className="w-full flex items-center justify-center px-4 py-3 rounded-xl bg-peach-500 text-white font-bold text-sm hover:bg-peach-700 hover:shadow-lg hover:shadow-peach-500/10 transition-all duration-300"
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        Pay levy for {host.split(" ")[0]}
                      </button>
                      <button
                        onClick={goToList}
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
        )}

        {/* ── General levy member status card ── */}
        {/* {activity.type === "general" && (
          <div>
            <h2 className="text-2xl font-bold text-black-900 mb-6 flex items-center">
              <UserCheck className="w-6 h-6 text-peach-500 mr-2 shrink-0" />
              Your Levy Status
            </h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-3xl bg-white p-8 border border-gray-100 shadow-md flex flex-col md:flex-row items-center justify-between gap-6"
            >
              <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 rounded-full bg-peach-50 opacity-40 blur-3xl pointer-events-none" />
              <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl border bg-peach-50 text-peach-600 border-peach-100">
                  {currentUser?.name.split(" ").map(n => n[0]).join("") || "AG"}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-black-900 mb-1">
                    {currentUser ? `Hello, ${currentUser.name.split(" ")[0]}` : "Member"}
                  </h3>
                  <p className="text-sm font-mono text-black-100/60">{currentUser?.regNumber ?? "—"}</p>
                  {currentUser && (
                    <div className="mt-3">
                      {hasUserPaid ? (
                        <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold bg-green-50 text-green-800 border border-green-200">
                          <CheckCircle className="w-3.5 h-3.5 mr-1" /> Levy Paid
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
                  className="px-6 py-4 bg-peach-500 text-white font-bold rounded-2xl shadow-lg shadow-peach-500/20 hover:bg-peach-700 transition-all duration-300 flex items-center justify-center"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Pay your levy
                </button>
                <button
                  onClick={goToList}
                  className="px-6 py-4 bg-black-900 text-white font-bold rounded-2xl hover:bg-black-100 transition-all duration-300 flex items-center justify-center"
                >
                  <Users className="w-5 h-5 mr-2" />
                  View Contribution List
                </button>
              </div>
            </motion.div>
          </div>
        )} */}
      </div>

      {/* ── Verification Modal ─────────────────── */}
      <AnimatePresence>
        {authModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black-900/70 backdrop-blur-sm"
              onClick={() => setAuthModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 text-center overflow-hidden z-10"
            >
              <button onClick={() => setAuthModalOpen(false)}
                className="absolute top-5 right-5 p-2 text-gray-400 hover:text-black-900 hover:bg-gray-100 rounded-full transition-colors z-20">
                <X className="w-5 h-5" />
              </button>
              <div className="absolute top-0 right-0 w-32 h-32 bg-peach-100 rounded-full blur-3xl opacity-50 -mr-16 -mt-16 pointer-events-none" />
              <div className="relative z-10">
                <div className="mx-auto w-16 h-16 bg-peach-50 text-peach-500 rounded-full flex items-center justify-center mb-6">
                  <Lock className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-black-900 mb-2">Verification Required</h2>
                <p className="text-peach-600 text-sm font-semibold mb-1 tracking-wide uppercase">{activity.title}</p>
                <p className="text-black-100/70 mb-8">Enter your Registration Number to view the contribution list.</p>
                <form onSubmit={handleRegSubmit}>
                  <div className="relative">
                    <input type="text" value={regNo}
                      onChange={e => { setRegNo(e.target.value); setRegError(false); }}
                      placeholder="e.g. AG-2023-001"
                      className={`w-full px-5 py-4 rounded-xl border text-center font-semibold text-lg outline-none transition-all ${regError ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                        : "border-gray-200 focus:border-peach-500 focus:ring-4 focus:ring-peach-500/10"}`}
                    />
                    {regError && (
                      <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                        className="absolute -bottom-7 left-0 right-0 mx-auto flex items-center justify-center text-red-500 text-sm font-medium">
                        <AlertCircle className="w-4 h-4 mr-1 shrink-0" /> Invalid Registration Number
                      </motion.p>
                    )}
                  </div>
                  <button type="submit"
                    className="w-full mt-10 bg-black-900 hover:bg-peach-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center group">
                    Verify & View List
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Pay Modal ──────────────────────────── */}
      <AnimatePresence>
        {payModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black-900/60 backdrop-blur-sm"
              onClick={() => setPayModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 overflow-hidden z-10"
            >
              <button onClick={() => setPayModalOpen(false)}
                className="absolute top-5 right-5 p-2 text-gray-400 hover:text-black-900 hover:bg-gray-100 rounded-full transition-colors z-20">
                <X className="w-5 h-5" />
              </button>
              <div className="absolute top-0 right-0 w-32 h-32 bg-peach-100 rounded-full blur-3xl opacity-50 -mr-16 -mt-16 pointer-events-none" />
              <div className="relative z-10">
                <div className="mx-auto w-16 h-16 bg-peach-100 text-peach-500 rounded-full flex items-center justify-center mb-6">
                  <CreditCard className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-black-900 mb-1 text-center">Pay Your Levy</h2>
                <p className="text-peach-500 text-sm font-semibold mb-2 text-center">{activity?.title}</p>
                {activity.amount && (
                  <p className="text-center text-2xl font-extrabold text-black-900 mb-6">{activity.amount}</p>
                )}
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Bank Name</p>
                    <p className="font-semibold text-black-900">{paymentAccountDetails.bankName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Account Name</p>
                    <p className="font-semibold text-black-900">{paymentAccountDetails.accountName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Account Number</p>
                    <div className="flex items-center justify-between bg-white rounded-xl p-3 border border-gray-100">
                      <p className="font-mono text-xl text-peach-500 tracking-wider font-bold">
                        {paymentAccountDetails.accountNumber}
                      </p>
                      <button onClick={copyToClipboard} className="text-gray-400 hover:text-peach-500 transition-colors">
                        {copied ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>
                <p className="text-center text-sm text-black-100/60 mt-6">
                  Use your <span className="font-semibold text-black-900">Registration Number</span> as the transfer reference.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
