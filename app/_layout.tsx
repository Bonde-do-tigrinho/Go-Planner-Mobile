import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect } from 'react';

import { useColorScheme } from '@/hooks/use-color-scheme';

// Impede que a tela de splash se esconda automaticamente antes de estarmos prontos
SplashScreen.preventAutoHideAsync();

/**
 * Componente que renderiza a navegação principal.
 * Ele só é chamado DEPOIS que as fontes foram carregadas.
 */

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

/**
 * Componente raiz que lida com o carregamento de assets (fontes).
 */
export default function RootLayout() {
  const [loaded, error] = useFonts({
    'Inter': require('../assets/fonts/Inter_18pt-Regular.ttf'),
    'Inter-SemiBold': require('../assets/fonts/Inter_18pt-SemiBold.ttf'),
    'Inter-Bold': require('../assets/fonts/Inter_18pt-Bold.ttf'),
  });
  console.log('Font Loaded Status:', loaded);
  console.log('Font Error:', error);
  // Expo Router usa useEffect para capturar erros durante o carregamento
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      // DICA DE SÊNIOR: Adicione um atraso para testar
      console.log("Fontes carregadas. Esperando 3 segundos para esconder a splash...");
      setTimeout(() => {
        SplashScreen.hideAsync();
        console.log("Splash screen escondida.");
      }, 3000); // Atraso de 3000ms (3 segundos)
    }
  }, [loaded]);

  // Se as fontes ainda não foram carregadas, não renderiza nada.
  // A tela de splash continuará visível.
  if (!loaded) {
    return null;
  }

  // Quando as fontes estiverem carregadas, renderiza o componente de navegação.
  return <RootLayoutNav />;
}