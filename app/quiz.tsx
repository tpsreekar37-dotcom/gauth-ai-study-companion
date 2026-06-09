import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Award, CheckCircle, ChevronRight, Zap } from 'lucide-react-native';
import { useAppStore } from '../services/store';

const { width } = Dimensions.get('window');

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  subject: string;
}

const quizDecks: Record<'Easy' | 'Medium' | 'Hard', QuizQuestion[]> = {
  Easy: [
    {
      question: "Which of the following is a prime number?",
      options: ["4", "6", "9", "11"],
      correctIndex: 3,
      explanation: "A prime number is a number greater than 1 that has no positive divisors other than 1 and itself. 11 is only divisible by 1 and 11.",
      subject: "Math"
    },
    {
      question: "What is the formula for the area of a circle?",
      options: ["2πr", "πr^2", "πd", "2πr^2"],
      correctIndex: 1,
      explanation: "The area of a circle is calculated by multiplying Pi (π) by the square of the radius (r^2).",
      subject: "Math"
    }
  ],
  Medium: [
    {
      question: "Solve for x: 2x + 7 = 15",
      options: ["x = 3", "x = 4", "x = 5", "x = 8"],
      correctIndex: 1,
      explanation: "Subtract 7 from both sides: 2x = 8. Divide by 2: x = 4.",
      subject: "Math"
    },
    {
      question: "Which gas is released during plant photosynthesis?",
      options: ["Carbon Dioxide", "Nitrogen", "Oxygen", "Hydrogen"],
      correctIndex: 2,
      explanation: "Plants take in carbon dioxide and water and release oxygen (O2) into the atmosphere during photosynthesis.",
      subject: "Science"
    }
  ],
  Hard: [
    {
      question: "What is the derivative of e^(2x)?",
      options: ["e^(2x)", "2e^(2x)", "2e^x", "e^2x / 2"],
      correctIndex: 1,
      explanation: "Using the chain rule: d/dx [e^(2x)] = e^(2x) * d/dx[2x] = 2e^(2x).",
      subject: "Math"
    },
    {
      question: "What was the main outcome of the Battle of Waterloo (1815)?",
      options: [
        "Napoleon's final defeat and exile",
        "Sign of the Magna Carta",
        "End of the Roman Empire",
        "Establishment of American Independence"
      ],
      correctIndex: 0,
      explanation: "The Battle of Waterloo marked the final defeat of Napoleon Bonaparte, ending the Napoleonic Wars.",
      subject: "History"
    }
  ]
};

export default function QuizScreen() {
  const router = useRouter();
  const addPoints = useAppStore((state) => state.addPoints);
  
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard' | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const activeDeck = difficulty ? quizDecks[difficulty] : [];
  const currentQuestion = activeDeck[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (showFeedback) return;
    setSelectedOption(idx);
    setShowFeedback(true);
    
    if (idx === currentQuestion.correctIndex) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setShowFeedback(false);
    
    if (currentIndex < activeDeck.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Complete quiz
      const gainedXP = score * (difficulty === 'Easy' ? 20 : difficulty === 'Medium' ? 40 : 60);
      addPoints(gainedXP);
      setQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setDifficulty(null);
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption(null);
    setShowFeedback(false);
    setQuizCompleted(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Study Quiz</Text>
        <View style={{ width: 40 }} />
      </View>

      {!difficulty ? (
        // Difficulty Selection Screen
        <View style={styles.selectorBody}>
          <Zap size={44} color="#fbbf24" fill="#fbbf24" style={{ marginBottom: 16 }} />
          <Text style={styles.title}>Choose Difficulty</Text>
          <Text style={styles.subtitle}>Test your knowledge and gain scholar multipliers</Text>

          <View style={styles.deckList}>
            {(['Easy', 'Medium', 'Hard'] as const).map((level) => (
              <TouchableOpacity 
                key={level} 
                style={styles.difficultyBtn}
                onPress={() => setDifficulty(level)}
              >
                <View>
                  <Text style={styles.diffName}>{level}</Text>
                  <Text style={styles.diffReward}>
                    +{level === 'Easy' ? '20' : level === 'Medium' ? '40' : '60'} XP per correct answer
                  </Text>
                </View>
                <ChevronRight size={18} color="rgba(255,255,255,0.4)" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : quizCompleted ? (
        // Results Screen
        <View style={styles.resultsBody}>
          <Award size={64} color="#fbbf24" style={{ marginBottom: 20 }} />
          <Text style={styles.title}>Quiz Completed!</Text>
          <Text style={styles.resultsText}>
            You scored {score} out of {activeDeck.length} correct answers.
          </Text>
          
          <View style={styles.xpCard}>
            <Text style={styles.xpText}>
              +{score * (difficulty === 'Easy' ? 20 : difficulty === 'Medium' ? 40 : 60)} XP earned!
            </Text>
          </View>

          <TouchableOpacity style={styles.doneBtn} onPress={resetQuiz}>
            <Text style={styles.doneBtnText}>Practice Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // Active Question Screen
        <View style={styles.quizBody}>
          
          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <Text style={styles.progressLabel}>Question {currentIndex + 1} of {activeDeck.length}</Text>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${((currentIndex + 1) / activeDeck.length) * 100}%` }]} />
            </View>
          </View>

          <View style={styles.questionCard}>
            <View style={styles.subjectBadge}>
              <Text style={styles.subjectBadgeText}>{currentQuestion.subject}</Text>
            </View>
            <Text style={styles.questionText}>{currentQuestion.question}</Text>
          </View>

          <View style={styles.optionsList}>
            {currentQuestion.options.map((option, idx) => {
              const isCorrect = idx === currentQuestion.correctIndex;
              const isSelected = idx === selectedOption;
              
              let styleBtn = styles.optionBtn;
              if (showFeedback) {
                if (isCorrect) styleBtn = [styles.optionBtn, styles.optionCorrect];
                else if (isSelected) styleBtn = [styles.optionBtn, styles.optionIncorrect];
              } else if (isSelected) {
                styleBtn = [styles.optionBtn, styles.optionSelected];
              }

              return (
                <TouchableOpacity 
                  key={idx} 
                  style={styleBtn} 
                  onPress={() => handleSelectOption(idx)}
                  disabled={showFeedback}
                >
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {showFeedback && (
            <View style={styles.feedbackCard}>
              <Text style={styles.feedbackTitle}>
                {selectedOption === currentQuestion.correctIndex ? "🎉 Correct!" : "❌ Incorrect"}
              </Text>
              <Text style={styles.feedbackDesc}>{currentQuestion.explanation}</Text>
              
              <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
                <Text style={styles.nextBtnText}>
                  {currentIndex === activeDeck.length - 1 ? "Finish" : "Next Question"}
                </Text>
              </TouchableOpacity>
            </View>
          )}

        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c0a0f',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#16121e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  selectorBody: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.4)',
    marginTop: 6,
    textAlign: 'center',
    marginBottom: 32,
  },
  deckList: {
    width: '100%',
    gap: 12,
  },
  difficultyBtn: {
    backgroundColor: '#110e16',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  diffName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  diffReward: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.4)',
    marginTop: 4,
  },
  resultsBody: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  resultsText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 8,
    textAlign: 'center',
  },
  xpCard: {
    backgroundColor: '#1c1c16',
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.25)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginTop: 24,
    marginBottom: 32,
  },
  xpText: {
    color: '#fbbf24',
    fontWeight: 'bold',
    fontSize: 15,
  },
  doneBtn: {
    backgroundColor: '#8b5cf6',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 16,
  },
  doneBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  quizBody: {
    flex: 1,
    padding: 20,
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressLabel: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#8b5cf6',
    borderRadius: 3,
  },
  questionCard: {
    backgroundColor: '#110e16',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    padding: 20,
    marginBottom: 20,
  },
  subjectBadge: {
    backgroundColor: '#261b34',
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.2)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  subjectBadgeText: {
    color: '#c084fc',
    fontSize: 10,
    fontWeight: 'bold',
  },
  questionText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    lineHeight: 22,
  },
  optionsList: {
    gap: 8,
    marginBottom: 20,
  },
  optionBtn: {
    backgroundColor: '#110e16',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  optionSelected: {
    borderColor: '#8b5cf6',
    backgroundColor: '#261b34',
  },
  optionCorrect: {
    borderColor: '#10b981',
    backgroundColor: '#16241e',
  },
  optionIncorrect: {
    borderColor: '#ef4444',
    backgroundColor: '#2e1c1c',
  },
  optionText: {
    color: '#ffffff',
    fontSize: 14,
  },
  feedbackCard: {
    backgroundColor: '#16121e',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    padding: 18,
    marginTop: 10,
  },
  feedbackTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 6,
  },
  feedbackDesc: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    lineHeight: 16,
    marginBottom: 14,
  },
  nextBtn: {
    backgroundColor: '#8b5cf6',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  nextBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  }
});
