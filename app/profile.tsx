import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  Switch,
  Alert 
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, User, Shield, CloudLightning, LogOut, Check, Heart, Trophy } from 'lucide-react-native';
import { useAppStore } from '../services/store';

export default function ProfileScreen() {
  const router = useRouter();
  const { profile } = useAppStore();
  const [syncEnabled, setSyncEnabled] = useState(true);
  const [backupFlashcards, setBackupFlashcards] = useState(true);

  const leaderboard = [
    { rank: 1, name: "David K.", xp: 1250 },
    { rank: 2, name: "Sreekar (You)", xp: profile.points, isUser: true },
    { rank: 3, name: "Alex M.", xp: 420 },
    { rank: 4, name: "Chloe S.", xp: 390 }
  ];

  const handleLogout = () => {
    Alert.alert("Logout", "You are currently running in Guest mode. In production, this clears your active session.");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile & Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarContainer}>
            <User size={32} color="#c084fc" />
          </View>
          <Text style={styles.username}>{profile.username}</Text>
          <Text style={styles.email}>{profile.email}</Text>
          
          <View style={styles.statsOverview}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{profile.streak} Days</Text>
              <Text style={styles.statLabel}>Streak</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{profile.totalSolved}</Text>
              <Text style={styles.statLabel}>Solved</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{profile.points}</Text>
              <Text style={styles.statLabel}>XP</Text>
            </View>
          </View>
        </View>

        {/* Leaderboard */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Trophy size={18} color="#fbbf24" />
            <Text style={styles.cardTitle}>Global Scholar Leaderboard</Text>
          </View>

          {leaderboard.map((item) => (
            <View 
              key={item.rank} 
              style={[styles.leaderboardRow, item.isUser && styles.userRow]}
            >
              <View style={styles.rankInfo}>
                <Text style={[styles.rankText, item.rank === 1 && styles.goldRank]}>
                  #{item.rank}
                </Text>
                <Text style={[styles.rankName, item.isUser && styles.userRankName]}>
                  {item.name}
                </Text>
              </View>
              <Text style={styles.rankXp}>{item.xp} XP</Text>
            </View>
          ))}
        </View>

        {/* Firebase Synchronization Settings */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <CloudLightning size={18} color="#a78bfa" />
            <Text style={styles.cardTitle}>Cloud Synchronization (Firebase)</Text>
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingName}>Sync Solved History</Text>
              <Text style={styles.settingDesc}>Sync questions automatically to Firestore</Text>
            </View>
            <Switch
              value={syncEnabled}
              onValueChange={setSyncEnabled}
              trackColor={{ false: '#2d3748', true: '#8b5cf6' }}
              thumbColor={syncEnabled ? '#ffffff' : '#cbd5e0'}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingName}>Backup Flashcards</Text>
              <Text style={styles.settingDesc}>Keep flashcards backed up in real-time</Text>
            </View>
            <Switch
              value={backupFlashcards}
              onValueChange={setBackupFlashcards}
              trackColor={{ false: '#2d3748', true: '#8b5cf6' }}
              thumbColor={backupFlashcards ? '#ffffff' : '#cbd5e0'}
            />
          </View>
        </View>

        {/* General Settings */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Shield size={18} color="#60a5fa" />
            <Text style={styles.cardTitle}>Security & Privacy</Text>
          </View>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Terms of Service</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Privacy Policy</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Contact Support</Text>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <LogOut size={18} color="#ef4444" />
          <Text style={styles.logoutText}>Logout from Account</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Gauth Clone v1.0.0 • 8x Engineer Entry</Text>

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
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  userCard: {
    backgroundColor: '#16121e',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.15)',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#261b34',
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  email: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    marginTop: 2,
  },
  statsOverview: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    paddingTop: 16,
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  statLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.4)',
    marginTop: 2,
  },
  card: {
    backgroundColor: '#110e16',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  leaderboardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
  },
  userRow: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 8,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    borderWidth: 1,
  },
  rankInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rankText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: 'rgba(255,255,255,0.4)',
    width: 24,
  },
  goldRank: {
    color: '#fbbf24',
  },
  rankName: {
    fontSize: 13,
    color: '#ffffff',
  },
  userRankName: {
    fontWeight: 'bold',
  },
  rankXp: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
  },
  settingInfo: {
    flex: 1,
    paddingRight: 12,
  },
  settingName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
  },
  settingDesc: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
    marginTop: 2,
  },
  menuItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
  },
  menuItemText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
  },
  logoutBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'rgba(239, 68, 68, 0.2)',
    borderWidth: 1,
    backgroundColor: '#211619',
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
    marginTop: 10,
    marginBottom: 20,
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: 'bold',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 10,
    color: 'rgba(255,255,255,0.25)',
  }
});
