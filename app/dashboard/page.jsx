"use client";

import { useState } from "react";
import { auth } from "../../firebase/config";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import {
  CloudArrowUpIcon,
  ClipboardDocumentListIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/outline";

export default function Dashboard() {
  const [jobDesc, setJobDesc] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [message, setMessage] = useState("");
  const [ranking, setRanking] = useState([]);
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const handleSubmitJobDesc = () => {
    if (!jobDesc.trim()) return alert("Job description cannot be empty");
    localStorage.setItem("jobDesc", jobDesc);
    setMessage("Job description saved!");
  };

  const handleResumeUpload = async () => {
    if (!resumeFile) return alert("Choose a PDF first");

    const formData = new FormData();
    formData.append("file", resumeFile);

    const res = await fetch("/api/upload-resume", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setMessage(data.message || "Resume uploaded!");
  };

  const computeRanking = async () => {
    const savedJD = localStorage.getItem("jobDesc") || jobDesc;
    if (!savedJD.trim()) return alert("Enter and save a job description first!");

    const res = await fetch("/api/analyze-resumes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobDescription: savedJD }),
    });

    const data = await res.json();
    if (data.ranked) {
      setRanking(data.ranked);
      setMessage("Ranking complete!");
    } else {
      setMessage("Error during ranking");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 px-6 py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
          AI Resume Screening
        </h1>
        <button
          onClick={handleLogout}
          className="text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow"
        >
          Logout
        </button>
      </div>

      {/* Main Cards */}
      <div className="max-w-3xl mx-auto grid gap-8">
        {/* Job Description */}
        <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="flex items-center mb-3">
            <ClipboardDocumentListIcon className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">
              1. Paste Job Description
            </h2>
          </div>

          <textarea
            className="w-full h-32 border rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setJobDesc(e.target.value)}
          />

          <button
            onClick={handleSubmitJobDesc}
            className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg shadow transition"
          >
            Save Description
          </button>
        </div>

        {/* Upload Resume */}
        <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="flex items-center mb-3">
            <CloudArrowUpIcon className="h-6 w-6 text-green-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">
              2. Upload Resume PDF
            </h2>
          </div>

          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setResumeFile(e.target.files[0])}
            className="block w-full mb-3 text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 
            file:rounded-md file:border-0 file:text-sm 
            file:bg-gray-300 file:hover:bg-gray-400 cursor-pointer"
          />

          <button
            onClick={handleResumeUpload}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg shadow"
          >
            Upload Resume
          </button>
        </div>

        {/* Rank */}
        <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="flex items-center mb-3">
            <ArrowRightCircleIcon className="h-6 w-6 text-purple-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">
              3. Rank Candidates
            </h2>
          </div>

          <button
            onClick={computeRanking}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg shadow transition"
          >
            Compute Rankings
          </button>
        </div>

        {/* RESULTS */}
        {ranking.length > 0 && (
          <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Ranking Results
            </h2>

            {ranking.map((r, i) => (
              <div key={i} className="p-4 border-b">
                <p className="font-bold text-gray-900">
                  {i + 1}. {r.filename}
                </p>
                <p className="text-sm text-gray-600">Score: {r.score}</p>
                <p className="text-xs text-gray-500 mt-1 italic">
                  {r.rawText}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status message */}
      {message && (
        <p className="text-center mt-6 text-green-700 font-medium animate-fade">
          {message}
        </p>
      )}
    </div>
  );
}
