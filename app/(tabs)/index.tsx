import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookOpen, Target, Calendar, Award } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabase';
import LoadingSpinner from '@/components/LoadingSpinner';

const { width } = Dimensions.get('window');

interface UserStats {
  questionsAnswered: number;
  averageScore: number;
  studyStreak: number;
  totalSubjects: number;
}

export default function HomeScreen() {
  const { userProfile } = useAuth();
  const { t } = useLanguage();
  const [stats, setStats] = useState<UserStats>({
    questionsAnswered: 0,
    averageScore: 0,
    studyStreak: 0,
    totalSubjects: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userProfile) {
      fetchUserStats();
    }
  }, [userProfile]);

  const fetchUserStats = async () => {
    try {
      if (!userProfile) return;

      // Fetch user progress
      const { data: progressData } = await supabase
        .from('progress')
        .select('*')
        .eq('user_id', userProfile.id);

      if (progressData) {
        const totalQuestions = progressData.reduce((sum, p) => sum + p.total_questions_attempted, 0);
        const totalCorrect = progressData.reduce((sum, p) => sum + p.correct_answers, 0);
        const avgScore = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;
        const maxStreak = Math.max(...progressData.map(p => p.streak_days), 0);

        setStats({
          questionsAnswered: totalQuestions,
          averageScore: Math.round(avgScore),
          studyStreak: maxStreak,
          totalSubjects: progressData.length,
        });
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={['#2563EB', '#3B82F6']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <Text style={styles.greeting}>{t('welcomeBack')}</Text>
            <Text style={styles.userName}>{userProfile?.full_name || 'Student'}</Text>
            <Text style={styles.subtitle}>{t('studyToday')}</Text>
          </View>
        </LinearGradient>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>{t('quickStats')}</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <BookOpen size={24} color="#2563EB" />
              <Text style={styles.statNumber}>{stats.questionsAnswered}</Text>
              <Text style={styles.statLabel}>{t('questionsAnswered')}</Text>
            </View>

            <View style={styles.statCard}>
              <Target size={24} color="#059669" />
              <Text style={styles.statNumber}>{stats.averageScore}%</Text>
              <Text style={styles.statLabel}>{t('averageScore')}</Text>
            </View>

            <View style={styles.statCard}>
              <Calendar size={24} color="#EA580C" />
              <Text style={styles.statNumber}>{stats.studyStreak}</Text>
              <Text style={styles.statLabel}>{t('studyStreak')} {t('days')}</Text>
            </View>

            <View style={styles.statCard}>
              <Award size={24} color="#7C3AED" />
              <Text style={styles.statNumber}>{stats.totalSubjects}</Text>
              <Text style={styles.statLabel}>{t('subjects')}</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <LinearGradient
              colors={['#2563EB', '#3B82F6']}
              style={styles.actionGradient}
            >
              <Play size={20} color="#FFFFFF" />
              <Text style={styles.actionText}>{t('startQuiz')}</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <LinearGradient
              colors={['#059669', '#10B981']}
              style={styles.actionGradient}
            >
              <BookOpen size={20} color="#FFFFFF" />
              <Text style={styles.actionText}>{t('pastPapers')}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Daily Tips */}
        <View style={styles.tipsContainer}>
          <Text style={styles.sectionTitle}>Daily Study Tip</Text>
          <View style={styles.tipCard}>
            <Text style={styles.tipText}>
              "Practice questions daily to improve your performance. Focus on your weak subjects first."
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerContent: {
    alignItems: 'center',
  },
  greeting: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    marginTop: 5,
  },
  statsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    width: (width - 60) / 2,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
  },
  actionsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  actionButton: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  tipsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  tipCard: {
    backgroundColor: '#FEF3C7',
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  tipText: {
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
  },
});