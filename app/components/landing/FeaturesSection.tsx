"use client";

import { useEffect, useRef, useState } from "react";

const features = [
    {
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
            </svg>
        ),
        title: "Smart JD Analysis",
        description:
            "Our AI parses job descriptions to extract key skills, requirements, and preferences automatically.",
        color: "blue",
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342"
                />
            </svg>
        ),
        title: "Semantic Matching",
        description:
            "Using TensorFlow embeddings to understand context, not just keywords. Find truly qualified candidates.",
        color: "purple",
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                />
            </svg>
        ),
        title: "Instant Rankings",
        description:
            "Get real-time candidate rankings with detailed match scores. No more manual resume screening.",
        color: "orange",
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
            </svg>
        ),
        title: "Detailed Reports",
        description:
            "Export comprehensive PDF reports with skill breakdowns, experience analysis, and recommendations.",
        color: "cyan",
    },
];

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
    blue: {
        bg: "bg-blue-500/10",
        text: "text-blue-400",
        border: "border-blue-500/20",
    },
    purple: {
        bg: "bg-purple-500/10",
        text: "text-purple-400",
        border: "border-purple-500/20",
    },
    orange: {
        bg: "bg-orange-500/10",
        text: "text-orange-400",
        border: "border-orange-500/20",
    },
    cyan: {
        bg: "bg-cyan-500/10",
        text: "text-cyan-400",
        border: "border-cyan-500/20",
    },
};

export default function FeaturesSection() {
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
            id="features"
            ref={sectionRef}
            className="relative py-32 section-gradient"
        >
            {/* Background Elements */}
            <div className="absolute inset-0 grid-background opacity-30" />

            <div className="relative z-10 max-w-6xl mx-auto px-6">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2
                        className={`text-4xl md:text-5xl font-bold mb-6 transition-all duration-700 ${isVisible
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-8"
                            }`}
                    >
                        Unmatched <span className="gradient-text-blue">Efficiency</span>
                    </h2>
                    <p
                        className={`text-lg text-gray-400 max-w-2xl mx-auto transition-all duration-700 delay-100 ${isVisible
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-8"
                            }`}
                    >
                        HireSight combines cutting-edge AI with intuitive design to
                        revolutionize how you screen candidates.
                    </p>
                </div>

                {/* Feature Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {features.map((feature, index) => {
                        const colors = colorMap[feature.color];
                        return (
                            <div
                                key={feature.title}
                                className={`glass-card p-8 rounded-2xl transition-all duration-700 ${isVisible
                                        ? "opacity-100 translate-y-0"
                                        : "opacity-0 translate-y-12"
                                    }`}
                                style={{ transitionDelay: `${150 + index * 100}ms` }}
                            >
                                {/* Icon */}
                                <div
                                    className={`w-14 h-14 rounded-xl ${colors.bg} ${colors.border} border flex items-center justify-center mb-6 icon-glow ${colors.text}`}
                                >
                                    {feature.icon}
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-semibold text-white mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-400 leading-relaxed">
                                    {feature.description}
                                </p>

                                {/* Subtle Hover Effect Indicator */}
                                <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
                                    <span className={`w-1.5 h-1.5 rounded-full ${colors.bg}`} />
                                    <span>Learn more</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom Stats */}
                <div
                    className={`mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 transition-all duration-700 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                        }`}
                >
                    {[
                        { value: "95%", label: "Accuracy Rate" },
                        { value: "10x", label: "Faster Screening" },
                        { value: "500+", label: "Companies Trust Us" },
                        { value: "1M+", label: "Resumes Analyzed" },
                    ].map((stat) => (
                        <div key={stat.label} className="text-center">
                            <div className="text-3xl md:text-4xl font-bold gradient-text-blue mb-2">
                                {stat.value}
                            </div>
                            <div className="text-sm text-gray-500">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
