import { ThemedView } from "@/components/themed-view";
import { BtnThemeToggleButton } from "@/components/ui/btnToggleTheme";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Button, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Profile(){
  const insets = useSafeAreaInsets();

  const handleResetOnboarding = async () => {
    try {
      await AsyncStorage.removeItem('hasCompletedOnboarding');
      router.replace('/(onboarding)');
    } catch (e) {
      console.error('Falha ao limpar o AsyncStorage', e);
    }
  };

  return(
    <ThemedView
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom }
      ]}
      bgColor="background"
    >
      <BtnThemeToggleButton />
      <View style={styles.debugButton}>
        <Button
          title="Resetar Onboarding (Debug)"
          onPress={handleResetOnboarding}
          color="green"
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  debugButton: {
    width: 300,
    borderRadius: 16,
  },
  container:{
    flex: 1,
    display: 'flex',
    flexDirection: "column",
    gap: 20,
    justifyContent:'center',
    alignItems: 'center'
  }
});