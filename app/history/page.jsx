"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { CalendarIcon, UserGroupIcon, BriefcaseIcon } from "@heroicons/react/24/outline";
import ThemeToggle from "../components/ThemeToggle";
import Sidebar from "../components/Sidebar";

export default function HistoryPage() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (!user) {
                router.push("/login");
                return;
            }

            try {
                // Fetch history for current user
                const q = query(
                    collection(db, "history"),
                    where("userId", "==", user.uid)
                );
                const querySnapshot = await getDocs(q);
                const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                // Sort client-side to avoid Firestore index requirement issues immediately
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
        // Reconstruct format expected by Results page
        const resultData = {
            ranked: item.candidates,
            jdAnalysis: item.jdAnalysis
        };
        sessionStorage.setItem("rankingResults", JSON.stringify(resultData));
        router.push("/results");
    };

    if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading history...</div>;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <main className={`transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"} min-h-screen`}>
                <header className="flex justify-between items-center px-8 py-6">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Role History</h1>
                    <ThemeToggle />
                </header>

                <div className="max-w-5xl mx-auto p-6 md:p-8">
                    {history.length === 0 ? (
                        <div className="text-center py-20 text-gray-400">
                            <p>No history found. Rank some candidates first!</p>
                            <button
                                onClick={() => router.push("/dashboard")}
                                className="mt-4 text-indigo-600 font-medium hover:underline"
                            >
                                Go to Dashboard
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {history.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => handleView(item)}
                                    className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg transition-all cursor-pointer flex justify-between items-center group"
                                >
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-lg">
                                            <BriefcaseIcon className="w-5 h-5" />
                                            <h3>{item.jdAnalysis?.job_title || "Untitled Role"}</h3>
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 max-w-xl">
                                            {item.jdAnalysis?.summary || item.jobDescription.substring(0, 100) + "..."}
                                        </p>
                                        <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500 mt-2">
                                            <div className="flex items-center gap-1">
                                                <CalendarIcon className="w-4 h-4" />
                                                <span>{new Date(item.createdAt).toLocaleDateString()} {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <UserGroupIcon className="w-4 h-4" />
                                                <span>{item.candidates?.length || 0} Candidates</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors font-medium text-sm flex items-center">
                                        View Results <span className="ml-1">&rarr;</span>
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
