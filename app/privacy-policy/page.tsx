"use client";

import Link from "next/link";

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 grid-background opacity-20" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-purple-500/10 via-blue-500/5 to-transparent blur-3xl" />
            </div>

            {/* Navigation */}
            <nav className="relative z-50 flex items-center justify-between px-6 lg:px-12 py-6">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-sm">
                        H
                    </div>
                    <span className="text-xl font-bold tracking-tight group-hover:text-blue-400 transition-colors">
                        HireSight
                    </span>
                </Link>
                <Link
                    href="/"
                    className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Home
                </Link>
            </nav>

            {/* Main Content */}
            <main className="relative z-10 max-w-4xl mx-auto px-6 lg:px-12 py-12 pb-24">
                {/* Header */}
                <div className="mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
                        <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span className="text-sm text-purple-300">Legal Document</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="gradient-text">Privacy Policy</span>
                    </h1>
                    <p className="text-lg text-gray-400">
                        Last updated: January 13, 2026
                    </p>
                </div>

                {/* Content Sections */}
                <div className="space-y-12">
                    {/* Introduction */}
                    <section className="glass-card rounded-2xl p-8">
                        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">1</span>
                            Introduction
                        </h2>
                        <p className="text-gray-300 leading-relaxed">
                            Welcome to HireSight. We are committed to protecting your personal information and your right to privacy.
                            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our
                            AI-powered resume screening platform. Please read this policy carefully to understand our views and practices
                            regarding your personal data.
                        </p>
                    </section>

                    {/* Information We Collect */}
                    <section className="glass-card rounded-2xl p-8">
                        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">2</span>
                            Information We Collect
                        </h2>
                        <div className="space-y-4 text-gray-300">
                            <p className="leading-relaxed">We may collect the following types of information:</p>
                            <ul className="space-y-3 ml-4">
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                                    <span><strong className="text-white">Account Information:</strong> Name, email address, and login credentials when you create an account.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                                    <span><strong className="text-white">Resume Data:</strong> Resumes and job descriptions you upload for analysis, processed temporarily for AI matching.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                                    <span><strong className="text-white">Usage Data:</strong> Information about how you interact with our platform, including features used and time spent.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                                    <span><strong className="text-white">Device Information:</strong> Browser type, IP address, and device identifiers for security and optimization.</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* How We Use Your Information */}
                    <section className="glass-card rounded-2xl p-8">
                        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">3</span>
                            How We Use Your Information
                        </h2>
                        <div className="space-y-4 text-gray-300">
                            <p className="leading-relaxed">We use the information we collect to:</p>
                            <ul className="space-y-3 ml-4">
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                                    <span>Provide, operate, and maintain our AI resume screening services</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                                    <span>Process and analyze resumes against job descriptions using semantic AI</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                                    <span>Improve and personalize your experience on our platform</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                                    <span>Communicate with you about updates, security alerts, and support</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                                    <span>Detect, prevent, and address technical issues and security threats</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Data Security */}
                    <section className="glass-card rounded-2xl p-8">
                        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">4</span>
                            Data Security
                        </h2>
                        <p className="text-gray-300 leading-relaxed">
                            We implement industry-standard security measures to protect your data. All data transmissions are encrypted
                            using SSL/TLS protocols. Resume files are processed in secure, isolated environments and are not stored
                            permanently on our servers. We regularly audit our security practices and maintain strict access controls
                            for our team members.
                        </p>
                    </section>

                    {/* Data Retention */}
                    <section className="glass-card rounded-2xl p-8">
                        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">5</span>
                            Data Retention
                        </h2>
                        <p className="text-gray-300 leading-relaxed">
                            We retain your personal information only for as long as necessary to fulfill the purposes outlined in this
                            policy. Uploaded resumes are processed in real-time and are automatically deleted from our servers within
                            24 hours of analysis completion. Account data is retained until you request deletion or close your account.
                        </p>
                    </section>

                    {/* Your Rights */}
                    <section className="glass-card rounded-2xl p-8">
                        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">6</span>
                            Your Rights
                        </h2>
                        <div className="space-y-4 text-gray-300">
                            <p className="leading-relaxed">You have the right to:</p>
                            <ul className="space-y-3 ml-4">
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                                    <span>Access and receive a copy of your personal data</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                                    <span>Request correction of inaccurate personal data</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                                    <span>Request deletion of your personal data</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                                    <span>Withdraw consent for data processing at any time</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Contact */}
                    <section className="glass-card rounded-2xl p-8">
                        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">7</span>
                            Contact Us
                        </h2>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            If you have any questions about this Privacy Policy or our data practices, please contact us:
                        </p>
                        <a
                            href="mailto:luckyjournals@gmail.com"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:bg-purple-500/30 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            luckyjournals@gmail.com
                        </a>
                    </section>
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 border-t border-white/5 py-8">
                <div className="max-w-4xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-500">
                        © 2026 HireSight. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link href="/privacy-policy" className="text-sm text-gray-400 hover:text-white transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">
                            Contact Us
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
