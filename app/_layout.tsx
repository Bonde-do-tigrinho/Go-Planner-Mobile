import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { Stack, SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)/index" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal', headerShown: true }} />
            <Stack.Screen 
              name="createTrip" 
              options={{ 
                headerTitle: () => (
                  <ThemedText type='subtitle' colorName='textPrimary' isSemiBold={true} style={{left: -20}}>
                    Criação da viagem
                    <Ionicons name="ellipse" size={9} color="#FF5733" />
                  </ThemedText>
                ), 
                headerShown: true 
              }} 
            />
          </Stack>
          <StatusBar style="auto" />
        </>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  console.log('✅ Fontes carregadas:', loaded);
  console.log('❌ Erro ao carregar:', error);

  useEffect(() => {
    if (error) {
      console.error('Erro detalhado:', error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      console.log("🎉 Todas as fontes foram carregadas com sucesso!");
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded && !error) {
    return null;
  }

  return <RootLayoutNav />;
}