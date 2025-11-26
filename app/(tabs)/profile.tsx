import Header from "@/components/Header";
import Info from "@/components/profile/info";
import TabSelector from "@/components/tab-selector";
import { ThemedText } from "@/components/themed-text";
import ThemedTitle from "@/components/themed-title";
import { ThemedView } from "@/components/themed-view";
import { StatusBar } from "expo-status-bar";

import { useThemeColor } from "@/hooks/use-theme-color";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {

  const tabs = ["Dados pessoais", "Histórico de viagem", "Configurações"];
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const router = useRouter();

  const handleNavigateToNotifications = () => {
    router.push("/notifications");
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Dados pessoais":
        return <Info />;
      default:
        return (
          <ThemedView style={{ padding: 20, width: "100%" }}>
            <ThemedText colorName="textPrimary">
              Conteúdo de {activeTab}
            </ThemedText>
          </ThemedView>
        );
    }
  };
  const bgPrimary = useThemeColor({}, "bgPrimary");
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: bgPrimary, paddingVertical: 8 }}
    >
      <ThemedView style={styles.container} bgName="bgPrimary">
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Header onNotificationPress={handleNavigateToNotifications}>
            <ThemedTitle ballColor="secondary" title="Perfil" />
          </Header>
          <TabSelector
            activeTab={activeTab}
            onTabPress={setActiveTab}
            tabs={tabs}
          />
          {renderTabContent()}
        </ScrollView>
      </ThemedView>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    width: "100%",
    gap: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
});
