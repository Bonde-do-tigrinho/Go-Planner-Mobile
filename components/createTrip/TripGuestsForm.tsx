import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import { Control, FieldErrors } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Menu } from "react-native-paper";
import { CreateTripFormData } from "../../app/createTrip";
import SheetModal from "../modal";
import { ThemedText } from "../themed-text";
import { ThemedView } from "../themed-view";
import CardInfo from "./CardInfo";

const API_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://192.168.15.10:8082/api";

type Friend = {
  id: string;
  nome: string;
  email: string;
  foto?: string | null;
};

type Guest = {
  id: string;
  email: string;
  role: "Visualizar" | "Editor";
};

interface tripGuestsProps {
  control: Control<CreateTripFormData>;
  errors: FieldErrors<CreateTripFormData>;
  destination: string;
  startDate?: Date;
  endDate?: Date;
  guests: Guest[];
  onDeleteGuest: (guestId: string) => void;
  onAddGuest: (guest: Guest) => void;
  onUpdateGuestRole: (guestId: string, role: "Visualizar" | "Editor") => void;
}

export default function TripGuestsForm({
  control,
  errors,
  destination,
  endDate,
  startDate,
  guests,
  onDeleteGuest,
  onAddGuest,
  onUpdateGuestRole,
}: tripGuestsProps) {
  const iconColor = useThemeColor({}, "textTerciary");
  const bgMenu = useThemeColor({}, "bgPrimary");
  const primaryColor = useThemeColor({}, "primary");
  const borderColor = useThemeColor({}, "borderPrimary");
  const btnPlus = useThemeColor({}, "btnPlus");
  const bgBtnPlus = useThemeColor({}, "bgBtnPlus");
  const avatarPlaceholderBg = useThemeColor(
    { light: "#F4F4F5", dark: "#3F3F46" },
    "bgSecondary"
  );

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      setIsLoading(true);
      const [token, userId] = await Promise.all([
        AsyncStorage.getItem("userToken"),
        AsyncStorage.getItem("userId"),
      ]);

      if (!token || !userId) {
        console.warn("Token ou userId não encontrado");
        setFriends([]);
        return;
      }

      const response = await fetch(`${API_URL}/friends/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const friendsData = await response.json();
        setFriends(friendsData);
      } else {
        console.warn("Não foi possível carregar amigos");
        setFriends([]);
      }
    } catch (error) {
      console.error("Erro ao buscar amigos:", error);
      setFriends([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFriend = (friend: Friend) => {
    // Verifica se o amigo já está na lista
    const isAlreadyAdded = guests.some((g) => g.email === friend.email);

    if (isAlreadyAdded) {
      Alert.alert("Atenção", "Este amigo já foi convidado!");
      return;
    }

    const newGuest: Guest = {
      id: friend.id,
      email: friend.email,
      role: "Visualizar",
    };

    onAddGuest(newGuest);
    setModalVisible(false);
    Alert.alert("Sucesso", `${friend.nome} foi adicionado à viagem!`);
  };

  const toggleModal = () => setModalVisible(!isModalVisible);

  // Filtra amigos que ainda não foram convidados
  const availableFriends = friends.filter(
    (friend) => !guests.some((guest) => guest.email === friend.email)
  );

  // Filtra convidados que têm correspondência na lista de amigos
  const validGuests = guests.filter((guest) => {
    return friends.some((f) => f.email === guest.email || f.id === guest.id);
  });

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollContainer}
        >
          <CardInfo
            destination={destination}
            startDate={startDate}
            endDate={endDate}
          />
          <View style={{ marginTop: 20 }}>
            <View style={styles.headerSection}>
              <ThemedText colorName="textPrimary" type="default" isSemiBold>
                Convidados ({validGuests.length})
              </ThemedText>
            </View>

            {validGuests.length === 0 ? (
              <ThemedView style={styles.emptyState} bgName="bgSecondary">
                <Ionicons name="people-outline" size={48} color={iconColor} />
                <ThemedText
                  colorName="textSecondary"
                  type="sm"
                  style={{ textAlign: "center", marginTop: 12 }}
                >
                  Nenhum convidado ainda.{"\n"}
                  Clique no botão abaixo para adicionar!
                </ThemedText>
              </ThemedView>
            ) : (
              <View style={styles.listCardGuests}>
                {validGuests.map((guest) => {
                  // Busca por email ou por ID
                  const friendData = friends.find(
                    (f) => f.email === guest.email || f.id === guest.id
                  );

                  return (
                    <ThemedView
                      key={guest.id}
                      style={styles.containerCard}
                      borderWidth={1}
                      borderName="borderPrimary"
                    >
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          gap: 8,
                          alignItems: "center",
                        }}
                      >
                        {friendData?.foto ? (
                          <Image
                            style={[
                              styles.guestImage,
                              { borderColor: primaryColor },
                            ]}
                            source={{ uri: friendData.foto }}
                          />
                        ) : (
                          <View
                            style={[
                              styles.guestImage,
                              styles.avatarPlaceholder,
                              {
                                backgroundColor: avatarPlaceholderBg,
                                borderColor: primaryColor,
                              },
                            ]}
                          >
                            <Ionicons
                              name="person"
                              size={16}
                              color={primaryColor}
                            />
                          </View>
                        )}
                        <View>
                          <ThemedText
                            colorName="textPrimary"
                            type="sm"
                            isSemiBold
                          >
                            {friendData?.nome || "Usuário"}
                          </ThemedText>
                          <ThemedText colorName="textSecondary" type="px">
                            {guest.email}
                          </ThemedText>
                        </View>
                      </View>

                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          gap: 10,
                          alignItems: "center",
                        }}
                      >
                        <Menu
                          contentStyle={{ backgroundColor: bgMenu }}
                          visible={openMenuId === guest.id}
                          onDismiss={() => setOpenMenuId(null)}
                          anchor={
                            <Button onPress={() => setOpenMenuId(guest.id)}>
                              <ThemedText colorName="textSecondary" type="sm">
                                {guest.role}{" "}
                                <Ionicons name="chevron-down" size={14} />
                              </ThemedText>
                            </Button>
                          }
                        >
                          <Menu.Item
                            onPress={() => {
                              onUpdateGuestRole(guest.id, "Visualizar");
                              setOpenMenuId(null);
                            }}
                            title="Visualizar"
                          />
                          <Menu.Item
                            onPress={() => {
                              onUpdateGuestRole(guest.id, "Editor");
                              setOpenMenuId(null);
                            }}
                            title="Editor"
                          />
                        </Menu>
                        <ThemedView
                          bgName="bgTerciary"
                          style={{ height: 22, width: 2, borderRadius: 4 }}
                        />
                        <TouchableOpacity
                          onPress={() => onDeleteGuest(guest.id)}
                        >
                          <Ionicons name="trash" size={20} color={iconColor} />
                        </TouchableOpacity>
                      </View>
                    </ThemedView>
                  );
                })}
              </View>
            )}
          </View>
        </ScrollView>
      </View>

      {/* FAB - Botão Flutuante */}
      <Pressable style={styles.fabContainer} onPress={toggleModal}>
        <View style={[styles.fab, { backgroundColor: bgBtnPlus }]}>
          <ThemedText
            type="sm"
            isSemiBold={true}
            colorName="secondary"
            darkColor="#fff"
          >
            Adicionar amigo
          </ThemedText>
          <Ionicons name="add" size={40} color={btnPlus} />
        </View>
      </Pressable>

      {/* Modal de seleção de amigos */}
      <SheetModal
        visible={isModalVisible}
        onClose={toggleModal}
        title="Adicionar Convidados"
      >
        <View style={styles.modalContent}>
          <ThemedText
            colorName="textTerciary"
            type="sm"
            style={{ marginBottom: 16 }}
          >
            Selecione seus amigos para convidar para a viagem
          </ThemedText>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={primaryColor} />
              <ThemedText colorName="textSecondary" style={{ marginTop: 8 }}>
                Carregando amigos...
              </ThemedText>
            </View>
          ) : availableFriends.length === 0 ? (
            <ThemedView style={styles.emptyStateModal} bgName="bgSecondary">
              <Ionicons name="people-outline" size={40} color={iconColor} />
              <ThemedText
                colorName="textSecondary"
                type="sm"
                style={{ textAlign: "center", marginTop: 8 }}
              >
                {friends.length === 0
                  ? "Você ainda não tem amigos adicionados."
                  : "Todos os seus amigos já foram convidados!"}
              </ThemedText>
            </ThemedView>
          ) : (
            <ScrollView
              style={styles.friendsList}
              showsVerticalScrollIndicator={false}
            >
              {availableFriends.map((friend) => (
                <TouchableOpacity
                  key={friend.id}
                  style={[styles.friendItem, { borderColor: borderColor }]}
                  onPress={() => handleAddFriend(friend)}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    {friend.foto ? (
                      <Image
                        style={[
                          styles.friendAvatar,
                          { borderColor: primaryColor },
                        ]}
                        source={{ uri: friend.foto }}
                      />
                    ) : (
                      <View
                        style={[
                          styles.friendAvatar,
                          styles.avatarPlaceholder,
                          {
                            backgroundColor: avatarPlaceholderBg,
                            borderColor: primaryColor,
                          },
                        ]}
                      >
                        <Ionicons
                          name="person"
                          size={20}
                          color={primaryColor}
                        />
                      </View>
                    )}
                    <View>
                      <ThemedText colorName="textPrimary" type="sm" isSemiBold>
                        {friend.nome}
                      </ThemedText>
                      <ThemedText colorName="textSecondary" type="px">
                        {friend.email}
                      </ThemedText>
                    </View>
                  </View>
                  <Ionicons name="add-circle" size={28} color={primaryColor} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      </SheetModal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: "relative",
  },
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  scrollContainer: {
    paddingVertical: 8,
    paddingHorizontal: 1,
    width: "100%",
  },
  listCardGuests: {
    marginTop: 6,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  containerCard: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 8,
  },
  guestImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
  },
  avatarPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  emptyState: {
    padding: 32,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  modalContent: {
    paddingBottom: 20,
    maxHeight: 500,
  },
  loadingContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStateModal: {
    padding: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  friendsList: {
    maxHeight: 400,
  },
  friendItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  friendAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
  },
  fabContainer: {
    position: "absolute",
    bottom: -160,
    right: 0,
    width: 180,
    zIndex: 999,
  },
  fab: {
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
    elevation: 5,
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
});
