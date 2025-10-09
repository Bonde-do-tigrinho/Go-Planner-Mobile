import Header from "@/components/Header";
import Info from "@/components/profile/info";
import TabSelector from "@/components/tab-selector";
import { ThemedView } from "@/components/themed-view";
import { StatusBar } from "expo-status-bar";

import { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";

export default function ProfileScreen() {
  const tabs = ["Dados pessoais", "Histórico de viagem", "Configurações"];

  const [activeTab, setActiveTab] = useState(tabs[0]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "Dados pessoais":
        return <Info />// Continua funcionando perfeitamente
      // ... outros casos
    }
  };

  return (
    <>
      <ThemedView style={styles.container} bgName="bgPrimary">
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Header title="Perfil" ballColor="secondary"></Header>
          <TabSelector
            activeTab={activeTab}
            onTabPress={setActiveTab}
            tabs={tabs}
          />
          {renderTabContent()}
        </ScrollView>
      </ThemedView>
      <StatusBar style="auto" />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    paddingVertical: 24, // Espaçamento vertical para o conteúdo não colar no topo/fundo
    paddingHorizontal: 16, // Espaçamento horizontal nas laterais da tela
  },
});
