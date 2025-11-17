import { useEffect, useState, useRef } from 'react';
import { useRouter, useSegments } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  hasCompletedOnboarding: boolean | null;
  userToken: string | null;
  isLoading: boolean;
}

export function useAuth() {
  const router = useRouter();
  const segments = useSegments();
  const [authState, setAuthState] = useState<AuthState>({
    hasCompletedOnboarding: null,
    userToken: null,
    isLoading: true,
  });
  const hasCheckedRef = useRef(false);

  // Carrega os dados do AsyncStorage
  useEffect(() => {
    loadAuthState();
  }, []);

  // Gerencia redirecionamentos baseado no estado de autenticação
  useEffect(() => {
    if (authState.isLoading || hasCheckedRef.current) return;

    const inOnboarding = segments[0] === '(onboarding)';
    const inAuth = segments[0] === '(auth)';
    const inTabs = segments[0] === '(tabs)';

    // Não completou onboarding
    if (!authState.hasCompletedOnboarding && !inOnboarding) {
      hasCheckedRef.current = true;
      router.replace('/(onboarding)');
      return;
    }

    // Completou onboarding mas não está autenticado
    if (authState.hasCompletedOnboarding && !authState.userToken && !inAuth) {
      hasCheckedRef.current = true;
      router.replace('/(auth)');
      return;
    }

    // Está autenticado
    if (authState.userToken && !inTabs) {
      hasCheckedRef.current = true;
      router.replace('/(tabs)');
      return;
    }

    hasCheckedRef.current = false;
  }, [authState, segments]);

  const loadAuthState = async () => {
    try {
      const [hasCompleted, token] = await Promise.all([
        AsyncStorage.getItem('hasCompletedOnboarding'),
        AsyncStorage.getItem('userToken'),
      ]);

      setAuthState({
        hasCompletedOnboarding: hasCompleted === 'true',
        userToken: token,
        isLoading: false,
      });
    } catch (error) {
      console.error('Erro ao carregar estado de autenticação:', error);
      setAuthState({
        hasCompletedOnboarding: false,
        userToken: null,
        isLoading: false,
      });
    }
  };

  const signIn = async (token: string, email?: string) => {
    try {
      await AsyncStorage.setItem('userToken', token);
      if (email) {
        await AsyncStorage.setItem('userEmail', email);
      }
      setAuthState(prev => ({
        ...prev,
        userToken: token,
      }));
      hasCheckedRef.current = false;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.multiRemove(['userToken', 'userEmail']);
      setAuthState(prev => ({
        ...prev,
        userToken: null,
      }));
      hasCheckedRef.current = false;
      router.replace('/(auth)');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
      setAuthState(prev => ({
        ...prev,
        hasCompletedOnboarding: true,
      }));
      hasCheckedRef.current = false;
    } catch (error) {
      console.error('Erro ao completar onboarding:', error);
      throw error;
    }
  };

  const resetOnboarding = async () => {
    try {
      await AsyncStorage.removeItem('hasCompletedOnboarding');
      setAuthState(prev => ({
        ...prev,
        hasCompletedOnboarding: false,
      }));
      hasCheckedRef.current = false;
      router.replace('/(onboarding)');
    } catch (error) {
      console.error('Erro ao resetar onboarding:', error);
      throw error;
    }
  };

  return {
    ...authState,
    signIn,
    signOut,
    completeOnboarding,
    resetOnboarding,
    refreshAuthState: loadAuthState,
  };
}
