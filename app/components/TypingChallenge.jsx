"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { XMarkIcon, TrophyIcon, ClockIcon, ChartBarIcon, SparklesIcon, ArrowPathIcon } from "@heroicons/react/24/solid";

// Professional word list for typing challenges
const wordLists = {
    easy: ["the", "be", "to", "of", "and", "a", "in", "that", "have", "it", "for", "not", "on", "with", "he", "as", "you", "do", "at", "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", "or", "an", "will", "my", "one", "all", "would", "there", "their", "what", "so", "up", "out", "if", "about", "who", "get", "which", "go", "me"],
    medium: ["resume", "skills", "hiring", "talent", "career", "interview", "candidate", "position", "experience", "qualification", "professional", "employment", "recruitment", "manager", "company", "application", "opportunity", "development", "leadership", "teamwork", "communication", "problem", "solving", "creative", "innovative", "dedicated", "motivated", "organized", "efficient", "reliable"],
    hard: ["assessment", "evaluation", "qualification", "achievement", "recommendation", "responsibility", "collaboration", "implementation", "optimization", "performance", "productivity", "methodology", "infrastructure", "comprehensive", "proficiency", "exceptional", "entrepreneurial", "negotiation", "analytical", "strategic"]
};

const generateWords = (count = 30) => {
    const allWords = [...wordLists.easy, ...wordLists.medium, ...wordLists.hard];
    const shuffled = allWords.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count).join(" ");
};

export default function TypingChallenge({ isOpen, onClose, onAnalysisComplete, aiLoading }) {
    const [gameState, setGameState] = useState("idle"); // idle, playing, finished
    const [text, setText] = useState("");
    const [userInput, setUserInput] = useState("");
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [bestScore, setBestScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [showAnalysisComplete, setShowAnalysisComplete] = useState(false);
    const inputRef = useRef(null);

    // Load best score from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("hiresight_typing_best");
        if (saved) setBestScore(parseInt(saved, 10));
    }, []);

    // Generate new text on mount
    useEffect(() => {
        if (isOpen && gameState === "idle") {
            setText(generateWords(40));
        }
    }, [isOpen, gameState]);

    // Timer countdown
    useEffect(() => {
        let interval;
        if (gameState === "playing" && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        finishGame();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [gameState, timeLeft]);

    // Focus input when game starts
    useEffect(() => {
        if (gameState === "playing" && inputRef.current) {
            inputRef.current.focus();
        }
    }, [gameState]);

    // Watch for AI analysis completion
    useEffect(() => {
        if (!aiLoading && isOpen) {
            setShowAnalysisComplete(true);
        }
    }, [aiLoading, isOpen]);

    const startGame = () => {
        setText(generateWords(40));
        setUserInput("");
        setStartTime(Date.now());
        setEndTime(null);
        setWpm(0);
        setAccuracy(100);
        setTimeLeft(60);
        setGameState("playing");
        setShowAnalysisComplete(false);
    };

    const finishGame = useCallback(() => {
        setEndTime(Date.now());
        setGameState("finished");

        // Calculate final stats
        const words = userInput.trim().split(/\s+/).filter(w => w.length > 0);
        const correctWords = words.filter((word, i) => word === text.split(" ")[i]);
        const finalWpm = Math.round((correctWords.length / 60) * 60);
        const finalAccuracy = words.length > 0 ? Math.round((correctWords.length / words.length) * 100) : 0;

        setWpm(finalWpm);
        setAccuracy(finalAccuracy);

        // Update best score
        if (finalWpm > bestScore) {
            setBestScore(finalWpm);
            localStorage.setItem("hiresight_typing_best", finalWpm.toString());
        }
    }, [userInput, text, bestScore]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setUserInput(value);

        // Calculate live stats
        const words = value.trim().split(/\s+/).filter(w => w.length > 0);
        const targetWords = text.split(" ");
        const correctWords = words.filter((word, i) => word === targetWords[i]);

        // Calculate WPM based on time elapsed
        const timeElapsed = (Date.now() - startTime) / 1000 / 60; // in minutes
        if (timeElapsed > 0) {
            setWpm(Math.round(correctWords.length / timeElapsed));
        }

        // Calculate accuracy
        if (words.length > 0) {
            setAccuracy(Math.round((correctWords.length / words.length) * 100));
        }

        // Check if completed all text
        if (value.trim() === text.trim()) {
            finishGame();
        }
    };

    const renderText = () => {
        const words = text.split(" ");
        const typedWords = userInput.split(" ");

        return words.map((word, i) => {
            let className = "text-gray-400 dark:text-gray-500"; // Default

            if (i < typedWords.length - 1) {
                // Already typed word
                className = typedWords[i] === word
                    ? "text-green-500 dark:text-green-400"
                    : "text-red-500 dark:text-red-400 line-through";
            } else if (i === typedWords.length - 1 && userInput.endsWith(" ") === false) {
                // Currently typing word
                const currentTyped = typedWords[i] || "";
                const isCorrectSoFar = word.startsWith(currentTyped);
                className = isCorrectSoFar
                    ? "text-blue-500 dark:text-blue-400 underline"
                    : "text-red-500 dark:text-red-400 underline";
            }

            return (
                <span key={i} className={`${className} transition-colors`}>
                    {word}{" "}
                </span>
            );
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-white/10">
                {/* Gradient Header */}
                <div className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCAyLTRzMiAyIDIgNC0yIDQtMiA0LTItMi0yLTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />

                    <div className="relative px-6 py-5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                                <SparklesIcon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Speed Typing Challenge</h2>
                                <p className="text-sm text-white/70">Test your typing skills while AI analyzes</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                        >
                            <XMarkIcon className="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>

                {/* Analysis Complete Banner */}
                {showAnalysisComplete && (
                    <div className="mx-6 mt-4 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/30 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                <SparklesIcon className="w-5 h-5 text-green-500" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-green-700 dark:text-green-400">AI Analysis Complete!</h3>
                                <p className="text-sm text-green-600 dark:text-green-500">Your candidate rankings are ready to view</p>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                onClose();
                                onAnalysisComplete?.();
                            }}
                            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-all hover:scale-105"
                        >
                            View Results →
                        </button>
                    </div>
                )}

                {/* Stats Bar */}
                <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5">
                    <div className="grid grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-gray-50 dark:bg-white/5 rounded-xl">
                            <div className="flex items-center justify-center gap-1 text-gray-500 dark:text-gray-400 text-xs font-medium mb-1">
                                <ClockIcon className="w-3.5 h-3.5" />
                                TIME
                            </div>
                            <div className="text-2xl font-black text-gray-800 dark:text-white">{timeLeft}s</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 dark:bg-white/5 rounded-xl">
                            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">WPM</div>
                            <div className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{wpm}</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 dark:bg-white/5 rounded-xl">
                            <div className="flex items-center justify-center gap-1 text-gray-500 dark:text-gray-400 text-xs font-medium mb-1">
                                <ChartBarIcon className="w-3.5 h-3.5" />
                                ACCURACY
                            </div>
                            <div className={`text-2xl font-black ${accuracy >= 90 ? "text-green-500" : accuracy >= 70 ? "text-yellow-500" : "text-red-500"}`}>{accuracy}%</div>
                        </div>
                        <div className="text-center p-3 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-500/10 dark:to-amber-500/10 rounded-xl border border-yellow-200 dark:border-yellow-500/20">
                            <div className="flex items-center justify-center gap-1 text-yellow-600 dark:text-yellow-400 text-xs font-medium mb-1">
                                <TrophyIcon className="w-3.5 h-3.5" />
                                BEST
                            </div>
                            <div className="text-2xl font-black text-yellow-600 dark:text-yellow-400">{bestScore}</div>
                        </div>
                    </div>
                </div>

                {/* Game Area */}
                <div className="p-6">
                    {gameState === "idle" && (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                                <SparklesIcon className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Ready to Type?</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                                Test your typing speed while our AI analyzes your candidates. You have 60 seconds!
                            </p>
                            <button
                                onClick={startGame}
                                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-purple-500/30 transition-all hover:scale-105"
                            >
                                Start Challenge
                            </button>
                        </div>
                    )}

                    {gameState === "playing" && (
                        <div className="space-y-4">
                            {/* Text Display */}
                            <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 min-h-[120px] text-lg leading-relaxed font-mono">
                                {renderText()}
                            </div>

                            {/* Input */}
                            <textarea
                                ref={inputRef}
                                value={userInput}
                                onChange={handleInputChange}
                                placeholder="Start typing here..."
                                className="w-full p-4 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-white/10 rounded-2xl text-lg font-mono focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors resize-none text-gray-800 dark:text-white placeholder-gray-400"
                                rows={3}
                                autoFocus
                                spellCheck={false}
                                autoComplete="off"
                                autoCapitalize="off"
                            />

                            {/* Progress Bar */}
                            <div className="h-2 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 rounded-full"
                                    style={{ width: `${(userInput.trim().split(/\s+/).filter(w => w).length / text.split(" ").length) * 100}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {gameState === "finished" && (
                        <div className="text-center py-8">
                            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
                                <TrophyIcon className="w-12 h-12 text-white" />
                            </div>
                            <h3 className="text-3xl font-black text-gray-800 dark:text-white mb-2">Challenge Complete!</h3>

                            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto my-8">
                                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl">
                                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Final WPM</div>
                                    <div className="text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{wpm}</div>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl">
                                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Accuracy</div>
                                    <div className={`text-4xl font-black ${accuracy >= 90 ? "text-green-500" : accuracy >= 70 ? "text-yellow-500" : "text-red-500"}`}>{accuracy}%</div>
                                </div>
                            </div>

                            {wpm >= bestScore && wpm > 0 && (
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 rounded-full font-semibold text-sm mb-6">
                                    <TrophyIcon className="w-4 h-4" />
                                    New Personal Best!
                                </div>
                            )}

                            <div className="flex items-center justify-center gap-4">
                                <button
                                    onClick={startGame}
                                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all hover:scale-105"
                                >
                                    <ArrowPathIcon className="w-5 h-5" />
                                    Try Again
                                </button>
                                {showAnalysisComplete && (
                                    <button
                                        onClick={() => {
                                            onClose();
                                            onAnalysisComplete?.();
                                        }}
                                        className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-all hover:scale-105"
                                    >
                                        View Results →
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 dark:bg-white/[0.02] border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                    <p className="text-xs text-gray-400">
                        {aiLoading ? (
                            <span className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                                AI is analyzing your candidates...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2 text-green-500">
                                <span className="w-2 h-2 bg-green-500 rounded-full" />
                                Analysis complete
                            </span>
                        )}
                    </p>
                    <button
                        onClick={onClose}
                        className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    >
                        Skip game
                    </button>
                </div>
            </div>
        </div>
    );
}
