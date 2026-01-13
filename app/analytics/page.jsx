"use client";

import { useState, useEffect, useRef } from "react";
import { auth, db } from "../../firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";
import {
    ChartBarIcon,
    ArrowTrendingUpIcon,
    UserGroupIcon,
    CalendarDaysIcon,
    SparklesIcon,
    ArrowUpIcon,
    ArrowDownIcon
} from "@heroicons/react/24/outline";
import ThemeToggle from "../components/ThemeToggle";
import Sidebar from "../components/Sidebar";
import AuthGuard from "../components/AuthGuard";

function AnalyticsContent() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [loading, setLoading] = useState(true);
    const [historyData, setHistoryData] = useState([]);
    const [hoveredBar, setHoveredBar] = useState(null);
    const [hoveredSkill, setHoveredSkill] = useState(null);
    const [animationComplete, setAnimationComplete] = useState(false);

    // Analytics metrics
    const [metrics, setMetrics] = useState({
        totalSessions: 0,
        totalCandidates: 0,
        avgScore: 0,
        topScore: 0,
        thisMonth: 0,
        lastMonth: 0,
        skillsAnalyzed: []
    });

    useEffect(() => {
        const fetchAnalytics = async () => {
            const user = auth.currentUser;
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                const q = query(collection(db, "history"), where("userId", "==", user.uid));
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                setHistoryData(data);

                // Calculate metrics
                const totalSessions = data.length;
                const totalCandidates = data.reduce((acc, s) => acc + (s.candidates?.length || 0), 0);

                // Calculate average and top score
                let allScores = [];
                data.forEach(session => {
                    session.candidates?.forEach(c => {
                        if (c.score) allScores.push(c.score);
                    });
                });
                const avgScore = allScores.length > 0 ? (allScores.reduce((a, b) => a + b, 0) / allScores.length) : 0;
                const topScore = allScores.length > 0 ? Math.max(...allScores) : 0;

                // This month vs last month
                const now = new Date();
                const thisMonthSessions = data.filter(s => {
                    const d = new Date(s.createdAt);
                    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
                }).length;
                const lastMonthSessions = data.filter(s => {
                    const d = new Date(s.createdAt);
                    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                    return d.getMonth() === lastMonth.getMonth() && d.getFullYear() === lastMonth.getFullYear();
                }).length;

                // Extract skills from JD analysis
                const skillMap = {};
                data.forEach(session => {
                    const mustHave = session.jdAnalysis?.must_have_skills || [];
                    const goodToHave = session.jdAnalysis?.good_to_have_skills || [];
                    [...mustHave, ...goodToHave].forEach(skill => {
                        if (skill && skill !== "AI Analysis Failed") {
                            skillMap[skill] = (skillMap[skill] || 0) + 1;
                        }
                    });
                });
                const sortedSkills = Object.entries(skillMap)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 8)
                    .map(([name, count]) => ({ name, count }));

                setMetrics({
                    totalSessions,
                    totalCandidates,
                    avgScore: avgScore * 100,
                    topScore: topScore * 100,
                    thisMonth: thisMonthSessions,
                    lastMonth: lastMonthSessions,
                    skillsAnalyzed: sortedSkills
                });

            } catch (error) {
                console.error("Error fetching analytics:", error);
            }
            setLoading(false);
            setTimeout(() => setAnimationComplete(true), 100);
        };

        fetchAnalytics();
    }, []);

    // Generate activity data for the last 7 days
    const getActivityData = () => {
        const days = [];
        const now = new Date();
        for (let i = 6; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const count = historyData.filter(s => s.createdAt?.startsWith(dateStr)).length;
            days.push({
                date: date.toLocaleDateString('en-US', { weekday: 'short' }),
                count,
                fullDate: dateStr
            });
        }
        return days;
    };

    // Get score distribution
    const getScoreDistribution = () => {
        const ranges = [
            { label: '90-100%', min: 0.9, max: 1.0, count: 0, color: 'from-green-400 to-emerald-500' },
            { label: '70-89%', min: 0.7, max: 0.89, count: 0, color: 'from-blue-400 to-blue-500' },
            { label: '50-69%', min: 0.5, max: 0.69, count: 0, color: 'from-yellow-400 to-amber-500' },
            { label: '30-49%', min: 0.3, max: 0.49, count: 0, color: 'from-orange-400 to-orange-500' },
            { label: '0-29%', min: 0, max: 0.29, count: 0, color: 'from-red-400 to-red-500' }
        ];

        historyData.forEach(session => {
            session.candidates?.forEach(c => {
                if (c.score !== undefined) {
                    const score = c.score;
                    for (let r of ranges) {
                        if (score >= r.min && score <= r.max) {
                            r.count++;
                            break;
                        }
                    }
                }
            });
        });

        const maxCount = Math.max(...ranges.map(r => r.count), 1);
        return ranges.map(r => ({ ...r, percentage: (r.count / maxCount) * 100 }));
    };

    const activityData = getActivityData();
    const scoreDistribution = getScoreDistribution();
    const maxActivity = Math.max(...activityData.map(d => d.count), 1);
    const growthRate = metrics.lastMonth > 0
        ? ((metrics.thisMonth - metrics.lastMonth) / metrics.lastMonth * 100).toFixed(0)
        : metrics.thisMonth > 0 ? 100 : 0;

    if (loading) return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-[#0a0a0f] dark:to-[#0d0d14] flex items-center justify-center">
            <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                Loading analytics...
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

            <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-violet-500/10 dark:bg-violet-500/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <main className={`relative z-10 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"} min-h-screen`}>
                <header className="flex justify-between items-center px-8 py-6">
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent flex items-center gap-3">
                            <ChartBarIcon className="w-7 h-7 text-violet-500" />
                            Analytics & Insights
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track your hiring performance and trends</p>
                    </div>
                    <ThemeToggle />
                </header>

                <div className="px-8 pb-12 space-y-8">
                    {/* Stat Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { title: "Total Sessions", value: metrics.totalSessions, icon: CalendarDaysIcon, gradient: "from-blue-500 to-blue-600", change: growthRate },
                            { title: "Candidates Evaluated", value: metrics.totalCandidates, icon: UserGroupIcon, gradient: "from-purple-500 to-purple-600" },
                            { title: "Average Score", value: `${metrics.avgScore.toFixed(1)}%`, icon: ArrowTrendingUpIcon, gradient: "from-green-500 to-emerald-600" },
                            { title: "Top Score", value: `${metrics.topScore.toFixed(1)}%`, icon: SparklesIcon, gradient: "from-amber-500 to-orange-600" }
                        ].map((stat, i) => (
                            <div
                                key={i}
                                className="group relative"
                                style={{
                                    opacity: animationComplete ? 1 : 0,
                                    transform: animationComplete ? 'translateY(0)' : 'translateY(20px)',
                                    transition: `all 0.5s ease ${i * 100}ms`
                                }}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
                                <div className="relative bg-white/80 dark:bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-gray-200/50 dark:border-white/10 shadow-xl shadow-gray-200/30 dark:shadow-none hover:scale-[1.02] transition-all duration-300">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg`}>
                                            <stat.icon className="w-5 h-5" />
                                        </div>
                                        {stat.change !== undefined && (
                                            <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${Number(stat.change) >= 0
                                                    ? 'text-green-600 bg-green-100 dark:bg-green-500/20'
                                                    : 'text-red-600 bg-red-100 dark:bg-red-500/20'
                                                }`}>
                                                {Number(stat.change) >= 0 ? <ArrowUpIcon className="w-3 h-3" /> : <ArrowDownIcon className="w-3 h-3" />}
                                                {Math.abs(stat.change)}%
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-3xl font-bold text-gray-800 dark:text-white">{stat.value}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.title}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Activity Chart */}
                        <div
                            className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 shadow-xl shadow-gray-200/30 dark:shadow-none p-6"
                            style={{
                                opacity: animationComplete ? 1 : 0,
                                transform: animationComplete ? 'translateY(0)' : 'translateY(20px)',
                                transition: 'all 0.5s ease 400ms'
                            }}
                        >
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                                <CalendarDaysIcon className="w-5 h-5 text-blue-500" />
                                Activity This Week
                            </h3>
                            <div className="flex items-end justify-between gap-3 h-48">
                                {activityData.map((day, i) => (
                                    <div
                                        key={i}
                                        className="flex-1 flex flex-col items-center gap-2"
                                        onMouseEnter={() => setHoveredBar(i)}
                                        onMouseLeave={() => setHoveredBar(null)}
                                    >
                                        <div className="relative w-full flex justify-center">
                                            {hoveredBar === i && day.count > 0 && (
                                                <div className="absolute -top-10 bg-gray-900 dark:bg-slate-700 text-white text-xs px-2 py-1 rounded-lg animate-fadeIn whitespace-nowrap z-10">
                                                    {day.count} session{day.count !== 1 ? 's' : ''}
                                                </div>
                                            )}
                                            <div
                                                className={`w-full max-w-[40px] rounded-xl transition-all duration-500 cursor-pointer ${hoveredBar === i
                                                        ? 'bg-gradient-to-t from-blue-600 to-violet-500 scale-105'
                                                        : 'bg-gradient-to-t from-blue-500/80 to-violet-400/80'
                                                    }`}
                                                style={{
                                                    height: animationComplete ? `${Math.max((day.count / maxActivity) * 160, 8)}px` : '8px',
                                                    transition: `height 0.8s ease ${i * 100}ms, transform 0.2s ease, background 0.2s ease`
                                                }}
                                            />
                                        </div>
                                        <span className={`text-xs font-medium transition-colors ${hoveredBar === i ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
                                            }`}>
                                            {day.date}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            {metrics.totalSessions === 0 && (
                                <p className="text-center text-gray-400 text-sm mt-4">No activity yet. Start ranking resumes!</p>
                            )}
                        </div>

                        {/* Score Distribution */}
                        <div
                            className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 shadow-xl shadow-gray-200/30 dark:shadow-none p-6"
                            style={{
                                opacity: animationComplete ? 1 : 0,
                                transform: animationComplete ? 'translateY(0)' : 'translateY(20px)',
                                transition: 'all 0.5s ease 500ms'
                            }}
                        >
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                                <ChartBarIcon className="w-5 h-5 text-purple-500" />
                                Score Distribution
                            </h3>
                            <div className="space-y-4">
                                {scoreDistribution.map((range, i) => (
                                    <div key={i} className="group">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">{range.label}</span>
                                            <span className="text-sm font-semibold text-gray-800 dark:text-white">{range.count}</span>
                                        </div>
                                        <div className="h-3 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full bg-gradient-to-r ${range.color} rounded-full transition-all duration-1000 group-hover:brightness-110`}
                                                style={{
                                                    width: animationComplete ? `${range.percentage}%` : '0%',
                                                    transitionDelay: `${600 + i * 100}ms`
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Skills Cloud */}
                    <div
                        className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 shadow-xl shadow-gray-200/30 dark:shadow-none p-6"
                        style={{
                            opacity: animationComplete ? 1 : 0,
                            transform: animationComplete ? 'translateY(0)' : 'translateY(20px)',
                            transition: 'all 0.5s ease 700ms'
                        }}
                    >
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                            <SparklesIcon className="w-5 h-5 text-amber-500" />
                            Most Sought-After Skills
                        </h3>
                        {metrics.skillsAnalyzed.length > 0 ? (
                            <div className="flex flex-wrap gap-3">
                                {metrics.skillsAnalyzed.map((skill, i) => {
                                    const maxCount = Math.max(...metrics.skillsAnalyzed.map(s => s.count));
                                    const intensity = skill.count / maxCount;
                                    return (
                                        <div
                                            key={i}
                                            onMouseEnter={() => setHoveredSkill(i)}
                                            onMouseLeave={() => setHoveredSkill(null)}
                                            className={`relative px-4 py-2 rounded-xl font-medium cursor-pointer transition-all duration-300 ${hoveredSkill === i
                                                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white scale-110 shadow-lg shadow-blue-500/25'
                                                    : intensity > 0.7
                                                        ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300'
                                                        : intensity > 0.4
                                                            ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300'
                                                            : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300'
                                                }`}
                                            style={{
                                                fontSize: `${Math.max(0.8 + intensity * 0.4, 0.8)}rem`,
                                                animationDelay: `${800 + i * 50}ms`
                                            }}
                                        >
                                            {skill.name}
                                            {hoveredSkill === i && (
                                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-slate-700 text-white text-xs px-2 py-1 rounded-lg animate-fadeIn whitespace-nowrap">
                                                    {skill.count} jobs
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-gray-400 text-sm">Complete some ranking sessions to see skill trends.</p>
                        )}
                    </div>

                    {/* Insights Card */}
                    <div
                        className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl p-8 text-white relative overflow-hidden"
                        style={{
                            opacity: animationComplete ? 1 : 0,
                            transform: animationComplete ? 'translateY(0)' : 'translateY(20px)',
                            transition: 'all 0.5s ease 900ms'
                        }}
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold mb-4">💡 AI Insights</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                                    <p className="text-white/80 text-sm mb-2">This Month vs Last</p>
                                    <p className="text-2xl font-bold">
                                        {growthRate >= 0 ? '📈' : '📉'} {Math.abs(growthRate)}% {growthRate >= 0 ? 'growth' : 'decline'}
                                    </p>
                                </div>
                                <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                                    <p className="text-white/80 text-sm mb-2">Avg Candidates/Session</p>
                                    <p className="text-2xl font-bold">
                                        👥 {metrics.totalSessions > 0 ? (metrics.totalCandidates / metrics.totalSessions).toFixed(1) : 0}
                                    </p>
                                </div>
                                <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                                    <p className="text-white/80 text-sm mb-2">Quality Score</p>
                                    <p className="text-2xl font-bold">
                                        ⭐ {metrics.avgScore > 70 ? 'Excellent' : metrics.avgScore > 50 ? 'Good' : 'Fair'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function AnalyticsPage() {
    return (
        <AuthGuard>
            <AnalyticsContent />
        </AuthGuard>
    );
}
