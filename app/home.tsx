import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '../services/store';
import { 
  Camera, 
  Keyboard, 
  BookOpen, 
  Award, 
  History, 
  User, 
  Flame, 
  Sparkles,
  ChevronRight,
  TrendingUp,
  BarChart2,
  Calendar,
  Check,
  Plus,
  ArrowRight
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { profile, history: studyHistory, flashcards } = useAppStore();

  const recentItems = studyHistory.slice(0, 3);
  const weeklyGoal = 10;
  const progressPercent = Math.min(100, Math.round((profile.totalSolved / weeklyGoal) * 100));

  const dueCardsCount = flashcards ? flashcards.filter(c => c.nextReviewDate <= Date.now()).length : 0;
  const solvedTodayCount = studyHistory ? studyHistory.filter(h => h.timestamp >= Date.now() - 24 * 3600000).length : 0;

  // Generate a mock streak checklist for the past 7 days based on current streak
  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const todayIndex = 4; // Mock Friday

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfoRow}>
            <View style={styles.avatarWrapper}>
              <Text style={styles.avatarInitials}>{profile.username.substring(0, 2).toUpperCase()}</Text>
              <View style={styles.onlineIndicator} />
            </View>
            <View style={styles.welcomeInfo}>
              <Text style={styles.welcomeText}>Hi, {profile.username}!</Text>
              <Text style={styles.levelText}>{profile.points} XP • Pro Scholar</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.streakBadge} onPress={() => router.push('/profile')}>
            <Flame color="#ef4444" size={18} fill="#ef4444" />
            <Text style={styles.streakText}>{profile.streak} Days</Text>
          </TouchableOpacity>
        </View>

        {/* Primary Scanner Banner */}
        <TouchableOpacity 
          style={styles.scannerBanner} 
          onPress={() => router.push('/camera')}
          activeOpacity={0.85}
        >
          <View style={styles.scannerInner}>
            <View style={styles.scannerGlow} />
            <View style={styles.scannerGlowSecondary} />
            <View style={styles.scannerInfo}>
              <View style={styles.bannerBadge}>
                <Sparkles size={12} color="#c084fc" fill="#c084fc" />
                <Text style={styles.bannerBadgeText}>GEMINI AI SOLVER v1.5</Text>
              </View>
              <Text style={styles.bannerTitle}>Scan Homework</Text>
              <Text style={styles.bannerDesc}>Snap a photo of any Math, Science, or History problem for instant step-by-step solutions.</Text>
              
              <View style={styles.bannerCta}>
                <Text style={styles.bannerCtaText}>Launch Scanner</Text>
                <ArrowRight size={14} color="#ffffff" />
              </View>
            </View>
            <View style={styles.cameraIconContainer}>
              <Camera size={36} color="#ffffff" />
            </View>
          </View>
        </TouchableOpacity>

        {/* Quick Actions Row */}
        <Text style={styles.sectionTitleHeader}>Study Tools</Text>
        
        <View style={styles.row}>
          <TouchableOpacity 
            style={[styles.card, styles.halfCard]} 
            onPress={() => router.push('/text-input')}
            activeOpacity={0.8}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.iconWrapper, { backgroundColor: 'rgba(29, 78, 216, 0.15)', borderColor: 'rgba(96, 165, 250, 0.25)' }]}>
                <Keyboard size={20} color="#60a5fa" />
              </View>
              <View style={styles.cardBadge}>
                <Text style={styles.cardBadgeText}>+50 XP</Text>
              </View>
            </View>
            <Text style={styles.cardTitle}>Type Problem</Text>
            <Text style={styles.cardDesc}>Ask text questions manually</Text>
            <Text style={styles.cardMeta}>• Fast Response</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.card, styles.halfCard]} 
            onPress={() => router.push('/flashcards')}
            activeOpacity={0.8}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.iconWrapper, { backgroundColor: 'rgba(124, 58, 237, 0.15)', borderColor: 'rgba(192, 132, 252, 0.25)' }]}>
                <BookOpen size={20} color="#c084fc" />
              </View>
              <View style={[styles.cardBadge, { backgroundColor: 'rgba(192, 132, 252, 0.15)' }]}>
                <Text style={[styles.cardBadgeText, { color: '#c084fc' }]}>{dueCardsCount} Due</Text>
              </View>
            </View>
            <Text style={styles.cardTitle}>Flashcards</Text>
            <Text style={styles.cardDesc}>Spaced repetition study</Text>
            <Text style={styles.cardMeta}>• {flashcards ? flashcards.length : 0} cards in deck</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity 
            style={[styles.card, styles.halfCard]} 
            onPress={() => router.push('/quiz')}
            activeOpacity={0.8}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.iconWrapper, { backgroundColor: 'rgba(180, 83, 9, 0.15)', borderColor: 'rgba(251, 191, 36, 0.25)' }]}>
                <Award size={20} color="#fbbf24" />
              </View>
              <View style={[styles.cardBadge, { backgroundColor: 'rgba(251, 191, 36, 0.15)' }]}>
                <Text style={[styles.cardBadgeText, { color: '#fbbf24' }]}>+40 XP</Text>
              </View>
            </View>
            <Text style={styles.cardTitle}>Quiz Mode</Text>
            <Text style={styles.cardDesc}>Test your curriculum skills</Text>
            <Text style={styles.cardMeta}>• 82% avg accuracy</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.card, styles.halfCard]} 
            onPress={() => router.push('/history')}
            activeOpacity={0.8}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.iconWrapper, { backgroundColor: 'rgba(6, 95, 70, 0.15)', borderColor: 'rgba(52, 211, 153, 0.25)' }]}>
                <History size={20} color="#34d399" />
              </View>
              <View style={[styles.cardBadge, { backgroundColor: 'rgba(52, 211, 153, 0.15)' }]}>
                <Text style={[styles.cardBadgeText, { color: '#34d399' }]}>Logs</Text>
              </View>
            </View>
            <Text style={styles.cardTitle}>History</Text>
            <Text style={styles.cardDesc}>Review saved answers</Text>
            <Text style={styles.cardMeta}>• {studyHistory ? studyHistory.length : 0} solved ({solvedTodayCount} today)</Text>
          </TouchableOpacity>
        </View>

        {/* Analytics Card */}
        <TouchableOpacity 
          style={[styles.card, styles.fullCard]}
          onPress={() => router.push('/profile')}
          activeOpacity={0.85}
        >
          <View style={styles.analyticsHeader}>
            <View style={styles.analyticsTitleRow}>
              <View style={styles.analyticsIconWrapper}>
                <BarChart2 size={18} color="#a78bfa" />
              </View>
              <Text style={styles.analyticsTitle}>Weekly Study Analytics</Text>
            </View>
            <View style={styles.growthRow}>
              <TrendingUp size={14} color="#34d399" />
              <Text style={styles.growthText}>+15%</Text>
            </View>
          </View>

          {/* Goal progress bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressLabelRow}>
              <Text style={styles.progressLabelText}>Weekly Solved Goal</Text>
              <Text style={styles.progressValueText}>{progressPercent}% ({profile.totalSolved}/{weeklyGoal})</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
            </View>
          </View>

          {/* Streak Grid */}
          <View style={styles.divider} />
          <View style={styles.streakGridHeader}>
            <Calendar size={14} color="rgba(255,255,255,0.4)" />
            <Text style={styles.streakGridTitle}>Streak Completion</Text>
          </View>
          <View style={styles.streakCalendar}>
            {daysOfWeek.map((day, idx) => {
              // Highlight based on streak status
              const isCompleted = idx <= todayIndex; // Mock streak matches past days
              return (
                <View key={idx} style={styles.dayBox}>
                  <Text style={[styles.dayLabel, isCompleted && styles.activeDayLabel]}>{day}</Text>
                  <View style={[
                    styles.dayDot, 
                    isCompleted ? styles.activeDayDot : styles.inactiveDayDot
                  ]}>
                    {isCompleted && <Check size={10} color="#ffffff" />}
                  </View>
                </View>
              );
            })}
          </View>
        </TouchableOpacity>

        {/* Recent Solved Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Recent Solutions</Text>
          {recentItems.length > 0 && (
            <TouchableOpacity onPress={() => router.push('/history')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          )}
        </View>

        {recentItems.length === 0 ? (
          <View style={styles.emptyRecent}>
            <View style={styles.emptyGlow} />
            <View style={styles.emptyIconCircle}>
              <Sparkles size={28} color="#a78bfa" />
            </View>
            <Text style={styles.emptyTitle}>Solve your first homework problem!</Text>
            <Text style={styles.emptyDesc}>
              Use the scanner or type in any study question to generate instant step-by-step guides, customized quizzes, and flashcard sets.
            </Text>
            <TouchableOpacity 
              style={styles.emptyCtaButton} 
              onPress={() => router.push('/text-input')}
            >
              <Plus size={16} color="#ffffff" />
              <Text style={styles.emptyCtaButtonText}>Type your first question</Text>
            </TouchableOpacity>
          </View>
        ) : (
          recentItems.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.recentItem}
              onPress={() => router.push({
                pathname: '/explanation',
                params: { id: item.id }
              })}
              activeOpacity={0.8}
            >
              <View style={styles.recentInfo}>
                <View style={[styles.subjectBadge, 
                  item.subject === 'Math' ? styles.bgMath :
                  item.subject === 'Science' ? styles.bgScience : styles.bgGeneral
                ]}>
                  <Text style={styles.subjectBadgeText}>{item.subject}</Text>
                </View>
                <Text style={styles.recentQuestion} numberOfLines={1}>
                  {item.problem}
                </Text>
              </View>
              <ChevronRight size={18} color="rgba(255,255,255,0.3)" />
            </TouchableOpacity>
          ))
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c0a0f',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 10,
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#261b34',
    borderWidth: 1.5,
    borderColor: 'rgba(167, 139, 250, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatarInitials: {
    color: '#c084fc',
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10b981',
    borderWidth: 2,
    borderColor: '#0c0a0f',
  },
  welcomeInfo: {
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  levelText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.45)',
    marginTop: 1,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#261b20',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
  },
  streakText: {
    color: '#ef4444',
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 13,
  },
  scannerBanner: {
    backgroundColor: '#16121e',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.25)',
    marginBottom: 24,
    overflow: 'hidden',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
  },
  scannerInner: {
    flexDirection: 'row',
    padding: 22,
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
  },
  scannerGlow: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#8b5cf6',
    opacity: 0.2,
  },
  scannerGlowSecondary: {
    position: 'absolute',
    bottom: -40,
    left: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#3b82f6',
    opacity: 0.1,
  },
  scannerInfo: {
    flex: 1,
    paddingRight: 12,
  },
  bannerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#231834',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.25)',
  },
  bannerBadgeText: {
    color: '#c084fc',
    fontSize: 9,
    fontWeight: '800',
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  bannerDesc: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.55)',
    marginTop: 6,
    lineHeight: 17,
  },
  bannerCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 14,
    backgroundColor: '#8b5cf6',
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  bannerCtaText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  cameraIconContainer: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#8b5cf6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  sectionTitleHeader: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#110e16',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 16,
  },
  halfCard: {
    width: (width - 56) / 2,
  },
  fullCard: {
    width: '100%',
    marginBottom: 24,
    shadowColor: '#a78bfa',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  iconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBadge: {
    backgroundColor: 'rgba(96, 165, 250, 0.15)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  cardBadgeText: {
    color: '#60a5fa',
    fontSize: 9,
    fontWeight: 'bold',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  cardDesc: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.4)',
    marginTop: 4,
    lineHeight: 14,
  },
  cardMeta: {
    fontSize: 10,
    color: '#a78bfa',
    marginTop: 6,
    fontWeight: 'bold',
  },
  analyticsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  analyticsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  analyticsIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(167, 139, 250, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  analyticsTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  growthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 211, 153, 0.12)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 4,
  },
  growthText: {
    color: '#34d399',
    fontSize: 10,
    fontWeight: 'bold',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressLabelText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
  },
  progressValueText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#8b5cf6',
    borderRadius: 3,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginVertical: 14,
  },
  streakGridHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  streakGridTitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '500',
  },
  streakCalendar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  dayBox: {
    alignItems: 'center',
    gap: 6,
  },
  dayLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.3)',
    fontWeight: 'bold',
  },
  activeDayLabel: {
    color: '#c084fc',
  },
  dayDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeDayDot: {
    backgroundColor: '#8b5cf6',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  inactiveDayDot: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  seeAllText: {
    fontSize: 13,
    color: '#8b5cf6',
    fontWeight: '600',
  },
  emptyRecent: {
    backgroundColor: '#110e16',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
    position: 'relative',
    overflow: 'hidden',
  },
  emptyGlow: {
    position: 'absolute',
    top: -40,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#8b5cf6',
    opacity: 0.15,
  },
  emptyIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(167, 139, 250, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptyDesc: {
    color: 'rgba(255, 255, 255, 0.45)',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 17,
    paddingHorizontal: 10,
    marginBottom: 18,
  },
  emptyCtaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#8b5cf6',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  emptyCtaButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  recentItem: {
    flexDirection: 'row',
    backgroundColor: '#110e16',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  recentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 10,
  },
  subjectBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  bgMath: {
    backgroundColor: '#1d4ed8',
  },
  bgScience: {
    backgroundColor: '#7c3aed',
  },
  bgGeneral: {
    backgroundColor: '#374151',
  },
  subjectBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  recentQuestion: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  }
});
