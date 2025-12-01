import GradientText from "@/components/GradientText"; // <-- Importando o componente GradientText
import Header from "@/components/Header";
import ListTrips from "@/components/home/listTrips";
import TabSelector from "@/components/tab-selector";
import { ThemedText } from "@/components/themed-text";
import ThemedTitle from "@/components/themed-title";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import { CreateTripApiResponse, getMyTrips } from "@/service/api/tripsApi";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { router, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const API_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://192.168.15.10:8082/api";

export default function HomeScreen() {
  // IMPORTANTE: Todos os hooks devem ser chamados antes do return condicional
  const btnPlus = useThemeColor({}, "btnPlus");
  const bgBtnPlus = useThemeColor({}, "bgBtnPlus");
  const routerInstance = useRouter();
  const bgPrimary = useThemeColor({}, "bgPrimary");

  // Constantes que precisam vir antes do useState
  const tabs = ["Todas", "Suas viagens", "Compartilhadas"];
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [user, setUser] = useState({
    name: "",
    avatar: "https://i.pravatar.cc/150?img=5",
  });
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [myTrips, setMyTrips] = useState<CreateTripApiResponse[]>([]);
  const [participatingTrips, setParticipatingTrips] = useState<
    CreateTripApiResponse[]
  >([]);
  const [isLoadingTrips, setIsLoadingTrips] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string>("");

  useEffect(() => {
    fetchUserData();
    fetchMyTrips();
  }, []);

  const fetchMyTrips = async (isRefresh = false) => {
    try {
      if (!isRefresh) {
        setIsLoadingTrips(true);
      }

      const [token, userId] = await Promise.all([
        AsyncStorage.getItem("userToken"),
        AsyncStorage.getItem("userId"),
      ]);

      if (!token || !userId) {
        console.log("Token ou userId não encontrado");
        setMyTrips([]);
        setParticipatingTrips([]);
        return;
      }

      setCurrentUserId(userId);

      // Busca viagens criadas pelo usuário
      const createdTrips = await getMyTrips();

      // Busca viagens em que o usuário participa
      const participatingResponse = await fetch(
        `${API_URL}/trips/participando`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      let participatingTripsData: CreateTripApiResponse[] = [];
      if (participatingResponse.ok) {
        participatingTripsData = await participatingResponse.json();
      }

      // Inverte a ordem para mostrar as mais recentes primeiro
      setMyTrips(createdTrips.reverse());
      setParticipatingTrips(participatingTripsData.reverse());
    } catch (error) {
      console.error("Erro ao carregar viagens:", error);
      setMyTrips([]);
      setParticipatingTrips([]);
    } finally {
      if (!isRefresh) {
        setIsLoadingTrips(false);
      }
    }
  };

  const fetchUserData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoadingUser(true);
      }
      const token = await AsyncStorage.getItem("userToken");

      if (!token) {
        console.log("Token não encontrado");
        setIsLoadingUser(false);
        return;
      }

      const response = await fetch(`${API_URL}/users/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Dados do usuário:", data);

        const nameSplit = data.nome.split(" ");

        const firstName = nameSplit[0];
        const lastName = nameSplit[nameSplit.length - 1];

        setUser({
          name: `${firstName} ${lastName}` || "Usuário",
          avatar:
            data.foto || "https://avatars.githubusercontent.com/u/63155478?v=4",
        });
      } else {
        console.error("Erro ao buscar dados do usuário");
      }
    } catch (error) {
      console.error("Erro ao conectar ao servidor:", error);
    } finally {
      if (isRefresh) {
        setIsRefreshing(false);
      } else {
        setIsLoadingUser(false);
      }
    }
  };

  const onRefresh = () => {
    fetchUserData(true);
    fetchMyTrips(true);
  };

  const handleNavigateToNotifications = () => {
    routerInstance.push("/notifications");
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

  const renderTabContent = () => {
    if (isLoadingTrips) {
      return (
        <View style={{ padding: 40, alignItems: "center" }}>
          <ActivityIndicator size="large" color={btnPlus} />
          <ThemedText colorName="textSecondary" style={{ marginTop: 12 }}>
            Carregando viagens...
          </ThemedText>
        </View>
      );
    }

    switch (activeTab) {
      case "Todas":
        // Combina viagens criadas + viagens participando (sem duplicatas)
        const allTripsIds = new Set(myTrips.map((t) => t.id));
        const uniqueParticipatingTrips = participatingTrips.filter(
          (t) => !allTripsIds.has(t.id)
        );
        const allTrips = [...myTrips, ...uniqueParticipatingTrips];

        if (allTrips.length === 0) {
          return (
            <View style={{ padding: 40, alignItems: "center" }}>
              <Ionicons name="airplane-outline" size={48} color={btnPlus} />
              <ThemedText
                colorName="textSecondary"
                style={{ marginTop: 12, textAlign: "center" }}
              >
                Você ainda não tem viagens.{"\n"}
                Clique no botão "Nova viagem" para começar!
              </ThemedText>
            </View>
          );
        }
        return <ListTrips userTrips={allTrips} />;

      case "Suas viagens":
        // Apenas viagens criadas pelo usuário
        if (myTrips.length === 0) {
          return (
            <View style={{ padding: 40, alignItems: "center" }}>
              <Ionicons name="airplane-outline" size={48} color={btnPlus} />
              <ThemedText
                colorName="textSecondary"
                style={{ marginTop: 12, textAlign: "center" }}
              >
                Você ainda não criou nenhuma viagem.{"\n"}
                Clique no botão "Nova viagem" para começar!
              </ThemedText>
            </View>
          );
        }
        return <ListTrips userTrips={myTrips} />;

      case "Compartilhadas":
        // Apenas viagens compartilhadas (que o usuário participa mas não criou)
        if (participatingTrips.length === 0) {
          return (
            <View style={{ padding: 40, alignItems: "center" }}>
              <Ionicons name="people-outline" size={48} color={btnPlus} />
              <ThemedText
                colorName="textSecondary"
                style={{ marginTop: 12, textAlign: "center" }}
              >
                Você ainda não participa de{"\n"}
                nenhuma viagem compartilhada.
              </ThemedText>
            </View>
          );
        }
        return <ListTrips userTrips={participatingTrips} />;

      default:
        return <ListTrips userTrips={myTrips} />;
    }
  };

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

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor={btnPlus}
              colors={[btnPlus]}
            />
          }
        >
          <Header onNotificationPress={handleNavigateToNotifications}>
            <View style={styles.nameTitle}>
              {isLoadingUser ? (
                <ActivityIndicator size="small" color={btnPlus} />
              ) : (
                <>
                  <Image source={{ uri: user.avatar }} style={styles.avatar} />
                  <GradientText style={styles.gradientName}>
                    Olá, {user.name}
                  </GradientText>
                </>
              )}
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
    width: 200,
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
