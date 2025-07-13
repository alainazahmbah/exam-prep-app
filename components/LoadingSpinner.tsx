import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useLanguage } from '@/contexts/LanguageContext';

export default function LoadingSpinner() {
  const { t } = useLanguage();
  
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#2563EB" />
      <Text style={styles.text}>{t('loading')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    color: '#6B7280',
  },
});