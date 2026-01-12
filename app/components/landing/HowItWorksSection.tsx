"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const steps = [
    {
        number: "01",
        title: "Upload Job Description",
        description:
            "Paste your job description or upload a PDF. Our AI extracts key requirements, skills, and qualifications automatically.",
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
            </svg>
        ),
        gradient: "from-blue-500 to-blue-600",
        bgGlow: "bg-blue-500",
    },
    {
        number: "02",
        title: "Add Candidate Resumes",
        description:
            "Upload multiple resumes at once. We support batch processing and can handle hundreds of candidates simultaneously.",
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
            </svg>
        ),
        gradient: "from-purple-500 to-purple-600",
        bgGlow: "bg-purple-500",
    },
    {
        number: "03",
        title: "Get AI-Powered Rankings",
        description:
            "Receive instant candidate rankings with detailed match scores, skill analysis, and actionable hiring recommendations.",
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
            </svg>
        ),
        gradient: "from-emerald-500 to-emerald-600",
        bgGlow: "bg-emerald-500",
    },
];

export default function HowItWorksSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const [activeStep, setActiveStep] = useState(0);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    // Handle scroll-based progress
    const handleScroll = useCallback(() => {
        if (!sectionRef.current) return;

        const section = sectionRef.current;
        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top;
        const sectionHeight = rect.height;
        const windowHeight = window.innerHeight;

        // Calculate how far through the section we've scrolled
        const startOffset = windowHeight * 0.3;
        const scrolled = startOffset - sectionTop;
        const scrollableDistance = sectionHeight - windowHeight * 0.5;

        if (scrolled < 0) {
            setScrollProgress(0);
            setActiveStep(0);
        } else if (scrolled >= scrollableDistance) {
            setScrollProgress(100);
            setActiveStep(2);
        } else {
            const progress = (scrolled / scrollableDistance) * 100;
            setScrollProgress(Math.min(100, Math.max(0, progress)));

            // Determine active step based on progress
            if (progress < 33) {
                setActiveStep(0);
            } else if (progress < 66) {
                setActiveStep(1);
            } else {
                setActiveStep(2);
            }
        }
    }, []);

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

        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            observer.disconnect();
            window.removeEventListener("scroll", handleScroll);
        };
    }, [handleScroll]);

    return (
        <section
            ref={sectionRef}
            id="how-it-works"
            className="relative py-32 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden"
        >
            {/* Background Decorations */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Subtle grid pattern */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />

                {/* Floating orbs */}
                <div className="absolute top-20 left-[10%] w-72 h-72 bg-blue-200/30 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-[10%] w-64 h-64 bg-purple-200/30 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-100/20 rounded-full blur-3xl" />
            </div>

            {/* Header */}
            <div className="relative z-10 max-w-4xl mx-auto px-6 text-center mb-20">
                <div
                    className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                        }`}
                >
                    <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-sm font-medium text-blue-600 rounded-full mb-4">
                        Simple Process
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                        How It{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                            Works
                        </span>
                    </h2>
                    <p className="text-gray-500 text-lg max-w-xl mx-auto">
                        Three simple steps to transform your hiring process. No complex setup, no learning curve.
                    </p>
                </div>
            </div>

            {/* Steps Container */}
            <div className="relative z-10 max-w-5xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
                    {/* Progress Track - Left Side on Desktop */}
                    <div className="hidden lg:flex lg:col-span-1 justify-center">
                        <div className="relative h-full w-1">
                            {/* Background Track */}
                            <div className="absolute inset-0 w-1 bg-gray-200 rounded-full" />

                            {/* Animated Progress Fill */}
                            <div
                                ref={progressRef}
                                className="absolute top-0 left-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-emerald-500 rounded-full transition-all duration-300 ease-out"
                                style={{ height: `${scrollProgress}%` }}
                            />

                            {/* Glowing Orb at Progress Point */}
                            <div
                                className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white shadow-lg transition-all duration-300 ease-out"
                                style={{ top: `${scrollProgress}%`, transform: `translate(-50%, -50%)` }}
                            >
                                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse" />
                            </div>
                        </div>
                    </div>

                    {/* Steps Content - Right Side on Desktop */}
                    <div className="lg:col-span-11 space-y-24 lg:space-y-32">
                        {steps.map((step, index) => (
                            <div
                                key={index}
                                className={`relative transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                                    }`}
                                style={{ transitionDelay: `${200 + index * 150}ms` }}
                            >
                                {/* Step Card */}
                                <div
                                    className={`relative flex flex-col lg:flex-row items-start gap-6 lg:gap-10 p-8 rounded-3xl transition-all duration-500 ${activeStep >= index
                                            ? "bg-white shadow-xl shadow-gray-200/50"
                                            : "bg-gray-50/50"
                                        }`}
                                >
                                    {/* Icon Container */}
                                    <div className="relative flex-shrink-0">
                                        {/* Glow Effect */}
                                        <div
                                            className={`absolute inset-0 rounded-2xl blur-xl transition-all duration-500 ${activeStep >= index ? `${step.bgGlow} opacity-30` : "opacity-0"
                                                }`}
                                        />

                                        {/* Icon Box */}
                                        <div
                                            className={`relative w-16 h-16 lg:w-20 lg:h-20 rounded-2xl flex items-center justify-center transition-all duration-500 ${activeStep >= index
                                                    ? `bg-gradient-to-br ${step.gradient} text-white shadow-lg`
                                                    : "bg-gray-100 text-gray-400"
                                                }`}
                                        >
                                            {step.icon}

                                            {/* Pulse Ring Animation */}
                                            {activeStep === index && (
                                                <>
                                                    <div
                                                        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.gradient} opacity-50 animate-ping`}
                                                    />
                                                </>
                                            )}
                                        </div>

                                        {/* Step Number Badge */}
                                        <div
                                            className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${activeStep >= index
                                                    ? "bg-white text-gray-900 shadow-md"
                                                    : "bg-gray-200 text-gray-500"
                                                }`}
                                        >
                                            {step.number}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <h3
                                            className={`text-xl lg:text-2xl font-bold mb-3 transition-colors duration-500 ${activeStep >= index ? "text-gray-900" : "text-gray-400"
                                                }`}
                                        >
                                            {step.title}
                                        </h3>
                                        <p
                                            className={`text-base lg:text-lg leading-relaxed transition-colors duration-500 ${activeStep >= index ? "text-gray-600" : "text-gray-400"
                                                }`}
                                        >
                                            {step.description}
                                        </p>

                                        {/* Feature Pills */}
                                        {activeStep >= index && (
                                            <div className="flex flex-wrap gap-2 mt-4">
                                                {index === 0 && (
                                                    <>
                                                        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full">AI Parsing</span>
                                                        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full">Auto-Extract</span>
                                                    </>
                                                )}
                                                {index === 1 && (
                                                    <>
                                                        <span className="px-3 py-1 bg-purple-50 text-purple-600 text-sm rounded-full">Batch Upload</span>
                                                        <span className="px-3 py-1 bg-purple-50 text-purple-600 text-sm rounded-full">100+ Files</span>
                                                    </>
                                                )}
                                                {index === 2 && (
                                                    <>
                                                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-sm rounded-full">Instant</span>
                                                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-sm rounded-full">95% Accuracy</span>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Progress Indicator for Mobile */}
                                    <div className="lg:hidden absolute left-0 top-0 bottom-0 w-1 rounded-full overflow-hidden">
                                        <div
                                            className={`w-full transition-all duration-500 ${activeStep >= index
                                                    ? `bg-gradient-to-b ${step.gradient} h-full`
                                                    : "bg-gray-200 h-full"
                                                }`}
                                        />
                                    </div>
                                </div>

                                {/* Connecting Line - Mobile */}
                                {index < steps.length - 1 && (
                                    <div className="lg:hidden flex justify-center py-4">
                                        <div className="w-0.5 h-16 bg-gradient-to-b from-gray-200 to-gray-100" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom CTA */}
            <div
                className={`relative z-10 max-w-4xl mx-auto px-6 mt-20 text-center transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
                style={{ transitionDelay: "600ms" }}
            >
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-medium shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all cursor-pointer group">
                    <span>Start Screening Now</span>
                    <svg
                        className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </div>
            </div>
        </section>
    );
}
