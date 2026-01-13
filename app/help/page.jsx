"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
    BookOpenIcon,
    QuestionMarkCircleIcon,
    CommandLineIcon,
    ChatBubbleLeftRightIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    RocketLaunchIcon,
    LightBulbIcon,
    DocumentTextIcon,
    EnvelopeIcon
} from "@heroicons/react/24/outline";
import ThemeToggle from "../components/ThemeToggle";
import Sidebar from "../components/Sidebar";
import AuthGuard from "../components/AuthGuard";

function HelpContent() {
    const searchParams = useSearchParams();
    const tabFromUrl = searchParams.get("tab");

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState(tabFromUrl || "getting-started");
    const [expandedFaq, setExpandedFaq] = useState(null);

    // Watch for URL tab parameter changes
    useEffect(() => {
        if (tabFromUrl) {
            setActiveTab(tabFromUrl);
        }
    }, [tabFromUrl]);

    const tabs = [
        { id: "getting-started", name: "Getting Started", icon: RocketLaunchIcon },
        { id: "faq", name: "FAQ", icon: QuestionMarkCircleIcon },
        { id: "shortcuts", name: "Keyboard Shortcuts", icon: CommandLineIcon },
        { id: "contact", name: "Contact Support", icon: ChatBubbleLeftRightIcon },
    ];

    const faqs = [
        {
            q: "How does HireSight analyze resumes?",
            a: "HireSight uses advanced AI models to understand the context and semantics of both your job description and candidate resumes. It extracts key skills, experience, and qualifications to calculate a comprehensive match score."
        },
        {
            q: "What file formats are supported?",
            a: "Currently, HireSight supports PDF files for both job descriptions and resumes. We recommend using PDFs for the best text extraction quality."
        },
        {
            q: "How accurate is the ranking?",
            a: "Our AI achieves high accuracy by using semantic understanding rather than just keyword matching. However, we recommend using the rankings as a starting point and always reviewing candidates personally."
        },
        {
            q: "Is my data secure?",
            a: "Yes! All data is encrypted in transit and at rest. We use Firebase's enterprise-grade security, and your documents are never shared with third parties."
        },
        {
            q: "Can I export my results?",
            a: "Absolutely! You can export your ranking results as CSV or PDF from the results page. This makes it easy to share with your team."
        },
        {
            q: "What's the minimum number of resumes needed?",
            a: "You need at least 3 resumes to run a ranking session. This ensures meaningful comparisons between candidates."
        }
    ];

    const shortcuts = [
        { keys: ["⌘", "K"], action: "Quick search" },
        { keys: ["⌘", "D"], action: "Go to Dashboard" },
        { keys: ["⌘", "H"], action: "View History" },
        { keys: ["⌘", "S"], action: "Open Settings" },
        { keys: ["⌘", "Enter"], action: "Start Ranking" },
        { keys: ["Esc"], action: "Close modal" },
    ];

    const gettingStarted = [
        {
            step: 1,
            title: "Add Your Job Description",
            desc: "Paste your job description or upload a PDF. Use the AI Improvise feature to enhance it.",
            icon: DocumentTextIcon
        },
        {
            step: 2,
            title: "Upload Candidate Resumes",
            desc: "Upload multiple PDF resumes. We support batch processing for efficiency.",
            icon: BookOpenIcon
        },
        {
            step: 3,
            title: "Get Instant Rankings",
            desc: "Click 'Rank Candidates' and let our AI analyze and score each candidate.",
            icon: RocketLaunchIcon
        },
        {
            step: 4,
            title: "Review & Export",
            desc: "Review detailed insights for each candidate and export results as needed.",
            icon: LightBulbIcon
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-[#0a0a0f] dark:via-[#0d0d14] dark:to-[#0a0a0f] transition-colors duration-300">
            {/* Background */}
            <div className="fixed inset-0 opacity-30 dark:opacity-20 pointer-events-none">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(100,100,100,0.15) 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                }} />
            </div>

            <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-cyan-500/10 dark:bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <main className={`relative z-10 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"} min-h-screen`}>
                <header className="flex justify-between items-center px-8 py-6">
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                            Help & Documentation
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Learn how to use HireSight effectively</p>
                    </div>
                    <ThemeToggle />
                </header>

                <div className="max-w-4xl mx-auto px-8 pb-12">
                    {/* Tabs */}
                    <div className="flex flex-wrap gap-2 mb-8">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === tab.id
                                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                                    : "bg-white/60 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-200/50 dark:border-white/10"
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.name}
                            </button>
                        ))}
                    </div>

                    {/* Getting Started */}
                    {activeTab === "getting-started" && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
                                <h2 className="text-2xl font-bold mb-2">Welcome to HireSight! 👋</h2>
                                <p className="text-blue-100">Let's get you started with AI-powered resume screening in just a few steps.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {gettingStarted.map((item) => (
                                    <div key={item.step} className="relative group">
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        <div className="relative bg-white/80 dark:bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-gray-200/50 dark:border-white/10 shadow-xl shadow-gray-200/30 dark:shadow-none">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/25">
                                                    {item.step}
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-800 dark:text-white mb-1">{item.title}</h3>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* FAQ */}
                    {activeTab === "faq" && (
                        <div className="space-y-4 animate-fadeIn">
                            {faqs.map((faq, i) => (
                                <div key={i} className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 shadow-lg shadow-gray-200/30 dark:shadow-none overflow-hidden">
                                    <button
                                        onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                                        className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                    >
                                        <span className="font-medium text-gray-800 dark:text-white pr-4">{faq.q}</span>
                                        {expandedFaq === i ? (
                                            <ChevronUpIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                        ) : (
                                            <ChevronDownIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                        )}
                                    </button>
                                    {expandedFaq === i && (
                                        <div className="px-5 pb-5 animate-fadeIn">
                                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{faq.a}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Shortcuts */}
                    {activeTab === "shortcuts" && (
                        <div className="animate-fadeIn">
                            <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 shadow-xl shadow-gray-200/30 dark:shadow-none p-6">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">Keyboard Shortcuts</h3>
                                <div className="space-y-3">
                                    {shortcuts.map((shortcut, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-xl">
                                            <div className="flex items-center gap-2">
                                                {shortcut.keys.map((key, j) => (
                                                    <span key={j}>
                                                        <kbd className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-lg text-sm font-mono text-gray-600 dark:text-gray-300 shadow-sm">
                                                            {key}
                                                        </kbd>
                                                        {j < shortcut.keys.length - 1 && <span className="mx-1 text-gray-400">+</span>}
                                                    </span>
                                                ))}
                                            </div>
                                            <span className="text-sm text-gray-600 dark:text-gray-400">{shortcut.action}</span>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-400 mt-4">Note: Use Ctrl instead of ⌘ on Windows</p>
                            </div>
                        </div>
                    )}

                    {/* Contact */}
                    {activeTab === "contact" && (
                        <div className="animate-fadeIn">
                            <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 shadow-xl shadow-gray-200/30 dark:shadow-none p-8">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Contact Support</h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-6">We're here to help! Reach out to us with any questions.</p>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-500/10 dark:to-purple-500/10 rounded-xl border border-blue-100 dark:border-blue-500/20">
                                        <EnvelopeIcon className="w-8 h-8 text-blue-500" />
                                        <div>
                                            <p className="font-medium text-gray-800 dark:text-white">Email Us</p>
                                            <a href="mailto:luckyjournals@gmail.com" className="text-blue-500 hover:underline">luckyjournals@gmail.com</a>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            <strong>Response time:</strong> We typically respond within 24-48 hours during business days.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default function HelpPage() {
    return (
        <AuthGuard>
            <HelpContent />
        </AuthGuard>
    );
}
