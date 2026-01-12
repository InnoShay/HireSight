"use client";

import { useEffect, useRef, useState } from "react";

const steps = [
    {
        number: "01",
        title: "Upload Job Description",
        description:
            "Paste your job description or upload a PDF. Our AI extracts key requirements, skills, and qualifications automatically.",
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
            </svg>
        ),
    },
    {
        number: "02",
        title: "Add Candidate Resumes",
        description:
            "Upload multiple resumes at once. We support batch processing and can handle hundreds of candidates simultaneously.",
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
            </svg>
        ),
    },
    {
        number: "03",
        title: "Get AI-Powered Rankings",
        description:
            "Receive instant candidate rankings with detailed match scores, skill analysis, and actionable hiring recommendations.",
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
            </svg>
        ),
    },
];

export default function HowItWorksSection() {
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
            id="how-it-works"
            ref={sectionRef}
            className="relative py-32 bg-[#0a0a0f]"
        >
            {/* Background Grid */}
            <div className="absolute inset-0 grid-background opacity-30" />

            {/* Accent Glow */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

            <div className="relative z-10 max-w-5xl mx-auto px-6">
                {/* Section Header */}
                <div className="text-center mb-20">
                    <h2
                        className={`text-4xl md:text-5xl font-bold mb-6 transition-all duration-700 ${isVisible
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-8"
                            }`}
                    >
                        How It <span className="gradient-text-blue">Works</span>
                    </h2>
                    <p
                        className={`text-lg text-gray-400 max-w-2xl mx-auto transition-all duration-700 delay-100 ${isVisible
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-8"
                            }`}
                    >
                        Three simple steps to transform your hiring process. No complex
                        setup, no learning curve.
                    </p>
                </div>

                {/* Steps */}
                <div className="relative">
                    {/* Connecting Line */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/50 via-purple-500/50 to-orange-500/50 hidden md:block" />

                    {/* Step Cards */}
                    <div className="space-y-16 md:space-y-24">
                        {steps.map((step, index) => (
                            <div
                                key={step.number}
                                className={`relative flex flex-col md:flex-row items-center gap-8 transition-all duration-700 ${isVisible
                                        ? "opacity-100 translate-y-0"
                                        : "opacity-0 translate-y-12"
                                    } ${index % 2 === 1 ? "md:flex-row-reverse" : ""}`}
                                style={{ transitionDelay: `${200 + index * 150}ms` }}
                            >
                                {/* Content */}
                                <div
                                    className={`flex-1 text-center md:text-left ${index % 2 === 1 ? "md:text-right" : ""
                                        }`}
                                >
                                    <div
                                        className={`inline-block text-sm font-mono text-gray-500 mb-3 ${index % 2 === 1 ? "md:ml-auto" : ""
                                            }`}
                                    >
                                        STEP {step.number}
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-400 leading-relaxed max-w-md mx-auto md:mx-0">
                                        {step.description}
                                    </p>
                                </div>

                                {/* Center Icon */}
                                <div className="relative z-10 order-first md:order-none">
                                    <div
                                        className={`w-20 h-20 rounded-2xl flex items-center justify-center ${index === 0
                                                ? "bg-blue-500/20 text-blue-400"
                                                : index === 1
                                                    ? "bg-purple-500/20 text-purple-400"
                                                    : "bg-orange-500/20 text-orange-400"
                                            } border ${index === 0
                                                ? "border-blue-500/30"
                                                : index === 1
                                                    ? "border-purple-500/30"
                                                    : "border-orange-500/30"
                                            } shadow-lg`}
                                    >
                                        {step.icon}
                                    </div>

                                    {/* Pulse Ring */}
                                    <div
                                        className={`absolute inset-0 rounded-2xl animate-pulse ${index === 0
                                                ? "bg-blue-500/10"
                                                : index === 1
                                                    ? "bg-purple-500/10"
                                                    : "bg-orange-500/10"
                                            }`}
                                        style={{ animationDelay: `${index * 0.5}s` }}
                                    />
                                </div>

                                {/* Illustration Space */}
                                <div className="flex-1 hidden md:block">
                                    {/* Placeholder for potential illustrations */}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom CTA */}
                <div
                    className={`mt-24 text-center transition-all duration-700 delay-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                        }`}
                >
                    <p className="text-gray-400 mb-6">
                        Ready to streamline your hiring process?
                    </p>
                    <a href="/login" className="btn-primary inline-flex">
                        Start Free Trial
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
                    </a>
                </div>
            </div>
        </section>
    );
}
