"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";

// Code chips scattered across the hero section - like floating code fragments
const codeChips = [
    { id: 1, x: 5, y: 15, code: "const analyze = async ()" },
    { id: 2, x: 12, y: 45, code: "await model.embed(data)" },
    { id: 3, x: 8, y: 70, code: "return similarity.score" },
    { id: 4, x: 75, y: 10, code: "interface Candidate {" },
    { id: 5, x: 82, y: 25, code: "  matchScore: number" },
    { id: 6, x: 88, y: 40, code: "  skills: string[]" },
    { id: 7, x: 78, y: 55, code: "}" },
    { id: 8, x: 85, y: 68, code: "function rankCandidates()" },
    { id: 9, x: 20, y: 80, code: ".sort((a, b) => b - a)" },
    { id: 10, x: 65, y: 85, code: "AI.process(resume)" },
    { id: 11, x: 3, y: 30, code: "const embedding = tf.tensor" },
    { id: 12, x: 90, y: 78, code: "export default Resume" },
    { id: 13, x: 15, y: 60, code: "if (score > threshold)" },
    { id: 14, x: 70, y: 35, code: "candidates.filter(c =>" },
    { id: 15, x: 25, y: 25, code: "import { TensorFlow }" },
    { id: 16, x: 60, y: 75, code: "const jdVector = await" },
    { id: 17, x: 35, y: 90, code: "return topMatches.slice(0,5)" },
    { id: 18, x: 50, y: 8, code: "type MatchResult = {" },
];

export default function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
    const flashlightRadius = 200; // Radius of the flashlight effect

    // Track mouse position for flashlight effect
    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    }, []);

    const handleMouseLeave = useCallback(() => {
        setMousePos({ x: -1000, y: -1000 });
    }, []);

    // Calculate opacity based on distance from mouse (flashlight effect)
    const getChipOpacity = (chipX: number, chipY: number) => {
        if (!containerRef.current) return 0;
        const rect = containerRef.current.getBoundingClientRect();
        const chipAbsX = (chipX / 100) * rect.width;
        const chipAbsY = (chipY / 100) * rect.height;

        const distance = Math.sqrt(
            Math.pow(mousePos.x - chipAbsX, 2) + Math.pow(mousePos.y - chipAbsY, 2)
        );

        // Closer = more visible, farther = less visible
        if (distance > flashlightRadius * 1.5) return 0;
        if (distance < flashlightRadius * 0.3) return 0.7;
        return Math.max(0, 0.7 - (distance / (flashlightRadius * 1.5)) * 0.7);
    };

    return (
        <section
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative min-h-screen overflow-hidden bg-[#0a0a0f]"
        >
            {/* Background Grid */}
            <div className="absolute inset-0 grid-background opacity-30" />

            {/* Star Field */}
            <div className="star-field">
                {[...Array(80)].map((_, i) => (
                    <div
                        key={i}
                        className="star"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            opacity: Math.random() * 0.4 + 0.1,
                        }}
                    />
                ))}
            </div>

            {/* Code Chips - scattered across hero, revealed by flashlight cursor */}
            {codeChips.map((chip) => (
                <div
                    key={chip.id}
                    className="absolute font-mono text-xs px-3 py-1.5 rounded-md pointer-events-none select-none transition-opacity duration-200"
                    style={{
                        left: `${chip.x}%`,
                        top: `${chip.y}%`,
                        opacity: getChipOpacity(chip.x, chip.y),
                        color: "rgba(139, 92, 246, 0.9)",
                        background: "rgba(139, 92, 246, 0.08)",
                        border: "1px solid rgba(139, 92, 246, 0.15)",
                        backdropFilter: "blur(4px)",
                        textShadow: "0 0 8px rgba(139, 92, 246, 0.4)",
                        transform: "translateX(-50%) translateY(-50%)",
                        whiteSpace: "nowrap",
                        zIndex: 5,
                    }}
                >
                    {chip.code}
                </div>
            ))}

            {/* Cursor Glow Effect (flashlight) */}
            <div
                className="absolute pointer-events-none transition-opacity duration-100"
                style={{
                    left: mousePos.x,
                    top: mousePos.y,
                    width: flashlightRadius * 2,
                    height: flashlightRadius * 2,
                    transform: "translate(-50%, -50%)",
                    background: `radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, rgba(59, 130, 246, 0.08) 40%, transparent 70%)`,
                    opacity: mousePos.x > 0 ? 1 : 0,
                    zIndex: 4,
                }}
            />

            {/* ============= LIGHT BEAM EFFECT ============= */}
            <div className="beam-wrapper">
                {/* Mist at the top where beam originates */}
                <div className="beam-mist-top" />

                {/* Main visible beam */}
                <div className="beam-core" />

                {/* Beam glow layers */}
                <div className="beam-glow-1" />
                <div className="beam-glow-2" />
                <div className="beam-glow-3" />

                {/* Flowing particles in beam */}
                <div className="beam-particles">
                    {[...Array(12)].map((_, i) => (
                        <div
                            key={i}
                            className="beam-particle"
                            style={{
                                animationDelay: `${i * 0.3}s`,
                                left: `${45 + Math.random() * 10}%`,
                            }}
                        />
                    ))}
                </div>

                {/* Mist around beam */}
                <div className="beam-mist-left" />
                <div className="beam-mist-right" />

                {/* Spread effect at bottom where beam hits dashboard */}
                <div className="beam-spread" />
                <div className="beam-splash-ring" />
                <div className="beam-splash-ring delay-1" />
                <div className="beam-splash-ring delay-2" />
            </div>

            {/* Main Content - Split Layout */}
            <div className="relative z-20 max-w-7xl mx-auto px-6 pt-32 pb-20 min-h-screen flex flex-col">
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8 flex-1">
                    {/* Left Side - Text Content */}
                    <div className="flex-1 max-w-xl">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                            <span className="text-sm text-gray-300">
                                AI-Powered Recruitment
                            </span>
                        </div>

                        {/* Main Headline */}
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6">
                            <span className="gradient-text">Transform Your</span>
                            <br />
                            <span className="text-white">Hiring Process</span>
                        </h1>

                        {/* Subheadline */}
                        <p className="text-lg text-gray-400 mb-10 leading-relaxed max-w-md">
                            HireSight uses advanced AI and semantic analysis to instantly rank
                            candidates against your job descriptions. Find the perfect match
                            in seconds, not hours.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-start gap-4">
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
                    </div>

                    {/* Right Side - spacer */}
                    <div className="flex-1 hidden lg:block" />
                </div>

                {/* Dashboard Preview */}
                <div className="relative mt-auto pt-16 flex justify-center">
                    <div className="dashboard-preview relative z-10 w-full max-w-5xl overflow-visible px-8">
                        <div className="bg-[#111118] rounded-xl border border-white/10 overflow-hidden shadow-2xl">
                            {/* Window Header */}
                            <div className="flex items-center justify-between px-4 py-3 bg-[#0a0a0f] border-b border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        HireSight Dashboard
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center">
                                        <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center">
                                        <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Dashboard Content */}
                            <div className="p-5 grid grid-cols-12 gap-5">
                                {/* Enhanced Sidebar */}
                                <div className="col-span-3 space-y-4">
                                    {/* Active Job */}
                                    <div className="p-3 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
                                        <div className="text-xs text-blue-400 mb-1">Active Job</div>
                                        <div className="text-sm font-medium text-white truncate">Sr. ML Engineer</div>
                                        <div className="text-xs text-gray-500 mt-1">5 candidates</div>
                                    </div>

                                    {/* Navigation Items */}
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 text-white text-xs">
                                            <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                            Rankings
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-400 text-xs hover:bg-white/5 transition-colors">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            Job Postings
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-400 text-xs hover:bg-white/5 transition-colors">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            History
                                        </div>
                                    </div>

                                    {/* Quick Stats */}
                                    <div className="p-3 bg-white/5 rounded-lg">
                                        <div className="text-xs text-gray-400 mb-2">Today's Stats</div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="text-center p-2 bg-white/5 rounded">
                                                <div className="text-lg font-bold text-green-400">12</div>
                                                <div className="text-[10px] text-gray-500">Analyzed</div>
                                            </div>
                                            <div className="text-center p-2 bg-white/5 rounded">
                                                <div className="text-lg font-bold text-blue-400">3</div>
                                                <div className="text-[10px] text-gray-500">Shortlisted</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Main Content */}
                                <div className="col-span-9 space-y-4">
                                    {/* Search Bar */}
                                    <div className="flex gap-3">
                                        <div className="flex-1 h-10 bg-white/5 rounded-lg flex items-center px-3 gap-2">
                                            <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                            <span className="text-xs text-gray-500">Search candidates...</span>
                                        </div>
                                        <div className="h-10 px-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center gap-2 text-white text-xs font-medium">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                            </svg>
                                            Upload
                                        </div>
                                    </div>

                                    {/* Enhanced Candidate Cards */}
                                    {[
                                        { name: "Sarah Chen", role: "ML Engineer", score: 95, color: "green", skills: ["Python", "TensorFlow", "AWS"], exp: "5 yrs" },
                                        { name: "Alex Kumar", role: "Data Scientist", score: 89, color: "blue", skills: ["Python", "PyTorch", "SQL"], exp: "4 yrs" },
                                        { name: "Jordan Lee", role: "Backend Dev", score: 82, color: "blue", skills: ["Node.js", "Go", "K8s"], exp: "3 yrs" },
                                    ].map((candidate, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-white/5 hover:bg-white/[0.07] transition-colors"
                                        >
                                            {/* Rank Badge */}
                                            <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center text-xs font-bold text-gray-400">
                                                {i + 1}
                                            </div>
                                            {/* Avatar */}
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-sm font-medium text-white">
                                                {candidate.name.split(" ").map(n => n[0]).join("")}
                                            </div>
                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium text-white">{candidate.name}</span>
                                                    <span className="text-xs text-gray-500">• {candidate.exp}</span>
                                                </div>
                                                <div className="text-xs text-gray-500">{candidate.role}</div>
                                                {/* Skills Tags */}
                                                <div className="flex gap-1 mt-1.5">
                                                    {candidate.skills.map((skill, j) => (
                                                        <span key={j} className="px-1.5 py-0.5 text-[10px] bg-white/10 text-gray-400 rounded">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            {/* Score */}
                                            <div className="flex flex-col items-end gap-1">
                                                <div
                                                    className={`px-3 py-1 rounded-full text-xs font-bold ${candidate.color === "green"
                                                        ? "bg-green-500/20 text-green-400"
                                                        : "bg-blue-500/20 text-blue-400"
                                                        }`}
                                                >
                                                    {candidate.score}%
                                                </div>
                                                <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${candidate.color === "green" ? "bg-green-500" : "bg-blue-500"}`}
                                                        style={{ width: `${candidate.score}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Floating Cards - Repositioned inside container */}
                        <div
                            className="absolute left-0 top-8 glass-card p-3 rounded-xl animate-float hidden lg:block"
                            style={{ animationDelay: "0.5s" }}
                        >
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-xs font-medium">Analyzed</p>
                                    <p className="text-[10px] text-gray-400">95% Match</p>
                                </div>
                            </div>
                        </div>

                        <div
                            className="absolute right-0 top-16 glass-card p-3 rounded-xl animate-float hidden lg:block"
                            style={{ animationDelay: "1s" }}
                        >
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-xs font-medium">AI Active</p>
                                    <p className="text-[10px] text-gray-400">Processing</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Gradient Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0a0a0f] to-transparent pointer-events-none z-30" />
        </section>
    );
}
