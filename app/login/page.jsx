"use client";

import { useState, useEffect } from "react";
import { auth, db } from "../../firebase/config";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Carousel images with quotes - AI/Hiring themed illustrations
const carouselSlides = [
  {
    image: "/carousel-1.png",
    quote: "Transform Your Hiring Process",
    subtext: "AI-powered recruitment made simple",
  },
  {
    image: "/carousel-2.png",
    quote: "Find Perfect Matches",
    subtext: "Semantic analysis that understands context",
  },
  {
    image: "/carousel-3.png",
    quote: "Screen Smarter, Hire Faster",
    subtext: "From hours to seconds with HireSight",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [isSignup, setIsSignup] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isSignup && !agreeTerms) {
      setError("Please agree to the Terms & Conditions");
      return;
    }

    if (isSignup && (!firstName.trim() || !lastName.trim())) {
      setError("Please enter your first and last name");
      return;
    }

    setLoading(true);

    try {
      if (isSignup) {
        // Create user with Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update display name
        await updateProfile(user, {
          displayName: `${firstName} ${lastName}`,
        });

        // Store user data in Firestore
        await setDoc(doc(db, "users", user.uid), {
          firstName,
          lastName,
          email,
          displayName: `${firstName} ${lastName}`,
          createdAt: new Date().toISOString(),
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.push("/dashboard");
    } catch (e) {
      if (e.code === "auth/email-already-in-use") {
        setError("Email already in use");
      } else if (e.code === "auth/weak-password") {
        setError("Password should be at least 6 characters");
      } else if (e.code === "auth/invalid-credential") {
        setError("Invalid email or password");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      {/* Left Side - Image Carousel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 via-blue-600/20 to-transparent z-10" />

        {/* Carousel Images */}
        {carouselSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${currentSlide === index ? "opacity-100" : "opacity-0"
              }`}
          >
            <img
              src={slide.image}
              alt={slide.quote}
              className="w-full h-full object-cover"
            />
          </div>
        ))}

        {/* Content Overlay */}
        <div className="absolute inset-0 z-20 flex flex-col justify-between p-10">
          {/* Top - Logo & Back Link */}
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-white border border-white/20">
                H
              </div>
              <span className="text-xl font-bold text-white">HireSight</span>
            </Link>

            <Link
              href="/"
              className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white text-sm font-medium border border-white/20 hover:bg-white/20 transition-colors flex items-center gap-2"
            >
              Back to website
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Bottom - Quote & Indicators */}
          <div>
            {/* Quote */}
            <div className="mb-8">
              {carouselSlides.map((slide, index) => (
                <div
                  key={index}
                  className={`transition-all duration-500 ${currentSlide === index ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 absolute"
                    }`}
                >
                  <h2 className="text-3xl lg:text-4xl font-bold text-white mb-2">{slide.quote}</h2>
                  <p className="text-white/70 text-lg">{slide.subtext}</p>
                </div>
              ))}
            </div>

            {/* Carousel Indicators */}
            <div className="flex gap-2">
              {carouselSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-1 rounded-full transition-all duration-300 ${currentSlide === index ? "w-8 bg-white" : "w-4 bg-white/40"
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative overflow-hidden">
        {/* Background Orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl" />
        </div>

        {/* Form Container */}
        <div className="relative z-10 w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white">
                H
              </div>
              <span className="text-xl font-bold text-white">HireSight</span>
            </Link>
          </div>

          {/* Glassmorphism Card */}
          <div className="relative">
            {/* Card Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 rounded-3xl blur-xl" />

            <div className="relative bg-[#111118]/90 backdrop-blur-xl rounded-2xl border border-white/10 p-8 lg:p-10">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">
                  {isSignup ? "Create an account" : "Welcome back"}
                </h1>
                <p className="text-gray-400">
                  {isSignup ? "Already have an account? " : "Don't have an account? "}
                  <button
                    onClick={() => {
                      setIsSignup(!isSignup);
                      setError("");
                    }}
                    className="text-blue-400 hover:text-blue-300 font-medium hover:underline"
                  >
                    {isSignup ? "Log in" : "Sign up"}
                  </button>
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
                  <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span className="text-red-400 text-sm">{error}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name Fields - Only for Signup */}
                {isSignup && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">First name</label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="John"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Last name</label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Doe"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* Email */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@work-email.com"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Terms Checkbox - Only for Signup */}
                {isSignup && (
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => setAgreeTerms(!agreeTerms)}
                      className={`w-5 h-5 rounded flex-shrink-0 flex items-center justify-center border transition-all ${agreeTerms
                        ? "bg-blue-500 border-blue-500"
                        : "bg-white/5 border-white/20"
                        }`}
                    >
                      {agreeTerms && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    <span className="text-sm text-gray-400">
                      I agree to the{" "}
                      <a href="#" className="text-blue-400 hover:underline">
                        Terms & Conditions
                      </a>
                    </span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Please wait...</span>
                    </>
                  ) : (
                    <span>{isSignup ? "Create account" : "Sign in"}</span>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-gray-500 text-sm">Or {isSignup ? "register" : "continue"} with</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Social Login Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className="flex items-center justify-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium hover:bg-white/10 transition-all"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </button>

                <button
                  type="button"
                  className="flex items-center justify-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium hover:bg-white/10 transition-all"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  GitHub
                </button>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <a href="#" className="hover:text-gray-400 transition-colors">Terms of Use</a>
            <span className="mx-2">|</span>
            <a href="#" className="hover:text-gray-400 transition-colors">Privacy Policy</a>
          </div>
        </div>
      </div>
    </div>
  );
}
