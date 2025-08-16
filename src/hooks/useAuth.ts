import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Simular carga inicial
    const timer = setTimeout(() => {
      console.log('🔍 useAuth: Simulando carga inicial...');
      setAuthState({
        user: null,
        loading: false,
        error: null,
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    console.log('🔍 useAuth: Intentando registro...', { email, name });
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      // Simular registro exitoso
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: 'mock-user-id',
        email,
        name,
        created_at: new Date().toISOString(),
      };

      setAuthState({
        user: mockUser,
        loading: false,
        error: null,
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setAuthState(prev => ({ ...prev, loading: false, error: errorMessage }));
      return { error: errorMessage };
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('🔍 useAuth: Intentando login...', { email });
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      // Simular login exitoso
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: 'mock-user-id',
        email,
        name: 'Usuario Mock',
        created_at: new Date().toISOString(),
      };

      setAuthState({
        user: mockUser,
        loading: false,
        error: null,
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setAuthState(prev => ({ ...prev, loading: false, error: errorMessage }));
      return { error: errorMessage };
    }
  };

  const signOut = async () => {
    console.log('🔍 useAuth: Cerrando sesión...');
    setAuthState({
      user: null,
      loading: false,
      error: null,
    });
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!authState.user) return { error: 'No hay usuario autenticado' };

    console.log('🔍 useAuth: Actualizando perfil...', updates);
    
    const updatedUser = { ...authState.user, ...updates };
    setAuthState(prev => ({ ...prev, user: updatedUser }));
    
    return { success: true, user: updatedUser };
  };

  return {
    ...authState,
    signUp,
    signIn,
    signOut,
    updateProfile,
  };
};
