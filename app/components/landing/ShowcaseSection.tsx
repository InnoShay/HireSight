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
            id="showcase"
            ref={sectionRef}
            className="relative py-32 overflow-hidden"
            style={{
                background:
                    "linear-gradient(180deg, #0a0a0f 0%, #111118 50%, #0a0a0f 100%)",
            }}
        >
            {/* Ambient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-orange-500/10 via-purple-500/10 to-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-6xl mx-auto px-6">
                {/* Section Header */}
                <div className="text-center mb-20">
                    <h2
                        className={`text-4xl md:text-5xl font-bold mb-6 transition-all duration-700 ${isVisible
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-8"
                            }`}
                    >
                        See It <span className="gradient-text-orange">In Action</span>
                    </h2>
                    <p
                        className={`text-lg text-gray-400 max-w-2xl mx-auto transition-all duration-700 delay-100 ${isVisible
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-8"
                            }`}
                    >
                        Watch how HireSight transforms complex hiring decisions into simple,
                        data-driven insights.
                    </p>
                </div>

                {/* Main Showcase */}
                <div
                    className={`relative transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
                        }`}
                >
                    {/* Main Dashboard Frame */}
                    <div className="relative mx-auto max-w-4xl">
                        {/* Glow Effect Behind */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-orange-500/20 rounded-2xl blur-2xl transform scale-105" />

                        {/* Dashboard Mock */}
                        <div className="relative glass-dark rounded-2xl overflow-hidden border border-white/10">
                            {/* Window Chrome */}
                            <div className="flex items-center justify-between px-4 py-3 bg-black/40 border-b border-white/5">
                                <div className="flex items-center gap-2">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-500" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                        <div className="w-3 h-3 rounded-full bg-green-500" />
                                    </div>
                                    <span className="text-xs text-gray-500 ml-3">
                                        hiresight.app/dashboard
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded bg-white/5" />
                                    <div className="w-6 h-6 rounded bg-white/5" />
                                </div>
                            </div>

                            {/* Dashboard Content */}
                            <div className="p-6">
                                <div className="grid grid-cols-12 gap-6">
                                    {/* Left Panel - Job Description */}
                                    <div className="col-span-5 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-medium text-white">
                                                Job Description
                                            </h4>
                                            <span className="px-2 py-1 text-xs bg-purple-500/20 text-purple-400 rounded-full">
                                                AI Enhanced
                                            </span>
                                        </div>
                                        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                            <div className="space-y-2">
                                                <div className="h-3 bg-white/10 rounded w-full" />
                                                <div className="h-3 bg-white/10 rounded w-5/6" />
                                                <div className="h-3 bg-white/10 rounded w-4/5" />
                                                <div className="h-3 bg-white/10 rounded w-full" />
                                                <div className="h-3 bg-white/10 rounded w-3/4" />
                                            </div>
                                            <div className="mt-4 pt-4 border-t border-white/5">
                                                <div className="flex flex-wrap gap-2">
                                                    {["Python", "ML", "TensorFlow", "AWS"].map((skill) => (
                                                        <span
                                                            key={skill}
                                                            className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded"
                                                        >
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Panel - Candidates */}
                                    <div className="col-span-7 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-medium text-white">
                                                Top Candidates
                                            </h4>
                                            <span className="text-xs text-gray-500">
                                                5 resumes analyzed
                                            </span>
                                        </div>

                                        {/* Candidate List */}
                                        <div className="space-y-3">
                                            {[
                                                {
                                                    name: "Sarah Chen",
                                                    role: "ML Engineer",
                                                    score: 96,
                                                    color: "green",
                                                },
                                                {
                                                    name: "Alex Kumar",
                                                    role: "Data Scientist",
                                                    score: 89,
                                                    color: "blue",
                                                },
                                                {
                                                    name: "Jordan Lee",
                                                    role: "Software Engineer",
                                                    score: 84,
                                                    color: "blue",
                                                },
                                            ].map((candidate, i) => (
                                                <div
                                                    key={candidate.name}
                                                    className={`flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5 transition-all duration-500 ${isVisible
                                                            ? "opacity-100 translate-x-0"
                                                            : "opacity-0 translate-x-8"
                                                        }`}
                                                    style={{ transitionDelay: `${400 + i * 150}ms` }}
                                                >
                                                    {/* Rank */}
                                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-sm">
                                                        {i + 1}
                                                    </div>

                                                    {/* Avatar */}
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center text-sm font-medium">
                                                        {candidate.name
                                                            .split(" ")
                                                            .map((n) => n[0])
                                                            .join("")}
                                                    </div>

                                                    {/* Info */}
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-white">
                                                            {candidate.name}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {candidate.role}
                                                        </p>
                                                    </div>

                                                    {/* Score */}
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full rounded-full ${candidate.color === "green"
                                                                        ? "bg-green-500"
                                                                        : "bg-blue-500"
                                                                    }`}
                                                                style={{ width: `${candidate.score}%` }}
                                                            />
                                                        </div>
                                                        <span
                                                            className={`text-sm font-semibold ${candidate.color === "green"
                                                                    ? "text-green-400"
                                                                    : "text-blue-400"
                                                                }`}
                                                        >
                                                            {candidate.score}%
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Floating Feature Cards */}
                    <div
                        className={`absolute -left-4 top-1/4 transform -translate-y-1/2 transition-all duration-700 delay-500 hidden xl:block ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                            }`}
                    >
                        <div className="glass-card p-4 rounded-xl animate-float w-48">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                    <svg
                                        className="w-4 h-4 text-blue-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                                <span className="text-sm font-medium">Skill Match</span>
                            </div>
                            <div className="text-2xl font-bold text-green-400">92%</div>
                            <div className="text-xs text-gray-500">Above average</div>
                        </div>
                    </div>

                    <div
                        className={`absolute -right-4 top-1/3 transform transition-all duration-700 delay-600 hidden xl:block ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
                            }`}
                    >
                        <div
                            className="glass-card p-4 rounded-xl animate-float w-52"
                            style={{ animationDelay: "1s" }}
                        >
                            <div className="text-xs text-gray-500 mb-2">AI Analysis</div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-400">Experience</span>
                                    <span className="text-white font-medium">5+ years</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-400">Skills Match</span>
                                    <span className="text-green-400 font-medium">High</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-400">Education</span>
                                    <span className="text-blue-400 font-medium">MS CS</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
