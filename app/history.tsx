import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Bookmark, Trash2, Calendar, ChevronRight } from 'lucide-react-native';
import { useAppStore } from '../services/store';

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

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Study History</Text>
        <View style={{ width: 40 }} />
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
            <Text style={[styles.filterBadgeText, !filterSubject && styles.activeFilterBadgeText]}>All</Text>
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

      {filteredData.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No saved logs found</Text>
          <Text style={styles.emptySubtitle}>Problems you solve will appear here.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.historyCard}>
              <TouchableOpacity 
                style={styles.cardMain}
                onPress={() => router.push({
                  pathname: '/explanation',
                  params: { id: item.id }
                })}
              >
                <View style={styles.cardHeader}>
                  <View style={[styles.subjectBadge, 
                    item.subject === 'Math' ? styles.bgMath :
                    item.subject === 'Science' ? styles.bgScience : styles.bgGeneral
                  ]}>
                    <Text style={styles.subjectBadgeText}>{item.subject}</Text>
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
                  <Text style={styles.answerPreviewLabel}>Answer Preview:</Text>
                  <Text style={styles.answerPreviewValue} numberOfLines={1}>
                    {item.explanation.finalAnswer}
                  </Text>
                </View>
              </TouchableOpacity>

              <View style={styles.cardActions}>
                <TouchableOpacity 
                  style={styles.actionIcon} 
                  onPress={() => toggleBookmark(item.id)}
                >
                  <Bookmark size={16} color={item.bookmarked ? "#8b5cf6" : "rgba(255,255,255,0.4)"} fill={item.bookmarked ? "#8b5cf6" : "transparent"} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.actionIcon} 
                  onPress={() => deleteHistoryItem(item.id)}
                >
                  <Trash2 size={16} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
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
  tabsRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 16,
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
    marginTop: 16,
    marginBottom: 8,
  },
  filtersList: {
    flexDirection: 'row',
    gap: 8,
  },
  filterBadge: {
    backgroundColor: '#110e16',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
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
  listContent: {
    padding: 20,
    paddingTop: 10,
  },
  historyCard: {
    backgroundColor: '#110e16',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
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
    marginBottom: 10,
  },
  subjectBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
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
    fontSize: 9,
    fontWeight: 'bold',
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
  },
  answerPreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 6,
  },
  answerPreviewLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.3)',
  },
  answerPreviewValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#34d399',
    flex: 1,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: '#0e0b12',
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 16,
  },
  actionIcon: {
    padding: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  emptySubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    marginTop: 4,
    textAlign: 'center',
  }
});
