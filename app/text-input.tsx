import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Send } from 'lucide-react-native';
import { useAppStore } from '../services/store';
import { GeminiService } from '../services/GeminiService';

export default function TextInputScreen() {
  const router = useRouter();
  const addHistoryItem = useAppStore((state) => state.addHistoryItem);
  const [problemText, setProblemText] = useState('');
  const [subject, setSubject] = useState<'Math' | 'Science' | 'History' | 'General'>('Math');
  const [loading, setLoading] = useState(false);

  const subjects: Array<'Math' | 'Science' | 'History' | 'General'> = ['Math', 'Science', 'History', 'General'];

  const handleSolve = async () => {
    if (!problemText.trim()) return;
    setLoading(true);

    try {
      const result = await GeminiService.solveProblem({ text: problemText }, subject);
      
      const id = addHistoryItem({
        problem: problemText,
        subject,
        explanation: result
      });

      setLoading(false);
      router.push({
        pathname: '/explanation',
        params: { id }
      });
    } catch (err) {
      setLoading(false);
      alert("Something went wrong, please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Type Problem</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Subject Picker */}
        <Text style={styles.sectionLabel}>Select Subject</Text>
        <View style={styles.subjectRow}>
          {subjects.map((sub) => (
            <TouchableOpacity 
              key={sub} 
              style={[styles.subjectBtn, subject === sub && styles.activeSubjectBtn]}
              onPress={() => setSubject(sub)}
            >
              <Text style={[styles.subjectText, subject === sub && styles.activeSubjectText]}>
                {sub}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Input Box */}
        <Text style={styles.sectionLabel}>Your Question</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            multiline
            numberOfLines={6}
            placeholder="Type your homework question, math equation, or topic query here..."
            placeholderTextColor="rgba(255, 255, 255, 0.3)"
            value={problemText}
            onChangeText={setProblemText}
          />
        </View>

        {/* Solve Button */}
        <TouchableOpacity 
          style={[styles.solveButton, !problemText.trim() && styles.disabledButton]} 
          onPress={handleSolve}
          disabled={loading || !problemText.trim()}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <>
              <Text style={styles.solveButtonText}>Solve with Gemini AI</Text>
              <Send size={16} color="#ffffff" />
            </>
          )}
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
  },
  sectionLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 10,
    fontWeight: '500',
  },
  subjectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  subjectBtn: {
    flex: 1,
    backgroundColor: '#110e16',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    paddingVertical: 10,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  activeSubjectBtn: {
    backgroundColor: '#8b5cf6',
    borderColor: '#a78bfa',
  },
  subjectText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    fontWeight: 'bold',
  },
  activeSubjectText: {
    color: '#ffffff',
  },
  inputContainer: {
    backgroundColor: '#110e16',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 28,
  },
  textInput: {
    color: '#ffffff',
    fontSize: 14,
    lineHeight: 20,
    height: 120,
    textAlignVertical: 'top',
  },
  solveButton: {
    backgroundColor: '#8b5cf6',
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  disabledButton: {
    backgroundColor: 'rgba(139, 92, 246, 0.4)',
  },
  solveButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  }
});
