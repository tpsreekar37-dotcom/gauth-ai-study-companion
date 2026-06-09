import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HistoryItem, Flashcard, UserProfile } from '../types';

interface AppState {
  profile: UserProfile;
  history: HistoryItem[];
  flashcards: Flashcard[];
  
  // Actions
  addHistoryItem: (item: Omit<HistoryItem, 'id' | 'timestamp' | 'bookmarked'>) => string;
  toggleBookmark: (id: string) => void;
  deleteHistoryItem: (id: string) => void;
  
  addFlashcard: (front: string, back: string, subject: string) => void;
  reviewFlashcard: (id: string, correct: boolean) => void;
  
  incrementStreak: () => void;
  addPoints: (amount: number) => void;
  
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

const mockQuestions: Omit<HistoryItem, 'id' | 'timestamp' | 'bookmarked'>[] = [
  {
    problem: "Solve x^2 - 4 = 0",
    subject: "Math",
    explanation: {
      understanding: "We need to find the values of x that satisfy the quadratic equation x^2 - 4 = 0.",
      steps: [
        { title: "Move Constant", description: "Add 4 to both sides of the equation: x^2 = 4" },
        { title: "Take Square Root", description: "Take the square root of both sides: x = ±√4" },
        { title: "Simplify", description: "Simplify the root: x = 2 or x = -2" }
      ],
      finalAnswer: "x = ±2",
      beginnerExplanation: "Imagine you are finding a number which, when multiplied by itself, gives 4. Both 2 * 2 and (-2) * (-2) equal 4.",
      practiceQuestion: {
        question: "Solve x^2 - 9 = 0",
        options: ["x = ±3", "x = ±9", "x = 3", "x = -3"],
        correctIndex: 0,
        explanation: "Adding 9 to both sides gives x^2 = 9. Taking square roots gives x = ±3."
      }
    }
  },
  {
    problem: "What is the capital of France?",
    subject: "General",
    explanation: {
      understanding: "Identify the capital city of the nation of France.",
      steps: [
        { title: "Geographical Identification", description: "France is a European country." },
        { title: "Capital Recognition", description: "Paris is its largest city and official seat of government." }
      ],
      finalAnswer: "Paris",
      beginnerExplanation: "Paris is the main city in France, famous for the Eiffel Tower.",
      practiceQuestion: {
        question: "What is the capital of Germany?",
        options: ["Munich", "Berlin", "Frankfurt", "Hamburg"],
        correctIndex: 1,
        explanation: "Berlin is the capital and largest city of Germany."
      }
    }
  }
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      profile: {
        username: "Sreekar",
        email: "sreekar@tpsreekar37.com",
        streak: 5,
        totalSolved: 2,
        points: 450
      },
      history: [],
      flashcards: [
        {
          id: 'fc-1',
          front: "What is the derivative of sin(x)?",
          back: "cos(x)",
          subject: "Math",
          interval: 1,
          easeFactor: 2.5,
          repetitions: 0,
          nextReviewDate: Date.now()
        },
        {
          id: 'fc-2',
          front: "Formula for Photosynthesis?",
          back: "6CO2 + 6H2O -> C6H12O6 + 6O2",
          subject: "Science",
          interval: 1,
          easeFactor: 2.5,
          repetitions: 0,
          nextReviewDate: Date.now()
        }
      ],
      hasHydrated: false,
      
      setHasHydrated: (state) => set({ hasHydrated: state }),
      
      addHistoryItem: (item) => {
        const id = 'hist-' + Math.random().toString(36).substr(2, 9);
        const newItem: HistoryItem = {
          ...item,
          id,
          timestamp: Date.now(),
          bookmarked: false
        };
        
        set((state) => ({
          history: [newItem, ...state.history],
          profile: {
            ...state.profile,
            totalSolved: state.profile.totalSolved + 1,
            points: state.profile.points + 50
          }
        }));
        
        get().incrementStreak();
        return id;
      },
      
      toggleBookmark: (id) => set((state) => ({
        history: state.history.map((h) => 
          h.id === id ? { ...h, bookmarked: !h.bookmarked } : h
        )
      })),
      
      deleteHistoryItem: (id) => set((state) => ({
        history: state.history.filter((h) => h.id !== id)
      })),
      
      addFlashcard: (front, back, subject) => {
        const newCard: Flashcard = {
          id: 'fc-' + Math.random().toString(36).substr(2, 9),
          front,
          back,
          subject,
          interval: 1,
          easeFactor: 2.5,
          repetitions: 0,
          nextReviewDate: Date.now()
        };
        set((state) => ({
          flashcards: [newCard, ...state.flashcards]
        }));
      },
      
      reviewFlashcard: (id, correct) => set((state) => {
        const updated = state.flashcards.map((card) => {
          if (card.id !== id) return card;
          
          let nextRep = correct ? card.repetitions + 1 : 0;
          let nextInterval = 1;
          let nextEF = card.easeFactor;
          
          if (correct) {
            if (nextRep === 1) nextInterval = 1;
            else if (nextRep === 2) nextInterval = 6;
            else nextInterval = Math.round(card.interval * card.easeFactor);
            nextEF = Math.max(1.3, card.easeFactor + 0.1);
          } else {
            nextEF = Math.max(1.3, card.easeFactor - 0.2);
            nextInterval = 1;
          }
          
          return {
            ...card,
            repetitions: nextRep,
            interval: nextInterval,
            easeFactor: nextEF,
            nextReviewDate: Date.now() + nextInterval * 24 * 60 * 60 * 1000
          };
        });
        
        return {
          flashcards: updated,
          profile: {
            ...state.profile,
            points: state.profile.points + (correct ? 15 : 5)
          }
        };
      }),
      
      incrementStreak: () => set((state) => {
        const today = new Date().toISOString().split('T')[0];
        if (state.profile.lastSolvedDate === today) return {};
        
        const nextStreak = state.profile.lastSolvedDate ? state.profile.streak + 1 : 1;
        
        return {
          profile: {
            ...state.profile,
            streak: nextStreak,
            lastSolvedDate: today
          }
        };
      }),
      
      addPoints: (amount) => set((state) => ({
        profile: {
          ...state.profile,
          points: state.profile.points + amount
        }
      }))
    }),
    {
      name: 'gauth-store',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
          
          // Seed mock history if empty
          if (state.history.length === 0) {
            state.history = mockQuestions.map((q, idx) => ({
              ...q,
              id: `seed-${idx}`,
              timestamp: Date.now() - idx * 3600000,
              bookmarked: false
            }));
          }
        }
      }
    }
  )
);
