# Loom Walkthrough Script: Gauth Clone

This script outlines a high-impact, 3-minute video presentation showing the judges all required submission criteria.

---

## ⏱️ Timeline & Outline

| Timestamp | Section | Key Visual Focus | Speaking Point |
| :--- | :--- | :--- | :--- |
| **0:00 - 0:30** | Introduction & Splash | App launch, animated splash screen, transition to dark home dashboard. | "Hi judges, I'm Sreekar, and today I'm demonstrating Gauth Clone—the ultimate AI Homework & Study Companion built for the 8x Engineer challenge..." |
| **0:30 - 1:15** | Homework Scanner & Text Input | Camera scan screen overlay, scan animation, and typing a math question. | "Let's scan a math problem. The scanner displays a neon line effect. We can also manually type any question in our text solver input..." |
| **1:15 - 2:00** | AI Explanation Screen | Structured cards: understanding, solver steps, final answer, beginner concept, practice question. | "Here is our core solver engine. Powered by Gemini API, it breaks problems down into clear, structured explanation cards, including a simplified beginner explanation and practice drills..." |
| **2:00 - 2:30** | Flashcards & Quiz Mode | Flip card animations, spaced repetition selections. | "From this question, we can generate a dynamic review deck. Here is the 3D flip card animation in Reanimated. We can test ourselves using Spaced Repetition quizzes..." |
| **2:30 - 3:00** | History & Final Outro | Bookmarks page, daily streak tracker, Settings screen, pushing to Git. | "All of our study sessions are synced locally and in the cloud with Firebase. Our analytics dashboard tracks active study streaks. Thank you for reviewing!" |

---

## 🎤 Detailed Speaking Script

### 1. Introduction
* **Action:** Start with the app closed, click the app icon. The screen shows the deep indigo dark background with the Gauth logo fading in and a neon gradient loading indicator.
* **Script:**
  > "Hello judges! I am Sreekar. Welcome to Gauth Clone—a premium, dark-themed AI Homework and Study Companion that empowers students to learn smarter. I built this app using Expo, React Native, TypeScript, Zustand, and Gemini API. Let's look at the home screen."

### 2. Home Screen Overview
* **Action:** Transition from splash to Home screen. Scroll through the options showing the glassmorphism dashboard cards. Point out the daily streak indicator (e.g., "5 Day Streak!").
* **Script:**
  > "Our Home screen leverages a premium design language featuring glassmorphism cards and neon glow elements. We have quick actions for scanning, text solving, reviewing flashcards, starting quizzes, and checking study analytics."

### 3. Scanning and Solving Homework
* **Action:** Tap the `Scan Homework` button. The camera feed or crop frame is shown with a neon purple horizontal bar moving up and down. Click "Scan" to trigger the solver.
* **Script:**
  > "Let's tap Scan Homework. Here, a student can snap a photo of any worksheet. Our scanning overlay utilizes React Native Reanimated to guide the camera. Once snapped, the image is parsed via Gemini's multimodal API."

### 4. AI Explanation Flow
* **Action:** The explanation screen slides in. Show the distinct collapsible sections: "Understanding", "Steps", "Final Answer", and "Practice Drills".
* **Script:**
  > "The AI solver returns structured JSON data containing step-by-step reasoning. We render this on modern typography cards. Students can view detailed derivations, read a simplified 'beginner' explanation, or try a similar practice question."

### 5. Flashcards (Interactive Flip)
* **Action:** Tap `Generate Flashcard` on the explanation screen, then go to the Flashcards screen. Click on a card to see it flip with a smooth 3D rotation.
* **Script:**
  > "To reinforce learning, students can instantly generate custom study cards. Using React Native Reanimated, we created a 3D card flip animation. Students can self-assess using spaced repetition."

### 6. Quiz System & Analytics
* **Action:** Go to the Quiz screen. Select "Medium" difficulty. Click on a correct answer to see it turn green, then show the end scorecard.
* **Script:**
  > "Our Quiz engine helps students study systematically. Quizzes dynamically adapt based on saved history, giving instant green/red indicator feedback and tracking leaderboard scores."

### 7. Wrap-up
* **Action:** Return to Home, click Settings, then end showing the `/ai-logs` directory structure on GitHub.
* **Script:**
  > "All session history is persisted locally and backed up to Firebase. I've also checked in all 9 required AI log files documenting our prompt history. Thanks for your time, and let's win this contest!"
