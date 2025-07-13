import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

const isSupabaseConfigured = supabaseUrl && supabaseAnonKey && 
  supabaseUrl !== 'your-supabase-url' && 
  supabaseAnonKey !== 'your-supabase-anon-key' &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  supabaseAnonKey !== 'your-anon-key-here';

if (!isSupabaseConfigured) {
  console.warn('Supabase environment variables are not set. Please configure EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in your .env file.');
}

// Create a mock client when Supabase is not configured
const createMockClient = () => {
  const mockError = { message: 'Supabase not configured. Please set up your Supabase credentials.' };
  
  return {
  auth: {
    signInWithPassword: async () => ({ 
      data: { user: null, session: null }, 
      error: mockError
    }),
    signUp: async () => ({ 
      data: { user: null, session: null }, 
      error: mockError
    }),
    signOut: async () => ({ error: null }),
    getSession: async () => ({ data: { session: null }, error: null }),
    getUser: async () => ({ data: { user: null }, error: null }),
    onAuthStateChange: (callback) => {
      // Call the callback immediately with no session
      setTimeout(() => callback('SIGNED_OUT', null), 0);
      return { data: { subscription: { unsubscribe: () => {} } } };
    },
  },
  from: () => ({
    select: () => ({
      eq: () => ({
        single: async () => ({ data: null, error: mockError }),
        order: async () => ({ data: [], error: null }),
        limit: async () => ({ data: [], error: null }),
      }),
      order: async () => ({ data: [], error: null }),
    }),
    insert: async () => ({ data: null, error: mockError }),
    update: async () => ({ data: null, error: mockError }),
    delete: async () => ({ data: null, error: mockError }),
  }),
  };
};

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : createMockClient();

// Auth helpers
export const signUp = async (email: string, password: string, userData: any) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData,
    },
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};