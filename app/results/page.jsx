"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
    TrophyIcon,
    ChartBarIcon,
    DocumentTextIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    ArrowLeftIcon,
    ArrowDownTrayIcon,
    XMarkIcon,
    CheckCircleIcon,
    ArrowRightCircleIcon
} from "@heroicons/react/24/solid";
import ThemeToggle from "../components/ThemeToggle";

export default function ResultsPage() {
    const router = useRouter();
    const [data, setData] = useState(null);
    const [viewMode, setViewMode] = useState("cards"); // 'cards' or 'leaderboard'
    const [expandedRow, setExpandedRow] = useState(null); // For accordion
    const [selectedForCompare, setSelectedForCompare] = useState([]);
    const [showCompareModal, setShowCompareModal] = useState(false);

    const toggleCompare = (id) => {
        if (selectedForCompare.includes(id)) {
            setSelectedForCompare(prev => prev.filter(cId => cId !== id));
        } else {
            if (selectedForCompare.length >= 2) {
                // If 2 already selected, replace the first one (FIFO) implies a smoother UX than alerting
                // But user requested "Compare any two", so alert is safer or just blocking.
                // Let's allow max 2.
                alert("You can only compare 2 candidates at a time. Unselect one to add another.");
                return;
            }
            setSelectedForCompare(prev => [...prev, id]);
        }
    };

    useEffect(() => {
        // Retrieve data from session storage
        const storedData = sessionStorage.getItem("rankingResults");
        if (!storedData) {
            router.push("/dashboard");
            return;
        }
        try {
            setData(JSON.parse(storedData));
        } catch (e) {
            console.error("Failed to parse ranking data", e);
            router.push("/dashboard");
        }
    }, [router]);

    if (!data) return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading results...</div>;

    const { ranked: candidates, jdAnalysis } = data;

    // Helper for toggle
    const toggleRow = (id) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    // --- Export Functions ---
    const exportCSV = () => {
        const headers = ["Rank,Filename,Score,Matched Keywords,Missing Keywords,Experience Years,Summary"];
        const rows = candidates.map((c, i) => {
            const ai = c.aiAnalysis || {};
            return [
                i + 1,
                `"${c.filename}"`,
                (c.score * 100).toFixed(2) + "%",
                `"${(ai.matchedKeywords || []).join(", ")}"`,
                `"${(ai.missingKeywords || []).join(", ")}"`,
                ai.experienceYears || "-",
                `"${(ai.summary || "").replace(/"/g, '""')}"` // Escape quotes
            ].join(",");
        });
        const csvContent = headers.concat(rows).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `HireSight_Report_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text("HireSight Ranking Report", 14, 20);
        doc.setFontSize(11);
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 28);

        const tableColumn = ["Rank", "Candidate", "Score", "Experience", "Summary"];
        const tableRows = candidates.map((c, i) => [
            i + 1,
            c.filename,
            (c.score * 100).toFixed(0) + "%",
            (c.aiAnalysis?.experienceYears || "-") + " yrs",
            c.aiAnalysis?.summary || ""
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 35,
            styles: { fontSize: 9 },
            headStyles: { fillColor: [79, 70, 229] } // Indigo-600
        });

        doc.save(`HireSight_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
    };
    // ------------------------

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-gray-100 transition-colors duration-200">
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30 shadow-sm transition-colors duration-200">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => router.push("/dashboard")}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors text-gray-500 dark:text-gray-400"
                        >
                            <ArrowLeftIcon className="w-5 h-5" />
                        </button>
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                            Ranking Results
                        </h1>
                    </div>

                    <div className="flex items-center space-x-3">
                        <ThemeToggle />
                        {/* Export Buttons */}
                        <div className="flex bg-gray-100 dark:bg-slate-800 rounded-lg p-1 mr-2 transition-colors">
                            <button onClick={exportCSV} className="px-3 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm rounded transition-all flex items-center gap-1">
                                <ArrowDownTrayIcon className="w-3 h-3" /> CSV
                            </button>
                            <div className="w-px bg-gray-300 dark:bg-gray-600 my-1 mx-1"></div>
                            <button onClick={exportPDF} className="px-3 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm rounded transition-all flex items-center gap-1">
                                <ArrowDownTrayIcon className="w-3 h-3" /> PDF
                            </button>
                        </div>

                        <div className="flex items-center space-x-2 bg-gray-100 dark:bg-slate-800 p-1 rounded-lg transition-colors">
                            <button
                                onClick={() => setViewMode("cards")}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${viewMode === "cards"
                                    ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                                    }`}
                            >
                                <div className="flex items-center space-x-2">
                                    <DocumentTextIcon className="w-4 h-4" />
                                    <span>Cards</span>
                                </div>
                            </button>
                            <button
                                onClick={() => setViewMode("leaderboard")}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${viewMode === "leaderboard"
                                    ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                                    }`}
                            >
                                <div className="flex items-center space-x-2">
                                    <TrophyIcon className="w-4 h-4" />
                                    <span>Leaderboard</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto p-6 md:p-8">

                {/* Top Stats / Context */}
                <section className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide">Total Candidates</h3>
                        <p className="text-3xl font-extrabold text-slate-700 mt-1">{candidates.length}</p>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide">Must-Have Skills (JD)</h3>
                        <div className="flex flex-wrap gap-1 mt-2">
                            {jdAnalysis?.must_have_skills?.length > 0
                                ? jdAnalysis.must_have_skills.slice(0, 10).map((s, i) => (
                                    <span key={i} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md border border-indigo-100">
                                        {s}
                                    </span>
                                ))
                                : <span className="text-sm text-gray-400">None detected</span>
                            }
                        </div>
                        {/* Good to have & Soft skills row */}
                        <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-x-4 gap-y-2">
                            {jdAnalysis?.good_to_have_skills?.length > 0 && (
                                <div className="flex items-center gap-1">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase">Good-to-Have:</span>
                                    <span className="text-xs text-gray-600">
                                        {jdAnalysis.good_to_have_skills.slice(0, 5).join(", ")}
                                    </span>
                                </div>
                            )}
                            {jdAnalysis?.soft_skills?.length > 0 && (
                                <div className="flex items-center gap-1">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase">Soft Skills:</span>
                                    <span className="text-xs text-gray-600">
                                        {jdAnalysis.soft_skills.slice(0, 5).join(", ")}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden group flex flex-col justify-between">
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <TrophyIcon className="w-20 h-20 text-yellow-500" />
                        </div>

                        <div className="z-10 relative">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide">Top Performer</h3>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <TrophyIcon className="w-5 h-5 text-yellow-500" />
                                        <span className="font-bold text-gray-900 text-lg truncate max-w-[200px]" title={candidates[0]?.filename}>
                                            {candidates[0]?.filename}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                                Ranked <span className="font-bold text-indigo-600">#1</span> because matches <strong className="text-indigo-600">
                                    {(() => {
                                        const mustHaves = jdAnalysis?.must_have_skills || [];
                                        const matches = candidates[0]?.aiAnalysis?.matchedKeywords || [];
                                        // Count matches that appear in must_have_skills (case-insensitive)
                                        const strictCount = matches.filter(m => mustHaves.some(mh => mh.toLowerCase() === m.toLowerCase())).length;
                                        // Fallback: if strict count is 0 but there are matches, maybe strict check failed, so clamp length? 
                                        // Better to just clamp to unique size to be safe UI-wise if strings don't align perfectly
                                        return Math.min(strictCount || matches.length, mustHaves.length);
                                    })()}
                                    /{jdAnalysis?.must_have_skills?.length || 0}</strong> key skills, has <strong className="text-indigo-600">{candidates[0]?.aiAnalysis?.experienceYears || "0"} years</strong> exp.
                            </p>
                        </div>

                        {/* Statistical Rings Row */}
                        <div className="flex items-center justify-between mt-6 z-10 relative px-2">
                            {/* Ring 1: Fit Score */}
                            <div className="flex flex-col items-center gap-2">
                                <div className="relative w-14 h-14">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="28" cy="28" r="22" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-100 dark:text-gray-700" />
                                        <circle cx="28" cy="28" r="22" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-indigo-600"
                                            strokeDasharray={2 * Math.PI * 22}
                                            strokeDashoffset={2 * Math.PI * 22 * (1 - (candidates[0]?.score || 0))}
                                            strokeLinecap="round" />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-800 dark:text-gray-100">
                                        {(candidates[0]?.score * 100).toFixed(0)}%
                                    </div>
                                </div>
                                <span className="text-[10px] uppercase font-bold text-gray-400">Fit Score</span>
                            </div>

                            {/* Ring 2: Skill Match */}
                            <div className="flex flex-col items-center gap-2">
                                <div className="relative w-14 h-14">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="28" cy="28" r="22" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-100 dark:text-gray-700" />
                                        <circle cx="28" cy="28" r="22" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-purple-500"
                                            strokeDasharray={2 * Math.PI * 22}
                                            strokeDashoffset={2 * Math.PI * 22 * (1 - Math.min((() => {
                                                const mustHaves = jdAnalysis?.must_have_skills || [];
                                                const matches = candidates[0]?.aiAnalysis?.matchedKeywords || [];
                                                const strictCount = matches.filter(m => mustHaves.some(mh => mh.toLowerCase() === m.toLowerCase())).length;
                                                return (strictCount || matches.length) / (mustHaves.length || 1);
                                            })(), 1))}
                                            strokeLinecap="round" />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-800 dark:text-gray-100">
                                        {(() => {
                                            const mustHaves = jdAnalysis?.must_have_skills || [];
                                            const matches = candidates[0]?.aiAnalysis?.matchedKeywords || [];
                                            const strictCount = matches.filter(m => mustHaves.some(mh => mh.toLowerCase() === m.toLowerCase())).length;
                                            return Math.min(strictCount || matches.length, mustHaves.length);
                                        })()}/{jdAnalysis?.must_have_skills?.length || 0}
                                    </div>
                                </div>
                                <span className="text-[10px] uppercase font-bold text-gray-400">Skills</span>
                            </div>

                            {/* Ring 3: Experience */}
                            <div className="flex flex-col items-center gap-2">
                                <div className="relative w-14 h-14">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="28" cy="28" r="22" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-100" />
                                        {/* Assuming max 10 years for visual ring, capped at 100% */}
                                        <circle cx="28" cy="28" r="22" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-emerald-500"
                                            strokeDasharray={2 * Math.PI * 22}
                                            strokeDashoffset={2 * Math.PI * 22 * (1 - Math.min((parseFloat(candidates[0]?.aiAnalysis?.experienceYears) || 0) / 10, 1))}
                                            strokeLinecap="round" />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-800">
                                        {candidates[0]?.aiAnalysis?.experienceYears || 0}y
                                    </div>
                                </div>
                                <span className="text-[10px] uppercase font-bold text-gray-400">Exp.</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Metrics Dashboard */}
                <section className="mb-8 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Metrics Dashboard</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                        {/* 1. Skill Match Rate */}
                        <div className="flex flex-col justify-between">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Must-Have Skill Match Rate</h3>
                            <div className="flex items-end gap-2">
                                <span className="text-4xl font-black text-indigo-600">
                                    {(() => {
                                        const passing = candidates.filter(c => {
                                            const matched = c.aiAnalysis?.matchedKeywords?.length || 0;
                                            const total = jdAnalysis?.must_have_skills?.length || 1;
                                            return (matched / total) >= 0.5;
                                        }).length;
                                        return Math.round((passing / candidates.length) * 100) || 0;
                                    })()}%
                                </span>
                                <span className="text-xs text-gray-400 mb-1">of candidates match &gt;50% skills</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2 mt-3">
                                <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${Math.round((candidates.filter(c => (c.aiAnalysis?.matchedKeywords?.length || 0) / (jdAnalysis?.must_have_skills?.length || 1) >= 0.5).length / candidates.length) * 100) || 0}%` }}></div>
                            </div>
                        </div>

                        {/* 2. Top Shared Skills */}
                        <div>
                            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Top Shared Skills</h3>
                            <div className="space-y-2">
                                {Object.entries(candidates.reduce((acc, c) => {
                                    (c.aiAnalysis?.matchedKeywords || []).forEach(k => acc[k] = (acc[k] || 0) + 1);
                                    return acc;
                                }, {}))
                                    .sort((a, b) => b[1] - a[1])
                                    .slice(0, 3)
                                    .map(([skill, count], i) => (
                                        <div key={i} className="flex justify-between items-center text-sm">
                                            <span className="text-gray-700 font-medium">{skill}</span>
                                            <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-bold">{count}</span>
                                        </div>
                                    ))}
                            </div>
                        </div>

                        {/* 3. Most Common Missing */}
                        <div>
                            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Common Missing Skills</h3>
                            <div className="space-y-2">
                                {Object.entries(candidates.reduce((acc, c) => {
                                    (c.aiAnalysis?.missingKeywords || []).forEach(k => acc[k] = (acc[k] || 0) + 1);
                                    return acc;
                                }, {}))
                                    .sort((a, b) => b[1] - a[1])
                                    .slice(0, 3)
                                    .map(([skill, count], i) => (
                                        <div key={i} className="flex justify-between items-center text-sm">
                                            <span className="text-gray-600">{skill}</span>
                                            <span className="bg-red-50 text-red-500 text-xs px-2 py-0.5 rounded-full font-bold">{count}</span>
                                        </div>
                                    ))}
                            </div>
                        </div>

                        {/* 4. Ranking Distribution Chart */}
                        <div>
                            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-4">Score Distribution</h3>
                            <div className="flex items-end justify-between h-24 gap-2">
                                {['<50', '50-70', '70-90', '90+'].map((label, i) => {
                                    const count = candidates.filter(c => {
                                        const s = c.score * 100;
                                        if (i === 0) return s < 50;
                                        if (i === 1) return s >= 50 && s < 70;
                                        if (i === 2) return s >= 70 && s < 90;
                                        if (i === 3) return s >= 90;
                                        return false;
                                    }).length;
                                    const height = candidates.length > 0 ? (count / candidates.length) * 100 : 0;

                                    return (
                                        <div key={label} className="flex flex-col items-center flex-1 group">
                                            <div className="w-full bg-indigo-100 rounded-t-sm relative transition-all duration-500 group-hover:bg-indigo-200" style={{ height: `${Math.max(height, 5)}%` }}>
                                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-[10px] font-bold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {count}
                                                </div>
                                            </div>
                                            <span className="text-[10px] text-gray-400 mt-1 font-medium">{label}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                    </div>
                </section>

                {viewMode === "cards" ? (
                    /* Cards View */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                        {candidates.map((candidate, idx) => {
                            const ai = candidate.aiAnalysis || {};
                            return (
                                <div
                                    key={candidate.id}
                                    className={`relative bg-white rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col ${selectedForCompare.includes(candidate.id) ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-100 shadow-sm hover:shadow-lg'}`}
                                >
                                    {/* Selection Checkbox */}
                                    <div className="absolute top-4 right-4 z-10">
                                        <input
                                            type="checkbox"
                                            checked={selectedForCompare.includes(candidate.id)}
                                            onChange={() => toggleCompare(candidate.id)}
                                            className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center space-x-3">
                                                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg ${idx === 0 ? "bg-yellow-100 text-yellow-700" :
                                                    idx === 1 ? "bg-gray-100 text-gray-600" :
                                                        idx === 2 ? "bg-orange-100 text-orange-700" :
                                                            "bg-slate-100 text-slate-600"
                                                    }`}>
                                                    #{idx + 1}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg text-gray-800 truncate max-w-[200px] md:max-w-xs" title={candidate.filename}>
                                                        {candidate.filename}
                                                    </h3>
                                                    {candidate.isDuplicate && (
                                                        <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                                            Duplicate
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-black text-indigo-600">
                                                    {Math.round(candidate.score * 100)}%
                                                </div>
                                                <div className="text-[10px] text-gray-400 font-semibold uppercase">Fit Score</div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            {/* Keywords */}
                                            <div>
                                                <div className="flex justify-between items-baseline mb-2">
                                                    <p className="text-xs font-semibold text-gray-500 uppercase">Key Matches</p>
                                                    {ai.missingKeywords && ai.missingKeywords.length > 0 && (
                                                        <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider">
                                                            {ai.missingKeywords.length} Missing
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex flex-wrap gap-2">
                                                    {/* Matched */}
                                                    {ai.matchedKeywords && ai.matchedKeywords.length > 0 ? (
                                                        ai.matchedKeywords.slice(0, 10).map((kw, i) => (
                                                            <span key={`match-${i}`} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-md border border-green-100 font-medium">
                                                                {kw}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-xs text-gray-400 italic">No specific keyword matches found</span>
                                                    )}
                                                </div>

                                                {/* Missing Keywords (Red) */}
                                                {ai.missingKeywords && ai.missingKeywords.length > 0 && (
                                                    <div className="mt-2">
                                                        <div className="flex flex-wrap gap-2">
                                                            {ai.missingKeywords.map((kw, i) => (
                                                                <span key={`miss-${i}`} className="px-2 py-1 bg-red-50 text-red-500 text-xs rounded-md border border-red-100 font-medium line-through decoration-red-300">
                                                                    {kw}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Experience */}
                                            <div className="flex items-center justify-between text-sm bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                <span className="text-gray-500">Experience Match</span>
                                                <span className="font-semibold text-gray-800">
                                                    {ai.experienceYears !== "N/A" ? `${ai.experienceYears} Years` : "Not detected"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Accordion Footer */}
                                    <div className="mt-auto border-t border-gray-100">
                                        <button
                                            onClick={() => toggleRow(candidate.id)}
                                            className="w-full flex items-center justify-between p-4 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                                        >
                                            <span className="font-medium">Read Summary & Analysis</span>
                                            {expandedRow === candidate.id ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
                                        </button>

                                        {expandedRow === candidate.id && (
                                            <div className="p-6 bg-slate-50 space-y-4 border-t border-gray-100 animate-slide-down">
                                                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                                    <h4 className="text-xs font-bold text-indigo-500 uppercase mb-2">Resume Summary</h4>
                                                    <p className="text-sm text-gray-700 leading-relaxed">{ai.summary}</p>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="bg-green-50/50 p-4 rounded-xl border border-green-100">
                                                        <h4 className="text-xs font-bold text-green-700 uppercase mb-2">Why High Score?</h4>
                                                        <p className="text-sm text-gray-700 leading-relaxed">{ai.whyHigh}</p>
                                                    </div>
                                                    <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100">
                                                        <h4 className="text-xs font-bold text-amber-700 uppercase mb-2">Improvement Areas</h4>
                                                        <p className="text-sm text-gray-700 leading-relaxed">{ai.improvement}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    /* Leaderboard View */
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                                        <th className="p-4 w-10 text-center">Select</th>
                                        <th className="p-4 w-16 text-center">Rank</th>
                                        <th className="p-4">Candidate Name</th>
                                        <th className="p-4">Score</th>
                                        <th className="p-4">Skill Match</th>
                                        <th className="p-4">Experience</th>
                                        <th className="p-4">Insight</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {candidates.map((candidate, idx) => {
                                        const ai = candidate.aiAnalysis || {};
                                        const skillCount = ai.matchedKeywords?.length || 0;
                                        // Dummy calculation for skill match % if total jd skills known, else just count
                                        const detectedJDSkills = (jdAnalysis?.must_have_skills?.length || 0) + (jdAnalysis?.good_to_have_skills?.length || 0);
                                        const skillMatchPct = detectedJDSkills > 0 ? Math.round((skillCount / detectedJDSkills) * 100) : 0;

                                        return (
                                            <tr key={candidate.id} className={`hover:bg-gray-50 transition-colors group ${selectedForCompare.includes(candidate.id) ? 'bg-indigo-50/50' : ''}`}>
                                                <td className="p-4 text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedForCompare.includes(candidate.id)}
                                                        onChange={() => toggleCompare(candidate.id)}
                                                        className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                                    />
                                                </td>
                                                <td className="p-4 text-center font-bold text-gray-700">
                                                    {idx + 1}
                                                </td>
                                                <td className="p-4 font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                                                    {candidate.filename}
                                                    {candidate.isDuplicate && <span className="ml-2 text-[10px] text-red-500 font-bold bg-red-50 px-1 py-0.5 rounded">DUP</span>}
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="font-bold text-indigo-600">{Math.round(candidate.score * 100)}%</span>
                                                        {/* Mini bar */}
                                                        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${candidate.score * 100}%` }}></div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        {skillMatchPct > 0 ? `${skillMatchPct}%` : `${skillCount} found`}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-sm text-gray-600">
                                                    {ai.experienceYears !== "N/A" ? `${ai.experienceYears}y` : "-"}
                                                </td>
                                                <td className="p-4 text-sm text-gray-500 max-w-xs truncate" title={ai.summary}>
                                                    {ai.summary}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>

            {/* Comparison Floating Bar */}
            {selectedForCompare.length > 0 && (
                <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-2 pl-6 rounded-full flex items-center shadow-2xl z-40 animate-slide-up border border-gray-700">
                    <span className="text-sm font-medium mr-4">{selectedForCompare.length} selected</span>
                    <button
                        onClick={() => setShowCompareModal(true)}
                        disabled={selectedForCompare.length !== 2}
                        className={`flex items-center space-x-2 px-5 py-2 rounded-full font-bold text-sm transition-all shadow-lg ${selectedForCompare.length === 2
                            ? "bg-indigo-600 hover:bg-indigo-500 text-white hover:scale-105"
                            : "bg-gray-800 text-gray-500 cursor-not-allowed"
                            }`}
                    >
                        <span>Compare Candidates</span>
                        <ArrowRightCircleIcon className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setSelectedForCompare([])}
                        className="ml-3 p-2 hover:bg-gray-800 rounded-full text-gray-400 transition-colors"
                        title="Clear selection"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>
            )}

            {/* Comparison Modal */}
            {showCompareModal && selectedForCompare.length === 2 && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative ring-1 ring-white/10">
                        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-slate-800/50">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                    <ChartBarIcon className="w-6 h-6 text-indigo-500" />
                                    Head-to-Head Comparison
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Comparing top 2 selections</p>
                            </div>
                            <button onClick={() => setShowCompareModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-0 grid grid-cols-2 divide-x divide-gray-100 dark:divide-gray-800 relative bg-white dark:bg-slate-900">
                            {/* Middle VS Badge */}
                            <div className="absolute left-1/2 top-8 -translate-x-1/2 z-10">
                                <div className="bg-white dark:bg-slate-800 border-4 border-slate-50 dark:border-slate-900 rounded-full w-12 h-12 flex items-center justify-center font-black text-gray-300 dark:text-gray-600 text-sm shadow-sm">
                                    VS
                                </div>
                            </div>

                            {selectedForCompare.map((id, index) => {
                                const c = candidates.find(can => can.id === id);
                                if (!c) return null;
                                const ai = c.aiAnalysis || {};
                                return (
                                    <div key={id} className={`p-8 space-y-8 ${index === 0 ? 'bg-gradient-to-b from-indigo-50/30 to-transparent dark:from-indigo-900/10' : 'bg-gradient-to-b from-purple-50/30 to-transparent dark:from-purple-900/10'}`}>
                                        <div className="text-center relative">
                                            <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-2xl font-bold mb-4 ${index === 0 ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300' : 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-300'}`}>
                                                {c.filename.charAt(0).toUpperCase()}
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate px-4" title={c.filename}>{c.filename}</h3>
                                            <div className="mt-4 inline-flex items-center px-6 py-2 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-gray-100 dark:border-gray-700">
                                                <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                                                    {Math.round(c.score * 100)}
                                                </span>
                                                <span className="text-sm font-bold text-gray-400 ml-1">% Fit</span>
                                            </div>
                                        </div>

                                        {/* Metrics Grid */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl text-center">
                                                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Experience</p>
                                                <p className="text-xl font-bold text-slate-700 dark:text-slate-200">{ai.experienceYears || 0} <span className="text-sm font-medium text-gray-400">Years</span></p>
                                            </div>
                                            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl text-center">
                                                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Keywords</p>
                                                <p className="text-xl font-bold text-slate-700 dark:text-slate-200">{ai.matchedKeywords?.length || 0} <span className="text-sm font-medium text-gray-400">Found</span></p>
                                            </div>
                                        </div>

                                        {/* Skills Breakdown */}
                                        <div>
                                            <h4 className="text-xs font-bold text-gray-400 uppercase mb-4 text-center tracking-widest">Skill Analysis</h4>
                                            <div className="space-y-4">
                                                <div className="bg-green-50/50 dark:bg-green-900/10 p-4 rounded-xl border border-green-100 dark:border-green-900/30">
                                                    <p className="text-xs font-bold text-green-700 dark:text-green-400 mb-2 flex items-center gap-2">
                                                        <CheckCircleIcon className="w-4 h-4" /> Matched Skills
                                                    </p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {ai.matchedKeywords?.length > 0 ? (
                                                            ai.matchedKeywords.map((k, i) => (
                                                                <span key={i} className="text-[11px] px-2.5 py-1 bg-white dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-md font-semibold shadow-sm border border-green-100 dark:border-green-800">{k}</span>
                                                            ))
                                                        ) : <span className="text-xs text-gray-400 italic">None</span>}
                                                    </div>
                                                </div>

                                                {ai.missingKeywords?.length > 0 && (
                                                    <div className="bg-red-50/50 dark:bg-red-900/10 p-4 rounded-xl border border-red-100 dark:border-red-900/30 opacity-80 hover:opacity-100 transition-opacity">
                                                        <p className="text-xs font-bold text-red-700 dark:text-red-400 mb-2 flex items-center gap-2">
                                                            <XMarkIcon className="w-4 h-4" /> Missing Skills
                                                        </p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {ai.missingKeywords.map((k, i) => (
                                                                <span key={i} className="text-[11px] px-2.5 py-1 bg-white dark:bg-red-900/20 text-red-500 dark:text-red-300 rounded-md decoration-red-300 line-through decoration-2 font-medium border border-red-100 dark:border-red-900/30">{k}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* AI Insights */}
                                        <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                            <div>
                                                <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Detailed Summary</h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">{ai.summary || "No summary available."}</p>
                                            </div>
                                            <div className="grid grid-cols-1 gap-3">
                                                <div className="p-3 bg-green-50 dark:bg-green-900/10 rounded-lg text-xs text-green-800 dark:text-green-300 border-l-4 border-green-500">
                                                    <span className="font-bold block mb-1">Strongest Point</span>
                                                    {ai.whyHigh || "N/A"}
                                                </div>
                                                <div className="p-3 bg-amber-50 dark:bg-amber-900/10 rounded-lg text-xs text-amber-800 dark:text-amber-300 border-l-4 border-amber-500">
                                                    <span className="font-bold block mb-1">Area of Concern</span>
                                                    {ai.improvement || "N/A"}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
}
