# Gauth Clone — AI Homework & Study Companion

[![Contest Status](https://img.shields.io/badge/8x_Engineer_Challenge-Active-blueviolet?style=for-the-badge)](https://github.com/tpsreekar37-dotcom/gauth-ai-study-companion)
[![Platform](https://img.shields.io/badge/Platform-iOS%20%7C%20Android%20%7C%20Web-blue?style=for-the-badge)](https://expo.dev)

A premium, production-ready AI Homework & Study Companion designed to mimic the core features of Gauth. It leverages computer vision (OCR) and Gemini AI to explain homework problems, generate interactive flashcards, track student progress, and test knowledge via spaced-repetition quizzes. Built as an entry for the **8x Engineer Challenge**.

---

## 🏆 Final Contest Optimization Pass

A comprehensive final hardening and premium UI optimization pass was executed on the `contest-final-optimization` branch to achieve **top-5 contest-quality** performance:
* **Explanation Screen Redesign:** Redesigned into structured flows with meta metrics (Solve Time, Difficulty, Accuracy score), accordion step cards with integrated mathematical equations, custom **Tutor Tips**, common student pitfalls warning cards, and interactive practice questions with instant choice feedback.
* **Home Dashboard Polish:** Enhanced visual card density, transparent glassmorphism, streak completion checklists, and dynamic counter badges for due cards and solved problems computed directly from state.
* **History Screen Upgrade:** Integrated top statistics headers (Solved Today, Solved This Week, Total solved logs), relative timestamps, custom subject icons, and color-coded difficulty chips.
* **AI Subject-Aware Prompts:** Dynamically updates Gemini instructions depending on the selected subject (Math, Science, History, General) to deliver authentic, structured outputs (equations, timelines, chemical formulas, code blocks).
* **Zero-Crash Robustness:** Included fallback handlers across the solver pipeline to guarantee graceful simulation flows when API keys or camera services are omitted.

---

## 📸 Screenshots & UI Design

> [!TIP]
> Visit the [`/screenshots/`](./screenshots/) directory to view all high-resolution design assets.

```
┌───────────────────────────┐  ┌───────────────────────────┐  ┌───────────────────────────┐
│       SPLASH SCREEN       │  │        HOME SCREEN        │  │       AI ANSWER SCREEN    │
│  [✦ Gauth AI Companion]   │  │   Hi Sreekar!             │  │   [x² - 4 = 0]            │
│                           │  │   [📸 Scan Homework]      │  │   - Step 1: Factoring     │
│    - Neon dark gradient   │  │   [✍️ Type Problem]       │  │   - Step 2: Solver steps  │
│    - Glassmorphism loading│  │   [📚 Flashcards]         │  │   - Beginner view         │
│    - Smooth micro-anims   │  │   [🏆 Daily Streak: 5]    │  │   [Generate Flashcard]    │
└───────────────────────────┘  └───────────────────────────┘  └───────────────────────────┘
```

---

## 🚀 Key Features

1. **✦ Modern Premium UI**: Deep dark theme, elegant neon accents, glassmorphic cards, and consistent spacing designed for an elite mobile experience.
2. **📸 Camera Scanner**: Supports scanning or uploading images of homework worksheets across Math, Science, History, and literature.
3. **✍️ Text Input Input**: Manually type questions when scanning isn't convenient.
4. **🧠 AI Multi-Perspective Solver (Core)**: Returns structured explanations, including:
   - *Problem Understanding*
   - *Step-by-Step Explanation*
   - *Final Solution*
   - *Beginner-Friendly Concept Breakdown*
   - *Similar Practice Problem*
5. **📚 Flashcard Generator**: Instantly generates cards based on solved questions, stored locally with Leitner spaced repetition.
6. **🏆 Interactive Quiz Mode**: Spaced repetition testing with variable difficulties (Easy, Medium, Hard) and progress bars.
7. **📂 Saved History & Analytics**: Access study history and performance charts showing active streaks.
8. **⚙️ Profile & Settings**: Adjust preferences, configure Firebase sync, and manage credentials.

---

## 🛠️ Tech Stack

- **Framework**: Expo (React Native SDK 51+)
- **Language**: TypeScript
- **Styling**: NativeWind (Tailwind CSS v4-compliant React Native utility wrappers)
- **State Management**: Zustand
- **Storage**: AsyncStorage (Local) + Firebase (Cloud Sync)
- **AI Backend**: Google Gemini API (via client-side structured JSON query system)
- **Animations**: React Native Reanimated
- **Icons**: Lucide React Native

---

## 📁 Repository Directory Structure

```
Gauth-AI-Study-Companion/
│── app/                  # Expo Router navigation configuration & entry paths
│── components/           # Reusable UI elements (Buttons, Glassmorphic Cards, Loading animations)
│── screens/              # Primary screen implementations
│   ├── SplashScreen.tsx
│   ├── HomeScreen.tsx
│   ├── CameraScreen.tsx
│   ├── TextInputScreen.tsx
│   ├── ExplanationScreen.tsx
│   ├── FlashcardsScreen.tsx
│   ├── QuizScreen.tsx
│   ├── HistoryScreen.tsx
│   └── ProfileScreen.tsx
│── hooks/                # Custom hooks (e.g., useHasHydrated for Zustand loading)
│── services/             # Core service modules (Gemini API integration, Mock Data)
│   ├── store.ts          # Zustand state store with AsyncStorage persistent middleware
│   └── GeminiService.ts  # Gemini API communication class
│── firebase/             # Firebase SDK client configurations and hooks
│── assets/               # Brand logos, static icons, and background resources
│── constants/            # Styling tokens, color palette definitions, and spacing guidelines
│── types/                # Shared TypeScript models and interface declarations
│   └── index.ts          # HistoryItem, Flashcard, QuizQuestion, and UserProfile types
│── utils/                # Helper utilities (Date formatting, Text parsing)
│── screenshots/          # High-fidelity UI screenshots for contest review
│── loom/                 # Loom video walkthrough script and details
│   └── demo-script.md    # Step-by-step presentation outline
│── docs/                 # General project documentation and architecture schemas
│── ai-logs/              # Mandatory AI-Assisted Development Logs (Phases 1-9)
│── README.md             # Project overview and instruction guide
│── reflection.md         # Personal project reflection and design tradeoffs
│── .env.example          # Sample environment configuration file
│── .gitignore            # Git exclusion guidelines
```

---

## 🪵 AI-Assisted Development Logs (`/ai-logs/`)

To comply with the contest rules, **every major step** of this project was documented under the [`/ai-logs/`](./ai-logs/) folder. This contains structured logs tracking:
- Date, goals, and specific prompts used.
- AI response summaries, code structural choices, and troubleshooting steps.
- Solutions applied to address system-level issues (like path collisions and package dependencies).

---

## 💻 Local Installation & Setup

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Expo Go App (installed on your iOS/Android device to test locally)

### Step 1: Clone and Connect
```bash
git clone https://github.com/tpsreekar37-dotcom/gauth-ai-study-companion.git
cd gauth-ai-study-companion
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Copy `.env.example` to `.env` and fill in your Gemini API key and Firebase credentials:
```bash
cp .env.example .env
```

### Step 4: Run the Development Server
```bash
npx expo start
```
- Press **`a`** to open in the Android emulator.
- Press **`i`** to open in the iOS simulator.
- Press **`w`** to open in web browser.
- Scan the QR code with your phone's camera to run it live via the **Expo Go** app.

---

## 🎥 Demonstration Video Setup

A structured walkthrough script has been prepared at [`/loom/demo-script.md`](./loom/demo-script.md). This helps ensure a professional Loom recording highlighting the:
- App Splash loading flow
- Home Screen navigation
- Camera scanning mock interaction
- Detailed AI explanation cards
- Flashcard 3D flips
- Spaced repetition quiz and leaderboard calculations.
