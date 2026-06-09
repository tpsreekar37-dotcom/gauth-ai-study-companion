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
  TrendingUp
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { profile, history } = useAppStore();

  const recentItems = history.slice(0, 3);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Hi, {profile.username}!</Text>
            <Text style={styles.levelText}>{profile.points} XP • Pro Scholar</Text>
          </View>
          <TouchableOpacity style={styles.streakBadge} onPress={() => router.push('/profile')}>
            <Flame color="#ef4444" size={20} fill="#ef4444" />
            <Text style={styles.streakText}>{profile.streak} Days</Text>
          </TouchableOpacity>
        </View>

        {/* Primary Scanner Banner */}
        <TouchableOpacity 
          style={styles.scannerBanner} 
          onPress={() => router.push('/camera')}
          activeOpacity={0.8}
        >
          <View style={styles.scannerInner}>
            <View style={styles.scannerGlow} />
            <View style={styles.scannerInfo}>
              <View style={styles.bannerBadge}>
                <Sparkles size={12} color="#a78bfa" />
                <Text style={styles.bannerBadgeText}>Gemini AI Powered</Text>
              </View>
              <Text style={styles.bannerTitle}>Scan Homework</Text>
              <Text style={styles.bannerDesc}>Take a photo of any math, science, or history problem for instant solutions.</Text>
            </View>
            <View style={styles.cameraIconContainer}>
              <Camera size={36} color="#ffffff" />
            </View>
          </View>
        </TouchableOpacity>

        {/* Quick Actions Row */}
        <View style={styles.row}>
          <TouchableOpacity 
            style={[styles.card, styles.halfCard]} 
            onPress={() => router.push('/text-input')}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.iconWrapper, { backgroundColor: '#1d4ed8' }]}>
                <Keyboard size={20} color="#60a5fa" />
              </View>
            </View>
            <Text style={styles.cardTitle}>Type Problem</Text>
            <Text style={styles.cardDesc}>Ask text questions manually</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.card, styles.halfCard]} 
            onPress={() => router.push('/flashcards')}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.iconWrapper, { backgroundColor: '#7c3aed' }]}>
                <BookOpen size={20} color="#c084fc" />
              </View>
            </View>
            <Text style={styles.cardTitle}>Flashcards</Text>
            <Text style={styles.cardDesc}>Spaced repetition study</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity 
            style={[styles.card, styles.halfCard]} 
            onPress={() => router.push('/quiz')}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.iconWrapper, { backgroundColor: '#b45309' }]}>
                <Award size={20} color="#fbbf24" />
              </View>
            </View>
            <Text style={styles.cardTitle}>Quiz Mode</Text>
            <Text style={styles.cardDesc}>Test your curriculum skills</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.card, styles.halfCard]} 
            onPress={() => router.push('/history')}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.iconWrapper, { backgroundColor: '#065f46' }]}>
                <History size={20} color="#34d399" />
              </View>
            </View>
            <Text style={styles.cardTitle}>History</Text>
            <Text style={styles.cardDesc}>Review saved answers</Text>
          </TouchableOpacity>
        </View>

        {/* Analytics Card */}
        <TouchableOpacity 
          style={[styles.card, styles.fullCard]}
          onPress={() => router.push('/profile')}
        >
          <View style={styles.analyticsHeader}>
            <View style={styles.analyticsTitleRow}>
              <TrendingUp size={20} color="#a78bfa" />
              <Text style={styles.analyticsTitle}>Weekly Study Analytics</Text>
            </View>
            <ChevronRight size={16} color="rgba(255,255,255,0.4)" />
          </View>
          <View style={styles.analyticsStats}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{profile.totalSolved}</Text>
              <Text style={styles.statLabel}>Questions Solved</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{profile.streak} Days</Text>
              <Text style={styles.statLabel}>Active Streak</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{profile.points} XP</Text>
              <Text style={styles.statLabel}>Total Points</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Recent Solved Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Recent Solutions</Text>
          <TouchableOpacity onPress={() => router.push('/history')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {recentItems.length === 0 ? (
          <View style={styles.emptyRecent}>
            <Text style={styles.emptyText}>No solved problems yet. Scan your first homework!</Text>
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
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  levelText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 2,
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
    borderColor: 'rgba(139, 92, 246, 0.2)',
    marginBottom: 20,
    overflow: 'hidden',
  },
  scannerInner: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scannerGlow: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#8b5cf6',
    opacity: 0.15,
    blurRadius: 30,
  },
  scannerInfo: {
    flex: 1,
    paddingRight: 16,
  },
  bannerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#231834',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.2)',
  },
  bannerBadgeText: {
    color: '#a78bfa',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  bannerDesc: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 4,
    lineHeight: 16,
  },
  cameraIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#8b5cf6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
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
  },
  cardHeader: {
    marginBottom: 12,
  },
  iconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.85,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  cardDesc: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.4)',
    marginTop: 4,
    lineHeight: 14,
  },
  analyticsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  analyticsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  analyticsTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 8,
  },
  analyticsStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  statLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.4)',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  seeAllText: {
    fontSize: 13,
    color: '#8b5cf6',
  },
  emptyRecent: {
    backgroundColor: '#110e16',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.03)',
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 12,
    textAlign: 'center',
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
