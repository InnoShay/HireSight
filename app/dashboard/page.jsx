"use client";

import { useState } from "react";
import { auth, db } from "../../firebase/config";
import { signOut } from "firebase/auth";
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

export default function Dashboard() {
  const [jobDesc, setJobDesc] = useState("");
  const [uploadedResumes, setUploadedResumes] = useState([]); // {id, filename, status}
  const [ranking, setRanking] = useState(null);
  const [isRanking, setIsRanking] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  // Optimize JD with AI
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
      const res = await fetch("/api/parse-pdf", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.text) setJobDesc(data.text);
    } catch (err) {
      alert("Failed to parse JD PDF");
    }
  };

  const handleResumeUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Optimistically add to list
    const newUploads = files.map((f) => ({
      file: f,
      filename: f.name,
      status: "uploading",
    }));

    setUploadedResumes((prev) => [...prev, ...newUploads]);

    // Upload each
    for (let i = 0; i < newUploads.length; i++) {
      const item = newUploads[i];
      const formData = new FormData();
      formData.append("file", item.file);

      try {
        const res = await fetch("/api/upload-resume", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();

        // Update status and ID
        setUploadedResumes((prev) =>
          prev.map((r) =>
            r.filename === item.filename
              ? { ...r, status: "done", id: data.id }
              : r
          )
        );
      } catch (err) {
        setUploadedResumes((prev) =>
          prev.map((r) =>
            r.filename === item.filename ? { ...r, status: "error" } : r
          )
        );
      }
    }
  };

  // State for loading text
  const [loadingText, setLoadingText] = useState("Processing...");

  // ... (Upload handlers remain same)

  const computeRanking = async () => {
    if (!jobDesc.trim()) return alert("Please enter/upload a JD.");

    // Validation: 3 resumes min (User requirement E)
    const validResumes = uploadedResumes.filter((r) => r.id);
    if (validResumes.length < 3) {
      return alert("Upload at least 3 resumes to rank candidates!");
    }

    setIsRanking(true);
    setLoadingText("Initializing...");

    try {
      // A. Simulate Loading States (User requirement D)
      setLoadingText("Parsing Job Description...");
      await new Promise(r => setTimeout(r, 600));

      setLoadingText("Scanning Resumes...");
      await new Promise(r => setTimeout(r, 800));

      setLoadingText("Computing Semantic Embeddings...");
      await new Promise(r => setTimeout(r, 1000));

      setLoadingText("Ranking with HireSight...");

      const res = await fetch("/api/analyze-resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobDescription: jobDesc,
          resumeIds: validResumes.map((r) => r.id),
        }),
      });

      const data = await res.json();

      if (data.ranked) {
        setLoadingText("Finalizing Leaderboard...");
        await new Promise(r => setTimeout(r, 500));

        // Store results and redirect (User requirement A)
        // Store results and redirect (User requirement A)
        sessionStorage.setItem("rankingResults", JSON.stringify(data));

        // Save to History (User requirement B)
        try {
          if (auth.currentUser) {
            await addDoc(collection(db, "history"), {
              userId: auth.currentUser.uid,
              jobDescription: jobDesc,
              jdAnalysis: data.jdAnalysis,
              candidates: data.ranked, // Save full ranking details
              createdAt: new Date().toISOString()
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 relative transition-colors duration-200">
      <nav className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex justify-between items-center shadow-sm transition-colors duration-200">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              HS
            </div>
            <span className="text-xl font-bold text-gray-800 dark:text-white">HireSight</span>
          </div>
          <Link href="/history" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            History
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button
            onClick={handleLogout}
            className="text-sm text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 font-medium transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Inputs */}
        <div className="space-y-8">
          {/* Job Description */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative group">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <ClipboardDocumentListIcon className="w-5 h-5 text-blue-500" />
                Job Description
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleImproviseJD}
                  disabled={isOptimizing || !jobDesc}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs font-bold shadow-sm hover:shadow-md hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isOptimizing ? (
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : <SparklesIcon className="w-3 h-3" />}
                  Improvise with AI
                </button>
                <label className="cursor-pointer text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-full transition-colors font-semibold flex items-center gap-1">
                  <DocumentTextIcon className="w-3 h-3" />
                  Upload PDF
                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={handleJDUpload}
                  />
                </label>
              </div>
            </div>

            <div className="relative">
              <textarea
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                placeholder="Paste job description here or upload a PDF..."
                className="w-full h-80 p-5 rounded-xl bg-gray-50/50 dark:bg-slate-800/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:outline-none transition-all resize-none text-sm leading-7 font-sans text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500"
              />

              {/* Decorative Elements for "Visual Correctness" */}
              {jobDesc.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-40">
                  <PencilSquareIcon className="w-12 h-12 text-gray-300 mb-2" />
                  <span className="text-sm text-gray-400">Describe the role...</span>
                </div>
              )}
            </div>

            <div className="flex justify-end mt-2">
              <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                {jobDesc.length} characters
              </span>
            </div>
          </section>

          {/* Resume Upload */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <CloudArrowUpIcon className="w-5 h-5 text-green-500" />
              Upload Resumes
            </h2>

            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
              <input
                type="file"
                multiple
                accept="application/pdf"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleResumeUpload}
              />
              <div className="space-y-2 pointer-events-none">
                <CloudArrowUpIcon className="w-10 h-10 text-gray-400 mx-auto" />
                <p className="text-gray-600 font-medium">
                  Click or drag PDFs here
                </p>
                <p className="text-xs text-gray-400">
                  Upload multiple files to rank them
                </p>
              </div>
            </div>

            {uploadedResumes.length > 0 && (
              <div className="mt-4 space-y-2">
                {uploadedResumes.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100"
                  >
                    <span className="text-sm truncate max-w-[200px] text-gray-700">
                      {file.filename}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${file.status === "done"
                        ? "bg-green-100 text-green-700"
                        : file.status === "error"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                        }`}
                    >
                      {file.status === "done" ? "Ready" : file.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Action & Hints */}
        <div className="flex flex-col gap-6">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 text-white shadow-lg">
            <h3 className="text-2xl font-bold mb-2">Ready to Rank?</h3>
            <p className="text-indigo-100 mb-6">
              Our AI will analyze the uploaded resumes against your job
              description to find the best match.
            </p>
            <button
              onClick={computeRanking}
              disabled={isRanking || !jobDesc || uploadedResumes.length === 0}
              className="w-full bg-white text-indigo-600 font-bold py-3 rounded-xl shadow-lg hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex justify-center items-center gap-2"
            >
              {isRanking ? (
                <>
                  <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  {loadingText}
                </>
              ) : (
                <>
                  <ArrowRightCircleIcon className="w-6 h-6" />
                  Rank Candidates
                </>
              )}
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex-1">
            <h3 className="font-semibold text-gray-800 mb-4">How it works</h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                  1
                </div>
                <p className="text-sm text-gray-600 pt-1">
                  Upload the Job Description (PDF or Text). We extract keywords
                  automatically.
                </p>
              </li>
              <li className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-sm">
                  2
                </div>
                <p className="text-sm text-gray-600 pt-1">
                  Upload multiple candidate resumes. We support batch processing.
                </p>
              </li>
              <li className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm">
                  3
                </div>
                <p className="text-sm text-gray-600 pt-1">
                  Get instant rankings based on semantic similarity and keyword
                  matching.
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

