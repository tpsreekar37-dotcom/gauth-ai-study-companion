import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView,
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft, 
  Bookmark, 
  Trash2, 
  Calendar, 
  ChevronRight,
  Calculator,
  Atom,
  Clock,
  BookOpen,
  Sparkles,
  Award,
  History as HistoryIcon
} from 'lucide-react-native';
import { useAppStore } from '../services/store';

const { width } = Dimensions.get('window');

export default function HistoryScreen() {
  const router = useRouter();
  const { history, toggleBookmark, deleteHistoryItem } = useAppStore();
  const [activeTab, setActiveTab] = useState<'All' | 'Bookmarks'>('All');
  const [filterSubject, setFilterSubject] = useState<string | null>(null);

  const subjects = ['Math', 'Science', 'History', 'General'];

  // Apply filters
  const filteredData = history.filter((item) => {
    const matchesTab = activeTab === 'All' || item.bookmarked;
    const matchesSubject = !filterSubject || item.subject === filterSubject;
    return matchesTab && matchesSubject;
  });

  // Calculate statistics
  const now = Date.now();
  const solvedToday = history.filter(item => item.timestamp >= now - 24 * 60 * 60 * 1000).length;
  const solvedThisWeek = history.filter(item => item.timestamp >= now - 7 * 24 * 60 * 60 * 1000).length;
  const totalQuestions = history.length;

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();
    
    const timeStr = date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: true });
    
    if (isToday) {
      return `Today at ${timeStr}`;
    } else if (isYesterday) {
      return `Yesterday at ${timeStr}`;
    } else {
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  const getSubjectIcon = (subject: string) => {
    switch (subject) {
      case 'Math':
        return <Calculator size={16} color="#60a5fa" />;
      case 'Science':
        return <Atom size={16} color="#c084fc" />;
      case 'History':
        return <Clock size={16} color="#fbbf24" />;
      default:
        return <BookOpen size={16} color="#34d399" />;
    }
  };

  const getSubjectStyle = (subject: string) => {
    switch (subject) {
      case 'Math':
        return { bg: 'rgba(29, 78, 216, 0.12)', border: 'rgba(96, 165, 250, 0.25)', text: '#60a5fa' };
      case 'Science':
        return { bg: 'rgba(124, 58, 237, 0.12)', border: 'rgba(192, 132, 252, 0.25)', text: '#c084fc' };
      case 'History':
        return { bg: 'rgba(180, 83, 9, 0.12)', border: 'rgba(251, 191, 36, 0.25)', text: '#fbbf24' };
      default:
        return { bg: 'rgba(6, 95, 70, 0.12)', border: 'rgba(52, 211, 153, 0.25)', text: '#34d399' };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={20} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Study History</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.mainScroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Stats Dashboard */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={[styles.statIconWrapper, { backgroundColor: 'rgba(96, 165, 250, 0.1)' }]}>
              <Award size={16} color="#60a5fa" />
            </View>
            <Text style={styles.statValue}>{solvedToday}</Text>
            <Text style={styles.statLabel}>Solved Today</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIconWrapper, { backgroundColor: 'rgba(192, 132, 252, 0.1)' }]}>
              <Sparkles size={16} color="#c084fc" />
            </View>
            <Text style={styles.statValue}>{solvedThisWeek}</Text>
            <Text style={styles.statLabel}>This Week</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIconWrapper, { backgroundColor: 'rgba(52, 211, 153, 0.1)' }]}>
              <Calendar size={16} color="#34d399" />
            </View>
            <Text style={styles.statValue}>{totalQuestions}</Text>
            <Text style={styles.statLabel}>Total Solved</Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsRow}>
          <TouchableOpacity 
            style={[styles.tabBtn, activeTab === 'All' && styles.activeTabBtn]} 
            onPress={() => setActiveTab('All')}
          >
            <Text style={[styles.tabText, activeTab === 'All' && styles.activeTabText]}>All Problems</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabBtn, activeTab === 'Bookmarks' && styles.activeTabBtn]} 
            onPress={() => setActiveTab('Bookmarks')}
          >
            <Text style={[styles.tabText, activeTab === 'Bookmarks' && styles.activeTabText]}>Bookmarks</Text>
          </TouchableOpacity>
        </View>

        {/* Filter Badges */}
        <View style={styles.filtersWrapper}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersList}
          >
            <TouchableOpacity 
              style={[styles.filterBadge, !filterSubject && styles.activeFilterBadge]}
              onPress={() => setFilterSubject(null)}
            >
              <Text style={[styles.filterBadgeText, !filterSubject && styles.activeFilterBadgeText]}>All Subjects</Text>
            </TouchableOpacity>
            {subjects.map((sub) => (
              <TouchableOpacity 
                key={sub} 
                style={[styles.filterBadge, filterSubject === sub && styles.activeFilterBadge]}
                onPress={() => setFilterSubject(sub)}
              >
                <Text style={[styles.filterBadgeText, filterSubject === sub && styles.activeFilterBadgeText]}>{sub}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* List items */}
        {filteredData.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyGlow} />
            <View style={styles.emptyIconCircle}>
              <HistoryIcon size={32} color="#a78bfa" />
            </View>
            <Text style={styles.emptyTitle}>No saved logs found</Text>
            <Text style={styles.emptySubtitle}>
              {activeTab === 'Bookmarks' 
                ? "Bookmark important questions from the explanation screen to review them later."
                : "Problems you solve using Gemini AI or manual inputs will automatically appear here."}
            </Text>
          </View>
        ) : (
          filteredData.map((item) => {
            const theme = getSubjectStyle(item.subject);
            const difficulty = item.explanation.difficulty || 'Easy';
            
            return (
              <View key={item.id} style={styles.historyCard}>
                <TouchableOpacity 
                  style={styles.cardMain}
                  onPress={() => router.push({
                    pathname: '/explanation',
                    params: { id: item.id }
                  })}
                  activeOpacity={0.85}
                >
                  <View style={styles.cardHeader}>
                    <View style={styles.cardHeaderLeft}>
                      <View style={[styles.subjectIconWrapper, { backgroundColor: theme.bg, borderColor: theme.border }]}>
                        {getSubjectIcon(item.subject)}
                      </View>
                      <View style={[styles.subjectBadge, { backgroundColor: theme.bg, borderColor: theme.border }]}>
                        <Text style={[styles.subjectBadgeText, { color: theme.text }]}>{item.subject}</Text>
                      </View>
                      
                      {/* Difficulty Chip */}
                      <View style={[
                        styles.diffBadge, 
                        difficulty === 'Hard' ? styles.bgDiffHard :
                        difficulty === 'Medium' ? styles.bgDiffMedium : styles.bgDiffEasy
                      ]}>
                        <Text style={[
                          styles.diffBadgeText,
                          difficulty === 'Hard' ? styles.textDiffHard :
                          difficulty === 'Medium' ? styles.textDiffMedium : styles.textDiffEasy
                        ]}>
                          {difficulty}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.dateContainer}>
                      <Calendar size={12} color="rgba(255,255,255,0.3)" />
                      <Text style={styles.dateText}>{formatDate(item.timestamp)}</Text>
                    </View>
                  </View>

                  <Text style={styles.questionText} numberOfLines={2}>
                    {item.problem}
                  </Text>

                  <View style={styles.answerPreviewRow}>
                    <Text style={styles.answerPreviewLabel}>Final Answer:</Text>
                    <Text style={styles.answerPreviewValue} numberOfLines={1}>
                      {item.explanation.finalAnswer}
                    </Text>
                    <ChevronRight size={14} color="rgba(255,255,255,0.25)" style={{ marginLeft: 'auto' }} />
                  </View>
                </TouchableOpacity>

                <View style={styles.cardActions}>
                  <TouchableOpacity 
                    style={styles.actionIcon} 
                    onPress={() => toggleBookmark(item.id)}
                    activeOpacity={0.7}
                  >
                    <Bookmark 
                      size={15} 
                      color={item.bookmarked ? "#8b5cf6" : "rgba(255,255,255,0.4)"} 
                      fill={item.bookmarked ? "#8b5cf6" : "transparent"} 
                    />
                    <Text style={[styles.actionText, item.bookmarked && { color: '#8b5cf6' }]}>
                      {item.bookmarked ? 'Bookmarked' : 'Bookmark'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.actionIcon} 
                    onPress={() => deleteHistoryItem(item.id)}
                    activeOpacity={0.7}
                  >
                    <Trash2 size={15} color="#ef4444" />
                    <Text style={[styles.actionText, { color: '#ef4444' }]}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
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
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  mainScroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#110e16',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    borderRadius: 18,
    padding: 12,
    alignItems: 'center',
  },
  statIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  statLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.4)',
    marginTop: 2,
    textAlign: 'center',
  },
  tabsRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 24,
    backgroundColor: '#110e16',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTabBtn: {
    backgroundColor: '#8b5cf6',
  },
  tabText: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 13,
    fontWeight: 'bold',
  },
  activeTabText: {
    color: '#ffffff',
  },
  filtersWrapper: {
    marginHorizontal: 20,
    marginTop: 18,
    marginBottom: 10,
  },
  filtersList: {
    flexDirection: 'row',
    gap: 8,
  },
  filterBadge: {
    backgroundColor: '#110e16',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  activeFilterBadge: {
    backgroundColor: '#261b34',
    borderColor: 'rgba(167, 139, 250, 0.3)',
  },
  filterBadgeText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    fontWeight: '500',
  },
  activeFilterBadgeText: {
    color: '#c084fc',
    fontWeight: 'bold',
  },
  historyCard: {
    backgroundColor: '#110e16',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 14,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  cardMain: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  subjectIconWrapper: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subjectBadge: {
    borderWidth: 1,
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  subjectBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  diffBadge: {
    borderWidth: 1,
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  bgDiffEasy: {
    backgroundColor: 'rgba(52, 211, 153, 0.08)',
    borderColor: 'rgba(52, 211, 153, 0.2)',
  },
  bgDiffMedium: {
    backgroundColor: 'rgba(251, 191, 36, 0.08)',
    borderColor: 'rgba(251, 191, 36, 0.2)',
  },
  bgDiffHard: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  diffBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  textDiffEasy: {
    color: '#34d399',
  },
  textDiffMedium: {
    color: '#fbbf24',
  },
  textDiffHard: {
    color: '#ef4444',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 11,
  },
  questionText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    lineHeight: 18,
    marginBottom: 10,
  },
  answerPreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0c0a0f',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
    gap: 6,
  },
  answerPreviewLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
  },
  answerPreviewValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#34d399',
    flex: 1,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#0e0b12',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.02)',
  },
  actionIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
  },
  actionText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
    marginTop: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  emptyGlow: {
    position: 'absolute',
    top: -20,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#8b5cf6',
    opacity: 0.1,
  },
  emptyIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(167, 139, 250, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.2)',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.45)',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 20,
  }
});

