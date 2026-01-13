"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function CTASection() {
    const sectionRef = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.2 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative py-32 overflow-hidden bg-[#0a0a0f]"
        >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#111118] to-[#0a0a0f]" />

            {/* Ambient Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-white/20 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animation: `pulse ${2 + Math.random() * 3}s ease-in-out infinite`,
                            animationDelay: `${Math.random() * 2}s`,
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    {/* Glowing Orb */}
                    <div
                        className={`flex-shrink-0 transition-all duration-1000 ${isVisible
                            ? "opacity-100 translate-x-0"
                            : "opacity-0 -translate-x-12"
                            }`}
                    >
                        <div className="relative">
                            {/* Outer Glow */}
                            <div className="absolute inset-0 scale-150 rounded-full bg-gradient-to-r from-orange-500/20 via-purple-500/20 to-blue-500/20 blur-3xl" />

                            {/* Main Orb */}
                            <div className="glowing-orb">
                                {/* Inner Content */}
                                <div className="absolute inset-[24px] rounded-full bg-gradient-to-br from-[#1a1a24] to-[#0a0a0f] flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                            <svg
                                                className="w-8 h-8 text-white"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1.5}
                                                    d="M13 10V3L4 14h7v7l9-11h-7z"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Orbiting Elements */}
                            <div
                                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
                                style={{ animation: "rotate 15s linear infinite" }}
                            >
                                <div className="w-4 h-4 rounded-full bg-orange-500 shadow-lg shadow-orange-500/50" />
                            </div>
                            <div
                                className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"
                                style={{
                                    animation: "rotate 15s linear infinite reverse",
                                }}
                            >
                                <div className="w-3 h-3 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50" />
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div
                        className={`flex-1 text-center lg:text-left transition-all duration-1000 delay-200 ${isVisible
                            ? "opacity-100 translate-x-0"
                            : "opacity-0 translate-x-12"
                            }`}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                            Join the
                            <br />
                            <span className="gradient-text-orange">Movement</span>
                        </h2>

                        <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                            Unlock the future of recruitment with HireSight. Transform how you
                            discover, evaluate, and hire top talent. The journey starts here.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                            <Link href="/login" className="btn-primary">
                                Get Started
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

                            <a
                                href="#features"
                                className="btn-secondary"
                            >
                                Learn More
                            </a>
                        </div>

                        {/* Trust Indicators */}
                        <div className="mt-10 flex items-center gap-4 justify-center lg:justify-start">
                            {/* Star Rating */}
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <svg
                                        key={i}
                                        className="w-5 h-5 text-amber-400"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <div className="text-sm text-gray-400">
                                <span className="text-white font-medium">Loved</span> by early adopters
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
