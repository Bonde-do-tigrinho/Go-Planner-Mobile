import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { BtnThemeToggleButton } from "@/components/ui/btnToggleTheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import { Button, StyleSheet, View, ScrollView, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/hooks/useAuth";

export default function Teste() {
  const insets = useSafeAreaInsets();
  const { refreshAuthState } = useAuth();
  const [storageData, setStorageData] = useState<{
    hasCompletedOnboarding: string | null;
    userToken: string | null;
    userEmail: string | null;
  }>({
    hasCompletedOnboarding: null,
    userToken: null,
    userEmail: null,
  });

  // Carrega os dados do AsyncStorage
  const loadStorageData = async () => {
    try {
      const [onboarding, token, email] = await Promise.all([
        AsyncStorage.getItem('hasCompletedOnboarding'),
        AsyncStorage.getItem('userToken'),
        AsyncStorage.getItem('userEmail'),
      ]);
      
      setStorageData({
        hasCompletedOnboarding: onboarding,
        userToken: token,
        userEmail: email,
      });
    } catch (error) {
      console.error('Erro ao carregar AsyncStorage:', error);
    }
  };

  // Carrega na montagem do componente
  useEffect(() => {
    loadStorageData();
  }, []);

  const handleResetOnboarding = async () => {
    try {
      await AsyncStorage.removeItem("hasCompletedOnboarding");
      Alert.alert('Sucesso', 'Onboarding resetado!');
      await loadStorageData(); // Recarrega os dados
      await refreshAuthState(); // Força o useAuth a verificar novamente
    } catch (e) {
      console.error("Falha ao limpar o AsyncStorage", e);
      Alert.alert('Erro', 'Falha ao resetar onboarding');
    }
  };

  const handleClearAll = async () => {
    try {
      await AsyncStorage.multiRemove(['hasCompletedOnboarding', 'userToken', 'userEmail']);
      Alert.alert('Sucesso', 'Todos os dados foram limpos!');
      await loadStorageData(); // Recarrega os dados
      await refreshAuthState(); // Força o useAuth a verificar novamente
    } catch (e) {
      console.error("Falha ao limpar o AsyncStorage", e);
      Alert.alert('Erro', 'Falha ao limpar dados');
    }
  };

  const handleClearToken = async () => {
    try {
      await AsyncStorage.multiRemove(['userToken', 'userEmail']);
      Alert.alert('Sucesso', 'Token removido!');
      await loadStorageData(); // Recarrega os dados
      await refreshAuthState(); // Força o useAuth a verificar novamente
    } catch (e) {
      console.error("Falha ao limpar token", e);
      Alert.alert('Erro', 'Falha ao limpar token');
    }
  };

  return (
    <ThemedView
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
      bgName="bgPrimary"
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <ThemedText type="title" colorName="textPrimary" style={styles.title}>
          Debug AsyncStorage
        </ThemedText>

        <ThemedView style={styles.dataContainer} bgName="bgSecondary" borderName="borderPrimary" borderWidth={1}>
          <ThemedText type="subtitle" colorName="textPrimary" style={styles.sectionTitle}>
            📦 Dados Armazenados:
          </ThemedText>
          
          <View style={styles.dataRow}>
            <ThemedText colorName="textSecondary" isSemiBold>
              hasCompletedOnboarding:
            </ThemedText>
            <ThemedText colorName={storageData.hasCompletedOnboarding === 'true' ? 'primary' : 'error'}>
              {storageData.hasCompletedOnboarding || 'null'}
            </ThemedText>
          </View>

          <View style={styles.dataRow}>
            <ThemedText colorName="textSecondary" isSemiBold>
              userToken:
            </ThemedText>
            <ThemedText colorName={storageData.userToken ? 'primary' : 'error'} numberOfLines={1}>
              {storageData.userToken ? `${storageData.userToken.substring(0, 20)}...` : 'null'}
            </ThemedText>
          </View>

          <View style={styles.dataRow}>
            <ThemedText colorName="textSecondary" isSemiBold>
              userEmail:
            </ThemedText>
            <ThemedText colorName={storageData.userEmail ? 'primary' : 'error'}>
              {storageData.userEmail || 'null'}
            </ThemedText>
          </View>

          <View style={styles.refreshButton}>
            <Button
              title="🔄 Recarregar Dados"
              onPress={loadStorageData}
              color="#007AFF"
            />
          </View>
        </ThemedView>

        <BtnThemeToggleButton />
        
        <View style={styles.buttonContainer}>
          <View style={styles.debugButton}>
            <Button
              title="🔄 Resetar Onboarding"
              onPress={handleResetOnboarding}
              color="#FF9500"
            />
          </View>

          <View style={styles.debugButton}>
            <Button
              title="🚪 Limpar Token (Logout)"
              onPress={handleClearToken}
              color="#FF3B30"
            />
          </View>

          <View style={styles.debugButton}>
            <Button
              title="🗑️ Limpar Tudo"
              onPress={handleClearAll}
              color="#8B0000"
            />
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 20,
  },
  title: {
    marginBottom: 10,
    textAlign: 'center',
  },
  dataContainer: {
    padding: 20,
    borderRadius: 12,
    gap: 12,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  dataRow: {
    flexDirection: 'column',
    gap: 4,
    paddingVertical: 8,
  },
  refreshButton: {
    marginTop: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  buttonContainer: {
    gap: 12,
    marginTop: 20,
  },
  debugButton: {
    borderRadius: 8,
    overflow: 'hidden',
  },
});
