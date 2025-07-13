import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Subject } from '@/types/database';
import { supabase } from '@/lib/supabase';
import LoadingSpinner from '@/components/LoadingSpinner';

const subjectIcons: { [key: string]: string } = {
  mathematics: '📐',
  physics: '⚛️',
  chemistry: '🧪',
  biology: '🧬',
  english: '📚',
  literature: '📖',
  geography: '🌍',
  history: '🏛️',
  economics: '📈',
  accounting: '💰',
};

export default function SubjectsScreen() {
  const { userProfile } = useAuth();
  const { t, language } = useLanguage();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubjects();
  }, [userProfile]);

  useEffect(() => {
    filterSubjects();
  }, [subjects, searchQuery, selectedCategory]);

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

  const filterSubjects = () => {
    let filtered = subjects;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(subject => {
        const name = language === 'fr' ? subject.name_fr : subject.name;
        return name.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(subject => subject.category === selectedCategory);
    }

    setFilteredSubjects(filtered);
  };

  const categories = [
    { key: 'all', label: t('all') },
    { key: 'sciences', label: t('sciences') },
    { key: 'arts', label: t('arts') },
    { key: 'commercial', label: t('commercial') },
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('subjects')}</Text>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={20} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('search')}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.key}
              style={[
                styles.categoryButton,
                selectedCategory === category.key && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(category.key)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category.key && styles.categoryTextActive,
                ]}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.subjectsGrid}>
          {filteredSubjects.map((subject) => (
            <TouchableOpacity
              key={subject.id}
              style={[styles.subjectCard, { borderColor: subject.color }]}
            >
              <View style={styles.subjectIcon}>
                <Text style={styles.subjectEmoji}>
                  {subjectIcons[subject.name.toLowerCase()] || '📚'}
                </Text>
              </View>
              
              <Text style={styles.subjectName}>
                {language === 'fr' ? subject.name_fr : subject.name}
              </Text>
              
              <View style={styles.subjectMeta}>
                <Text style={styles.subjectLevel}>
                  {userProfile?.level === 'o_level' ? 'O-Level' : 'A-Level'}
                </Text>
                <Text style={styles.subjectCategory}>
                  {t(subject.category)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {filteredSubjects.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No subjects found</Text>
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
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 15,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  categoryContainer: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 10,
  },
  categoryButtonActive: {
    backgroundColor: '#2563EB',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  subjectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  subjectCard: {
    backgroundColor: '#FFFFFF',
    width: '48%',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  subjectIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  subjectEmoji: {
    fontSize: 24,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subjectMeta: {
    alignItems: 'center',
  },
  subjectLevel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  subjectCategory: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
  },
});