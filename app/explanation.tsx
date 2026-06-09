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
import { 
  ArrowLeft, 
  Bookmark, 
  BookmarkCheck, 
  BookPlus, 
  GraduationCap, 
  CheckCircle, 
  HelpCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Clock
} from 'lucide-react-native';

export default function ExplanationScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { history, toggleBookmark, addFlashcard } = useAppStore();
  
  // Accordion toggle state: expand the first step by default
  const [expandedSteps, setExpandedSteps] = useState<Record<number, boolean>>({ 0: true });
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

  const toggleStep = (idx: number) => {
    setExpandedSteps(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleGenerateCard = () => {
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
        
        <Text style={styles.headerTitle}>AI Tutor Solution</Text>
        
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
          <Text style={styles.problemLabel}>STUDY QUERY</Text>
          <Text style={styles.problemText}>{item.problem}</Text>
        </View>

        {/* Problem Metadata Overview */}
        <View style={styles.metadataGrid}>
          <View style={styles.metaBadge}>
            <Text style={styles.metaBadgeLabel}>Subject</Text>
            <Text style={[styles.metaBadgeValue, { color: '#a78bfa' }]}>{item.subject}</Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaBadge}>
            <Text style={styles.metaBadgeLabel}>Difficulty</Text>
            <Text style={[
              styles.metaBadgeValue, 
              explanation.difficulty === 'Hard' ? { color: '#ef4444' } :
              explanation.difficulty === 'Medium' ? { color: '#fbbf24' } : { color: '#34d399' }
            ]}>
              {explanation.difficulty || 'Easy'}
            </Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaBadge}>
            <Text style={styles.metaBadgeLabel}>Solve Time</Text>
            <View style={styles.metaTimeRow}>
              <Clock size={12} color="rgba(255,255,255,0.6)" style={{ marginRight: 4 }} />
              <Text style={styles.metaBadgeValue}>{explanation.estimatedSolveTime || '1 min'}</Text>
            </View>
          </View>
        </View>

        {/* Tutor Confidence Score */}
        <View style={styles.confidenceCard}>
          <View style={styles.confidenceHeader}>
            <View style={styles.confidenceTitleRow}>
              <Sparkles size={16} color="#c084fc" />
              <Text style={styles.confidenceTitle}>AI Tutor Match Score</Text>
            </View>
            <Text style={styles.confidencePercent}>{explanation.confidenceScore || 98}% Accuracy</Text>
          </View>
          <View style={styles.confidenceTrack}>
            <View style={[styles.confidenceFill, { width: `${explanation.confidenceScore || 98}%` }]} />
          </View>
        </View>

        {/* Problem Understanding */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <GraduationCap size={20} color="#c084fc" />
            <Text style={styles.cardTitle}>Conceptual Overview</Text>
          </View>
          <Text style={styles.cardText}>{explanation.understanding}</Text>
        </View>

        {/* Step-by-Step Accordions */}
        <Text style={styles.sectionLabel}>STEP-BY-STEP SOLUTION</Text>
        {explanation.steps.map((step, idx) => {
          const isOpen = !!expandedSteps[idx];
          return (
            <View key={idx} style={styles.accordionContainer}>
              <TouchableOpacity 
                style={[styles.accordionHeader, isOpen && styles.accordionHeaderOpen]} 
                onPress={() => toggleStep(idx)}
                activeOpacity={0.85}
              >
                <View style={styles.accordionTitleRow}>
                  <View style={[styles.stepNumBadge, isOpen && styles.stepNumBadgeOpen]}>
                    <Text style={[styles.stepNumText, isOpen && styles.stepNumTextOpen]}>{idx + 1}</Text>
                  </View>
                  <Text style={styles.accordionTitleText}>{step.title}</Text>
                </View>
                {isOpen ? (
                  <ChevronUp size={18} color="#a78bfa" />
                ) : (
                  <ChevronDown size={18} color="rgba(255,255,255,0.4)" />
                )}
              </TouchableOpacity>

              {isOpen && (
                <View style={styles.accordionContent}>
                  <Text style={styles.stepDescText}>{step.description}</Text>
                  
                  {step.math && (
                    <View style={styles.mathContainer}>
                      <Text style={styles.mathText}>{step.math}</Text>
                    </View>
                  )}

                  {step.why && (
                    <View style={styles.whyContainer}>
                      <View style={styles.whyBadge}>
                        <Sparkles size={10} color="#c084fc" />
                        <Text style={styles.whyBadgeText}>Tutor Tip</Text>
                      </View>
                      <Text style={styles.whyText}>{step.why}</Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          );
        })}

        {/* Highlighted Final Answer */}
        <View style={styles.answerBanner}>
          <Text style={styles.answerLabel}>FINAL RESULT</Text>
          <Text style={styles.answerText}>{explanation.finalAnswer}</Text>
        </View>

        {/* Common Pitfalls Section */}
        {explanation.commonMistakes && explanation.commonMistakes.length > 0 && (
          <View style={styles.mistakesCard}>
            <View style={styles.mistakesHeader}>
              <AlertTriangle size={18} color="#ef4444" />
              <Text style={styles.mistakesTitle}>Common Student Pitfalls</Text>
            </View>
            <View style={styles.mistakesList}>
              {explanation.commonMistakes.map((mistake, idx) => (
                <View key={idx} style={styles.mistakeItem}>
                  <Text style={styles.mistakeDot}>•</Text>
                  <Text style={styles.mistakeText}>{mistake}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Explain Like I'm 12 Mode */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <HelpCircle size={20} color="#60a5fa" />
            <Text style={styles.cardTitle}>Simplified Explanation</Text>
          </View>
          <Text style={styles.cardText}>{explanation.beginnerExplanation}</Text>
        </View>

        {/* Interactive Practice Question */}
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
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
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
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    marginBottom: 16,
  },
  problemLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#a78bfa',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  problemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    lineHeight: 22,
  },
  metadataGrid: {
    flexDirection: 'row',
    backgroundColor: '#110e16',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  metaBadge: {
    flex: 1,
    alignItems: 'center',
  },
  metaDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  metaBadgeLabel: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  metaBadgeValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  metaTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  confidenceCard: {
    backgroundColor: '#110e16',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },
  confidenceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  confidenceTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  confidenceTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  confidencePercent: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#c084fc',
  },
  confidenceTrack: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    backgroundColor: '#8b5cf6',
    borderRadius: 3,
  },
  card: {
    backgroundColor: '#110e16',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
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
    fontSize: 10,
    fontWeight: 'bold',
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 1.5,
    marginBottom: 12,
    marginTop: 8,
  },
  accordionContainer: {
    backgroundColor: '#110e16',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
    marginBottom: 10,
    overflow: 'hidden',
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  accordionHeaderOpen: {
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    backgroundColor: 'rgba(255,255,255,0.01)',
  },
  accordionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    paddingRight: 10,
  },
  accordionTitleText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
  },
  accordionContent: {
    padding: 16,
    backgroundColor: '#0e0b12',
  },
  stepNumBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumBadgeOpen: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderColor: 'rgba(167, 139, 250, 0.3)',
  },
  stepNumText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
    fontWeight: 'bold',
  },
  stepNumTextOpen: {
    color: '#c084fc',
  },
  stepDescText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.65)',
    lineHeight: 18,
  },
  mathContainer: {
    backgroundColor: '#16121e',
    borderColor: 'rgba(139, 92, 246, 0.25)',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginTop: 12,
  },
  mathText: {
    color: '#a78bfa',
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  whyContainer: {
    backgroundColor: 'rgba(167, 139, 250, 0.06)',
    borderColor: 'rgba(167, 139, 250, 0.15)',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  whyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(192, 132, 252, 0.15)',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  whyBadgeText: {
    color: '#c084fc',
    fontSize: 9,
    fontWeight: 'bold',
  },
  whyText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.55)',
    lineHeight: 16,
  },
  answerBanner: {
    backgroundColor: '#161e1b',
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.25)',
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  answerLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#34d399',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  answerText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#ffffff',
  },
  mistakesCard: {
    backgroundColor: '#211619',
    borderColor: 'rgba(239, 68, 68, 0.2)',
    borderWidth: 1,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
  },
  mistakesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  mistakesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ef4444',
  },
  mistakesList: {
    gap: 8,
  },
  mistakeItem: {
    flexDirection: 'row',
    gap: 8,
  },
  mistakeDot: {
    color: '#ef4444',
    fontSize: 14,
  },
  mistakeText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 16,
    flex: 1,
  },
  practiceCard: {
    borderColor: 'rgba(52, 211, 153, 0.15)',
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
    borderRadius: 18,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
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
