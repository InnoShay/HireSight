"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function SystemInitLoader({ isActive, onComplete }) {
    const [stage, setStage] = useState(0);
    const [progress, setProgress] = useState(0);

    const loadingSteps = [
        "Authenticating credentials...",
        "Initializing user session...",
        "Loading dashboard modules...",
        "Configuring workspace...",
        "System ready"
    ];

    useEffect(() => {
        if (!isActive) {
            setStage(0);
            setProgress(0);
            return;
        }

        // Progress animation
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                return prev + 2;
            });
        }, 30);

        // Stage progression
        const stageInterval = setInterval(() => {
            setStage(prev => {
                if (prev >= loadingSteps.length - 1) {
                    clearInterval(stageInterval);
                    setTimeout(() => onComplete?.(), 500);
                    return prev;
                }
                return prev + 1;
            });
        }, 400);

        return () => {
            clearInterval(progressInterval);
            clearInterval(stageInterval);
        };
    }, [isActive, onComplete]);

    return (
        <AnimatePresence>
            {isActive && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-[#0a0a0f] overflow-hidden"
                >
                    {/* Animated Grid Background */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="absolute inset-0"
                    >
                        {/* Perspective Grid */}
                        <div
                            className="absolute inset-0 opacity-20"
                            style={{
                                backgroundImage: `
                                    linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
                                    linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
                                `,
                                backgroundSize: '60px 60px',
                                transform: 'perspective(500px) rotateX(60deg)',
                                transformOrigin: 'center top',
                                maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)'
                            }}
                        />

                        {/* Radial glow */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <div className="w-[800px] h-[800px] bg-gradient-radial from-blue-500/20 via-purple-500/10 to-transparent rounded-full blur-3xl" />
                        </motion.div>
                    </motion.div>

                    {/* Progress Line at Top */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.3 }}
                        className="absolute top-0 left-0 right-0 h-1 bg-white/10 origin-left"
                    >
                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: progress / 100 }}
                            transition={{ duration: 0.1 }}
                            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 origin-left"
                            style={{ boxShadow: '0 0 20px rgba(59, 130, 246, 0.8), 0 0 40px rgba(139, 92, 246, 0.6)' }}
                        />
                    </motion.div>

                    {/* Center Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        {/* Logo Animation */}
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{
                                type: "spring",
                                stiffness: 200,
                                damping: 20,
                                delay: 0.1
                            }}
                            className="mb-8"
                        >
                            <div className="relative">
                                {/* Outer Ring */}
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                    className="absolute -inset-4"
                                >
                                    <svg className="w-24 h-24" viewBox="0 0 100 100">
                                        <circle
                                            cx="50"
                                            cy="50"
                                            r="45"
                                            fill="none"
                                            stroke="url(#gradient1)"
                                            strokeWidth="2"
                                            strokeDasharray="10 5"
                                            className="opacity-50"
                                        />
                                        <defs>
                                            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#3b82f6" />
                                                <stop offset="100%" stopColor="#8b5cf6" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </motion.div>

                                {/* Inner Logo */}
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold shadow-2xl shadow-purple-500/50">
                                    H
                                </div>

                                {/* Pulse Effect */}
                                <motion.div
                                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500"
                                />
                            </div>
                        </motion.div>

                        {/* Brand Name */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-white mb-8"
                        >
                            HireSight
                        </motion.h1>

                        {/* Loading Steps */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-center space-y-4"
                        >
                            {/* Current Step */}
                            <div className="h-6 overflow-hidden">
                                <AnimatePresence mode="wait">
                                    <motion.p
                                        key={stage}
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -20, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="text-blue-400 font-medium"
                                    >
                                        {loadingSteps[stage]}
                                    </motion.p>
                                </AnimatePresence>
                            </div>

                            {/* Progress Percentage */}
                            <motion.p
                                className="text-gray-500 text-sm font-mono"
                            >
                                {Math.round(progress)}%
                            </motion.p>
                        </motion.div>

                        {/* Wireframe Cards Preview */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="mt-12 flex gap-4"
                        >
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.8 + i * 0.1 }}
                                    className="relative"
                                >
                                    {/* SVG Wireframe */}
                                    <svg
                                        className="w-32 h-20"
                                        viewBox="0 0 128 80"
                                        fill="none"
                                    >
                                        <motion.rect
                                            x="1"
                                            y="1"
                                            width="126"
                                            height="78"
                                            rx="8"
                                            stroke="url(#cardGradient)"
                                            strokeWidth="2"
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ duration: 0.8, delay: 0.9 + i * 0.15 }}
                                        />
                                        <defs>
                                            <linearGradient id="cardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                                                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" />
                                            </linearGradient>
                                        </defs>
                                    </svg>

                                    {/* Fill animation */}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 1.5 + i * 0.1 }}
                                        className="absolute inset-0 m-[2px] rounded-lg bg-gradient-to-br from-white/5 to-white/10 backdrop-blur"
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Floating Particles */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        {[...Array(20)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{
                                    x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                                    y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 20,
                                    opacity: 0
                                }}
                                animate={{
                                    y: -20,
                                    opacity: [0, 1, 0]
                                }}
                                transition={{
                                    duration: 3 + Math.random() * 2,
                                    repeat: Infinity,
                                    delay: Math.random() * 2
                                }}
                                className="absolute w-1 h-1 bg-blue-400 rounded-full"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    boxShadow: '0 0 10px rgba(59, 130, 246, 0.8)'
                                }}
                            />
                        ))}
                    </div>

                    {/* Bottom Tech Lines */}
                    <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-8">
                        {[...Array(5)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ scaleX: 0, opacity: 0 }}
                                animate={{ scaleX: 1, opacity: 0.3 }}
                                transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                                className="w-16 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"
                            />
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
