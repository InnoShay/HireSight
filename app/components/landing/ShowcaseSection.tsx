"use client";

import { useEffect, useRef, useState } from "react";

export default function ShowcaseSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section
            ref={sectionRef}
            id="showcase"
            className="relative py-32 bg-[#0a0a0f] overflow-hidden"
        >
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Left Orange/Amber Glow */}
                <div className="absolute left-0 top-1/4 w-96 h-[600px] bg-gradient-to-r from-orange-500/20 via-amber-500/10 to-transparent blur-3xl" />
                <div className="absolute left-0 top-1/3 w-64 h-96 bg-orange-500/15 blur-2xl" />

                {/* Right Blue Glow */}
                <div className="absolute right-0 top-1/2 w-64 h-64 bg-blue-500/10 blur-3xl rounded-full" />
            </div>

            {/* Header */}
            <div className="relative z-10 max-w-6xl mx-auto px-6 mb-16 text-center">
                <h2
                    className={`text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                        }`}
                >
                    See It <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">In Action</span>
                </h2>
                <p
                    className={`text-gray-400 max-w-2xl mx-auto transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                        }`}
                    style={{ transitionDelay: "100ms" }}
                >
                    Watch how HireSight transforms complex hiring decisions into simple, data-driven insights.
                </p>
            </div>

            {/* Dashboard Window with Neon Border */}
            <div
                className={`relative z-10 max-w-5xl mx-auto px-6 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                    }`}
                style={{ transitionDelay: "200ms" }}
            >
                {/* Neon Border Container */}
                <div className="relative rounded-2xl p-[2px] overflow-hidden neon-border-container">
                    {/* Animated Neon Border */}
                    <div className="neon-border" />

                    {/* Dashboard Content */}
                    <div className="relative bg-[#111118] rounded-2xl overflow-hidden">
                        {/* Window Header */}
                        <div className="flex items-center justify-between px-4 py-3 bg-[#0a0a0f] border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                    <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                    </svg>
                                    <span className="text-xs text-gray-400">hiresight.app/dashboard</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded bg-white/5" />
                                <div className="w-6 h-6 rounded bg-white/5" />
                            </div>
                        </div>

                        {/* Dashboard Content */}
                        <div className="p-6 grid grid-cols-12 gap-6">
                            {/* Left Panel - Skill Match Card */}
                            <div className="col-span-3">
                                <div className="bg-[#1a1a24] rounded-xl border border-white/10 p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center">
                                            <svg className="w-3 h-3 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <span className="text-xs font-medium text-white">Skill Match</span>
                                    </div>
                                    <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
                                        92%
                                    </div>
                                    <div className="text-xs text-gray-500">Above average</div>
                                </div>
                            </div>

                            {/* Center Panel - Job Description */}
                            <div className="col-span-5">
                                <div className="bg-[#1a1a24] rounded-xl border border-white/10 p-4 h-full">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm font-medium text-white">Job Description</span>
                                        <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full">AI Enhanced</span>
                                    </div>

                                    {/* Loading Lines Animation */}
                                    <div className="space-y-3">
                                        <div className="h-3 bg-white/5 rounded w-full animate-pulse" />
                                        <div className="h-3 bg-white/5 rounded w-5/6 animate-pulse" style={{ animationDelay: "100ms" }} />
                                        <div className="h-3 bg-white/5 rounded w-4/5 animate-pulse" style={{ animationDelay: "200ms" }} />
                                        <div className="h-3 bg-white/5 rounded w-full animate-pulse" style={{ animationDelay: "300ms" }} />
                                    </div>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {["Python", "ML", "TensorFlow", "AWS"].map((tag, i) => (
                                            <span key={i} className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-md">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Panel - Top Candidates */}
                            <div className="col-span-4">
                                <div className="bg-[#1a1a24] rounded-xl border border-white/10 p-4 h-full">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm font-medium text-white">Top Candidates</span>
                                        <span className="text-xs text-gray-500">5 resumes analyzed</span>
                                    </div>

                                    {/* Candidate List */}
                                    <div className="space-y-3">
                                        {[
                                            { rank: 1, name: "Sarah Chen", role: "ML Engineer", score: 95, color: "green" },
                                            { rank: 2, name: "Alex Kumar", role: "Data Scientist", score: 88, color: "blue" },
                                            { rank: 3, name: "Jordan Lee", role: "Software Engineer", score: 84, color: "blue" },
                                        ].map((c, i) => (
                                            <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                                                <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${c.rank === 1 ? "bg-green-500 text-black" : "bg-white/10 text-gray-400"
                                                    }`}>
                                                    {c.rank}
                                                </span>
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-xs font-medium text-white">
                                                    {c.name.split(" ").map(n => n[0]).join("")}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-xs font-medium text-white truncate">{c.name}</div>
                                                    <div className="text-[10px] text-gray-500">{c.role}</div>
                                                </div>
                                                {/* Score Bar */}
                                                <div className="w-20">
                                                    <div className="flex items-center gap-1">
                                                        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full rounded-full ${c.color === "green" ? "bg-green-500" : "bg-blue-500"}`}
                                                                style={{ width: `${c.score}%` }}
                                                            />
                                                        </div>
                                                        <span className={`text-xs font-medium ${c.color === "green" ? "text-green-400" : "text-blue-400"}`}>
                                                            {c.score}%
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Info Pills */}
                                    <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
                                        <div className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded text-[10px]">
                                            <span className="text-gray-400">Experience</span>
                                            <span className="text-white font-medium">5+ years</span>
                                        </div>
                                        <div className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded text-[10px]">
                                            <span className="text-gray-400">Skills Match</span>
                                            <span className="text-green-400 font-medium">High</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feature Tiles Grid - 3x2 */}
            <div
                className={`relative z-10 max-w-6xl mx-auto px-6 mt-24 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
                style={{ transitionDelay: "400ms" }}
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: (
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1zm1 2v10h14V7H5z" />
                                    <path d="M7 9h2v2H7V9zm4 0h6v2h-6V9zm-4 4h2v2H7v-2zm4 0h6v2h-6v-2z" />
                                </svg>
                            ),
                            title: "Bulk Processing",
                            description: "Upload multiple resumes and analyze them all at once with batch processing capabilities.",
                            gradient: "from-blue-500 to-blue-600",
                            color: "text-blue-400",
                        },
                        {
                            icon: (
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                </svg>
                            ),
                            title: "Smart Matching",
                            description: "AI understands context and nuance to find candidates who truly fit your requirements.",
                            gradient: "from-green-500 to-emerald-600",
                            color: "text-green-400",
                        },
                        {
                            icon: (
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                                </svg>
                            ),
                            title: "Detailed Insights",
                            description: "Get comprehensive reports with skill breakdowns, experience analysis, and recommendations.",
                            gradient: "from-purple-500 to-purple-600",
                            color: "text-purple-400",
                        },
                        {
                            icon: (
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            ),
                            title: "Lightning Fast",
                            description: "Analyze hundreds of resumes in seconds, not hours. AI-powered speed meets accuracy.",
                            gradient: "from-amber-500 to-orange-600",
                            color: "text-amber-400",
                        },
                        {
                            icon: (
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
                                </svg>
                            ),
                            title: "Privacy First",
                            description: "Your data stays secure with enterprise-grade encryption and compliance standards.",
                            gradient: "from-cyan-500 to-cyan-600",
                            color: "text-cyan-400",
                        },
                        {
                            icon: (
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                                </svg>
                            ),
                            title: "Easy Integration",
                            description: "Connect with your existing ATS and HR tools through our robust API and integrations.",
                            gradient: "from-pink-500 to-rose-600",
                            color: "text-pink-400",
                        },
                    ].map((feature, i) => (
                        <div
                            key={i}
                            className="group"
                            style={{ transitionDelay: `${500 + i * 100}ms` }}
                        >
                            {/* Icon */}
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                {feature.icon}
                            </div>

                            {/* Title */}
                            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:${feature.gradient} transition-colors">
                                {feature.title}
                            </h3>

                            {/* Description */}
                            <p className="text-sm text-gray-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
