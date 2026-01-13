"use client";

import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] via-[#0d0d14] to-[#0a0a0f] text-gray-100">
            {/* Background effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
                {/* Header */}
                <header className="border-b border-white/10 bg-black/30 backdrop-blur-xl sticky top-0 z-50">
                    <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg shadow-purple-500/30">
                                H
                            </div>
                            <span className="text-xl font-bold text-white">HireSight</span>
                        </Link>
                        <Link
                            href="/login"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            <ArrowLeftIcon className="w-4 h-4" />
                            Back to Login
                        </Link>
                    </div>
                </header>

                {/* Content */}
                <main className="max-w-4xl mx-auto px-6 py-16">
                    <div className="mb-12">
                        <h1 className="text-4xl font-bold text-white mb-4">Terms of Use</h1>
                        <p className="text-gray-400">Last updated: January 13, 2026</p>
                    </div>

                    <div className="space-y-10">
                        {/* Introduction */}
                        <section className="bg-white/5 rounded-2xl p-8 backdrop-blur-xl border border-white/10">
                            <h2 className="text-xl font-semibold text-white mb-4">1. Agreement to Terms</h2>
                            <p className="text-gray-300 leading-relaxed">
                                By accessing or using HireSight&apos;s AI-powered resume screening platform (&quot;Service&quot;), you agree to be
                                bound by these Terms of Use. If you disagree with any part of these terms, you may not access the Service.
                            </p>
                        </section>

                        {/* Use License */}
                        <section className="bg-white/5 rounded-2xl p-8 backdrop-blur-xl border border-white/10">
                            <h2 className="text-xl font-semibold text-white mb-4">2. Use License</h2>
                            <p className="text-gray-300 leading-relaxed mb-4">
                                Subject to these Terms, we grant you a limited, non-exclusive, non-transferable, revocable license to:
                            </p>
                            <ul className="space-y-2 text-gray-300">
                                <li className="flex items-start gap-3">
                                    <span className="w-2 h-2 mt-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex-shrink-0" />
                                    Access and use the Service for your internal business hiring purposes
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-2 h-2 mt-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex-shrink-0" />
                                    Upload and process resumes through our AI screening technology
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-2 h-2 mt-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex-shrink-0" />
                                    View and export ranking results for your hiring decisions
                                </li>
                            </ul>
                        </section>

                        {/* Restrictions */}
                        <section className="bg-white/5 rounded-2xl p-8 backdrop-blur-xl border border-white/10">
                            <h2 className="text-xl font-semibold text-white mb-4">3. Restrictions</h2>
                            <p className="text-gray-300 leading-relaxed mb-4">You agree not to:</p>
                            <ul className="space-y-2 text-gray-300">
                                <li className="flex items-start gap-3">
                                    <span className="w-2 h-2 mt-2 rounded-full bg-red-500 flex-shrink-0" />
                                    Use the Service for any illegal or unauthorized purpose
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-2 h-2 mt-2 rounded-full bg-red-500 flex-shrink-0" />
                                    Attempt to reverse engineer, decompile, or extract source code
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-2 h-2 mt-2 rounded-full bg-red-500 flex-shrink-0" />
                                    Share your account credentials with third parties
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-2 h-2 mt-2 rounded-full bg-red-500 flex-shrink-0" />
                                    Use automated scripts or bots to access the Service
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-2 h-2 mt-2 rounded-full bg-red-500 flex-shrink-0" />
                                    Upload malicious files or content designed to harm our systems
                                </li>
                            </ul>
                        </section>

                        {/* AI & Data Processing */}
                        <section className="bg-white/5 rounded-2xl p-8 backdrop-blur-xl border border-white/10">
                            <h2 className="text-xl font-semibold text-white mb-4">4. AI Processing & Data Handling</h2>
                            <p className="text-gray-300 leading-relaxed mb-4">
                                Our Service uses artificial intelligence to analyze and rank resumes. You acknowledge that:
                            </p>
                            <ul className="space-y-2 text-gray-300">
                                <li className="flex items-start gap-3">
                                    <span className="w-2 h-2 mt-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex-shrink-0" />
                                    AI recommendations are advisory and should not be the sole basis for hiring decisions
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-2 h-2 mt-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex-shrink-0" />
                                    You retain full responsibility for final hiring decisions
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-2 h-2 mt-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex-shrink-0" />
                                    You have obtained proper consent to process candidate data
                                </li>
                            </ul>
                        </section>

                        {/* Account */}
                        <section className="bg-white/5 rounded-2xl p-8 backdrop-blur-xl border border-white/10">
                            <h2 className="text-xl font-semibold text-white mb-4">5. Your Account</h2>
                            <p className="text-gray-300 leading-relaxed">
                                You are responsible for maintaining the confidentiality of your account and password, and for
                                restricting access to your computer. You agree to accept responsibility for all activities that
                                occur under your account. We reserve the right to refuse service, terminate accounts, or remove
                                content at our sole discretion.
                            </p>
                        </section>

                        {/* Intellectual Property */}
                        <section className="bg-white/5 rounded-2xl p-8 backdrop-blur-xl border border-white/10">
                            <h2 className="text-xl font-semibold text-white mb-4">6. Intellectual Property</h2>
                            <p className="text-gray-300 leading-relaxed">
                                The Service and its original content (excluding user-uploaded content), features, and functionality
                                are and will remain the exclusive property of HireSight and its licensors. The Service is protected
                                by copyright, trademark, and other laws. Our trademarks may not be used without prior written consent.
                            </p>
                        </section>

                        {/* Disclaimer */}
                        <section className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl p-8 border border-amber-500/20">
                            <h2 className="text-xl font-semibold text-amber-400 mb-4">7. Disclaimer of Warranties</h2>
                            <p className="text-gray-300 leading-relaxed">
                                THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS
                                OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
                                PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED,
                                SECURE, OR ERROR-FREE.
                            </p>
                        </section>

                        {/* Limitation */}
                        <section className="bg-white/5 rounded-2xl p-8 backdrop-blur-xl border border-white/10">
                            <h2 className="text-xl font-semibold text-white mb-4">8. Limitation of Liability</h2>
                            <p className="text-gray-300 leading-relaxed">
                                In no event shall HireSight, its directors, employees, partners, or affiliates be liable for any
                                indirect, incidental, special, consequential, or punitive damages, including without limitation,
                                loss of profits, data, or goodwill, arising out of your use of the Service.
                            </p>
                        </section>

                        {/* Changes */}
                        <section className="bg-white/5 rounded-2xl p-8 backdrop-blur-xl border border-white/10">
                            <h2 className="text-xl font-semibold text-white mb-4">9. Changes to Terms</h2>
                            <p className="text-gray-300 leading-relaxed">
                                We reserve the right to modify these terms at any time. We will notify you of significant changes
                                by posting a notice on our Service. Your continued use of the Service after such modifications
                                constitutes your acceptance of the updated terms.
                            </p>
                        </section>

                        {/* Contact */}
                        <section className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-8 border border-blue-500/20">
                            <h2 className="text-xl font-semibold text-blue-400 mb-4">10. Contact Us</h2>
                            <p className="text-gray-300 leading-relaxed mb-4">
                                If you have any questions about these Terms, please contact us:
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link
                                    href="/contact"
                                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all"
                                >
                                    Contact Support
                                </Link>
                                <a
                                    href="mailto:legal@hiresight.ai"
                                    className="px-6 py-3 bg-white/5 border border-white/10 text-white font-medium rounded-xl hover:bg-white/10 transition-all"
                                >
                                    legal@hiresight.ai
                                </a>
                            </div>
                        </section>
                    </div>
                </main>

                {/* Footer */}
                <footer className="border-t border-white/10 py-8 mt-16">
                    <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-gray-500 text-sm">
                        <p>© 2026 HireSight. All rights reserved.</p>
                        <div className="flex gap-6">
                            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
                            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
