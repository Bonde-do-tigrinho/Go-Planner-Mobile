import Header from "@/components/Header";
import TabSelector from "@/components/tab-selector";
import { ThemedText } from "@/components/themed-text";
import ThemedTitle from "@/components/themed-title";
import { ThemedView } from "@/components/themed-view";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function HomeScreen() {
  //resetar o AsyncStorage para eu poder ver a tela de onboarding
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
      image: require("../../assets/images/popularTrips/disney.png"), // Placeholder
      guest: [
        { id: 1, name: "kendi", avatar: "https://i.pravatar.cc/150?img=1" },
        { id: 3, name: "Leandro", avatar: "https://i.pravatar.cc/150?img=3" },
        { id: 4, name: "Miguel", avatar: "https://i.pravatar.cc/150?img=5" },
      ],
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
        return <View> todas </View>; // Continua funcionando perfeitamente
      // ... outros casos
    }
  };
  return (
    <>
      <ThemedView style={styles.container} bgName="bgPrimary">
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Header>
            <View style={styles.nameTitle}>
              <Image source={{ uri: user.avatar }} style={styles.avatar} />

              <ThemedText colorName="primary" type="default">
                Olá, {user.name}
              </ThemedText>
              {/* <GradientText>
              Olá, {user.name}
            </GradientText> */}
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
  mainContainer: {
    paddingVertical: 20,
    paddingHorizontal: 10,
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
