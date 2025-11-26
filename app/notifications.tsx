import Header from "@/components/Header";
import NotificationItem from "@/components/notifications/item";
import { ThemedText } from "@/components/themed-text";
import ThemedTitle from "@/components/themed-title";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  SectionList,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const API_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://192.168.15.10:8082/api";

// --- 1. Definição dos tipos baseados na API ---
type NotificationType = "SOLICITACAO_AMIZADE" | "CONVITE_VIAGEM";

type ApiNotification = {
  id: string;
  message?: string;
  mensagem?: string;
  destinatarioId: string;
  referenciaId: string;
  dataCriacao: string;
  lida: boolean;
  viagemId: string | null;
  remetenteId: string;
  tipo: NotificationType;
  solicitanteId?: string;
  solicitadoId?: string;
};

type SectionData = {
  title: string;
  data: ApiNotification[];
};

export default function NotificationsScreen() {
  const router = useRouter();
  const primaryColor = useThemeColor({}, "primary");
  const primaryBackground = useThemeColor({}, "bgPrimary");

  // --- Estados ---
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [sections, setSections] = useState<SectionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // --- Buscar notificações ao montar ---
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const token = await AsyncStorage.getItem("userToken");

      if (!token) {
        Alert.alert("Erro", "Token não encontrado. Faça login novamente.");
        return;
      }

      const response = await fetch(
        `${API_URL}/notifications/minhasNotificacoes`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data: ApiNotification[] = await response.json();
        console.log("Resposta completa da API:", JSON.stringify(data, null, 2));
        console.log("Primeira notificação completa:", data[0]);
        setNotifications(data);
        groupNotifications(data);
      } else {
        const errorData = await response.json();
        console.error("Erro ao buscar notificações:", errorData);
        Alert.alert("Erro", "Não foi possível carregar as notificações.");
      }
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
      Alert.alert("Erro", "Não foi possível conectar ao servidor.");
    } finally {
      if (isRefresh) {
        setIsRefreshing(false);
      } else {
        setIsLoading(false);
      }
    }
  };

  const onRefresh = () => {
    fetchNotifications(true);
  };

  // --- Aceitar solicitação ---
  const handleAccept = async (
    notificationId: string,
    solicitanteId: string,
    solicitadoId: string
  ) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Erro", "Dados de autenticação não encontrados.");
        return;
      }

      console.log("=== ACEITAR SOLICITAÇÃO ===");
      console.log("NotificationId:", notificationId);
      console.log("Payload:", JSON.stringify({ solicitanteId, solicitadoId }));

      const response = await fetch(`${API_URL}/friend/accept-friend`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          solicitanteId,
          solicitadoId,
        }),
      });

      if (response.ok) {
        // Remove a notificação da lista ANTES de mostrar o alert
        const updatedNotifications = notifications.filter(
          (n) => n.id !== notificationId
        );
        setNotifications(updatedNotifications);
        groupNotifications(updatedNotifications);

        Alert.alert("Sucesso", "Solicitação de amizade aceita!");
      } else {
        const errorData = await response.json();
        console.error("Erro ao aceitar:", errorData);
        Alert.alert(
          "Erro",
          errorData.error || "Não foi possível aceitar a solicitação."
        );
      }
    } catch (error) {
      console.error("Erro ao aceitar solicitação:", error);
      Alert.alert("Erro", "Não foi possível conectar ao servidor.");
    }
  };

  // --- Recusar solicitação ---
  const handleDecline = async (
    notificationId: string,
    solicitanteId: string,
    solicitadoId: string
  ) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Erro", "Dados de autenticação não encontrados.");
        return;
      }

      console.log("=== RECUSAR SOLICITAÇÃO ===");
      console.log("NotificationId:", notificationId);
      console.log("Payload:", JSON.stringify({ solicitanteId, solicitadoId }));

      const response = await fetch(`${API_URL}/friend/decline-friend`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          solicitanteId,
          solicitadoId,
        }),
      });

      if (response.ok) {
        // Remove a notificação da lista ANTES de mostrar o alert
        const updatedNotifications = notifications.filter(
          (n) => n.id !== notificationId
        );
        setNotifications(updatedNotifications);
        groupNotifications(updatedNotifications);

        Alert.alert("Sucesso", "Solicitação de amizade recusada.");
      } else {
        const errorData = await response.json();
        console.error("Erro ao recusar:", errorData);
        Alert.alert(
          "Erro",
          errorData.error || "Não foi possível recusar a solicitação."
        );
      }
    } catch (error) {
      console.error("Erro ao recusar solicitação:", error);
      Alert.alert("Erro", "Não foi possível conectar ao servidor.");
    }
  };

  // --- Agrupar notificações por data ---
  const groupNotifications = (data: ApiNotification[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayNotifications: ApiNotification[] = [];
    const olderNotifications: ApiNotification[] = [];

    data.forEach((notification) => {
      const notificationDate = new Date(notification.dataCriacao);
      notificationDate.setHours(0, 0, 0, 0);

      if (notificationDate.getTime() === today.getTime()) {
        todayNotifications.push(notification);
      } else {
        olderNotifications.push(notification);
      }
    });

    const grouped: SectionData[] = [];

    if (todayNotifications.length > 0) {
      grouped.push({ title: "Hoje", data: todayNotifications });
    }

    if (olderNotifications.length > 0) {
      grouped.push({ title: "Anteriores", data: olderNotifications });
    }

    setSections(grouped);
  };

  // --- Formatar timestamp ---
  const formatTimestamp = (dataHora: string): string => {
    const date = new Date(dataHora);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  // --- Traduzir tipo da API para exibição ---
  const getNotificationDetails = (item: ApiNotification) => {
    let icon: keyof typeof Ionicons.glyphMap = "alert-circle";
    let showActions: boolean = false;

    switch (item.tipo) {
      case "CONVITE_VIAGEM":
        icon = "airplane";
        showActions = true;
        break;
      case "SOLICITACAO_AMIZADE":
        icon = "person-add";
        showActions = true;
        break;
      default:
        icon = "notifications";
        showActions = false;
    }

    return { icon, showActions };
  };

  // --- Loading State ---
  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: primaryBackground }}>
        <ThemedView bgName="bgPrimary" style={styles.container}>
          <Header onBackPress={() => router.back()} hideNotificationIcon={true}>
            <ThemedTitle ballColor="secondary" title="Notificação" />
          </Header>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={primaryColor} />
            <ThemedText colorName="textSecondary" style={{ marginTop: 12 }}>
              Carregando notificações...
            </ThemedText>
          </View>
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: primaryBackground,
        paddingVertical: 8,
      }}
    >
      <ThemedView bgName="bgPrimary" style={styles.container}>
        <Header
          onBackPress={() => router.back()}
          hideNotificationIcon={true}
          hideThemeToggle
        >
          <ThemedTitle ballColor="secondary" title="Notificação" />
        </Header>

        {sections.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={64} color="#999" />
            <ThemedText colorName="textSecondary" style={styles.emptyText}>
              Nenhuma notificação ainda
            </ThemedText>
          </View>
        ) : (
          <SectionList
            sections={sections}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const { icon, showActions } = getNotificationDetails(item);

              // Fallback para mensagem se vier undefined
              const messageText =
                item.message ||
                item.mensagem ||
                `Notificação do tipo ${item.tipo}`;

              return (
                <NotificationItem
                  icon={icon}
                  text={messageText}
                  time={formatTimestamp(item.dataCriacao)}
                  showActions={showActions}
                  onAccept={() =>
                    handleAccept(
                      item.id,
                      item.remetenteId || "",
                      item.destinatarioId || ""
                    )
                  }
                  onDecline={() =>
                    handleDecline(
                      item.id,
                      item.remetenteId || "",
                      item.destinatarioId || ""
                    )
                  }
                />
              );
            }}
            renderSectionHeader={({ section: { title } }) => (
              <ThemedText
                type="subtitle"
                colorName="textPrimary"
                style={styles.sectionHeader}
              >
                {title}
              </ThemedText>
            )}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                tintColor={primaryColor}
                colors={[primaryColor]}
              />
            }
          />
        )}
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContainer: { paddingHorizontal: 16 },
  sectionHeader: {
    paddingTop: 24,
    paddingBottom: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: "center",
  },
});
