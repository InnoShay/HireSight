"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface PreloaderProps {
    onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
    const [progress, setProgress] = useState(0);
    const [phase, setPhase] = useState<"loading" | "complete" | "exit">("loading");
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(0);
    const progressRef = useRef(0);
    const timeRef = useRef(0);

    // Progress counter
    useEffect(() => {
        const duration = 2000; // 2 seconds
        const startTime = performance.now();

        const updateProgress = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const newProgress = Math.min(100, Math.floor((elapsed / duration) * 100));

            setProgress(newProgress);
            progressRef.current = newProgress;

            if (newProgress < 100) {
                requestAnimationFrame(updateProgress);
            } else {
                setPhase("complete");
                setTimeout(() => {
                    setPhase("exit");
                    setTimeout(onComplete, 500);
                }, 200);
            }
        };

        requestAnimationFrame(updateProgress);
    }, [onComplete]);

    // Canvas wireframe animation
    const drawFrame = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;
        const p = progressRef.current / 100; // 0 to 1
        const t = timeRef.current;

        // Clear canvas
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, width, height);

        // Grid settings
        const gridCols = 20;
        const gridRows = 12;
        const cellWidth = width / gridCols;
        const cellHeight = height / gridRows;
        const centerX = width / 2;
        const centerY = height / 2;
        const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);

        // Draw grid lines based on progress
        ctx.lineWidth = 1;

        // Horizontal lines
        for (let row = 0; row <= gridRows; row++) {
            const y = row * cellHeight;
            const distFromCenterY = Math.abs(y - centerY) / centerY; // 0 at center, 1 at edges

            // Only draw if progress allows
            if (p >= distFromCenterY * 0.9) {
                const alpha = Math.min(0.6, (p - distFromCenterY * 0.9) * 3);
                ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
                ctx.beginPath();

                for (let col = 0; col <= gridCols; col++) {
                    const x = col * cellWidth;
                    // Wave effect
                    const waveOffset = Math.sin(col * 0.5 + t * 3) * 8 * p;
                    const pointY = y + waveOffset;

                    if (col === 0) {
                        ctx.moveTo(x, pointY);
                    } else {
                        ctx.lineTo(x, pointY);
                    }
                }
                ctx.stroke();
            }
        }

        // Vertical lines
        for (let col = 0; col <= gridCols; col++) {
            const x = col * cellWidth;
            const distFromCenterX = Math.abs(x - centerX) / centerX; // 0 at center, 1 at edges

            // Only draw if progress allows
            if (p >= distFromCenterX * 0.9) {
                const alpha = Math.min(0.5, (p - distFromCenterX * 0.9) * 3);
                ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
                ctx.beginPath();

                for (let row = 0; row <= gridRows; row++) {
                    const y = row * cellHeight;
                    // Wave effect
                    const waveOffset = Math.sin(row * 0.5 + t * 3) * 8 * p;
                    const pointX = x + waveOffset;

                    if (row === 0) {
                        ctx.moveTo(pointX, y);
                    } else {
                        ctx.lineTo(pointX, y);
                    }
                }
                ctx.stroke();
            }
        }

        // Center glow that grows with progress
        const glowRadius = 100 + 300 * p;
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, glowRadius);
        gradient.addColorStop(0, `rgba(59, 130, 246, ${0.25 * p})`);
        gradient.addColorStop(0.5, `rgba(139, 92, 246, ${0.1 * p})`);
        gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        timeRef.current += 0.016;
        animationRef.current = requestAnimationFrame(drawFrame);
    }, []);

    // Initialize canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        // Start animation
        animationRef.current = requestAnimationFrame(drawFrame);

        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animationRef.current);
        };
    }, [drawFrame]);

    return (
        <div className="fixed inset-0 z-[9999]">
            {/* Canvas - Full screen wireframe */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
                style={{
                    opacity: phase === "exit" ? 0 : 1,
                    transition: "opacity 0.3s ease-out",
                }}
            />

            {/* Left Curtain */}
            <div
                className="absolute inset-y-0 left-0 w-1/2 bg-black"
                style={{
                    transform: phase === "exit" ? "translateX(-100%)" : "translateX(0%)",
                    transition: "transform 0.5s cubic-bezier(0.65, 0, 0.35, 1)",
                }}
            />

            {/* Right Curtain */}
            <div
                className="absolute inset-y-0 right-0 w-1/2 bg-black"
                style={{
                    transform: phase === "exit" ? "translateX(100%)" : "translateX(0%)",
                    transition: "transform 0.5s cubic-bezier(0.65, 0, 0.35, 1)",
                }}
            />

            {/* Center Content */}
            <div
                className="absolute inset-0 flex flex-col items-center justify-center z-10"
                style={{
                    opacity: phase === "exit" ? 0 : 1,
                    transform: phase === "exit" ? "scale(0.95)" : "scale(1)",
                    transition: "all 0.3s ease-out",
                }}
            >
                {/* Counter */}
                <div className="relative">
                    <div
                        className="font-mono font-bold text-white tabular-nums leading-none"
                        style={{
                            fontSize: "clamp(100px, 22vw, 220px)",
                            textShadow: `
                0 0 40px rgba(59, 130, 246, ${0.5 + progress * 0.005}),
                0 0 80px rgba(59, 130, 246, ${0.3 + progress * 0.003}),
                0 0 120px rgba(139, 92, 246, ${0.2 + progress * 0.002})
              `,
                        }}
                    >
                        {progress}
                        <span className="text-blue-400/70 ml-1" style={{ fontSize: "0.3em" }}>
                            %
                        </span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-8 w-56 md:w-72 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full"
                        style={{
                            width: `${progress}%`,
                            background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
                            boxShadow: "0 0 20px rgba(59, 130, 246, 0.6)",
                            transition: "width 0.05s linear",
                        }}
                    />
                </div>

                {/* Status */}
                <div className="mt-5 text-blue-400/50 text-xs tracking-[0.25em] uppercase font-medium">
                    {phase === "complete" ? "Ready" : "Loading"}
                </div>
            </div>

            {/* Center glow line on exit */}
            {phase === "exit" && (
                <div
                    className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2px] z-20"
                    style={{
                        background: "linear-gradient(to bottom, transparent 5%, #3b82f6 50%, transparent 95%)",
                        boxShadow: "0 0 50px 15px rgba(59, 130, 246, 0.6)",
                    }}
                />
            )}
        </div>
    );
}
