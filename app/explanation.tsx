import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  Alert
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAppStore } from '../services/store';
import { ArrowLeft, Bookmark, BookmarkCheck, BookPlus, GraduationCap, CheckCircle, HelpCircle } from 'lucide-react-native';

export default function ExplanationScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { history, toggleBookmark, addFlashcard } = useAppStore();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const item = history.find((h) => h.id === id);

  if (!item) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Solution not found.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/home')}>
          <Text style={styles.backBtnText}>Go Home</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const { explanation } = item;

  const handleGenerateCard = () => {
    // Generate card front/back from solving detail
    addFlashcard(
      `Concept: ${item.problem}`,
      `Answer: ${explanation.finalAnswer}\n\nKey Step: ${explanation.steps[0]?.description || ""}`,
      item.subject
    );
    Alert.alert("Success", "Flashcard added to your library! You can review it in the Flashcards section.");
  };

  const handleSelectOption = (idx: number) => {
    if (showFeedback) return;
    setSelectedOption(idx);
    setShowFeedback(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.circleBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color="#ffffff" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>{item.subject} Solution</Text>
        
        <TouchableOpacity style={styles.circleBtn} onPress={() => toggleBookmark(item.id)}>
          {item.bookmarked ? (
            <BookmarkCheck size={20} color="#8b5cf6" />
          ) : (
            <Bookmark size={20} color="#ffffff" />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Scanned/Input Problem Card */}
        <View style={styles.problemCard}>
          <Text style={styles.problemLabel}>PROBLEM</Text>
          <Text style={styles.problemText}>{item.problem}</Text>
        </View>

        {/* Understanding */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <GraduationCap size={20} color="#c084fc" />
            <Text style={styles.cardTitle}>Understanding the Concept</Text>
          </View>
          <Text style={styles.cardText}>{explanation.understanding}</Text>
        </View>

        {/* Steps */}
        <Text style={styles.sectionLabel}>STEP-BY-STEP SOLUTION</Text>
        {explanation.steps.map((step, idx) => (
          <View key={idx} style={styles.stepItem}>
            <View style={styles.stepNumBadge}>
              <Text style={styles.stepNumText}>{idx + 1}</Text>
            </View>
            <View style={styles.stepTextContent}>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepDesc}>{step.description}</Text>
            </View>
          </View>
        ))}

        {/* Final Answer Banner */}
        <View style={styles.answerBanner}>
          <Text style={styles.answerLabel}>FINAL ANSWER</Text>
          <Text style={styles.answerText}>{explanation.finalAnswer}</Text>
        </View>

        {/* Beginner Explanation */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <HelpCircle size={20} color="#60a5fa" />
            <Text style={styles.cardTitle}>Simple Breakdown</Text>
          </View>
          <Text style={styles.cardText}>{explanation.beginnerExplanation}</Text>
        </View>

        {/* Practice Drill Card */}
        <View style={[styles.card, styles.practiceCard]}>
          <View style={styles.cardHeader}>
            <CheckCircle size={20} color="#34d399" />
            <Text style={styles.cardTitle}>Practice Question</Text>
          </View>
          <Text style={styles.practiceQuestionText}>
            {explanation.practiceQuestion.question}
          </Text>

          {explanation.practiceQuestion.options.map((option, idx) => {
            const isCorrect = idx === explanation.practiceQuestion.correctIndex;
            const isSelected = idx === selectedOption;
            
            let optionStyle: any = styles.optionBtn;
            if (showFeedback) {
              if (isCorrect) optionStyle = [styles.optionBtn, styles.optionCorrect];
              else if (isSelected) optionStyle = [styles.optionBtn, styles.optionIncorrect];
            } else if (isSelected) {
              optionStyle = [styles.optionBtn, styles.optionSelected];
            }

            return (
              <TouchableOpacity 
                key={idx} 
                style={optionStyle}
                onPress={() => handleSelectOption(idx)}
                disabled={showFeedback}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            );
          })}

          {showFeedback && (
            <View style={styles.feedbackContainer}>
              <Text style={styles.feedbackTitle}>
                {selectedOption === explanation.practiceQuestion.correctIndex ? "🎉 Correct!" : "❌ Incorrect"}
              </Text>
              <Text style={styles.feedbackDesc}>
                {explanation.practiceQuestion.explanation}
              </Text>
            </View>
          )}
        </View>

        {/* Add Flashcard Action */}
        <TouchableOpacity style={styles.cardActionBtn} onPress={handleGenerateCard}>
          <BookPlus size={20} color="#ffffff" />
          <Text style={styles.cardActionText}>Add to Study Flashcards</Text>
        </TouchableOpacity>

      </ScrollView>
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
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#16121e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  problemCard: {
    backgroundColor: '#16121e',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.15)',
    marginBottom: 20,
  },
  problemLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#a78bfa',
    letterSpacing: 1,
    marginBottom: 6,
  },
  problemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    lineHeight: 22,
  },
  card: {
    backgroundColor: '#110e16',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  cardText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 18,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 1,
    marginBottom: 12,
    marginTop: 8,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  stepNumBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#261b34',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumText: {
    color: '#c084fc',
    fontSize: 12,
    fontWeight: 'bold',
  },
  stepTextContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  stepDesc: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 4,
    lineHeight: 18,
  },
  answerBanner: {
    backgroundColor: '#161e1b',
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.2)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  answerLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#34d399',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  answerText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#ffffff',
  },
  practiceCard: {
    borderColor: 'rgba(52, 211, 153, 0.1)',
  },
  practiceQuestionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 14,
  },
  optionBtn: {
    backgroundColor: '#16121e',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
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
    fontSize: 13,
  },
  feedbackContainer: {
    marginTop: 16,
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingTop: 14,
  },
  feedbackTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  feedbackDesc: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    lineHeight: 16,
  },
  cardActionBtn: {
    backgroundColor: '#8b5cf6',
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  cardActionText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#0c0a0f',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 16,
  },
  backBtn: {
    backgroundColor: '#8b5cf6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  backBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
  }
});
