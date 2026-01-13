"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { auth, db } from "../../firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";
import {
    ChartBarIcon,
    UserGroupIcon,
    KeyIcon,
    ClockIcon,
    DocumentTextIcon,
    ArrowTrendingUpIcon,
    CalendarDaysIcon
} from "@heroicons/react/24/outline";
import ThemeToggle from "../components/ThemeToggle";
import Sidebar from "../components/Sidebar";
import AuthGuard from "../components/AuthGuard";

function AdminContent() {
    const searchParams = useSearchParams();
    const tabFromUrl = searchParams.get("tab");

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState(tabFromUrl || "overview");
    const [stats, setStats] = useState({
        totalSessions: 0,
        totalCandidates: 0,
        thisMonth: 0,
        avgCandidates: 0
    });
    const [loading, setLoading] = useState(true);

    // Watch for URL tab parameter changes
    useEffect(() => {
        if (tabFromUrl) {
            setActiveTab(tabFromUrl);
        }
    }, [tabFromUrl]);

    useEffect(() => {
        const fetchStats = async () => {
            const user = auth.currentUser;
            if (!user) return;

            try {
                const q = query(collection(db, "history"), where("userId", "==", user.uid));
                const snapshot = await getDocs(q);

                const sessions = snapshot.docs.map(doc => doc.data());
                const totalSessions = sessions.length;
                const totalCandidates = sessions.reduce((acc, s) => acc + (s.candidates?.length || 0), 0);

                const now = new Date();
                const thisMonthSessions = sessions.filter(s => {
                    const created = new Date(s.createdAt);
                    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
                }).length;

                setStats({
                    totalSessions,
                    totalCandidates,
                    thisMonth: thisMonthSessions,
                    avgCandidates: totalSessions > 0 ? Math.round(totalCandidates / totalSessions) : 0
                });
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
            setLoading(false);
        };

        fetchStats();
    }, []);

    const tabs = [
        { id: "overview", name: "Overview", icon: ChartBarIcon },
        { id: "team", name: "Team", icon: UserGroupIcon },
        { id: "api", name: "API Access", icon: KeyIcon },
    ];

    const statCards = [
        {
            title: "Total Sessions",
            value: stats.totalSessions,
            icon: DocumentTextIcon,
            gradient: "from-blue-500 to-blue-600",
            change: "+12%"
        },
        {
            title: "Candidates Evaluated",
            value: stats.totalCandidates,
            icon: UserGroupIcon,
            gradient: "from-purple-500 to-purple-600",
            change: "+8%"
        },
        {
            title: "This Month",
            value: stats.thisMonth,
            icon: CalendarDaysIcon,
            gradient: "from-green-500 to-emerald-600",
            change: "+24%"
        },
        {
            title: "Avg per Session",
            value: stats.avgCandidates,
            icon: ArrowTrendingUpIcon,
            gradient: "from-amber-500 to-orange-600",
            change: "+3%"
        }
    ];

    if (loading) return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-[#0a0a0f] dark:to-[#0d0d14] flex items-center justify-center">
            <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                Loading admin panel...
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-[#0a0a0f] dark:via-[#0d0d14] dark:to-[#0a0a0f] transition-colors duration-300">
            {/* Background */}
            <div className="fixed inset-0 opacity-30 dark:opacity-20 pointer-events-none">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(100,100,100,0.15) 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                }} />
            </div>

            <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <main className={`relative z-10 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"} min-h-screen`}>
                <header className="flex justify-between items-center px-8 py-6">
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                            Admin Panel
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Monitor usage and manage your workspace</p>
                    </div>
                    <ThemeToggle />
                </header>

                <div className="max-w-6xl mx-auto px-8 pb-12">
                    {/* Tabs */}
                    <div className="flex gap-2 mb-8 bg-white/60 dark:bg-white/5 backdrop-blur-xl p-1.5 rounded-2xl border border-gray-200/50 dark:border-white/10 w-fit">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === tab.id
                                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.name}
                            </button>
                        ))}
                    </div>

                    {/* Overview Tab */}
                    {activeTab === "overview" && (
                        <div className="space-y-8 animate-fadeIn">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {statCards.map((stat, i) => (
                                    <div key={i} className="relative group">
                                        <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                                        <div className="relative bg-white/80 dark:bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-gray-200/50 dark:border-white/10 shadow-xl shadow-gray-200/30 dark:shadow-none">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg`}>
                                                    <stat.icon className="w-5 h-5" />
                                                </div>
                                                <span className="text-xs font-bold text-green-500 bg-green-100 dark:bg-green-500/20 px-2 py-1 rounded-lg">
                                                    {stat.change}
                                                </span>
                                            </div>
                                            <p className="text-3xl font-bold text-gray-800 dark:text-white">{stat.value}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.title}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Recent Activity */}
                            <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 shadow-xl shadow-gray-200/30 dark:shadow-none p-6">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                                    <ClockIcon className="w-5 h-5 text-gray-400" />
                                    Recent Activity
                                </h3>
                                <div className="space-y-4">
                                    {stats.totalSessions > 0 ? (
                                        <p className="text-gray-600 dark:text-gray-400">
                                            You have completed {stats.totalSessions} ranking sessions, evaluating a total of {stats.totalCandidates} candidates.
                                        </p>
                                    ) : (
                                        <p className="text-gray-500 dark:text-gray-400">No ranking sessions yet. Start by analyzing some resumes!</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Team Tab */}
                    {activeTab === "team" && (
                        <div className="animate-fadeIn">
                            <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 shadow-xl shadow-gray-200/30 dark:shadow-none p-8">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Team Management</h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-6">Invite team members to collaborate on hiring decisions.</p>

                                <div className="flex gap-4 mb-8">
                                    <input
                                        type="email"
                                        placeholder="Enter email address"
                                        className="flex-1 px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                    />
                                    <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transition-all">
                                        Invite
                                    </button>
                                </div>

                                <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-xl border border-dashed border-gray-300 dark:border-white/10 text-center">
                                    <UserGroupIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                                    <p className="text-gray-500 dark:text-gray-400">No team members yet</p>
                                    <p className="text-xs text-gray-400 mt-1">Team features coming soon</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* API Tab */}
                    {activeTab === "api" && (
                        <div className="animate-fadeIn">
                            <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 shadow-xl shadow-gray-200/30 dark:shadow-none p-8">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">API Access</h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-6">Integrate HireSight with your existing tools and workflows.</p>

                                <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-500/10 dark:to-purple-500/10 rounded-xl border border-blue-100 dark:border-blue-500/20 mb-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <KeyIcon className="w-6 h-6 text-blue-500" />
                                        <h4 className="font-semibold text-gray-800 dark:text-white">Your API Key</h4>
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value="hs_live_•••••••••••••••••••••"
                                            disabled
                                            className="flex-1 px-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 rounded-xl font-mono text-sm text-gray-600 dark:text-gray-400"
                                        />
                                        <button className="px-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                                            Copy
                                        </button>
                                    </div>
                                </div>

                                <div className="p-4 bg-amber-50 dark:bg-amber-500/10 rounded-xl border border-amber-100 dark:border-amber-500/20">
                                    <p className="text-sm text-amber-700 dark:text-amber-400">
                                        <strong>Note:</strong> API access is currently in beta. Contact support for early access.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default function AdminPage() {
    return (
        <AuthGuard>
            <AdminContent />
        </AuthGuard>
    );
}
