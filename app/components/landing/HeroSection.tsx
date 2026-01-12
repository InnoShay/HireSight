"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// Code snippets for the reflection effect
const codeSnippets = [
    `const analyzeResume = async (data) => {
  const embedding = await model.embed(data);
  return computeSimilarity(embedding, jdVector);
}`,
    `function rankCandidates(resumes, jobDesc) {
  return resumes
    .map(r => ({ ...r, score: match(r, jobDesc) }))
    .sort((a, b) => b.score - a.score);
}`,
    `interface Candidate {
  name: string;
  skills: string[];
  experience: number;
  matchScore: number;
}`,
];

export default function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    // Handle mouse movement for code reflection effect
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    return (
        <section
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-32 overflow-hidden code-reflection-container"
        >
            {/* Background Grid */}
            <div className="absolute inset-0 grid-background opacity-50" />

            {/* Light Beam Effect */}
            <div className="absolute inset-0 flex justify-center pointer-events-none">
                <div className="light-beam" />
            </div>

            {/* Star Field */}
            <div className="star-field">
                {[...Array(50)].map((_, i) => (
                    <div
                        key={i}
                        className="star"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            opacity: Math.random() * 0.5 + 0.1,
                        }}
                    />
                ))}
            </div>

            {/* Code Reflection Effect */}
            {isHovering && (
                <div
                    className="code-reflection"
                    style={{
                        left: mousePos.x + 20,
                        top: mousePos.y + 20,
                        opacity: 0.4,
                        transform: "rotate(-5deg)",
                    }}
                >
                    {codeSnippets[Math.floor(Math.random() * codeSnippets.length)]}
                </div>
            )}

            {/* Content */}
            <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 animate-float-slow">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-sm text-gray-300">
                        AI-Powered Recruitment Platform
                    </span>
                </div>

                {/* Main Headline */}
                <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
                    <span className="gradient-text">Transform Your</span>
                    <br />
                    <span className="text-white">Hiring Process</span>
                </h1>

                {/* Subheadline */}
                <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                    HireSight uses advanced AI and semantic analysis to instantly rank
                    candidates against your job descriptions. Find the perfect match in
                    seconds, not hours.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                    <Link href="/login" className="btn-primary">
                        <span>Get Started</span>
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                        </svg>
                    </Link>
                    <a href="#how-it-works" className="btn-secondary">
                        See How It Works
                    </a>
                </div>

                {/* Dashboard Preview */}
                <div className="relative max-w-4xl mx-auto">
                    <div className="dashboard-preview">
                        {/* Mock Dashboard UI */}
                        <div className="bg-[#111118] rounded-xl border border-white/10 overflow-hidden shadow-2xl">
                            {/* Window Header */}
                            <div className="flex items-center gap-2 px-4 py-3 bg-[#0a0a0f] border-b border-white/5">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                                </div>
                                <span className="text-xs text-gray-500 ml-2">
                                    HireSight Dashboard
                                </span>
                            </div>

                            {/* Dashboard Content */}
                            <div className="p-6 grid grid-cols-3 gap-4">
                                {/* Sidebar */}
                                <div className="col-span-1 space-y-3">
                                    <div className="h-8 bg-white/5 rounded-lg animate-pulse" />
                                    <div className="h-6 bg-white/5 rounded w-3/4" />
                                    <div className="h-6 bg-white/5 rounded w-1/2" />
                                    <div className="h-6 bg-white/5 rounded w-2/3" />
                                    <div className="mt-4 h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-500/20" />
                                </div>

                                {/* Main Content */}
                                <div className="col-span-2 space-y-4">
                                    <div className="flex gap-3">
                                        <div className="flex-1 h-10 bg-white/5 rounded-lg" />
                                        <div className="w-24 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg" />
                                    </div>

                                    {/* Candidate Cards */}
                                    {[1, 2, 3].map((i) => (
                                        <div
                                            key={i}
                                            className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-white/5"
                                            style={{ animationDelay: `${i * 0.2}s` }}
                                        >
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />
                                            <div className="flex-1">
                                                <div className="h-4 bg-white/10 rounded w-1/3 mb-2" />
                                                <div className="h-3 bg-white/5 rounded w-1/2" />
                                            </div>
                                            <div
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${i === 1
                                                        ? "bg-green-500/20 text-green-400"
                                                        : i === 2
                                                            ? "bg-yellow-500/20 text-yellow-400"
                                                            : "bg-blue-500/20 text-blue-400"
                                                    }`}
                                            >
                                                {i === 1 ? "95%" : i === 2 ? "87%" : "82%"}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Floating Elements */}
                    <div
                        className="absolute -left-20 top-1/4 glass-card p-4 rounded-xl animate-float hidden lg:block"
                        style={{ animationDelay: "0.5s" }}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                <svg
                                    className="w-5 h-5 text-green-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium">Resume Analyzed</p>
                                <p className="text-xs text-gray-400">John Smith - 95% Match</p>
                            </div>
                        </div>
                    </div>

                    <div
                        className="absolute -right-16 top-1/3 glass-card p-4 rounded-xl animate-float hidden lg:block"
                        style={{ animationDelay: "1s" }}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                                <svg
                                    className="w-5 h-5 text-purple-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 10V3L4 14h7v7l9-11h-7z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium">AI Processing</p>
                                <p className="text-xs text-gray-400">Semantic Analysis</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Gradient Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0f] to-transparent pointer-events-none" />
        </section>
    );
}
