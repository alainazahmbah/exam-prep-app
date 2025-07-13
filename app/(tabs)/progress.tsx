import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { TrendingUp, Target, Clock, Award } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Progress } from '@/types/database';
import { supabase } from '@/lib/supabase';
import LoadingSpinner from '@/components/LoadingSpinner';

const { width } = Dimensions.get('window');
const chartConfig = {
  backgroundColor: '#FFFFFF',
  backgroundGradientFrom: '#FFFFFF',
  backgroundGradientTo: '#FFFFFF',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '6',
    strokeWidth: '2',
    stroke: '#2563EB',
  },
};

interface ProgressData {
  overall: {
    totalQuestions: number;
    correctAnswers: number;
    accuracy: number;
    timeSpent: number;
    streak: number;
  };
  subjects: Progress[];
  weeklyProgress: number[];
  recentQuizzes: any[];
}

export default function ProgressScreen() {
  const { userProfile } = useAuth();
  const { t } = useLanguage();
  const [progressData, setProgressData] = useState<ProgressData>({
    overall: {
      totalQuestions: 0,
      correctAnswers: 0,
      accuracy: 0,
      timeSpent: 0,
      streak: 0,
    },
    subjects: [],
    weeklyProgress: [0, 0, 0, 0, 0, 0, 0],
    recentQuizzes: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userProfile) {
      fetchProgressData();
    }
  }, [userProfile]);

  const fetchProgressData = async () => {
    try {
      if (!userProfile) return;

      // Fetch progress data
      const { data: progressData } = await supabase
        .from('progress')
        .select(`
          *,
          subjects(name, name_fr, color)
        `)
        .eq('user_id', userProfile.id);

      // Fetch recent quizzes
      const { data: quizzesData } = await supabase
        .from('quizzes')
        .select(`
          *,
          subjects(name, name_fr)
        `)
        .eq('user_id', userProfile.id)
        .order('completed_at', { ascending: false })
        .limit(10);

      if (progressData) {
        const totalQuestions = progressData.reduce((sum, p) => sum + p.total_questions_attempted, 0);
        const correctAnswers = progressData.reduce((sum, p) => sum + p.correct_answers, 0);
        const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
        const timeSpent = progressData.reduce((sum, p) => sum + p.time_spent, 0);
        const maxStreak = Math.max(...progressData.map(p => p.streak_days), 0);

        // Generate mock weekly progress data
        const weeklyProgress = [65, 70, 75, 80, 78, 85, 88];

        setProgressData({
          overall: {
            totalQuestions,
            correctAnswers,
            accuracy: Math.round(accuracy),
            timeSpent,
            streak: maxStreak,
          },
          subjects: progressData,
          weeklyProgress,
          recentQuizzes: quizzesData || [],
        });
      }
    } catch (error) {
      console.error('Error fetching progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const weeklyData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: progressData.weeklyProgress,
        color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const subjectData = progressData.subjects.slice(0, 5).map((subject, index) => ({
    name: subject.subjects?.name || 'Subject',
    population: subject.average_score,
    color: ['#2563EB', '#059669', '#EA580C', '#7C3AED', '#DC2626'][index],
    legendFontColor: '#6B7280',
    legendFontSize: 12,
  }));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('progress')}</Text>
        <Text style={styles.subtitle}>Track your learning journey</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Overall Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('overallProgress')}</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <TrendingUp size={24} color="#2563EB" />
              <Text style={styles.statNumber}>{progressData.overall.accuracy}%</Text>
              <Text style={styles.statLabel}>Accuracy</Text>
            </View>

            <View style={styles.statCard}>
              <Target size={24} color="#059669" />
              <Text style={styles.statNumber}>{progressData.overall.totalQuestions}</Text>
              <Text style={styles.statLabel}>Questions</Text>
            </View>

            <View style={styles.statCard}>
              <Clock size={24} color="#EA580C" />
              <Text style={styles.statNumber}>{formatTime(progressData.overall.timeSpent)}</Text>
              <Text style={styles.statLabel}>Study Time</Text>
            </View>

            <View style={styles.statCard}>
              <Award size={24} color="#7C3AED" />
              <Text style={styles.statNumber}>{progressData.overall.streak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
          </View>
        </View>

        {/* Weekly Progress Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Progress</Text>
          <View style={styles.chartContainer}>
            <LineChart
              data={weeklyData}
              width={width - 40}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </View>
        </View>

        {/* Subject Performance */}
        {subjectData.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('subjectProgress')}</Text>
            <View style={styles.chartContainer}>
              <PieChart
                data={subjectData}
                width={width - 40}
                height={220}
                chartConfig={chartConfig}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                style={styles.chart}
              />
            </View>
          </View>
        )}

        {/* Subject Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Subject Breakdown</Text>
          {progressData.subjects.map((subject, index) => (
            <View key={subject.id} style={styles.subjectRow}>
              <View style={styles.subjectInfo}>
                <View
                  style={[
                    styles.subjectColor,
                    { backgroundColor: subject.subjects?.color || '#6B7280' },
                  ]}
                />
                <Text style={styles.subjectName}>
                  {subject.subjects?.name || 'Subject'}
                </Text>
              </View>
              
              <View style={styles.subjectStats}>
                <Text style={styles.subjectScore}>{subject.average_score}%</Text>
                <Text style={styles.subjectQuestions}>
                  {subject.total_questions_attempted} questions
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('recentActivity')}</Text>
          {progressData.recentQuizzes.slice(0, 5).map((quiz, index) => (
            <View key={quiz.id} style={styles.activityRow}>
              <View style={styles.activityInfo}>
                <Text style={styles.activitySubject}>
                  {quiz.subjects?.name || 'Subject'}
                </Text>
                <Text style={styles.activityDate}>
                  {new Date(quiz.completed_at).toLocaleDateString()}
                </Text>
              </View>
              
              <View style={styles.activityScore}>
                <Text style={styles.activityScoreText}>{quiz.score}%</Text>
                <Text style={styles.activityTime}>
                  {formatTime(quiz.time_taken)}
                </Text>
              </View>
            </View>
          ))}
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    width: '48%',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  subjectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  subjectInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  subjectColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  subjectStats: {
    alignItems: 'flex-end',
  },
  subjectScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#059669',
  },
  subjectQuestions: {
    fontSize: 12,
    color: '#6B7280',
  },
  activityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  activityInfo: {
    flex: 1,
  },
  activitySubject: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  activityDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  activityScore: {
    alignItems: 'flex-end',
  },
  activityScoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  activityTime: {
    fontSize: 12,
    color: '#6B7280',
  },
});