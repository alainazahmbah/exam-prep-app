import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, router } from 'expo-router';
import { Mail, Lock, User, GraduationCap } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

export default function RegisterScreen() {
  const { signUp } = useAuth();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    level: 'o_level' as 'o_level' | 'a_level',
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const { fullName, email, password, confirmPassword, level } = formData;

    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const userData = {
        full_name: fullName,
        level,
        role: 'student' as const,
        preferred_language: 'en' as const,
      };

      const { error } = await signUp(email, password, userData);
      
      if (error) {
        Alert.alert('Registration Error', error.message);
      } else {
        Alert.alert(
          'Success',
          'Account created successfully! Please check your email to verify your account.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/auth/login'),
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Join thousands of students preparing for GCE</Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <User size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder={t('fullName')}
                  value={formData.fullName}
                  onChangeText={(value) => updateFormData('fullName', value)}
                  autoCapitalize="words"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.inputContainer}>
                <Mail size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder={t('email')}
                  value={formData.email}
                  onChangeText={(value) => updateFormData('email', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.inputContainer}>
                <Lock size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder={t('password')}
                  value={formData.password}
                  onChangeText={(value) => updateFormData('password', value)}
                  secureTextEntry
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.inputContainer}>
                <Lock size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder={t('confirmPassword')}
                  value={formData.confirmPassword}
                  onChangeText={(value) => updateFormData('confirmPassword', value)}
                  secureTextEntry
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              {/* Level Selection */}
              <View style={styles.levelContainer}>
                <Text style={styles.levelLabel}>{t('selectLevel')}</Text>
                <View style={styles.levelButtons}>
                  <TouchableOpacity
                    style={[
                      styles.levelButton,
                      formData.level === 'o_level' && styles.levelButtonActive,
                    ]}
                    onPress={() => updateFormData('level', 'o_level')}
                  >
                    <GraduationCap
                      size={20}
                      color={formData.level === 'o_level' ? '#FFFFFF' : '#6B7280'}
                    />
                    <Text
                      style={[
                        styles.levelButtonText,
                        formData.level === 'o_level' && styles.levelButtonTextActive,
                      ]}
                    >
                      {t('oLevel')}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.levelButton,
                      formData.level === 'a_level' && styles.levelButtonActive,
                    ]}
                    onPress={() => updateFormData('level', 'a_level')}
                  >
                    <GraduationCap
                      size={20}
                      color={formData.level === 'a_level' ? '#FFFFFF' : '#6B7280'}
                    />
                    <Text
                      style={[
                        styles.levelButtonText,
                        formData.level === 'a_level' && styles.levelButtonTextActive,
                      ]}
                    >
                      {t('aLevel')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={styles.registerButton}
                onPress={handleRegister}
                disabled={loading}
              >
                <LinearGradient
                  colors={['#2563EB', '#3B82F6']}
                  style={styles.registerGradient}
                >
                  <Text style={styles.registerText}>
                    {loading ? 'Creating Account...' : t('register')}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <Link href="/auth/login" asChild>
                <TouchableOpacity>
                  <Text style={styles.linkText}>{t('login')}</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  form: {
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1F2937',
  },
  levelContainer: {
    marginBottom: 20,
  },
  levelLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  levelButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  levelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  levelButtonActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  levelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginLeft: 8,
  },
  levelButtonTextActive: {
    color: '#FFFFFF',
  },
  registerButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 10,
  },
  registerGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  registerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
  },
  linkText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
  },
});