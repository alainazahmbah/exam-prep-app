import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Language = 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Auth
    login: 'Login',
    register: 'Register',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    fullName: 'Full Name',
    selectLevel: 'Select Level',
    oLevel: 'O-Level',
    aLevel: 'A-Level',
    student: 'Student',
    teacher: 'Teacher',
    
    // Navigation
    home: 'Home',
    subjects: 'Subjects',
    practice: 'Practice',
    progress: 'Progress',
    profile: 'Profile',
    
    // Home
    welcomeBack: 'Welcome back',
    studyToday: 'Continue your study today',
    quickStats: 'Quick Stats',
    questionsAnswered: 'Questions Answered',
    averageScore: 'Average Score',
    studyStreak: 'Study Streak',
    days: 'days',
    
    // Subjects
    sciences: 'Sciences',
    arts: 'Arts',
    commercial: 'Commercial',
    mathematics: 'Mathematics',
    physics: 'Physics',
    chemistry: 'Chemistry',
    biology: 'Biology',
    english: 'English',
    literature: 'Literature',
    geography: 'Geography',
    history: 'History',
    economics: 'Economics',
    accounting: 'Accounting',
    
    // Practice
    startQuiz: 'Start Quiz',
    timedQuiz: 'Timed Quiz',
    practiceMode: 'Practice Mode',
    customQuiz: 'Custom Quiz',
    pastPapers: 'Past Papers',
    selectYear: 'Select Year',
    questionsCount: 'questions',
    
    // Quiz
    question: 'Question',
    of: 'of',
    timeLeft: 'Time Left',
    submit: 'Submit',
    next: 'Next',
    previous: 'Previous',
    bookmark: 'Bookmark',
    explanation: 'Explanation',
    
    // Results
    quizComplete: 'Quiz Complete!',
    yourScore: 'Your Score',
    timeSpent: 'Time Spent',
    correctAnswers: 'Correct Answers',
    reviewAnswers: 'Review Answers',
    tryAgain: 'Try Again',
    
    // Progress
    overallProgress: 'Overall Progress',
    subjectProgress: 'Subject Progress',
    recentActivity: 'Recent Activity',
    achievements: 'Achievements',
    
    // Profile
    myProfile: 'My Profile',
    settings: 'Settings',
    language: 'Language',
    notifications: 'Notifications',
    about: 'About',
    logout: 'Logout',
    
    // Common
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    search: 'Search',
    filter: 'Filter',
    all: 'All',
    downloadPDF: 'Download PDF',
    offline: 'Offline',
    online: 'Online',
  },
  fr: {
    // Auth
    login: 'Connexion',
    register: 'Inscription',
    email: 'Email',
    password: 'Mot de passe',
    confirmPassword: 'Confirmer le mot de passe',
    fullName: 'Nom complet',
    selectLevel: 'Sélectionner le niveau',
    oLevel: 'O-Level',
    aLevel: 'A-Level',
    student: 'Étudiant',
    teacher: 'Enseignant',
    
    // Navigation
    home: 'Accueil',
    subjects: 'Matières',
    practice: 'Pratique',
    progress: 'Progrès',
    profile: 'Profil',
    
    // Home
    welcomeBack: 'Content de vous revoir',
    studyToday: 'Continuez vos études aujourd\'hui',
    quickStats: 'Statistiques rapides',
    questionsAnswered: 'Questions répondues',
    averageScore: 'Score moyen',
    studyStreak: 'Série d\'étude',
    days: 'jours',
    
    // Subjects
    sciences: 'Sciences',
    arts: 'Arts',
    commercial: 'Commercial',
    mathematics: 'Mathématiques',
    physics: 'Physique',
    chemistry: 'Chimie',
    biology: 'Biologie',
    english: 'Anglais',
    literature: 'Littérature',
    geography: 'Géographie',
    history: 'Histoire',
    economics: 'Économie',
    accounting: 'Comptabilité',
    
    // Practice
    startQuiz: 'Commencer le quiz',
    timedQuiz: 'Quiz chronométré',
    practiceMode: 'Mode pratique',
    customQuiz: 'Quiz personnalisé',
    pastPapers: 'Épreuves passées',
    selectYear: 'Sélectionner l\'année',
    questionsCount: 'questions',
    
    // Quiz
    question: 'Question',
    of: 'de',
    timeLeft: 'Temps restant',
    submit: 'Soumettre',
    next: 'Suivant',
    previous: 'Précédent',
    bookmark: 'Marquer',
    explanation: 'Explication',
    
    // Results
    quizComplete: 'Quiz terminé !',
    yourScore: 'Votre score',
    timeSpent: 'Temps passé',
    correctAnswers: 'Bonnes réponses',
    reviewAnswers: 'Réviser les réponses',
    tryAgain: 'Recommencer',
    
    // Progress
    overallProgress: 'Progrès global',
    subjectProgress: 'Progrès par matière',
    recentActivity: 'Activité récente',
    achievements: 'Réalisations',
    
    // Profile
    myProfile: 'Mon profil',
    settings: 'Paramètres',
    language: 'Langue',
    notifications: 'Notifications',
    about: 'À propos',
    logout: 'Déconnexion',
    
    // Common
    loading: 'Chargement...',
    error: 'Erreur',
    success: 'Succès',
    cancel: 'Annuler',
    save: 'Enregistrer',
    delete: 'Supprimer',
    edit: 'Modifier',
    search: 'Rechercher',
    filter: 'Filtrer',
    all: 'Tous',
    downloadPDF: 'Télécharger PDF',
    offline: 'Hors ligne',
    online: 'En ligne',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('app_language');
      if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'fr')) {
        setLanguageState(savedLanguage as Language);
      }
    } catch (error) {
      console.error('Error loading language:', error);
    }
  };

  const setLanguage = async (lang: Language) => {
    try {
      await AsyncStorage.setItem('app_language', lang);
      setLanguageState(lang);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}