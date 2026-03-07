"use client";

import { useEffect, useRef, useState } from "react";

export default function WatsonChat() {
    const [isLoaded, setIsLoaded] = useState(false);
    const scriptLoaded = useRef(false);

    useEffect(() => {
        if (scriptLoaded.current) return;
        scriptLoaded.current = true;

        window.watsonAssistantChatOptions = {
            integrationID: "09639690-18cd-4778-8438-39dd8e7edc63",
            region: "au-syd",
            serviceInstanceID: "bde6851e-7f4b-4618-a105-42b427dfb094",
            showLauncher: false, // We use our custom launcher
            onLoad: async (instance) => {
                // Apply custom styling overrides
                const customStyles = document.createElement("style");
                customStyles.textContent = `
          /* Watson chat window styling */
          #WACWidget.WACWidget .WACWidget__Chat {
            border-radius: 20px !important;
            overflow: hidden !important;
            box-shadow: 
              0 25px 60px rgba(0, 0, 0, 0.5),
              0 0 40px rgba(139, 92, 246, 0.15),
              0 0 80px rgba(59, 130, 246, 0.1) !important;
            border: 1px solid rgba(139, 92, 246, 0.2) !important;
          }

          /* Header customization */
          #WACWidget.WACWidget .WACWidget__Header {
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%) !important;
            border-bottom: 1px solid rgba(139, 92, 246, 0.3) !important;
          }

          /* Chat container background */
          #WACWidget.WACWidget .WACWidget__MessageView {
            background: #0d0d15 !important;
          }

          /* Input area */
          #WACWidget.WACWidget .WACWidget__InputArea {
            background: #111118 !important;
            border-top: 1px solid rgba(139, 92, 246, 0.2) !important;
          }
        `;
                document.head.appendChild(customStyles);

                // Listen for open/close events
                instance.on({
                    type: "window:open", handler: () => {
                        document.querySelector('.watson-chat-launcher')?.classList.add('chat-open');
                    }
                });
                instance.on({
                    type: "window:close", handler: () => {
                        document.querySelector('.watson-chat-launcher')?.classList.remove('chat-open');
                    }
                });

                await instance.render();
                setIsLoaded(true);

                // Store instance reference for our custom launcher
                window.__watsonInstance = instance;
            },
        };

        const script = document.createElement("script");
        script.src =
            "https://web-chat.global.assistant.watson.appdomain.cloud/versions/" +
            (window.watsonAssistantChatOptions.clientVersion || "latest") +
            "/WatsonAssistantChatEntry.js";
        script.async = true;
        document.head.appendChild(script);

        return () => {
            // Cleanup is not needed as Watson manages its own lifecycle
        };
    }, []);

    const toggleChat = () => {
        if (window.__watsonInstance) {
            window.__watsonInstance.toggleOpen();
        }
    };

    return (
        <>
            {/* Custom Animated Launcher Button */}
            <button
                onClick={toggleChat}
                className="watson-chat-launcher"
                aria-label="Open AI Assistant"
                title="Chat with HireSight AI Assistant"
            >
                {/* Animated ring pulse */}
                <span className="launcher-ring launcher-ring-1" />
                <span className="launcher-ring launcher-ring-2" />
                <span className="launcher-ring launcher-ring-3" />

                {/* Glow backdrop */}
                <span className="launcher-glow" />

                {/* Icon container */}
                <span className="launcher-icon-wrapper">
                    {/* Chat icon (default) */}
                    <svg
                        className="launcher-icon launcher-icon-chat"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M12 2C6.48 2 2 5.58 2 10c0 2.24 1.12 4.27 2.93 5.72-.17 1.41-.73 2.7-1.62 3.72a.5.5 0 00.36.84c2.09 0 3.89-.87 5.08-1.72.73.13 1.49.2 2.25.2 5.52 0 10-3.58 10-8s-4.48-8-10-8z"
                            fill="currentColor"
                        />
                        <circle cx="8" cy="10" r="1.2" fill="#0d0d15" />
                        <circle cx="12" cy="10" r="1.2" fill="#0d0d15" />
                        <circle cx="16" cy="10" r="1.2" fill="#0d0d15" />
                    </svg>

                    {/* Close icon (when open) */}
                    <svg
                        className="launcher-icon launcher-icon-close"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M18 6L6 18M6 6l12 12"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </span>

                {/* "AI" badge */}
                <span className="launcher-badge">AI</span>
            </button>

            {/* Tooltip */}
            <div className="watson-tooltip">
                <span>💬</span> Need help? Ask our AI assistant!
                <div className="watson-tooltip-arrow" />
            </div>

            {/* Inline styles for the launcher - keeps everything self-contained */}
            <style jsx global>{`
        /* ============================================
           WATSON CHAT LAUNCHER - ANIMATIONS
           ============================================ */

        .watson-chat-launcher {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 64px;
          height: 64px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 50%, #06b6d4 100%);
          background-size: 200% 200%;
          animation: launcherGradient 4s ease infinite;
          box-shadow:
            0 4px 15px rgba(139, 92, 246, 0.5),
            0 8px 30px rgba(59, 130, 246, 0.3),
            inset 0 1px 1px rgba(255, 255, 255, 0.2);
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
                      box-shadow 0.3s ease;
          overflow: visible;
        }

        .watson-chat-launcher:hover {
          transform: scale(1.12);
          box-shadow:
            0 6px 25px rgba(139, 92, 246, 0.6),
            0 12px 40px rgba(59, 130, 246, 0.4),
            inset 0 1px 1px rgba(255, 255, 255, 0.3);
        }

        .watson-chat-launcher:active {
          transform: scale(0.95);
        }

        /* Gradient animation */
        @keyframes launcherGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* ============================================
           PULSE RINGS
           ============================================ */

        .launcher-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 2px solid rgba(139, 92, 246, 0.4);
          transform: translate(-50%, -50%) scale(1);
          animation: ringPulse 3s ease-out infinite;
          pointer-events: none;
        }

        .launcher-ring-2 {
          animation-delay: 1s;
        }

        .launcher-ring-3 {
          animation-delay: 2s;
        }

        @keyframes ringPulse {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.6;
          }
          100% {
            transform: translate(-50%, -50%) scale(2.2);
            opacity: 0;
          }
        }

        /* Hide rings when chat is open */
        .watson-chat-launcher.chat-open .launcher-ring {
          animation: none;
          opacity: 0;
        }

        /* ============================================
           GLOW EFFECT
           ============================================ */

        .launcher-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 120%;
          height: 120%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(139, 92, 246, 0.3) 0%,
            rgba(59, 130, 246, 0.15) 40%,
            transparent 70%
          );
          animation: glowPulse 2s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes glowPulse {
          0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.3); }
        }

        /* ============================================
           ICON ANIMATIONS
           ============================================ */

        .launcher-icon-wrapper {
          position: relative;
          width: 28px;
          height: 28px;
          z-index: 2;
        }

        .launcher-icon {
          position: absolute;
          top: 0;
          left: 0;
          width: 28px;
          height: 28px;
          color: white;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .launcher-icon-chat {
          opacity: 1;
          transform: scale(1) rotate(0deg);
        }

        .launcher-icon-close {
          opacity: 0;
          transform: scale(0.3) rotate(-90deg);
        }

        /* When chat is open, swap icons */
        .watson-chat-launcher.chat-open .launcher-icon-chat {
          opacity: 0;
          transform: scale(0.3) rotate(90deg);
        }

        .watson-chat-launcher.chat-open .launcher-icon-close {
          opacity: 1;
          transform: scale(1) rotate(0deg);
        }

        /* ============================================
           AI BADGE
           ============================================ */

        .launcher-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          font-size: 8px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          letter-spacing: 0.5px;
          z-index: 3;
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.5);
          animation: badgeBounce 2s ease-in-out infinite;
        }

        @keyframes badgeBounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }

        /* Hide badge when chat is open */
        .watson-chat-launcher.chat-open .launcher-badge {
          opacity: 0;
          transform: scale(0);
          transition: all 0.3s ease;
        }

        /* ============================================
           TOOLTIP
           ============================================ */

        .watson-tooltip {
          position: fixed;
          bottom: 96px;
          right: 24px;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          color: #e2e8f0;
          padding: 10px 16px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 500;
          z-index: 9999;
          pointer-events: none;
          opacity: 0;
          transform: translateY(8px) scale(0.95);
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          border: 1px solid rgba(139, 92, 246, 0.3);
          box-shadow:
            0 8px 30px rgba(0, 0, 0, 0.4),
            0 0 20px rgba(139, 92, 246, 0.1);
          white-space: nowrap;
          backdrop-filter: blur(12px);
          font-family: var(--font-geist-sans), 'Inter', system-ui, sans-serif;
        }

        .watson-tooltip-arrow {
          position: absolute;
          bottom: -6px;
          right: 28px;
          width: 12px;
          height: 12px;
          background: #16213e;
          border-right: 1px solid rgba(139, 92, 246, 0.3);
          border-bottom: 1px solid rgba(139, 92, 246, 0.3);
          transform: rotate(45deg);
        }

        .watson-chat-launcher:hover ~ .watson-tooltip {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .watson-chat-launcher.chat-open ~ .watson-tooltip {
          opacity: 0 !important;
          transform: translateY(8px) scale(0.95) !important;
        }

        /* ============================================
           WATSON WIDGET OVERRIDES
           ============================================ */

        /* Smooth open/close animation for the Watson chat window */
        #WACWidget.WACWidget .WAC__inputContainer {
          border-radius: 0 0 20px 20px !important;
        }

        /* Custom scrollbar inside Watson chat */
        #WACWidget.WACWidget ::-webkit-scrollbar {
          width: 6px;
        }

        #WACWidget.WACWidget ::-webkit-scrollbar-track {
          background: transparent;
        }

        #WACWidget.WACWidget ::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.3);
          border-radius: 3px;
        }

        #WACWidget.WACWidget ::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.5);
        }

        /* ============================================
           RESPONSIVE
           ============================================ */

        @media (max-width: 768px) {
          .watson-chat-launcher {
            width: 56px;
            height: 56px;
            bottom: 16px;
            right: 16px;
          }

          .launcher-icon-wrapper {
            width: 24px;
            height: 24px;
          }

          .launcher-icon {
            width: 24px;
            height: 24px;
          }

          .watson-tooltip {
            display: none;
          }
        }
      `}</style>
        </>
    );
}
