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
    const [viewMode, setViewMode] = useState("cards");
    const [expandedRow, setExpandedRow] = useState(null);
    const [selectedForCompare, setSelectedForCompare] = useState([]);
    const [showCompareModal, setShowCompareModal] = useState(false);

    const toggleCompare = (id) => {
        if (selectedForCompare.includes(id)) {
            setSelectedForCompare(prev => prev.filter(cId => cId !== id));
        } else {
            if (selectedForCompare.length >= 2) {
                alert("You can only compare 2 candidates at a time. Unselect one to add another.");
                return;
            }
            setSelectedForCompare(prev => [...prev, id]);
        }
    };

    useEffect(() => {
        const storedData = sessionStorage.getItem("rankingResults");
        if (!storedData) { router.push("/dashboard"); return; }
        try { setData(JSON.parse(storedData)); }
        catch (e) { console.error("Failed to parse ranking data", e); router.push("/dashboard"); }
    }, [router]);

    if (!data) return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-[#0a0a0f] dark:to-[#0d0d14] flex items-center justify-center">
            <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                Loading results...
            </div>
        </div>
    );

    const { ranked: candidates, jdAnalysis } = data;
    const toggleRow = (id) => { setExpandedRow(expandedRow === id ? null : id); };

    const exportCSV = () => {
        const headers = ["Rank,Filename,Score,Matched Keywords,Missing Keywords,Experience Years,Summary"];
        const rows = candidates.map((c, i) => {
            const ai = c.aiAnalysis || {};
            return [i + 1, `"${c.filename}"`, (c.score * 100).toFixed(2) + "%", `"${(ai.matchedKeywords || []).join(", ")}"`, `"${(ai.missingKeywords || []).join(", ")}"`, ai.experienceYears || "-", `"${(ai.summary || "").replace(/"/g, '""')}"`].join(",");
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
        const tableRows = candidates.map((c, i) => [i + 1, c.filename, (c.score * 100).toFixed(0) + "%", (c.aiAnalysis?.experienceYears || "-") + " yrs", c.aiAnalysis?.summary || ""]);
        autoTable(doc, { head: [tableColumn], body: tableRows, startY: 35, styles: { fontSize: 9 }, headStyles: { fillColor: [79, 70, 229] } });
        doc.save(`HireSight_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-[#0a0a0f] dark:via-[#0d0d14] dark:to-[#0a0a0f] transition-colors duration-300">
            {/* Background effects */}
            <div className="fixed inset-0 opacity-30 dark:opacity-20 pointer-events-none">
                <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, rgba(100,100,100,0.15) 1px, transparent 0)`, backgroundSize: '40px 40px' }} />
            </div>
            <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-0 left-1/2 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Header */}
            <div className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-white/10">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button onClick={() => router.push("/dashboard")} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-colors text-gray-500 dark:text-gray-400">
                            <ArrowLeftIcon className="w-5 h-5" />
                        </button>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Ranking Results
                        </h1>
                    </div>
                    <div className="flex items-center space-x-3">
                        <ThemeToggle />
                        <div className="flex bg-gray-100/80 dark:bg-white/5 rounded-xl p-1 mr-2 backdrop-blur-sm">
                            <button onClick={exportCSV} className="px-3 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-white/10 rounded-lg transition-all flex items-center gap-1">
                                <ArrowDownTrayIcon className="w-3 h-3" /> CSV
                            </button>
                            <div className="w-px bg-gray-300 dark:bg-white/10 my-1 mx-1" />
                            <button onClick={exportPDF} className="px-3 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-white/10 rounded-lg transition-all flex items-center gap-1">
                                <ArrowDownTrayIcon className="w-3 h-3" /> PDF
                            </button>
                        </div>
                        <div className="flex items-center space-x-1 bg-gray-100/80 dark:bg-white/5 p-1 rounded-xl backdrop-blur-sm">
                            <button onClick={() => setViewMode("cards")} className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${viewMode === "cards" ? "bg-white dark:bg-white/10 text-indigo-600 dark:text-indigo-400 shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}`}>
                                <div className="flex items-center space-x-2"><DocumentTextIcon className="w-4 h-4" /><span>Cards</span></div>
                            </button>
                            <button onClick={() => setViewMode("leaderboard")} className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${viewMode === "leaderboard" ? "bg-white dark:bg-white/10 text-indigo-600 dark:text-indigo-400 shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}`}>
                                <div className="flex items-center space-x-2"><TrophyIcon className="w-4 h-4" /><span>Leaderboard</span></div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <main className="relative z-10 max-w-7xl mx-auto p-6 md:p-8">
                {/* Top Stats */}
                <section className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl p-5 rounded-2xl border border-gray-200/50 dark:border-white/10 shadow-xl shadow-gray-200/30 dark:shadow-none">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide">Total Candidates</h3>
                        <p className="text-3xl font-extrabold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mt-1">{candidates.length}</p>
                    </div>
                    <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl p-5 rounded-2xl border border-gray-200/50 dark:border-white/10 shadow-xl shadow-gray-200/30 dark:shadow-none">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide">Must-Have Skills (JD)</h3>
                        <div className="flex flex-wrap gap-1 mt-2">
                            {jdAnalysis?.must_have_skills?.length > 0 ? jdAnalysis.must_have_skills.slice(0, 8).map((s, i) => (
                                <span key={i} className="text-xs bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded-lg font-medium">{s}</span>
                            )) : <span className="text-sm text-gray-400">None detected</span>}
                        </div>
                    </div>
                    <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl p-5 rounded-2xl border border-gray-200/50 dark:border-white/10 shadow-xl shadow-gray-200/30 dark:shadow-none relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <TrophyIcon className="w-20 h-20 text-yellow-500" />
                        </div>
                        <div className="z-10 relative">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide">Top Performer</h3>
                            <div className="flex items-center space-x-2 mt-1">
                                <div className="p-1.5 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500">
                                    <TrophyIcon className="w-4 h-4 text-white" />
                                </div>
                                <span className="font-bold text-gray-900 dark:text-white text-lg truncate max-w-[200px]">{candidates[0]?.filename}</span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                Score: <span className="font-bold text-indigo-600 dark:text-indigo-400">{(candidates[0]?.score * 100).toFixed(0)}%</span>
                            </p>
                        </div>
                    </div>
                </section>

                {/* Metrics Dashboard */}
                <section className="mb-8 bg-white/80 dark:bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-gray-200/50 dark:border-white/10 shadow-xl shadow-gray-200/30 dark:shadow-none">
                    <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-6">Metrics Dashboard</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="flex flex-col justify-between">
                            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Must-Have Skill Match Rate</h3>
                            <div className="flex items-end gap-2">
                                <span className="text-4xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    {(() => { const passing = candidates.filter(c => { const matched = c.aiAnalysis?.matchedKeywords?.length || 0; const total = jdAnalysis?.must_have_skills?.length || 1; return (matched / total) >= 0.5; }).length; return Math.round((passing / candidates.length) * 100) || 0; })()}%
                                </span>
                                <span className="text-xs text-gray-400 mb-1">match &gt;50% skills</span>
                            </div>
                            <div className="w-full bg-gray-100 dark:bg-white/10 rounded-full h-2 mt-3 overflow-hidden">
                                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full" style={{ width: `${Math.round((candidates.filter(c => (c.aiAnalysis?.matchedKeywords?.length || 0) / (jdAnalysis?.must_have_skills?.length || 1) >= 0.5).length / candidates.length) * 100) || 0}%` }} />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">Top Shared Skills</h3>
                            <div className="space-y-2">
                                {Object.entries(candidates.reduce((acc, c) => { (c.aiAnalysis?.matchedKeywords || []).forEach(k => acc[k] = (acc[k] || 0) + 1); return acc; }, {})).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([skill, count], i) => (
                                    <div key={i} className="flex justify-between items-center text-sm">
                                        <span className="text-gray-700 dark:text-gray-300 font-medium">{skill}</span>
                                        <span className="bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 text-xs px-2 py-0.5 rounded-full font-bold">{count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">Common Missing Skills</h3>
                            <div className="space-y-2">
                                {Object.entries(candidates.reduce((acc, c) => { (c.aiAnalysis?.missingKeywords || []).forEach(k => acc[k] = (acc[k] || 0) + 1); return acc; }, {})).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([skill, count], i) => (
                                    <div key={i} className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">{skill}</span>
                                        <span className="bg-red-100 dark:bg-red-500/20 text-red-500 dark:text-red-400 text-xs px-2 py-0.5 rounded-full font-bold">{count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-4">Score Distribution</h3>
                            <div className="flex items-end justify-between h-24 gap-2">
                                {['<50', '50-70', '70-90', '90+'].map((label, i) => {
                                    const count = candidates.filter(c => { const s = c.score * 100; if (i === 0) return s < 50; if (i === 1) return s >= 50 && s < 70; if (i === 2) return s >= 70 && s < 90; return s >= 90; }).length;
                                    const height = candidates.length > 0 ? (count / candidates.length) * 100 : 0;
                                    return (
                                        <div key={label} className="flex flex-col items-center flex-1 group">
                                            <div className="w-full bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t-lg relative transition-all duration-500 group-hover:from-indigo-400 group-hover:to-purple-400" style={{ height: `${Math.max(height, 10)}%` }}>
                                                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">{count}</div>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {candidates.map((candidate, idx) => {
                            const ai = candidate.aiAnalysis || {};
                            return (
                                <div key={candidate.id} className={`relative group ${selectedForCompare.includes(candidate.id) ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900' : ''}`}>
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="relative bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 shadow-xl shadow-gray-200/30 dark:shadow-none overflow-hidden flex flex-col">
                                        <div className="absolute top-4 right-4 z-10">
                                            <input type="checkbox" checked={selectedForCompare.includes(candidate.id)} onChange={() => toggleCompare(candidate.id)} className="w-5 h-5 rounded-lg border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
                                        </div>
                                        <div className="p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className={`flex items-center justify-center w-12 h-12 rounded-xl font-bold text-lg shadow-lg ${idx === 0 ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-white" : idx === 1 ? "bg-gradient-to-br from-gray-300 to-gray-400 text-white" : idx === 2 ? "bg-gradient-to-br from-orange-400 to-amber-600 text-white" : "bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 text-slate-600 dark:text-slate-300"}`}>
                                                        #{idx + 1}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-lg text-gray-800 dark:text-white truncate max-w-[200px]">{candidate.filename}</h3>
                                                        {candidate.isDuplicate && <span className="text-[10px] bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full font-bold uppercase">Duplicate</span>}
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{Math.round(candidate.score * 100)}%</div>
                                                    <div className="text-[10px] text-gray-400 font-semibold uppercase">Fit Score</div>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <div>
                                                    <div className="flex justify-between items-baseline mb-2">
                                                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Key Matches</p>
                                                        {ai.missingKeywords?.length > 0 && <span className="text-[10px] text-red-500 font-bold uppercase">{ai.missingKeywords.length} Missing</span>}
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {ai.matchedKeywords?.length > 0 ? ai.matchedKeywords.slice(0, 8).map((kw, i) => (
                                                            <span key={i} className="px-2 py-1 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 text-xs rounded-lg font-medium">{kw}</span>
                                                        )) : <span className="text-xs text-gray-400 italic">No specific matches</span>}
                                                    </div>
                                                    {ai.missingKeywords?.length > 0 && (
                                                        <div className="mt-2 flex flex-wrap gap-2">
                                                            {ai.missingKeywords.slice(0, 5).map((kw, i) => (
                                                                <span key={i} className="px-2 py-1 bg-red-100 dark:bg-red-500/20 text-red-500 dark:text-red-400 text-xs rounded-lg font-medium line-through">{kw}</span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex items-center justify-between text-sm bg-gray-50 dark:bg-white/5 p-3 rounded-xl border border-gray-100 dark:border-white/5">
                                                    <span className="text-gray-500 dark:text-gray-400">Experience Match</span>
                                                    <span className="font-semibold text-gray-800 dark:text-white">{ai.experienceYears !== "N/A" ? `${ai.experienceYears} Years` : "Not detected"}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-auto border-t border-gray-100 dark:border-white/5">
                                            <button onClick={() => toggleRow(candidate.id)} className="w-full flex items-center justify-between p-4 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                                <span className="font-medium">Read Summary & Analysis</span>
                                                {expandedRow === candidate.id ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
                                            </button>
                                            {expandedRow === candidate.id && (
                                                <div className="p-6 bg-gray-50 dark:bg-white/[0.02] space-y-4 border-t border-gray-100 dark:border-white/5">
                                                    <div className="bg-white dark:bg-white/5 p-4 rounded-xl border border-gray-200 dark:border-white/10">
                                                        <h4 className="text-xs font-bold text-indigo-500 uppercase mb-2">Resume Summary</h4>
                                                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{ai.summary}</p>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="bg-green-50 dark:bg-green-500/10 p-4 rounded-xl border border-green-100 dark:border-green-500/20">
                                                            <h4 className="text-xs font-bold text-green-700 dark:text-green-400 uppercase mb-2">Why High Score?</h4>
                                                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{ai.whyHigh}</p>
                                                        </div>
                                                        <div className="bg-amber-50 dark:bg-amber-500/10 p-4 rounded-xl border border-amber-100 dark:border-amber-500/20">
                                                            <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase mb-2">Improvement Areas</h4>
                                                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{ai.improvement}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 shadow-xl shadow-gray-200/30 dark:shadow-none overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">
                                        <th className="p-4 w-10 text-center">Select</th>
                                        <th className="p-4 w-16 text-center">Rank</th>
                                        <th className="p-4">Candidate Name</th>
                                        <th className="p-4">Score</th>
                                        <th className="p-4">Skill Match</th>
                                        <th className="p-4">Experience</th>
                                        <th className="p-4">Insight</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                    {candidates.map((candidate, idx) => {
                                        const ai = candidate.aiAnalysis || {};
                                        const skillCount = ai.matchedKeywords?.length || 0;
                                        const detectedJDSkills = (jdAnalysis?.must_have_skills?.length || 0) + (jdAnalysis?.good_to_have_skills?.length || 0);
                                        const skillMatchPct = detectedJDSkills > 0 ? Math.round((skillCount / detectedJDSkills) * 100) : 0;
                                        return (
                                            <tr key={candidate.id} className={`hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group ${selectedForCompare.includes(candidate.id) ? 'bg-indigo-50/50 dark:bg-indigo-500/10' : ''}`}>
                                                <td className="p-4 text-center">
                                                    <input type="checkbox" checked={selectedForCompare.includes(candidate.id)} onChange={() => toggleCompare(candidate.id)} className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
                                                </td>
                                                <td className="p-4 text-center">
                                                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm ${idx === 0 ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-white" : idx === 1 ? "bg-gradient-to-br from-gray-300 to-gray-400 text-white" : idx === 2 ? "bg-gradient-to-br from-orange-400 to-amber-600 text-white" : "bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300"}`}>{idx + 1}</span>
                                                </td>
                                                <td className="p-4 font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                    {candidate.filename}
                                                    {candidate.isDuplicate && <span className="ml-2 text-[10px] text-red-500 font-bold bg-red-50 dark:bg-red-500/20 px-1 py-0.5 rounded">DUP</span>}
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="font-bold text-indigo-600 dark:text-indigo-400">{Math.round(candidate.score * 100)}%</span>
                                                        <div className="w-16 h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                                                            <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: `${candidate.score * 100}%` }} />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-400">
                                                        {skillMatchPct > 0 ? `${skillMatchPct}%` : `${skillCount} found`}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{ai.experienceYears !== "N/A" ? `${ai.experienceYears}y` : "-"}</td>
                                                <td className="p-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">{ai.summary}</td>
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
                <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900/95 dark:bg-slate-800/95 backdrop-blur-xl text-white px-2 py-2 pl-6 rounded-2xl flex items-center shadow-2xl z-40 border border-white/10">
                    <span className="text-sm font-medium mr-4">{selectedForCompare.length} selected</span>
                    <button onClick={() => setShowCompareModal(true)} disabled={selectedForCompare.length !== 2} className={`flex items-center space-x-2 px-5 py-2 rounded-xl font-bold text-sm transition-all ${selectedForCompare.length === 2 ? "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white hover:scale-105 shadow-lg shadow-indigo-500/25" : "bg-gray-800 text-gray-500 cursor-not-allowed"}`}>
                        <span>Compare Candidates</span><ArrowRightCircleIcon className="w-5 h-5" />
                    </button>
                    <button onClick={() => setSelectedForCompare([])} className="ml-3 p-2 hover:bg-white/10 rounded-xl text-gray-400 transition-colors"><XMarkIcon className="w-5 h-5" /></button>
                </div>
            )}

            {/* Comparison Modal */}
            {showCompareModal && selectedForCompare.length === 2 && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-gray-200 dark:border-white/10">
                        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                    <ChartBarIcon className="w-6 h-6 text-indigo-500" />
                                    Head-to-Head Comparison
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Comparing top 2 selections</p>
                            </div>
                            <button onClick={() => setShowCompareModal(false)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-white/10 rounded-xl transition-colors">
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-0 grid grid-cols-2 divide-x divide-gray-100 dark:divide-white/10 relative">
                            <div className="absolute left-1/2 top-8 -translate-x-1/2 z-10">
                                <div className="bg-white dark:bg-slate-800 border-4 border-gray-100 dark:border-slate-700 rounded-full w-12 h-12 flex items-center justify-center font-black text-gray-400 dark:text-gray-500 text-sm shadow-lg">VS</div>
                            </div>
                            {selectedForCompare.map((id, index) => {
                                const c = candidates.find(can => can.id === id);
                                if (!c) return null;
                                const ai = c.aiAnalysis || {};
                                return (
                                    <div key={id} className={`p-8 space-y-6 ${index === 0 ? 'bg-gradient-to-b from-indigo-50/50 to-transparent dark:from-indigo-500/5' : 'bg-gradient-to-b from-purple-50/50 to-transparent dark:from-purple-500/5'}`}>
                                        <div className="text-center">
                                            <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center text-2xl font-bold mb-4 shadow-lg ${index === 0 ? 'bg-gradient-to-br from-indigo-500 to-blue-600 text-white' : 'bg-gradient-to-br from-purple-500 to-pink-600 text-white'}`}>
                                                {c.filename.charAt(0).toUpperCase()}
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate px-4">{c.filename}</h3>
                                            <div className="mt-4 inline-flex items-center px-6 py-2 rounded-2xl bg-white dark:bg-white/5 shadow-lg border border-gray-100 dark:border-white/10">
                                                <span className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{Math.round(c.score * 100)}</span>
                                                <span className="text-sm font-bold text-gray-400 ml-1">% Fit</span>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl text-center">
                                                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Experience</p>
                                                <p className="text-xl font-bold text-gray-700 dark:text-white">{ai.experienceYears || 0} <span className="text-sm font-medium text-gray-400">Years</span></p>
                                            </div>
                                            <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl text-center">
                                                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Keywords</p>
                                                <p className="text-xl font-bold text-gray-700 dark:text-white">{ai.matchedKeywords?.length || 0} <span className="text-sm font-medium text-gray-400">Found</span></p>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="bg-green-50 dark:bg-green-500/10 p-4 rounded-xl border border-green-100 dark:border-green-500/20">
                                                <p className="text-xs font-bold text-green-700 dark:text-green-400 mb-2 flex items-center gap-2"><CheckCircleIcon className="w-4 h-4" /> Matched Skills</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {ai.matchedKeywords?.length > 0 ? ai.matchedKeywords.map((k, i) => (<span key={i} className="text-[11px] px-2.5 py-1 bg-white dark:bg-green-500/20 text-green-700 dark:text-green-300 rounded-lg font-semibold">{k}</span>)) : <span className="text-xs text-gray-400">None</span>}
                                                </div>
                                            </div>
                                            {ai.missingKeywords?.length > 0 && (
                                                <div className="bg-red-50 dark:bg-red-500/10 p-4 rounded-xl border border-red-100 dark:border-red-500/20">
                                                    <p className="text-xs font-bold text-red-700 dark:text-red-400 mb-2 flex items-center gap-2"><XMarkIcon className="w-4 h-4" /> Missing Skills</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {ai.missingKeywords.map((k, i) => (<span key={i} className="text-[11px] px-2.5 py-1 bg-white dark:bg-red-500/20 text-red-500 dark:text-red-300 rounded-lg line-through">{k}</span>))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-white/10">
                                            <div className="bg-white dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/10">
                                                <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Summary</h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{ai.summary || "No summary available."}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
