import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  Dimensions,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  interpolate 
} from 'react-native-reanimated';
import { ArrowLeft, Check, X, RefreshCw, Sparkles } from 'lucide-react-native';
import { useAppStore } from '../services/store';

const { width } = Dimensions.get('window');

export default function FlashcardsScreen() {
  const router = useRouter();
  const { flashcards, reviewFlashcard } = useAppStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Animation value: 0 for front, 180 for back
  const rotateY = useSharedValue(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const activeCard = flashcards[currentIndex];

  const handleFlip = () => {
    rotateY.value = withTiming(isFlipped ? 0 : 180, { duration: 400 });
    setIsFlipped(!isFlipped);
  };

  const handleAnswer = (correct: boolean) => {
    if (!activeCard) return;
    reviewFlashcard(activeCard.id, correct);
    
    // Animate back to front for the next card
    rotateY.value = 0;
    setIsFlipped(false);
    
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      Alert.alert("Completed!", "You have reviewed all flashcards in this deck.", [
        { text: "Go Home", onPress: () => router.replace('/home') },
        { text: "Restart", onPress: () => setCurrentIndex(0) }
      ]);
    }
  };

  // Reanimated style transforms for card flip
  const frontAnimatedStyle = useAnimatedStyle(() => {
    const spin = interpolate(rotateY.value, [0, 180], [0, 180]);
    return {
      transform: [{ rotateY: `${spin}deg` }],
      backfaceVisibility: 'hidden',
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const spin = interpolate(rotateY.value, [0, 180], [180, 360]);
    return {
      transform: [{ rotateY: `${spin}deg` }],
      backfaceVisibility: 'hidden',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    };
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Flashcards</Text>
        <View style={{ width: 40 }} />
      </View>

      {!activeCard ? (
        <View style={styles.emptyContainer}>
          <Sparkles size={40} color="#a78bfa" />
          <Text style={styles.emptyText}>No flashcards yet.</Text>
          <Text style={styles.emptySubtext}>
            Solve a problem via scan or typing, then click "Add to Study Flashcards" to populate your deck.
          </Text>
          <TouchableOpacity style={styles.goHomeBtn} onPress={() => router.replace('/home')}>
            <Text style={styles.goHomeBtnText}>Go Home</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.studyBody}>
          {/* Progress */}
          <Text style={styles.progressText}>
            Card {currentIndex + 1} of {flashcards.length}
          </Text>

          {/* Flashcard container */}
          <TouchableOpacity 
            style={styles.cardContainer} 
            onPress={handleFlip} 
            activeOpacity={1}
          >
            <View style={styles.cardInner}>
              
              {/* Front Card */}
              <Animated.View style={[styles.cardSide, styles.cardFront, frontAnimatedStyle]}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{activeCard.subject}</Text>
                </View>
                <Text style={styles.cardContentText}>{activeCard.front}</Text>
                <View style={styles.hintContainer}>
                  <RefreshCw size={14} color="rgba(255, 255, 255, 0.4)" />
                  <Text style={styles.hintText}>Tap card to flip</Text>
                </View>
              </Animated.View>

              {/* Back Card */}
              <Animated.View style={[styles.cardSide, styles.cardBack, backAnimatedStyle]}>
                <View style={[styles.badge, { backgroundColor: '#161e1b', borderColor: 'rgba(52,211,153,0.2)' }]}>
                  <Text style={[styles.badgeText, { color: '#34d399' }]}>SOLUTION</Text>
                </View>
                <Text style={[styles.cardContentText, { color: '#ffffff' }]}>
                  {activeCard.back}
                </Text>
                <View style={styles.hintContainer}>
                  <RefreshCw size={14} color="rgba(255, 255, 255, 0.4)" />
                  <Text style={styles.hintText}>Tap card to flip back</Text>
                </View>
              </Animated.View>

            </View>
          </TouchableOpacity>

          {/* Spaced repetition action buttons */}
          {isFlipped && (
            <View style={styles.actionsContainer}>
              <TouchableOpacity 
                style={[styles.actionBtn, styles.btnIncorrect]} 
                onPress={() => handleAnswer(false)}
              >
                <X size={20} color="#ef4444" />
                <Text style={[styles.actionBtnText, { color: '#ef4444' }]}>Still learning</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionBtn, styles.btnCorrect]} 
                onPress={() => handleAnswer(true)}
              >
                <Check size={20} color="#10b981" />
                <Text style={[styles.actionBtnText, { color: '#10b981' }]}>I know this</Text>
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptySubtext: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
    marginBottom: 24,
  },
  goHomeBtn: {
    backgroundColor: '#8b5cf6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  goHomeBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  studyBody: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  progressText: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  cardContainer: {
    width: width - 40,
    height: 380,
  },
  cardInner: {
    flex: 1,
  },
  cardSide: {
    flex: 1,
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    justifyContent: 'space-between',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  cardFront: {
    backgroundColor: '#110e16',
    borderColor: 'rgba(139, 92, 246, 0.25)',
    shadowColor: '#8b5cf6',
  },
  cardBack: {
    backgroundColor: '#0f121b',
    borderColor: 'rgba(52, 211, 153, 0.25)',
    shadowColor: '#10b981',
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
    backgroundColor: '#261b34',
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.2)',
  },
  badgeText: {
    color: '#c084fc',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  cardContentText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 28,
  },
  hintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    opacity: 0.6,
  },
  hintText: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 11,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 30,
    gap: 16,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
    borderWidth: 1,
  },
  btnIncorrect: {
    backgroundColor: '#211619',
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  btnCorrect: {
    backgroundColor: '#16211c',
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
  }
});
