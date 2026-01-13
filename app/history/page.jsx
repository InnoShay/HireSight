"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { CalendarIcon, UserGroupIcon, BriefcaseIcon, ArrowRightIcon, SparklesIcon } from "@heroicons/react/24/outline";
import ThemeToggle from "../components/ThemeToggle";
import Sidebar from "../components/Sidebar";
import AuthGuard from "../components/AuthGuard";

function HistoryContent() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (!user) { router.push("/login"); return; }
            try {
                const q = query(collection(db, "history"), where("userId", "==", user.uid));
                const querySnapshot = await getDocs(q);
                const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setHistory(data);
            } catch (err) {
                console.error("Error fetching history:", err);
            } finally {
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, [router]);

    const handleView = (item) => {
        const resultData = { ranked: item.candidates, jdAnalysis: item.jdAnalysis };
        sessionStorage.setItem("rankingResults", JSON.stringify(resultData));
        router.push("/results");
    };

    if (loading) return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-[#0a0a0f] dark:to-[#0d0d14] flex items-center justify-center">
            <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                Loading history...
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-[#0a0a0f] dark:via-[#0d0d14] dark:to-[#0a0a0f] transition-colors duration-300">
            {/* Subtle background pattern */}
            <div className="fixed inset-0 opacity-30 dark:opacity-20 pointer-events-none">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(100,100,100,0.15) 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                }} />
            </div>

            {/* Ambient glow effects */}
            <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <main className={`relative z-10 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"} min-h-screen`}>
                <header className="flex justify-between items-center px-8 py-6">
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                            Role History
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">View past ranking sessions and results</p>
                    </div>
                    <ThemeToggle />
                </header>

                <div className="max-w-5xl mx-auto px-6 md:px-8 pb-12">
                    {history.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-500/20 dark:to-purple-500/20 flex items-center justify-center">
                                <SparklesIcon className="w-10 h-10 text-indigo-500 dark:text-indigo-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No history found</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">Rank some candidates first to see your history here!</p>
                            <button
                                onClick={() => router.push("/dashboard")}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 transition-all"
                            >
                                Go to Dashboard
                                <ArrowRightIcon className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {history.map((item, idx) => (
                                <div
                                    key={item.id}
                                    onClick={() => handleView(item)}
                                    className="relative group cursor-pointer"
                                >
                                    {/* Hover glow */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    {/* Card */}
                                    <div className="relative bg-white/80 dark:bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-gray-200/50 dark:border-white/10 shadow-xl shadow-gray-200/30 dark:shadow-none group-hover:border-indigo-200 dark:group-hover:border-indigo-500/30 transition-all flex justify-between items-center">
                                        {/* Timeline connector */}
                                        {idx !== history.length - 1 && (
                                            <div className="absolute left-8 top-full w-0.5 h-4 bg-gradient-to-b from-indigo-200 to-transparent dark:from-indigo-500/30" />
                                        )}

                                        <div className="flex items-start gap-4">
                                            {/* Icon */}
                                            <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 flex-shrink-0">
                                                <BriefcaseIcon className="w-5 h-5" />
                                            </div>

                                            <div className="space-y-2">
                                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                    {item.jdAnalysis?.job_title || "Untitled Role"}
                                                </h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 max-w-xl">
                                                    {item.jdAnalysis?.summary || item.jobDescription?.substring(0, 100) + "..."}
                                                </p>
                                                <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
                                                    <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-white/5 px-2.5 py-1 rounded-lg">
                                                        <CalendarIcon className="w-3.5 h-3.5" />
                                                        <span>{new Date(item.createdAt).toLocaleDateString()} {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-white/5 px-2.5 py-1 rounded-lg">
                                                        <UserGroupIcon className="w-3.5 h-3.5" />
                                                        <span>{item.candidates?.length || 0} Candidates</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors font-medium text-sm">
                                            <span>View Results</span>
                                            <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

// Wrap HistoryContent with AuthGuard for route protection
export default function HistoryPage() {
    return (
        <AuthGuard>
            <HistoryContent />
        </AuthGuard>
    );
}
