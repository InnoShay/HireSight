"use client";

import { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "633a36a0-818a-41fe-a996-c2dad7bca8f6",
                    name: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                    subject: `HireSight Contact: ${formData.subject}`,
                    message: formData.message,
                    from_name: "HireSight Contact Form",
                }),
            });

            const result = await response.json();

            if (result.success) {
                setSubmitted(true);
                setFormData({ firstName: "", lastName: "", email: "", subject: "", message: "" });
            } else {
                setError("Failed to send message. Please try again.");
            }
        } catch {
            setError("Something went wrong. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 grid-background opacity-20" />
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

            {/* Main Content - Split Layout */}
            <main className="relative z-10 min-h-[calc(100vh-88px)] flex">
                {/* Left Panel - Purple Gradient */}
                <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden">
                    {/* Gradient Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800" />

                    {/* Decorative Elements */}
                    <div className="absolute inset-0">
                        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl" />
                        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-400/10 rounded-full blur-3xl" />
                    </div>

                    {/* Floating Orbs */}
                    <div className="absolute top-32 right-16 w-4 h-4 bg-white/30 rounded-full animate-float" style={{ animationDelay: "0s" }} />
                    <div className="absolute top-48 left-20 w-3 h-3 bg-white/20 rounded-full animate-float" style={{ animationDelay: "1s" }} />
                    <div className="absolute bottom-40 right-32 w-5 h-5 bg-white/25 rounded-full animate-float" style={{ animationDelay: "2s" }} />
                    <div className="absolute bottom-60 left-28 w-2 h-2 bg-white/30 rounded-full animate-float" style={{ animationDelay: "0.5s" }} />

                    {/* Content */}
                    <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16">
                        <h1 className="text-4xl xl:text-5xl font-bold leading-tight mb-6">
                            Let&apos;s Build Something
                            <br />
                            <span className="text-purple-200">Amazing Together</span>
                        </h1>
                        <p className="text-lg text-purple-100/80 mb-10 max-w-md">
                            Have a question about HireSight? Want to partner with us?
                            Or just want to say hello? We&apos;d love to hear from you.
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-purple-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-purple-200/60">Email us at</p>
                                    <a href="mailto:luckyjournals@gmail.com" className="text-white hover:text-purple-200 transition-colors">
                                        luckyjournals@gmail.com
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-purple-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-purple-200/60">Response time</p>
                                    <p className="text-white">Within 24 hours</p>
                                </div>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="mt-12">
                            <p className="text-sm text-purple-200/60 mb-4">Connect with us</p>
                            <div className="flex gap-3">
                                <a
                                    href="https://www.linkedin.com/in/innoshay/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                                >
                                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                    </svg>
                                </a>
                                <a
                                    href="https://github.com/InnoShay"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                                >
                                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Form */}
                <div className="flex-1 flex items-center justify-center px-6 lg:px-16 py-12">
                    <div className="w-full max-w-lg">
                        {/* Mobile Header */}
                        <div className="lg:hidden mb-8">
                            <h1 className="text-3xl font-bold mb-2">Get in Touch</h1>
                            <p className="text-gray-400">We&apos;d love to hear from you</p>
                        </div>

                        {/* Form Card */}
                        <div className="glass-card rounded-2xl p-8 relative overflow-hidden">
                            {/* Subtle gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 pointer-events-none" />

                            <div className="relative z-10">
                                <div className="hidden lg:block mb-8">
                                    <h2 className="text-2xl font-semibold mb-2">Get in Touch</h2>
                                    <p className="text-gray-400 text-sm">We&apos;ll get back to you soon!</p>
                                </div>

                                {submitted ? (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                                            <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                                        <p className="text-gray-400 mb-6">Thank you for reaching out. We&apos;ll respond within 24 hours.</p>
                                        <button
                                            onClick={() => {
                                                setSubmitted(false);
                                                setFormData({ firstName: "", lastName: "", email: "", subject: "", message: "" });
                                            }}
                                            className="text-purple-400 hover:text-purple-300 transition-colors"
                                        >
                                            Send another message
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        {/* Name Fields */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm text-gray-400 mb-2">First Name</label>
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    value={formData.firstName}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="Enter your first name"
                                                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-400 mb-2">Last Name</label>
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    value={formData.lastName}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="Enter your last name"
                                                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                                                />
                                            </div>
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-2">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                placeholder="you@example.com"
                                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                                            />
                                        </div>

                                        {/* Subject */}
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-2">Subject</label>
                                            <select
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all appearance-none cursor-pointer"
                                                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 1rem center", backgroundSize: "1rem" }}
                                            >
                                                <option value="" className="bg-[#111118]">Select a subject</option>
                                                <option value="general" className="bg-[#111118]">General Inquiry</option>
                                                <option value="partnership" className="bg-[#111118]">Partnership</option>
                                                <option value="support" className="bg-[#111118]">Technical Support</option>
                                                <option value="feedback" className="bg-[#111118]">Feedback</option>
                                                <option value="other" className="bg-[#111118]">Other</option>
                                            </select>
                                        </div>

                                        {/* Message */}
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-2">Message</label>
                                            <textarea
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                required
                                                rows={4}
                                                placeholder="Tell us how we can help..."
                                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all resize-none"
                                            />
                                        </div>

                                        {/* Error Message */}
                                        {error && (
                                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                                {error}
                                            </div>
                                        )}

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full py-3.5 rounded-lg bg-white text-[#0a0a0f] font-semibold hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                    </svg>
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    Send Message
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                    </svg>
                                                </>
                                            )}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>

                        {/* Mobile Contact Info */}
                        <div className="lg:hidden mt-8 text-center">
                            <p className="text-gray-400 text-sm mb-2">Or email us directly at</p>
                            <a href="mailto:luckyjournals@gmail.com" className="text-purple-400 hover:text-purple-300 transition-colors">
                                luckyjournals@gmail.com
                            </a>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
