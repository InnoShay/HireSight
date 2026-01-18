<div align="center">

# 🎯 HireSight

### AI-Powered Resume Screening & Candidate Ranking Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-4.22-FF6F00?style=for-the-badge&logo=tensorflow)](https://www.tensorflow.org/js)
[![Gemini](https://img.shields.io/badge/Gemini_2.5-Flash-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-12.7-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**Transform your hiring process from hours to seconds with hybrid AI intelligence.**

[Live Demo](https://hiresight-delta.vercel.app/) • [Report Bug](https://github.com/InnoShay/HireSight/issues) • [Request Feature](https://github.com/InnoShay/HireSight/issues)

</div>

---

## 📋 Table of Contents

- [About The Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Project Structure](#-project-structure)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)
- [Acknowledgments](#-acknowledgments)

---

## 🚀 About The Project

**HireSight** is an enterprise-grade AI recruitment platform that transcends traditional keyword-based screening through a **hybrid intelligence architecture** combining deep learning with generative AI.

### The Problem
- Recruiters spend **23+ hours** screening resumes per hire
- **75% of qualified candidates** are rejected by rigid ATS keyword matching
- Manual screening introduces unconscious bias and inconsistency

### Our Solution
A dual-engine AI system that:
1. **Understands context** through semantic vector analysis
2. **Provides explainable insights** via generative AI
3. **Scales infinitely** with intelligent load balancing

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🧠 **Semantic Matching** | TensorFlow.js Universal Sentence Encoder generates 512-dimensional embeddings for contextual understanding |
| 🤖 **Gemini AI Analysis** | Deep skill extraction, experience mapping, and personalized improvement recommendations |
| ⚡ **Two-Stage Ranking** | Quick semantic scoring + deep AI analysis for optimal speed and accuracy |
| 📊 **JD Optimization** | AI-powered job description enhancement for better candidate matches |
| 🔍 **Duplicate Detection** | Hash-based comparison to identify duplicate resume submissions |
| 📧 **Email Notifications** | Automated alerts when ranking completes via Nodemailer |
| 🔐 **Secure Authentication** | Firebase Auth with protected routes and session management |
| 🌙 **Dark/Light Mode** | Beautiful, accessible UI with theme persistence |
| 📱 **Responsive Design** | Optimized for desktop, tablet, and mobile devices |
| 🚀 **Production Ready** | Deployed on Vercel with environment-based configuration |

---

## 🛠 Tech Stack

<div align="center">

### Frontend
![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)

### AI/ML Layer
![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Gemini_2.5_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)

### Backend & Database
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)

### Deployment
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

</div>

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER INTERFACE (Next.js)                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │  Dashboard  │  │   Results   │  │   Analytics & History   │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    API LAYER (Next.js Routes)                    │
│  /api/upload-resume  /api/quick-rank  /api/analyze-resumes      │
│  /api/parse-pdf      /api/optimize-jd  /api/send-notification   │
└─────────────────────────────┬───────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│   TensorFlow.js │ │  Gemini 2.5 AI  │ │    Firebase     │
│   + Universal   │ │  Deep Analysis  │ │   Auth + DB     │
│ Sentence Encoder│ │  (Round-Robin)  │ │                 │
└────────┬────────┘ └────────┬────────┘ └────────┬────────┘
         │                   │                   │
         └───────────────────┼───────────────────┘
                             ▼
                 ┌───────────────────────┐
                 │   Score Merger +      │
                 │   Experience Bonus    │
                 └───────────────────────┘
                             │
                             ▼
                 ┌───────────────────────┐
                 │   Ranked Candidates   │
                 │   + AI Insights       │
                 └───────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase account
- Google AI (Gemini) API key(s)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/InnoShay/HireSight.git
   cd HireSight
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (see [Environment Variables](#-environment-variables))

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_APIKEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTHDOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECTID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGEBUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_SENDERID=your_sender_id
NEXT_PUBLIC_FIREBASE_APPID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENTID=G-XXXXXXXXXX

# Gemini API Keys (Round-Robin Load Balancing)
GEMINI_API_KEY_1=your_gemini_key_1
GEMINI_API_KEY_2=your_gemini_key_2
GEMINI_API_KEY_3=your_gemini_key_3
# Add more keys for higher throughput

# Email Notifications (Nodemailer)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Web3Forms (Contact Form)
NEXT_PUBLIC_WEB3FORMS_KEY=your_web3forms_key
```

---

## 📡 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/upload-resume` | POST | Upload and parse PDF resumes |
| `/api/parse-pdf` | POST | Extract text from PDF files |
| `/api/quick-rank` | POST | Fast semantic similarity scoring |
| `/api/analyze-resumes` | POST | Deep AI analysis with Gemini |
| `/api/ai-analysis` | POST | Standalone AI insights |
| `/api/optimize-jd` | POST | AI-powered JD enhancement |
| `/api/send-notification` | POST | Email ranking results |

---

## 📁 Project Structure

```
HireSight/
├── app/
│   ├── api/                    # API routes
│   │   ├── analyze-resumes/    # Deep AI analysis
│   │   ├── quick-rank/         # Fast semantic scoring
│   │   ├── upload-resume/      # Resume upload handler
│   │   └── ...
│   ├── components/             # React components
│   │   ├── landing/            # Landing page sections
│   │   ├── AuthGuard.tsx       # Protected route wrapper
│   │   ├── Sidebar.jsx         # Navigation sidebar
│   │   └── ThemeToggle.jsx     # Dark/Light mode
│   ├── dashboard/              # Main dashboard
│   ├── results/                # Ranking results page
│   ├── analytics/              # Usage analytics
│   ├── history/                # Past rankings
│   └── layout.tsx              # Root layout
├── firebase/
│   └── config.js               # Firebase initialization
├── lib/
│   └── apiKeyManager.js        # Round-robin API orchestrator
├── public/                     # Static assets
└── package.json
```

---

## 📸 Screenshots

<div align="center">

### 🏠 Landing Page
*Stunning hero section with glassmorphism design*

### 📊 Dashboard
*Upload resumes and job descriptions with real-time status*

### 🏆 Results
*Ranked candidates with AI-powered insights and recommendations*

### 📈 Analytics
*Track screening history and performance metrics*

</div>

---

## 🤝 Contributing

Contributions make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 🙏 Acknowledgments

- [Google Gemini](https://ai.google.dev/) - Generative AI capabilities
- [TensorFlow.js](https://www.tensorflow.org/js) - Browser-based ML
- [Universal Sentence Encoder](https://tfhub.dev/google/universal-sentence-encoder/4) - Semantic embeddings
- [Firebase](https://firebase.google.com/) - Authentication & Database
- [Vercel](https://vercel.com/) - Deployment platform
- [Heroicons](https://heroicons.com/) - Beautiful icons
- [Framer Motion](https://www.framer.com/motion/) - Smooth animations

---

<div align="center">

**Built with ❤️ by Team InnoShay**

⭐ Star this repository if you found it helpful!

[Report Bug](https://github.com/InnoShay/HireSight/issues) • [Request Feature](https://github.com/InnoShay/HireSight/issues)

</div>
