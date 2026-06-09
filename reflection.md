# Project Reflection: Gauth Clone (AI Homework & Study Companion)

## What Was Easy
- **Scaffolding and Repository Setup**: Structuring the repository according to the 8x Engineer contest requirements was smooth once the GitHub CLI was successfully installed and configured.
- **Expo Router Navigation**: Leveraging Expo Router's file-based navigation made it straightforward to outline the 9 required screens with clean path mappings.
- **State Architecture**: Using Zustand for state management allowed us to create a unified store with automatic AsyncStorage persistence, providing a robust offline-first experience.

## What Was Difficult
- **Headless Environment Tooling Mappings**: Debugging the Windows path conflict where `gh` resolved to a Python-based Pygame Snake script rather than the GitHub CLI was a major debugging hurdle that required path checking and `winget` reconfiguration.
- **Glassmorphism in React Native**: Achieving dynamic backdrop blurs across diverse platforms (iOS, Android, and Web) without relying on heavy native binary extensions. We had to implement a refined visual design using semi-transparent neutral layers and subtle thin borders.
- **OCR and Mathematics Formatting**: Displaying mathematical notations and step-by-step reasoning cleanly in mobile UI requires parsing LaTeX or rich text without slowing down the rendering process.

## What I Learned
- **DevOps on Windows platforms**: Learned how Windows cmd and PowerShell handle local application aliases (like `.py` extension association) and how to diagnose execution conflicts.
- **Offline-First Hybrid Architecture**: Design patterns for bootstrapping apps with pre-loaded local content (mock math and history sets) so that UI rendering works beautifully even during internet dropouts.
- **Spaced Repetition Integration**: Implementing a Leitner/spaced repetition system state in Zustand to drive quiz difficulty states.

## Tradeoffs Made
- **Local Simulation vs Live APIs**: For the contest demo flow, we implemented a dual-mode service layer. If `EXPO_PUBLIC_GEMINI_API_KEY` is not present in `.env`, the service falls back to high-fidelity, curated local JSON solutions. This ensures judges can review the entire app flow instantly without failing on API rate limits or missing credentials.
- **Simplified OCR**: Using base64 image encoding passed directly to the Gemini Vision API rather than running an on-device OCR engine. This dramatically improved formula parsing accuracy while keeping the application bundle lightweight.

## What I Would Improve
- **LaTeX Math Rendering**: Integrate `react-native-math-view` or full KaTeX webview rendering to display advanced calculus formulas beautifully.
- **Voice Explanations**: Integrate Text-to-Speech (TTS) inside the AI Explanation screen so students can listen to the step-by-step reasoning.
- **Real-Time Camera Cropper**: Add an interactive crop box in the Camera scan screen to let students highlight specific sections of their worksheets before scanning.
