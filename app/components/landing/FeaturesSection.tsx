"use client";

import { useEffect, useRef, useState } from "react";

// Feature data with visual previews
const features = [
    {
        id: 1,
        title: "Smart JD Analysis",
        description: "Our AI parses job descriptions to extract key skills, requirements, and preferences automatically.",
        size: "large", // large = spans 2 columns on desktop
    },
    {
        id: 2,
        title: "Semantic Matching",
        description: "Using TensorFlow embeddings to understand context, not just keywords. Find truly qualified candidates.",
        size: "large",
    },
    {
        id: 3,
        title: "Instant Rankings",
        description: "Get real-time candidate rankings with detailed match scores. No more manual resume screening.",
        size: "medium",
    },
    {
        id: 4,
        title: "Detailed Reports",
        description: "Export comprehensive PDF reports with skill breakdowns, experience analysis, and recommendations.",
        size: "medium",
    },
];

export default function FeaturesSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [hoveredTile, setHoveredTile] = useState<number | null>(null);

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
            id="features"
            className="relative py-24 bg-[#fafafa] overflow-hidden"
        >
            {/* Header */}
            <div className="max-w-6xl mx-auto px-6 mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    Unmatched <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Efficiency</span>
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl">
                    HireSight combines cutting-edge AI with intuitive design to revolutionize how you screen candidates.
                </p>
            </div>

            {/* Feature Tiles Grid */}
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Tile 1: Smart JD Analysis */}
                    <div
                        className={`group relative rounded-2xl overflow-hidden bg-[#1a1a24] transition-all duration-500 cursor-pointer ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                            }`}
                        style={{ transitionDelay: "0ms" }}
                        onMouseEnter={() => setHoveredTile(1)}
                        onMouseLeave={() => setHoveredTile(null)}
                    >
                        {/* Tile Content */}
                        <div className="relative h-72 p-6">
                            {/* Background Glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            {/* Interactive Preview - Command Palette Style */}
                            <div className={`relative transition-transform duration-500 ${hoveredTile === 1 ? "scale-[1.02]" : "scale-100"}`}>
                                {/* Search/Command Bar */}
                                <div className="bg-[#252530] rounded-lg border border-white/10 shadow-2xl overflow-hidden">
                                    <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        <span className="text-sm text-gray-300">Paste job description...</span>
                                        <div className="ml-auto px-2 py-0.5 bg-white/10 rounded text-[10px] text-gray-400">⌘V</div>
                                    </div>

                                    {/* Extracted Skills */}
                                    <div className="p-4 space-y-2">
                                        <div className="text-xs text-gray-500 mb-2">EXTRACTED REQUIREMENTS</div>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">Python (5+ yrs)</span>
                                            <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">Machine Learning</span>
                                            <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">TensorFlow</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded text-xs">AWS/GCP</span>
                                            <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-xs">Docker</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating Analysis Badge */}
                                <div className={`absolute -right-2 top-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg transition-all duration-300 ${hoveredTile === 1 ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
                                    }`}>
                                    AI Parsing...
                                </div>
                            </div>
                        </div>

                        {/* Title & Description */}
                        <div className="p-6 pt-0">
                            <h3 className="text-lg font-semibold text-white mb-2">Smart JD Analysis</h3>
                            <p className="text-sm text-gray-400">{features[0].description}</p>
                        </div>
                    </div>

                    {/* Tile 2: Semantic Matching */}
                    <div
                        className={`group relative rounded-2xl overflow-hidden bg-[#1a1a24] transition-all duration-500 cursor-pointer ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                            }`}
                        style={{ transitionDelay: "100ms" }}
                        onMouseEnter={() => setHoveredTile(2)}
                        onMouseLeave={() => setHoveredTile(null)}
                    >
                        <div className="relative h-72 p-6">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            {/* Matching Visualization */}
                            <div className={`relative transition-transform duration-500 ${hoveredTile === 2 ? "scale-[1.02]" : "scale-100"}`}>
                                <div className="bg-[#252530] rounded-lg border border-white/10 p-4 shadow-2xl">
                                    {/* Neural Network Style Connections */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex flex-col gap-2">
                                            <div className="px-3 py-1.5 bg-blue-500/20 rounded text-xs text-blue-300 border border-blue-500/30">Job Description</div>
                                            <div className="px-3 py-1.5 bg-purple-500/20 rounded text-xs text-purple-300 border border-purple-500/30">Required Skills</div>
                                        </div>

                                        {/* Connection Lines SVG */}
                                        <svg className="w-16 h-16" viewBox="0 0 64 64">
                                            <path d="M0 16 L64 24" stroke="rgba(59,130,246,0.4)" strokeWidth="2" fill="none" className={`transition-all duration-500 ${hoveredTile === 2 ? "stroke-blue-400" : ""}`} />
                                            <path d="M0 32 L64 32" stroke="rgba(139,92,246,0.4)" strokeWidth="2" fill="none" className={`transition-all duration-500 ${hoveredTile === 2 ? "stroke-purple-400" : ""}`} />
                                            <path d="M0 48 L64 40" stroke="rgba(236,72,153,0.4)" strokeWidth="2" fill="none" className={`transition-all duration-500 ${hoveredTile === 2 ? "stroke-pink-400" : ""}`} />
                                        </svg>

                                        <div className="flex flex-col gap-2">
                                            <div className="px-3 py-1.5 bg-green-500/20 rounded text-xs text-green-300 border border-green-500/30">Resume Data</div>
                                            <div className="px-3 py-1.5 bg-cyan-500/20 rounded text-xs text-cyan-300 border border-cyan-500/30">Candidate Skills</div>
                                        </div>
                                    </div>

                                    {/* Match Score */}
                                    <div className="text-center pt-2 border-t border-white/5">
                                        <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">94% Match</div>
                                        <div className="text-xs text-gray-500">Semantic Similarity</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 pt-0">
                            <h3 className="text-lg font-semibold text-white mb-2">Semantic Matching</h3>
                            <p className="text-sm text-gray-400">{features[1].description}</p>
                        </div>
                    </div>

                    {/* Tile 3: Instant Rankings */}
                    <div
                        className={`group relative rounded-2xl overflow-hidden bg-[#1a1a24] transition-all duration-500 cursor-pointer ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                            }`}
                        style={{ transitionDelay: "200ms" }}
                        onMouseEnter={() => setHoveredTile(3)}
                        onMouseLeave={() => setHoveredTile(null)}
                    >
                        <div className="relative h-72 p-6">
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-600/10 to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            {/* Rankings Preview */}
                            <div className={`relative transition-transform duration-500 ${hoveredTile === 3 ? "scale-[1.02]" : "scale-100"}`}>
                                <div className="bg-[#252530] rounded-lg border border-white/10 overflow-hidden shadow-2xl">
                                    {/* Mini Header */}
                                    <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border-b border-white/5">
                                        <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                        </svg>
                                        <span className="text-xs text-gray-300">Live Rankings</span>
                                    </div>

                                    {/* Candidate List */}
                                    <div className="p-3 space-y-2">
                                        {[
                                            { rank: 1, name: "Sarah Chen", score: 95, change: "+2" },
                                            { rank: 2, name: "Alex Kim", score: 91, change: "0" },
                                            { rank: 3, name: "Jordan Lee", score: 87, change: "-1" },
                                        ].map((c, i) => (
                                            <div key={i} className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${hoveredTile === 3 && i === 0 ? "bg-amber-500/10" : "bg-white/5"
                                                }`}>
                                                <span className={`w-5 h-5 rounded flex items-center justify-center text-xs font-bold ${c.rank === 1 ? "bg-amber-500 text-black" : "bg-white/10 text-gray-400"
                                                    }`}>{c.rank}</span>
                                                <span className="text-sm text-white flex-1">{c.name}</span>
                                                <span className="text-xs text-green-400">{c.score}%</span>
                                                <span className={`text-[10px] ${c.change.startsWith("+") ? "text-green-400" : c.change === "0" ? "text-gray-500" : "text-red-400"}`}>
                                                    {c.change}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Lightning Badge */}
                                <div className={`absolute -left-2 bottom-4 flex items-center gap-1 bg-amber-500 text-black px-2 py-1 rounded-full text-[10px] font-bold shadow-lg transition-all duration-300 ${hoveredTile === 3 ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
                                    }`}>
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    Instant
                                </div>
                            </div>
                        </div>

                        <div className="p-6 pt-0">
                            <h3 className="text-lg font-semibold text-white mb-2">Instant Rankings</h3>
                            <p className="text-sm text-gray-400">{features[2].description}</p>
                        </div>
                    </div>

                    {/* Tile 4: Detailed Reports - with glowing orb effect like Huly */}
                    <div
                        className={`group relative rounded-2xl overflow-hidden bg-[#1a1a24] transition-all duration-500 cursor-pointer ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                            }`}
                        style={{ transitionDelay: "300ms" }}
                        onMouseEnter={() => setHoveredTile(4)}
                        onMouseLeave={() => setHoveredTile(null)}
                    >
                        <div className="relative h-72 p-6 flex items-center justify-center">
                            {/* Glowing Orb Background */}
                            <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${hoveredTile === 4 ? "opacity-100" : "opacity-60"
                                }`}>
                                <div className="w-48 h-48 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-600/30 blur-3xl" />
                            </div>

                            {/* Report Preview */}
                            <div className={`relative transition-transform duration-500 ${hoveredTile === 4 ? "scale-[1.02]" : "scale-100"}`}>
                                <div className="bg-[#252530] rounded-lg border border-white/10 p-4 shadow-2xl w-full max-w-xs">
                                    {/* PDF Header */}
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-8 h-8 rounded bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
                                                <path d="M14 2v6h6" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="text-sm text-white font-medium">Candidate_Report.pdf</div>
                                            <div className="text-[10px] text-gray-500">Generated just now</div>
                                        </div>
                                    </div>

                                    {/* Report Sections */}
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 p-2 bg-white/5 rounded">
                                            <div className="w-2 h-2 rounded-full bg-green-400" />
                                            <span className="text-xs text-gray-300">Skills Analysis</span>
                                            <span className="ml-auto text-[10px] text-gray-500">Page 1-3</span>
                                        </div>
                                        <div className="flex items-center gap-2 p-2 bg-white/5 rounded">
                                            <div className="w-2 h-2 rounded-full bg-blue-400" />
                                            <span className="text-xs text-gray-300">Experience Match</span>
                                            <span className="ml-auto text-[10px] text-gray-500">Page 4-5</span>
                                        </div>
                                        <div className="flex items-center gap-2 p-2 bg-white/5 rounded">
                                            <div className="w-2 h-2 rounded-full bg-purple-400" />
                                            <span className="text-xs text-gray-300">Recommendations</span>
                                            <span className="ml-auto text-[10px] text-gray-500">Page 6</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 pt-0">
                            <h3 className="text-lg font-semibold text-white mb-2">Detailed Reports</h3>
                            <p className="text-sm text-gray-400">{features[3].description}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Row */}
            <div className="max-w-6xl mx-auto px-6 mt-20">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { value: "95%", label: "Accuracy Rate", color: "text-blue-600" },
                        { value: "10x", label: "Faster Screening", color: "text-purple-600" },
                        { value: "99%", label: "Satisfaction Rate", color: "text-cyan-600" },
                        { value: "1K+", label: "Resumes Analyzed", color: "text-pink-600" },
                    ].map((stat, i) => (
                        <div
                            key={i}
                            className={`text-center transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                                }`}
                            style={{ transitionDelay: `${400 + i * 100}ms` }}
                        >
                            <div className={`text-4xl md:text-5xl font-bold ${stat.color}`}>
                                {stat.value}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
