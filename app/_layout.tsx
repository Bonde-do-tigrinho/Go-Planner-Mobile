import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';

// Impede que a tela de splash se esconda automaticamente antes de estarmos prontos
SplashScreen.preventAutoHideAsync();

/**
 * Componente que renderiza a navegação principal.
 * Ele só é chamado depois que as fontes foram carregadas.
 */
function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal', headerShown: true, }} />
          {/* Adicionei essa linha pois ela corrige o bug de rota */}
          <Stack.Screen name="notifications" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

/**
 * Componente raiz que lida com o carregamento de assets.
 */
export default function RootLayout() {
  const [loaded, error] = useFonts({
    'Inter': require('../assets/fonts/Inter_18pt-Regular.ttf'),
    'Inter-SemiBold': require('../assets/fonts/Inter_18pt-SemiBold.ttf'),
    'Inter-Bold': require('../assets/fonts/Inter_18pt-Bold.ttf'),
  });

  // Expo Router usa useEffect para capturar erros durante o carregamento
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Se as fontes ainda não foram carregadas, não renderiza nada.
  if (!loaded) {
    return null;
  }

  // Quando as fontes estiverem carregadas, renderiza o componente de navegação.
  return <RootLayoutNav />;
}
