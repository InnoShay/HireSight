"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ThemeToggle() {
    const [theme, setTheme] = useState("light");
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [transitionOrigin, setTransitionOrigin] = useState({ x: 0, y: 0 });
    const toggleRef = useRef(null);

    useEffect(() => {
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
            setTheme('dark');
        } else {
            document.documentElement.classList.remove('dark');
            setTheme('light');
        }
    }, []);

    const performThemeChange = useCallback((newTheme) => {
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
        }
        setTheme(newTheme);
    }, []);

    const toggleTheme = (e) => {
        if (isTransitioning) return;

        const newTheme = theme === "light" ? "dark" : "light";

        // Get click coordinates for circular expansion
        const rect = toggleRef.current?.getBoundingClientRect();
        const x = rect ? rect.left + rect.width / 2 : e.clientX;
        const y = rect ? rect.top + rect.height / 2 : e.clientY;
        setTransitionOrigin({ x, y });

        // Check for View Transitions API support
        if (document.startViewTransition) {
            document.startViewTransition(() => {
                performThemeChange(newTheme);
            });
        } else {
            // Fallback with Framer Motion overlay
            setIsTransitioning(true);

            // Delay theme change slightly to allow overlay to start
            setTimeout(() => {
                performThemeChange(newTheme);
            }, 50);

            // End transition
            setTimeout(() => {
                setIsTransitioning(false);
            }, 800);
        }
    };

    const isDark = theme === "dark";

    return (
        <>
            {/* Circular Transition Overlay (Fallback for browsers without View Transitions API) */}
            <AnimatePresence>
                {isTransitioning && (
                    <motion.div
                        initial={{
                            clipPath: `circle(0% at ${transitionOrigin.x}px ${transitionOrigin.y}px)`,
                        }}
                        animate={{
                            clipPath: `circle(150% at ${transitionOrigin.x}px ${transitionOrigin.y}px)`,
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                        className={`fixed inset-0 z-[9999] pointer-events-none ${theme === "dark"
                                ? "bg-[#0a0a0f]"
                                : "bg-slate-50"
                            }`}
                        style={{
                            boxShadow: theme === "dark"
                                ? `0 0 80px 20px rgba(6, 182, 212, 0.4), inset 0 0 60px 10px rgba(6, 182, 212, 0.2)`
                                : `0 0 80px 20px rgba(245, 158, 11, 0.4), inset 0 0 60px 10px rgba(245, 158, 11, 0.2)`,
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Premium Capsule Toggle */}
            <div
                ref={toggleRef}
                onClick={toggleTheme}
                className={`relative cursor-pointer select-none overflow-hidden transition-all duration-500 ${isDark
                        ? "bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600"
                        : "bg-gradient-to-r from-sky-300 via-sky-400 to-sky-300"
                    }`}
                style={{
                    width: "72px",
                    height: "36px",
                    borderRadius: "18px",
                    boxShadow: isDark
                        ? "inset 0 2px 8px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05)"
                        : "inset 0 2px 8px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.3)",
                }}
                role="button"
                aria-label="Toggle Theme"
                tabIndex={0}
            >
                {/* Stars (Dark Mode Background) */}
                <AnimatePresence>
                    {isDark && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="absolute inset-0"
                        >
                            {/* Twinkling Stars */}
                            <motion.div
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                                className="absolute left-3 top-3 w-1 h-1 bg-white rounded-full"
                            />
                            <motion.div
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                                className="absolute left-5 top-5 w-0.5 h-0.5 bg-white/80 rounded-full"
                            />
                            <motion.div
                                animate={{ opacity: [0.4, 1, 0.4] }}
                                transition={{ duration: 2.2, repeat: Infinity, delay: 0.6 }}
                                className="absolute left-2 bottom-3 w-0.5 h-0.5 bg-white/70 rounded-full"
                            />
                            <motion.div
                                animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.2, 1] }}
                                transition={{ duration: 1.8, repeat: Infinity, delay: 0.2 }}
                                className="absolute left-7 top-2 w-1 h-1 bg-white rounded-full"
                                style={{ filter: "blur(0.5px)" }}
                            />
                            <motion.div
                                animate={{ opacity: [0.3, 0.8, 0.3] }}
                                transition={{ duration: 2.5, repeat: Infinity, delay: 0.8 }}
                                className="absolute left-4 bottom-2 w-0.5 h-0.5 bg-white/60 rounded-full"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Clouds (Light Mode Background) */}
                <AnimatePresence>
                    {!isDark && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.4 }}
                            className="absolute inset-0 overflow-hidden"
                        >
                            {/* Cloud 1 - Large */}
                            <motion.div
                                animate={{ x: [0, 3, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute right-1 top-1"
                            >
                                <div className="relative">
                                    <div className="w-7 h-4 bg-white/90 rounded-full shadow-sm" />
                                    <div className="absolute -left-2 top-1 w-4 h-3 bg-white/80 rounded-full" />
                                    <div className="absolute right-0 top-1.5 w-3 h-2.5 bg-white/70 rounded-full" />
                                </div>
                            </motion.div>

                            {/* Cloud 2 - Small */}
                            <motion.div
                                animate={{ x: [0, -2, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                className="absolute right-3 bottom-1"
                            >
                                <div className="relative">
                                    <div className="w-5 h-2.5 bg-white/70 rounded-full" />
                                    <div className="absolute -left-1 top-0.5 w-2.5 h-2 bg-white/60 rounded-full" />
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Sun/Moon Orb */}
                <motion.div
                    animate={{
                        x: isDark ? 38 : 4,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                    }}
                    className="absolute top-1 w-7 h-7"
                >
                    {/* Outer Glow Ring */}
                    <motion.div
                        animate={{
                            boxShadow: isDark
                                ? "0 0 12px 4px rgba(226, 232, 240, 0.3), 0 0 20px 8px rgba(226, 232, 240, 0.1)"
                                : "0 0 16px 6px rgba(250, 204, 21, 0.4), 0 0 24px 10px rgba(250, 204, 21, 0.2)",
                            scale: [1, 1.05, 1],
                        }}
                        transition={{
                            boxShadow: { duration: 0.4 },
                            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                        }}
                        className="absolute inset-0 rounded-full"
                    />

                    {/* Main Orb */}
                    <motion.div
                        animate={{ rotate: isDark ? 180 : 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className={`relative w-full h-full rounded-full overflow-hidden ${isDark
                                ? "bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400"
                                : "bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-400"
                            }`}
                        style={{
                            boxShadow: isDark
                                ? "inset -2px -2px 6px rgba(0,0,0,0.15), inset 2px 2px 6px rgba(255,255,255,0.3)"
                                : "inset -2px -2px 6px rgba(0,0,0,0.1), inset 2px 2px 6px rgba(255,255,255,0.5)",
                        }}
                    >
                        {/* Moon Craters */}
                        <AnimatePresence>
                            {isDark && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-slate-400/50 rounded-full" />
                                    <div className="absolute bottom-2 left-1 w-2 h-2 bg-slate-400/40 rounded-full" />
                                    <div className="absolute top-3 left-2 w-1 h-1 bg-slate-400/30 rounded-full" />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Sun Rays Effect */}
                        <AnimatePresence>
                            {!isDark && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.3 }}
                                    className="absolute inset-0 flex items-center justify-center"
                                >
                                    <div className="w-3 h-3 bg-yellow-200/50 rounded-full blur-sm" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>
            </div>

            {/* View Transitions API CSS */}
            <style jsx global>{`
                ::view-transition-old(root),
                ::view-transition-new(root) {
                    animation: none;
                    mix-blend-mode: normal;
                }

                ::view-transition-old(root) {
                    z-index: 1;
                }

                ::view-transition-new(root) {
                    z-index: 9999;
                    animation: reveal 0.7s cubic-bezier(0.4, 0, 0.2, 1);
                }

                @keyframes reveal {
                    from {
                        clip-path: circle(0% at var(--toggle-x, 50%) var(--toggle-y, 50%));
                    }
                    to {
                        clip-path: circle(150% at var(--toggle-x, 50%) var(--toggle-y, 50%));
                    }
                }

                .dark ::view-transition-new(root) {
                    box-shadow: 0 0 80px 20px rgba(6, 182, 212, 0.3);
                }

                :root:not(.dark) ::view-transition-new(root) {
                    box-shadow: 0 0 80px 20px rgba(245, 158, 11, 0.3);
                }
            `}</style>
        </>
    );
}
