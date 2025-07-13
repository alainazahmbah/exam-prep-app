import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Clock, Target, Shuffle, FileText, Play } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Subject } from '@/types/database';
import { supabase } from '@/lib/supabase';
import LoadingSpinner from '@/components/LoadingSpinner';

interface QuizOption {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string[];
  onPress: () => void;
}

export default function PracticeScreen() {
  const { userProfile } = useAuth();
  const { t, language } = useLanguage();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubjects();
  }, [userProfile]);

  const fetchSubjects = async () => {
    try {
      if (!userProfile) return;

      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .eq('level', userProfile.level)
        .order('name');

      if (error) throw error;
      setSubjects(data || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = (type: string, timeLimit?: number) => {
    if (!selectedSubject) {
      Alert.alert('Error', 'Please select a subject first');
      return;
    }

    // TODO: Navigate to quiz screen
    Alert.alert('Quiz Started', `Starting ${type} quiz for ${selectedSubject.name}`);
  };

  const quizOptions: QuizOption[] = [
    {
      id: 'timed',
      title: t('timedQuiz'),
      description: '20 questions • 30 minutes',
      icon: Clock,
      color: ['#DC2626', '#EF4444'],
      onPress: () => startQuiz('timed', 30),
    },
    {
      id: 'practice',
      title: t('practiceMode'),
      description: 'Unlimited time • Review answers',
      icon: Target,
      color: ['#059669', '#10B981'],
      onPress: () => startQuiz('practice'),
    },
    {
      id: 'custom',
      title: t('customQuiz'),
      description: 'Choose your questions',
      icon: Shuffle,
      color: ['#7C3AED', '#8B5CF6'],
      onPress: () => startQuiz('custom'),
    },
    {
      id: 'pastPapers',
      title: t('pastPapers'),
      description: 'Official GCE papers',
      icon: FileText,
      color: ['#EA580C', '#F97316'],
      onPress: () => startQuiz('pastPapers'),
    },
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('practice')}</Text>
        <Text style={styles.subtitle}>Choose how you want to practice</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Subject Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Subject</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.subjectsScroll}
          >
            {subjects.map((subject) => (
              <TouchableOpacity
                key={subject.id}
                style={[
                  styles.subjectChip,
                  selectedSubject?.id === subject.id && styles.subjectChipSelected,
                ]}
                onPress={() => setSelectedSubject(subject)}
              >
                <Text
                  style={[
                    styles.subjectChipText,
                    selectedSubject?.id === subject.id && styles.subjectChipTextSelected,
                  ]}
                >
                  {language === 'fr' ? subject.name_fr : subject.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Quiz Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Practice Mode</Text>
          
          {quizOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.quizOption}
              onPress={option.onPress}
              disabled={!selectedSubject}
            >
              <LinearGradient
                colors={option.color}
                style={[
                  styles.quizGradient,
                  !selectedSubject && styles.quizGradientDisabled,
                ]}
              >
                <View style={styles.quizContent}>
                  <View style={styles.quizLeft}>
                    <option.icon size={24} color="#FFFFFF" />
                    <View style={styles.quizText}>
                      <Text style={styles.quizTitle}>{option.title}</Text>
                      <Text style={styles.quizDescription}>{option.description}</Text>
                    </View>
                  </View>
                  <Play size={20} color="#FFFFFF" />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Years Selection for Past Papers */}
        {selectedSubject && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('selectYear')}</Text>
            <View style={styles.yearsGrid}>
              {[2023, 2022, 2021, 2020, 2019, 2018].map((year) => (
                <TouchableOpacity
                  key={year}
                  style={styles.yearButton}
                  onPress={() => startQuiz('pastPaper', year)}
                >
                  <Text style={styles.yearText}>{year}</Text>
                  <Text style={styles.yearQuestions}>25 {t('questionsCount')}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {!selectedSubject && (
          <View style={styles.selectPrompt}>
            <Text style={styles.selectPromptText}>
              Please select a subject to start practicing
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 15,
  },
  subjectsScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  subjectChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  subjectChipSelected: {
    backgroundColor: '#EBF4FF',
    borderColor: '#2563EB',
  },
  subjectChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  subjectChipTextSelected: {
    color: '#2563EB',
  },
  quizOption: {
    marginBottom: 15,
    borderRadius: 16,
    overflow: 'hidden',
  },
  quizGradient: {
    padding: 20,
  },
  quizGradientDisabled: {
    opacity: 0.5,
  },
  quizContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quizLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  quizText: {
    marginLeft: 15,
    flex: 1,
  },
  quizTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  quizDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  yearsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  yearButton: {
    backgroundColor: '#FFFFFF',
    width: '30%',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  yearText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  yearQuestions: {
    fontSize: 12,
    color: '#6B7280',
  },
  selectPrompt: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  selectPromptText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});