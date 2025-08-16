import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, auth, profiles, Profile } from '../lib/supabase';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ data: Profile | null; error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>({ 
    access_token: 'fake-token',
    refresh_token: 'fake-refresh',
    expires_in: 3600,
    token_type: 'bearer',
    user: {
      id: 'demo-user-id',
      email: 'demo@cheeserate.com',
      created_at: new Date().toISOString(),
      aud: 'authenticated',
      role: 'authenticated',
      email_confirmed_at: new Date().toISOString(),
      phone: '',
      confirmed_at: new Date().toISOString(),
      last_sign_in_at: new Date().toISOString(),
      app_metadata: {},
      user_metadata: {},
      identities: [],
      factors: []
    }
  } as Session);
  const [user, setUser] = useState<User | null>({
    id: 'demo-user-id',
    email: 'demo@cheeserate.com',
    created_at: new Date().toISOString(),
    aud: 'authenticated',
    role: 'authenticated',
    email_confirmed_at: new Date().toISOString(),
    phone: '',
    confirmed_at: new Date().toISOString(),
    last_sign_in_at: new Date().toISOString(),
    app_metadata: {},
    user_metadata: {},
    identities: [],
    factors: []
  });
  const [profile, setProfile] = useState<Profile | null>({
    id: 'demo-user-id',
    username: 'DemoUser',
    avatar_url: null,
    created_at: new Date().toISOString()
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Demo mode - no need to check auth
    setLoading(false);
  }, []);

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await profiles.getProfile(userId);
      if (error) {
        console.error('Error loading profile:', error);
        // If profile doesn't exist, create one
        if (error.code === 'PGRST116') {
          const { data: newProfile, error: createError } = await profiles.createProfile(
            userId,
            `user_${userId.slice(0, 8)}`
          );
          if (!createError && newProfile) {
            setProfile(newProfile);
          }
        }
      } else if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error in loadProfile:', error);
    }
  };

  const signIn = async (email: string) => {
    // Demo mode - always succeed
    return { error: null };
  };

  const signOut = async () => {
    // Demo mode - always succeed
    return { error: null };
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) {
      return { data: null, error: { message: 'No user logged in' } };
    }

    const { data, error } = await profiles.updateProfile(user.id, updates);
    if (!error && data) {
      setProfile(data);
    }
    return { data, error };
  };

  // Para desarrollo, siempre permitir acceso
  const demoSession = {
    access_token: 'demo-token',
    refresh_token: 'demo-refresh',
    expires_in: 3600,
    token_type: 'bearer',
    user: {
      id: 'demo-user-id',
      email: 'demo@cheeserate.com',
      created_at: new Date().toISOString(),
      aud: 'authenticated',
      role: 'authenticated',
      email_confirmed_at: new Date().toISOString(),
      phone: '',
      confirmed_at: new Date().toISOString(),
      last_sign_in_at: new Date().toISOString(),
      app_metadata: {},
      user_metadata: {},
      identities: [],
      factors: []
    }
  } as Session;

  const value: AuthContextType = {
    session: demoSession,
    user: user || demoSession.user,
    profile,
    loading: false,
    signIn,
    signOut,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
