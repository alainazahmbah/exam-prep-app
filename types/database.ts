export interface User {
  id: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  full_name: string;
  level: 'o_level' | 'a_level' | null;
  preferred_language: 'en' | 'fr';
  created_at: string;
  updated_at: string;
}

export interface Subject {
  id: string;
  name: string;
  name_fr: string;
  level: 'o_level' | 'a_level';
  category: 'sciences' | 'arts' | 'commercial';
  icon: string;
  color: string;
  created_at: string;
}

export interface Question {
  id: string;
  subject_id: string;
  year: number;
  question_number: number;
  question_text: string;
  question_text_fr?: string;
  options: string[];
  options_fr?: string[];
  correct_answer: number;
  explanation: string;
  explanation_fr?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topics: string[];
  created_by: string;
  created_at: string;
}

export interface Quiz {
  id: string;
  user_id: string;
  subject_id: string;
  questions: string[];
  answers: number[];
  score: number;
  time_taken: number;
  completed_at: string;
  quiz_type: 'practice' | 'timed' | 'custom';
}

export interface Progress {
  id: string;
  user_id: string;
  subject_id: string;
  total_questions_attempted: number;
  correct_answers: number;
  average_score: number;
  time_spent: number;
  last_study_date: string;
  streak_days: number;
  updated_at: string;
}

export interface Content {
  id: string;
  subject_id: string;
  title: string;
  title_fr?: string;
  type: 'video' | 'pdf' | 'article';
  url: string;
  description: string;
  description_fr?: string;
  level: 'o_level' | 'a_level';
  duration?: number;
  file_size?: number;
  created_by: string;
  created_at: string;
}

export interface UserBookmark {
  id: string;
  user_id: string;
  question_id: string;
  created_at: string;
}