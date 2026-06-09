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
      difficulty: "Easy",
      estimatedSolveTime: "1 min",
      confidenceScore: 99,
      commonMistakes: [
        "Forgetting the negative root when taking the square root (i.e. writing x = 2 instead of x = ±2).",
        "Adding 4 to one side but subtracting from the other side by mistake."
      ],
      steps: [
        { 
          title: "Isolate the variable term", 
          description: "Move the constant -4 to the right side of the equation by adding 4 to both sides.",
          math: "x^2 = 4",
          why: "This groups the variable x^2 on the left side and the numbers on the right side."
        },
        { 
          title: "Take the square root", 
          description: "Solve for x by taking the square root of both sides. Remember that taking the square root of a positive number yields both positive and negative roots.",
          math: "x = ±√4",
          why: "Any quadratic equation has up to two real solutions."
        },
        { 
          title: "Simplify the roots", 
          description: "Simplify √4 to 2, yielding two solutions: 2 and -2.",
          math: "x = ±2",
          why: "Since 2 * 2 = 4 and (-2) * (-2) = 4, both numbers are correct solutions."
        }
      ],
      finalAnswer: "x = ±2",
      beginnerExplanation: "Imagine you are looking for a number that, when multiplied by itself, gives 4. If you multiply 2 by 2, you get 4. If you multiply -2 by -2, the negatives cancel out and you also get 4! So both 2 and -2 are correct answers.",
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
      difficulty: "Easy",
      estimatedSolveTime: "30s",
      confidenceScore: 98,
      commonMistakes: [
        "Confusing the capital with other major cities like Marseille or Lyon."
      ],
      steps: [
        { 
          title: "Geographical Identification", 
          description: "Locate France on the world map as a key European country.",
          why: "Capital cities serve as the central administrative hub of their respective nations."
        },
        { 
          title: "Capital Recognition", 
          description: "Recognize Paris as the seat of the French government and the nation's largest urban center.",
          why: "Historically, Paris has been the capital since the late 10th century under King Hugh Capet."
        }
      ],
      finalAnswer: "Paris",
      beginnerExplanation: "Paris is the main city in France. It is globally famous for landmarks like the Eiffel Tower, the Louvre museum, and French pastries!",
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
