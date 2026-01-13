"use client";

import { useState } from "react";
import { auth, db } from "../../firebase/config";
import { addDoc, collection } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CloudArrowUpIcon,
  ClipboardDocumentListIcon,
  ArrowRightCircleIcon,
  DocumentTextIcon,
  XMarkIcon,
  CheckCircleIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { SparklesIcon } from "@heroicons/react/24/solid";
import ThemeToggle from "../components/ThemeToggle";
import Sidebar from "../components/Sidebar";
import AuthGuard from "../components/AuthGuard";

function DashboardContent() {
  const [jobDesc, setJobDesc] = useState("");
  const [uploadedResumes, setUploadedResumes] = useState([]);
  const [ranking, setRanking] = useState(null);
  const [isRanking, setIsRanking] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loadingText, setLoadingText] = useState("Processing...");

  const router = useRouter();

  const handleImproviseJD = async () => {
    if (!jobDesc.trim()) return alert("Please enter some text to improvise.");
    setIsOptimizing(true);
    try {
      const res = await fetch("/api/optimize-jd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription: jobDesc }),
      });
      const data = await res.json();
      if (data.refinedText) {
        setJobDesc(data.refinedText);
      } else {
        alert("Optimization failed or returned empty.");
      }
    } catch (e) {
      console.error(e);
      alert("Failed to connect to AI.");
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleJDUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/parse-pdf", { method: "POST", body: formData });
      const data = await res.json();
      if (data.text) setJobDesc(data.text);
    } catch (err) {
      alert("Failed to parse JD PDF");
    }
  };

  const handleResumeUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    const newUploads = files.map((f) => ({ file: f, filename: f.name, status: "uploading" }));
    setUploadedResumes((prev) => [...prev, ...newUploads]);

    for (let i = 0; i < newUploads.length; i++) {
      const item = newUploads[i];
      const formData = new FormData();
      formData.append("file", item.file);
      try {
        const res = await fetch("/api/upload-resume", { method: "POST", body: formData });
        const data = await res.json();
        setUploadedResumes((prev) =>
          prev.map((r) => (r.filename === item.filename ? { ...r, status: "done", id: data.id } : r))
        );
      } catch (err) {
        setUploadedResumes((prev) =>
          prev.map((r) => (r.filename === item.filename ? { ...r, status: "error" } : r))
        );
      }
    }
  };

  const computeRanking = async () => {
    if (!jobDesc.trim()) return alert("Please enter/upload a JD.");
    const validResumes = uploadedResumes.filter((r) => r.id);
    if (validResumes.length < 3) return alert("Upload at least 3 resumes to rank candidates!");

    setIsRanking(true);
    setLoadingText("Initializing...");

    try {
      setLoadingText("Parsing Job Description...");
      await new Promise((r) => setTimeout(r, 600));
      setLoadingText("Scanning Resumes...");
      await new Promise((r) => setTimeout(r, 800));
      setLoadingText("Computing Semantic Embeddings...");
      await new Promise((r) => setTimeout(r, 1000));
      setLoadingText("Ranking with HireSight...");

      const res = await fetch("/api/analyze-resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription: jobDesc, resumeIds: validResumes.map((r) => r.id) }),
      });
      const data = await res.json();

      if (data.ranked) {
        setLoadingText("Finalizing Leaderboard...");
        await new Promise((r) => setTimeout(r, 500));
        sessionStorage.setItem("rankingResults", JSON.stringify(data));
        try {
          if (auth.currentUser) {
            await addDoc(collection(db, "history"), {
              userId: auth.currentUser.uid,
              jobDescription: jobDesc,
              jdAnalysis: data.jdAnalysis,
              candidates: data.ranked,
              createdAt: new Date().toISOString(),
            });
          }
        } catch (error) {
          console.error("Failed to save history:", error);
        }
        router.push("/results");
      } else {
        alert("Ranking returned no results. Please check input.");
      }
    } catch (err) {
      console.error(err);
      alert("Ranking failed");
    } finally {
      setIsRanking(false);
      setLoadingText("Processing...");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-[#0a0a0f] dark:via-[#0d0d14] dark:to-[#0a0a0f] transition-colors duration-300">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 opacity-30 dark:opacity-20 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(100,100,100,0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Ambient glow effects */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className={`relative z-10 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"} min-h-screen`}>
        {/* Header */}
        <header className="flex justify-between items-center px-8 py-6">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Rank candidates with AI-powered analysis</p>
          </div>
          <ThemeToggle />
        </header>

        <div className="max-w-6xl mx-auto px-8 pb-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Inputs */}
          <div className="space-y-8">
            {/* Job Description Card */}
            <section className="relative group">
              {/* Glassmorphism card */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
              <div className="relative bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 p-6 shadow-xl shadow-gray-200/50 dark:shadow-none">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                      <ClipboardDocumentListIcon className="w-4 h-4" />
                    </div>
                    Job Description
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleImproviseJD}
                      disabled={isOptimizing || !jobDesc}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-xs font-bold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {isOptimizing ? (
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <SparklesIcon className="w-3.5 h-3.5" />
                      )}
                      Improvise with AI
                    </button>
                    <label className="cursor-pointer text-xs bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-600 dark:text-gray-300 px-4 py-2 rounded-xl transition-colors font-semibold flex items-center gap-1.5">
                      <DocumentTextIcon className="w-3.5 h-3.5" />
                      Upload PDF
                      <input type="file" accept="application/pdf" className="hidden" onChange={handleJDUpload} />
                    </label>
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    value={jobDesc}
                    onChange={(e) => setJobDesc(e.target.value)}
                    placeholder="Paste job description here or upload a PDF..."
                    className="w-full h-72 p-5 rounded-xl bg-gray-50/80 dark:bg-slate-900/50 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:outline-none transition-all resize-none text-sm leading-7 text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500"
                  />
                  {jobDesc.length === 0 && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <PencilSquareIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-2" />
                      <span className="text-sm text-gray-400 dark:text-gray-500">Describe the role...</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-end mt-3">
                  <span className="text-[10px] text-gray-400 font-medium bg-gray-100 dark:bg-white/5 px-3 py-1 rounded-lg">
                    {jobDesc.length} characters
                  </span>
                </div>
              </div>
            </section>

            {/* Resume Upload Card */}
            <section className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
              <div className="relative bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 p-6 shadow-xl shadow-gray-200/50 dark:shadow-none">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                    <CloudArrowUpIcon className="w-4 h-4" />
                  </div>
                  Upload Resumes
                </h2>

                <div className="relative border-2 border-dashed border-gray-300 dark:border-white/20 rounded-xl p-8 text-center hover:border-green-400 dark:hover:border-green-500/50 hover:bg-green-50/50 dark:hover:bg-green-500/5 transition-all cursor-pointer group/upload">
                  <input
                    type="file"
                    multiple
                    accept="application/pdf"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleResumeUpload}
                  />
                  <div className="space-y-2 pointer-events-none">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-500/20 dark:to-emerald-500/20 flex items-center justify-center group-hover/upload:scale-110 transition-transform">
                      <CloudArrowUpIcon className="w-7 h-7 text-green-600 dark:text-green-400" />
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 font-medium">Click or drag PDFs here</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">Upload multiple files to rank them</p>
                  </div>
                </div>

                {uploadedResumes.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {uploadedResumes.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center bg-gray-50 dark:bg-white/5 p-3 rounded-xl border border-gray-100 dark:border-white/5"
                      >
                        <span className="text-sm truncate max-w-[200px] text-gray-700 dark:text-gray-300">{file.filename}</span>
                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full ${file.status === "done"
                            ? "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400"
                            : file.status === "error"
                              ? "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400"
                              : "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400"
                            }`}
                        >
                          {file.status === "done" ? "Ready" : file.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Right Column: Action & Hints */}
          <div className="flex flex-col gap-6">
            {/* Action Panel */}
            <div className="relative overflow-hidden rounded-2xl">
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700" />
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCAyLTRzMiAyIDIgNC0yIDQtMiA0LTItMi0yLTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />

              <div className="relative p-8 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm">
                    <SparklesIcon className="w-5 h-5" />
                  </div>
                  <h3 className="text-2xl font-bold">Ready to Rank?</h3>
                </div>
                <p className="text-blue-100 mb-6 text-sm leading-relaxed">
                  Our AI will analyze the uploaded resumes against your job description to find the best match.
                </p>
                <button
                  onClick={computeRanking}
                  disabled={isRanking || !jobDesc || uploadedResumes.length === 0}
                  className="w-full bg-white text-indigo-600 font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all flex justify-center items-center gap-2"
                >
                  {isRanking ? (
                    <>
                      <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                      {loadingText}
                    </>
                  ) : (
                    <>
                      <ArrowRightCircleIcon className="w-5 h-5" />
                      Rank Candidates
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* How it Works */}
            <div className="relative group flex-1">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
              <div className="relative bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 p-6 shadow-xl shadow-gray-200/50 dark:shadow-none h-full">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                  <span className="text-lg">How it works</span>
                </h3>
                <ul className="space-y-5">
                  {[
                    { color: "blue", num: 1, text: "Upload the Job Description (PDF or Text). We extract keywords automatically." },
                    { color: "green", num: 2, text: "Upload multiple candidate resumes. We support batch processing." },
                    { color: "purple", num: 3, text: "Get instant rankings based on semantic similarity and keyword matching." },
                  ].map((step) => (
                    <li key={step.num} className="flex gap-4">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${step.color === "blue" ? "from-blue-500 to-blue-600" :
                        step.color === "green" ? "from-green-500 to-emerald-600" :
                          "from-purple-500 to-indigo-600"
                        } flex items-center justify-center text-white font-bold text-sm shadow-lg flex-shrink-0`}>
                        {step.num}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 pt-2 leading-relaxed">{step.text}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Wrap DashboardContent with AuthGuard for route protection
export default function Dashboard() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
