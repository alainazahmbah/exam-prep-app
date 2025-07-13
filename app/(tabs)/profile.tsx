import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  User,
  Settings,
  Globe,
  Bell,
  Download,
  HelpCircle,
  LogOut,
  ChevronRight,
} from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface SettingItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: any;
  type: 'navigation' | 'switch' | 'action';
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
}

export default function ProfileScreen() {
  const { userProfile, signOut } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const [notifications, setNotifications] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);

  const handleSignOut = () => {
    Alert.alert(
      t('logout'),
      'Are you sure you want to logout?',
      [
        {
          text: t('cancel'),
          style: 'cancel',
        },
        {
          text: t('logout'),
          onPress: async () => {
            const { error } = await signOut();
            if (error) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
  };

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'fr' : 'en';
    setLanguage(newLanguage);
  };

  const settingsItems: SettingItem[] = [
    {
      id: 'profile',
      title: t('myProfile'),
      subtitle: 'Edit your profile information',
      icon: User,
      type: 'navigation',
      onPress: () => Alert.alert('Profile', 'Profile editing coming soon'),
    },
    {
      id: 'language',
      title: t('language'),
      subtitle: language === 'en' ? 'English' : 'Français',
      icon: Globe,
      type: 'action',
      onPress: toggleLanguage,
    },
    {
      id: 'notifications',
      title: t('notifications'),
      subtitle: 'Manage your notification preferences',
      icon: Bell,
      type: 'switch',
      value: notifications,
      onToggle: setNotifications,
    },
    {
      id: 'offline',
      title: 'Offline Content',
      subtitle: 'Download content for offline use',
      icon: Download,
      type: 'switch',
      value: offlineMode,
      onToggle: setOfflineMode,
    },
    {
      id: 'help',
      title: 'Help & Support',
      subtitle: 'Get help and contact support',
      icon: HelpCircle,
      type: 'navigation',
      onPress: () => Alert.alert('Help', 'Help & Support coming soon'),
    },
    {
      id: 'about',
      title: t('about'),
      subtitle: 'App version and information',
      icon: Settings,
      type: 'navigation',
      onPress: () => Alert.alert('About', 'GCE Prep App v1.0.0'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('profile')}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Info */}
        <View style={styles.userCard}>
          <View style={styles.userAvatar}>
            <Text style={styles.userInitial}>
              {userProfile?.full_name?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{userProfile?.full_name || 'User'}</Text>
            <Text style={styles.userEmail}>{userProfile?.email}</Text>
            <View style={styles.userBadge}>
              <Text style={styles.userBadgeText}>
                {userProfile?.level === 'o_level' ? 'O-Level' : 'A-Level'} {t('student')}
              </Text>
            </View>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings')}</Text>
          
          {settingsItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.settingItem}
              onPress={item.onPress}
              disabled={item.type === 'switch'}
            >
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                  <item.icon size={20} color="#6B7280" />
                </View>
                
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>{item.title}</Text>
                  {item.subtitle && (
                    <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                  )}
                </View>
              </View>

              <View style={styles.settingRight}>
                {item.type === 'switch' ? (
                  <Switch
                    value={item.value}
                    onValueChange={item.onToggle}
                    trackColor={{ false: '#F3F4F6', true: '#2563EB' }}
                    thumbColor={item.value ? '#FFFFFF' : '#FFFFFF'}
                  />
                ) : (
                  <ChevronRight size={20} color="#9CA3AF" />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
          <LogOut size={20} color="#DC2626" />
          <Text style={styles.logoutText}>{t('logout')}</Text>
        </TouchableOpacity>

        {/* App Info */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>GCE Preparation App</Text>
          <Text style={styles.footerText}>Version 1.0.0</Text>
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
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInitial: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userInfo: {
    marginLeft: 15,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  userBadge: {
    backgroundColor: '#EBF4FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  userBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },
  section: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 15,
  },
  settingItem: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
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
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  settingRight: {
    marginLeft: 12,
  },
  logoutButton: {
    backgroundColor: '#FEF2F2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 30,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 2,
  },
});