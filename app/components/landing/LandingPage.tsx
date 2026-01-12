"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Preloader from "./Preloader";
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import VideoShowcaseSection from "./VideoShowcaseSection";
import ShowcaseSection from "./ShowcaseSection";
import HowItWorksSection from "./HowItWorksSection";
import CTASection from "./CTASection";
import Footer from "./Footer";

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      <div className={`min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden ${loading ? "overflow-hidden" : ""}`}>
        {/* Navbar */}
        <nav
          className={`navbar flex items-center justify-between transition-all duration-300 ${scrolled ? "scrolled" : ""
            }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-sm">
              H
            </div>
            <span className="text-xl font-bold tracking-tight group-hover:text-blue-400 transition-colors">
              HireSight
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              How It Works
            </a>
            <a
              href="#showcase"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Showcase
            </a>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors px-4 py-2"
            >
              Sign In
            </Link>
            <Link
              href="/login"
              className="btn-primary text-sm py-2 px-5"
            >
              Sign Up
            </Link>
          </div>
        </nav>

        {/* Main Content */}
        <main>
          <HeroSection />
          <FeaturesSection />
          <VideoShowcaseSection />
          <ShowcaseSection />
          <HowItWorksSection />
          <CTASection />
        </main>

        <Footer />
      </div>
    </>
  );
}
