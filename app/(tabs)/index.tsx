import GradientText from "@/components/GradientText"; // <-- Importando o componente GradientText
import Header from "@/components/Header";
import ListTrips from "@/components/home/listTrips";
import TabSelector from "@/components/tab-selector";
import { ThemedText } from "@/components/themed-text";
import ThemedTitle from "@/components/themed-title";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useAuth } from "@/hooks/useAuth";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  // Protege a rota verificando autenticação
  const { isLoading } = useAuth();

  // Enquanto carrega, não renderiza nada
  if (isLoading) {
    return null;
  }
  const btnPlus = useThemeColor({}, "btnPlus");
  const bgBtnPlus = useThemeColor({}, "bgBtnPlus");
  const routerInstance = useRouter();
  const handleNavigateToNotifications = () => {
    routerInstance.push("/notifications");
  };
  const user = {
    name: "Nicolas Yanase",
    avatar: "https://avatars.githubusercontent.com/u/63155478?v=4",
  };
  const popularTrips = [
    {
      id: 1,
      country: "USA",
      local: "Disney",
      image: require("../../assets/images/popularTrips/disney.png"),
    },
    {
      id: 2,
      country: "Brasil",
      local: "Pão de Açúcar",
      image: require("../../assets/images/popularTrips/pao-acucar.png"),
    },
    {
      id: 3,
      country: "França",
      local: "Paris",
      image: require("../../assets/images/popularTrips/paris.png"),
    },
    {
      id: 4,
      country: "Japão",
      local: "Tóquio",
      image: require("../../assets/images/popularTrips/tokyo.png"),
    },
  ];

  // Array completo com 10 registros de viagens
  const userTrips = [
    {
      id: 1,
      name: "Viagens dos guys",
      local: "Japão, Tóquio",
      dateFrom: "2024-12-20",
      dateTo: "2024-12-25",
      image: require("../../assets/images/popularTrips/tokyo.png"),
      guest: [
        { id: 1, name: "kendi", avatar: "https://i.pravatar.cc/150?img=1" },
        { id: 2, name: "raul", avatar: "https://i.pravatar.cc/150?img=2" },
        { id: 3, name: "Leandro", avatar: "https://i.pravatar.cc/150?img=3" },
        { id: 4, name: "Miguel", avatar: "https://i.pravatar.cc/150?img=5" },
        { id: 5, name: "Leandro", avatar: "https://i.pravatar.cc/150?img=3" },
        { id: 6, name: "Miguel", avatar: "https://i.pravatar.cc/150?img=5" },
      ],
    },
    {
      id: 2,
      name: "Viagens dos guys",
      local: "França, Paris",
      dateFrom: "2025-01-15",
      dateTo: "2025-01-22",
      image: require("../../assets/images/popularTrips/paris.png"),
      guest: [
        { id: 1, name: "kendi", avatar: "https://i.pravatar.cc/150?img=1" },
        { id: 2, name: "raul", avatar: "https://i.pravatar.cc/150?img=2" },
        { id: 3, name: "Leandro", avatar: "https://i.pravatar.cc/150?img=3" },
        { id: 4, name: "Miguel", avatar: "https://i.pravatar.cc/150?img=5" },
      ],
    },
    {
      id: 3,
      name: "Viagens dos guys",
      local: "Brasil, Fernando de Noronha",
      dateFrom: "2025-03-05",
      dateTo: "2025-03-12",
      image: require("../../assets/images/popularTrips/pao-acucar.png"),
      guest: [
        { id: 1, name: "kendi", avatar: "https://i.pravatar.cc/150?img=1" },
        { id: 2, name: "raul", avatar: "https://i.pravatar.cc/150?img=2" },
      ],
    },
    {
      id: 4,
      name: "Viagens dos guys",
      local: "Itália, Roma",
      dateFrom: "2025-05-10",
      dateTo: "2025-05-18",
      image: require("../../assets/images/popularTrips/tokyo.png"), // Placeholder
      guest: [
        { id: 1, name: "kendi", avatar: "https://i.pravatar.cc/150?img=1" },
        { id: 2, name: "raul", avatar: "https://i.pravatar.cc/150?img=2" },
        { id: 3, name: "Leandro", avatar: "https://i.pravatar.cc/150?img=3" },
      ],
    },
    {
      id: 5,
      name: "Viagens dos guys",
      local: "USA, Nova Iorque",
      dateFrom: "2025-07-01",
      dateTo: "2025-07-08",
      image: require("../../assets/images/popularTrips/disney.png"),
      guest: [],
    },
    {
      id: 6,
      name: "Viagens dos guys",
      local: "Argentina, Buenos Aires",
      dateFrom: "2025-08-20",
      dateTo: "2025-08-25",
      image: require("../../assets/images/popularTrips/pao-acucar.png"), // Placeholder
      guest: [
        { id: 1, name: "kendi", avatar: "https://i.pravatar.cc/150?img=1" },
        { id: 2, name: "raul", avatar: "https://i.pravatar.cc/150?img=2" },
        { id: 4, name: "Miguel", avatar: "https://i.pravatar.cc/150?img=5" },
      ],
    },
    {
      id: 7,
      name: "Viagens dos guys",
      local: "Portugal, Lisboa",
      dateFrom: "2025-09-11",
      dateTo: "2025-09-19",
      image: require("../../assets/images/popularTrips/paris.png"), // Placeholder
      guest: [
        { id: 1, name: "kendi", avatar: "https://i.pravatar.cc/150?img=1" },
        { id: 2, name: "raul", avatar: "https://i.pravatar.cc/150?img=2" },
        { id: 3, name: "Leandro", avatar: "https://i.pravatar.cc/150?img=3" },
        { id: 4, name: "Miguel", avatar: "https://i.pravatar.cc/150?img=5" },
      ],
    },
    {
      id: 8,
      name: "Viagens dos guys",
      local: "Canadá, Vancouver",
      dateFrom: "2025-10-30",
      dateTo: "2025-11-07",
      image: require("../../assets/images/popularTrips/tokyo.png"), // Placeholder
      guest: [
        { id: 1, name: "kendi", avatar: "https://i.pravatar.cc/150?img=1" },
        { id: 3, name: "Leandro", avatar: "https://i.pravatar.cc/150?img=3" },
      ],
    },
    {
      id: 9,
      name: "Viagens dos guys",
      local: "Chile, Santiago",
      dateFrom: "2026-02-02",
      dateTo: "2026-02-10",
      image: require("../../assets/images/popularTrips/pao-acucar.png"), // Placeholder
      guest: [
        { id: 1, name: "kendi", avatar: "https://i.pravatar.cc/150?img=1" },
        { id: 2, name: "raul", avatar: "https://i.pravatar.cc/150?img=2" },
        { id: 3, name: "Leandro", avatar: "https://i.pravatar.cc/150?img=3" },
      ],
    },
    {
      id: 10,
      name: "Viagens dos guys",
      local: "Austrália, Sydney",
      dateFrom: "2026-04-15",
      dateTo: "2026-04-25",
      image: require("../../assets/images/popularTrips/disney.png"), // Placeholder
      guest: [
        { id: 2, name: "raul", avatar: "https://i.pravatar.cc/150?img=2" },
        { id: 4, name: "Miguel", avatar: "https://i.pravatar.cc/150?img=5" },
      ],
    },
  ];

  const tabs = ["Todas", "Suas viagens", "Compartilhadas"];

  const [activeTab, setActiveTab] = useState(tabs[0]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "Todas":
        return <ListTrips userTrips={userTrips} />;
    }
  };
  const bgPrimary = useThemeColor({}, "bgPrimary");
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bgPrimary }}>
      <ThemedView style={styles.container} bgName="bgPrimary">
        <Pressable
          style={styles.addButtonContainer}
          onPress={() => router.push("/createTrip")}
        >
          <View style={[styles.addButton, { backgroundColor: bgBtnPlus }]}>
            <ThemedText
              type="sm"
              isSemiBold={true}
              colorName="secondary"
              darkColor="#fff"
            >
              {" "}
              Nova viagem{" "}
            </ThemedText>
            <Ionicons name="add" size={40} color={btnPlus} />
          </View>
        </Pressable>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Header onNotificationPress={handleNavigateToNotifications}>
            <View style={styles.nameTitle}>
              <Image source={{ uri: user.avatar }} style={styles.avatar} />

              <GradientText style={styles.gradientName}>
                {" "}
                {/* Adicionei um estilo */}
                Olá, {user.name}
              </GradientText>
            </View>
          </Header>
          <ThemedView style={styles.mainContainer}>
            <View style={{ paddingVertical: 20 }}>
              <ThemedTitle title="Viagens Populares" ballColor="primary" />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.containerPopularTrips}
              >
                {popularTrips.map((trip) => (
                  <View key={trip.id} style={styles.containerTrip}>
                    <Image source={trip.image} style={styles.trip} />
                    <ThemedText
                      type="px"
                      colorName="textSecondary"
                      style={{ textAlign: "center" }}
                    >
                      {" "}
                      {trip.local} - {trip.country}{" "}
                    </ThemedText>
                  </View>
                ))}
              </ScrollView>
            </View>

            <View style={{ paddingVertical: 20 }}>
              <ThemedTitle title="Viagens recentes" ballColor="secondary" />
              <TabSelector
                activeTab={activeTab}
                onTabPress={setActiveTab}
                tabs={tabs}
              />
              {renderTabContent()}
            </View>
          </ThemedView>
        </ScrollView>
      </ThemedView>
      <StatusBar style="auto" />
    </SafeAreaView>
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
  addButtonContainer: {
    position: "absolute",
    bottom: 130,
    right: 20,
    zIndex: 999,
  },
  addButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 3,
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  scrollContainer: {
    paddingVertical: 8, // Espaçamento vertical para o conteúdo não colar no topo/fundo
    paddingHorizontal: 16, // Espaçamento horizontal nas laterais da tela
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  nameTitle: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 4,
  },
  gradientName: {
    // <-- Adicionei esse estilo
    fontSize: 18, // Tamanho 'default' do ThemedText
    lineHeight: 24, // LineHeight 'default' do ThemedText
  },
  mainContainer: {
    paddingVertical: 20,
  },
  containerPopularTrips: {
    display: "flex",
    gap: 20,
    flexDirection: "row",
    paddingTop: 12,
  },
  containerTrip: {
    display: "flex",
    textAlign: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  trip: {
    width: 140,
    height: 140,
    borderRadius: 16,
  },
});
