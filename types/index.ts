export interface HistoryItem {
  id: string;
  problem: string;
  imageUri?: string;
  explanation: AIExplanation;
  subject: 'Math' | 'Science' | 'History' | 'General';
  timestamp: number;
  bookmarked: boolean;
}

export interface AIExplanation {
  understanding: string;
  steps: Array<{
    title: string;
    description: string;
    math?: string;
    why?: string;
  }>;
  finalAnswer: string;
  beginnerExplanation: string;
  commonMistakes?: string[];
  confidenceScore?: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  estimatedSolveTime?: string;
  practiceQuestion: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  subject: string;
  interval: number; // Leitner spaced repetition interval in days
  easeFactor: number;
  repetitions: number;
  nextReviewDate: number; // timestamp
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  subject: string;
}

export interface UserProfile {
  username: string;
  email: string;
  streak: number;
  totalSolved: number;
  points: number;
  lastSolvedDate?: string; // YYYY-MM-DD
}
