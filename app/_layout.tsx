import { ThemedText } from "@/components/themed-text";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAuth } from "@/hooks/useAuth";
import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { Ionicons } from "@expo/vector-icons";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { PaperProvider } from "react-native-paper";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { isLoading } = useAuth();

  // Enquanto está verificando a autenticação, não renderiza nada
  if (isLoading) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen
                name="(tabs)/index"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="modal"
                options={{
                  presentation: "modal",
                  title: "Modal",
                  headerShown: true,
                }}
              />
              <Stack.Screen
                name="createTrip"
                options={{
                  headerTitle: () => (
                    <ThemedText
                      type="subtitle"
                      colorName="textPrimary"
                      isSemiBold={true}
                      style={{ left: -20 }}
                    >
                      Criação da viagem
                      <Ionicons name="ellipse" size={9} color="#FF5733" />
                    </ThemedText>
                  ),
                  headerShown: true,
                }}
              />
              <Stack.Screen
                name="notifications"
                options={{ headerShown: false }}
              />
            </Stack>
            <StatusBar style="auto" />
          </>
        </ThemeProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

/**
 * Componente raiz que lida com o carregamento de assets.
 */
export default function RootLayout() {
  const [loaded, error] = useFonts({
    "Inter-Regular": Inter_400Regular,
    "Inter-SemiBold": Inter_600SemiBold,
    "Inter-Bold": Inter_700Bold,
  });

  // Expo Router usa useEffect para capturar erros durante o carregamento
  useEffect(() => {
    if (error) {
      console.error("Erro detalhado:", error);
      throw error;
    }
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

  return <RootLayoutNav />;
}
