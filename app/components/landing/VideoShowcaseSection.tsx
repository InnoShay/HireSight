"use client";

import { useEffect, useRef, useState } from "react";

export default function VideoShowcaseSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);

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
            className="relative py-32 bg-gradient-to-b from-[#f8fafc] to-white overflow-hidden"
        >
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Floating Cards - Left Side */}
                <div
                    className={`absolute left-[5%] top-[20%] w-48 h-32 rounded-2xl bg-white shadow-xl border border-gray-100 transition-all duration-1000 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                        }`}
                    style={{ transitionDelay: "200ms" }}
                >
                    <div className="p-4">
                        <div className="text-xs text-gray-400 mb-2">Job Opening</div>
                        <div className="text-sm font-medium text-gray-800">Senior ML Engineer</div>
                        <div className="flex items-center gap-2 mt-3">
                            <div className="w-6 h-6 rounded-full bg-blue-100" />
                            <div className="w-6 h-6 rounded-full bg-purple-100 -ml-2" />
                            <div className="w-6 h-6 rounded-full bg-green-100 -ml-2" />
                            <span className="text-xs text-gray-400 ml-1">+12 applicants</span>
                        </div>
                    </div>
                </div>

                <div
                    className={`absolute left-[8%] top-[55%] w-40 h-24 rounded-2xl bg-white shadow-xl border border-gray-100 transition-all duration-1000 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                        }`}
                    style={{ transitionDelay: "400ms" }}
                >
                    <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500" />
                            <span className="text-xs font-medium text-gray-700">AI Analysis</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full w-[85%] bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                        </div>
                        <div className="text-[10px] text-gray-400 mt-1">Processing...</div>
                    </div>
                </div>

                {/* Floating Cards - Right Side */}
                <div
                    className={`absolute right-[5%] top-[25%] w-44 h-28 rounded-2xl bg-white shadow-xl border border-gray-100 transition-all duration-1000 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
                        }`}
                    style={{ transitionDelay: "300ms" }}
                >
                    <div className="p-4">
                        <div className="text-xs text-gray-400 mb-1">Top Match</div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />
                            <div>
                                <div className="text-sm font-medium text-gray-800">Sarah Chen</div>
                                <div className="text-xs text-gray-400">ML Engineer</div>
                            </div>
                        </div>
                        <div className="mt-2 px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded-full w-fit">
                            95% Match
                        </div>
                    </div>
                </div>

                <div
                    className={`absolute right-[10%] top-[60%] w-36 h-20 rounded-2xl bg-white shadow-xl border border-gray-100 transition-all duration-1000 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
                        }`}
                    style={{ transitionDelay: "500ms" }}
                >
                    <div className="p-3 text-center">
                        <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                            47
                        </div>
                        <div className="text-xs text-gray-400">Resumes Today</div>
                    </div>
                </div>

                {/* Blue Glow Effects */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-400/10 blur-3xl" />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-cyan-300/15 blur-2xl" />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-5xl mx-auto px-6">
                {/* Header */}
                <div
                    className={`text-center mb-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                        }`}
                >
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
                        Hire smarter.
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                            Like having AI experts.
                        </span>
                    </h2>
                    <p className="text-gray-500 max-w-xl mx-auto">
                        Watch how HireSight analyzes resumes in real-time, extracting skills
                        and ranking candidates with precision AI matching.
                    </p>
                </div>

                {/* Video Player Tile */}
                <div
                    className={`relative max-w-3xl mx-auto transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                        }`}
                    style={{ transitionDelay: "200ms" }}
                >
                    {/* Video Container with Glow */}
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                        {/* Outer Glow Ring */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-2xl opacity-30 blur-sm" />

                        {/* Video Frame */}
                        <div className="relative bg-[#1a1a24] rounded-2xl overflow-hidden border border-white/10">
                            {/* Header Bar */}
                            <div className="flex items-center justify-between px-4 py-3 bg-[#111118] border-b border-white/5">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-sm text-white font-medium">AI Resume Analysis</span>
                                    <span className="text-xs text-gray-500">• Live Demo</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center">
                                        <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Video Content Area - Animated Demo */}
                            <div className="relative aspect-video bg-gradient-to-br from-[#0f0f17] to-[#1a1a24] p-6">
                                {/* Simulated Dashboard Content */}
                                <div className="h-full grid grid-cols-3 gap-4">
                                    {/* Left Panel - Resume Upload */}
                                    <div className="col-span-1 space-y-3">
                                        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                                            <div className="text-xs text-gray-400 mb-2">Uploaded Resume</div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-10 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-white">resume.pdf</div>
                                                    <div className="text-[10px] text-gray-500">2.4 MB</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                                            <div className="text-xs text-gray-400 mb-2">Extracted Skills</div>
                                            <div className="flex flex-wrap gap-1">
                                                {["Python", "ML", "TensorFlow", "AWS"].map((skill, i) => (
                                                    <span key={i} className="px-2 py-0.5 bg-blue-500/20 text-blue-300 text-[10px] rounded animate-pulse" style={{ animationDelay: `${i * 200}ms` }}>
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Center Panel - Analysis Visualization */}
                                    <div className="col-span-1 flex flex-col items-center justify-center">
                                        {/* Animated Processing Circle */}
                                        <div className="relative w-24 h-24">
                                            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
                                                <circle
                                                    cx="50"
                                                    cy="50"
                                                    r="45"
                                                    fill="none"
                                                    stroke="url(#gradient)"
                                                    strokeWidth="6"
                                                    strokeLinecap="round"
                                                    strokeDasharray="283"
                                                    strokeDashoffset="42"
                                                    className="animate-pulse"
                                                />
                                                <defs>
                                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                        <stop offset="0%" stopColor="#3b82f6" />
                                                        <stop offset="100%" stopColor="#8b5cf6" />
                                                    </linearGradient>
                                                </defs>
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <span className="text-xl font-bold text-white">95%</span>
                                                <span className="text-[10px] text-gray-400">Match</span>
                                            </div>
                                        </div>
                                        <div className="mt-3 text-xs text-gray-400">Analyzing...</div>
                                    </div>

                                    {/* Right Panel - Results */}
                                    <div className="col-span-1 space-y-2">
                                        <div className="text-xs text-gray-400 mb-2">Ranking Results</div>
                                        {[
                                            { name: "Sarah C.", score: 95 },
                                            { name: "Alex K.", score: 89 },
                                            { name: "Jordan L.", score: 84 },
                                        ].map((c, i) => (
                                            <div key={i} className="flex items-center gap-2 p-2 bg-white/5 rounded border border-white/5">
                                                <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold ${i === 0 ? "bg-amber-500 text-black" : "bg-white/10 text-gray-400"}`}>
                                                    {i + 1}
                                                </span>
                                                <span className="text-xs text-white flex-1">{c.name}</span>
                                                <span className="text-xs text-green-400">{c.score}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Video Controls */}
                            <div className="flex items-center justify-center gap-3 px-4 py-4 bg-[#111118] border-t border-white/5">
                                <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>

                                <button
                                    onClick={() => setIsPlaying(!isPlaying)}
                                    className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
                                >
                                    {isPlaying ? (
                                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    )}
                                </button>

                                <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>

                                <div className="absolute right-4 flex items-center gap-2">
                                    <button className="w-8 h-8 rounded bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M6 18l.01-.01M6 6l.01.01" />
                                        </svg>
                                    </button>
                                    <button className="w-8 h-8 rounded bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description Text */}
                <div
                    className={`text-center mt-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                        }`}
                    style={{ transitionDelay: "400ms" }}
                >
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
                        <span className="font-semibold text-gray-800">Screening candidates is effortless</span> with our AI-powered platform.
                        Watch real-time analysis as HireSight extracts skills, matches job requirements,
                        and ranks applicants—all in seconds.
                    </p>
                </div>
            </div>
        </section>
    );
}
