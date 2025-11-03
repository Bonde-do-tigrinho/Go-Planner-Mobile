import Header from "@/components/Header";
import NotificationItem from "@/components/notifications/item";
import { ThemedText } from "@/components/themed-text";
import ThemedTitle from "@/components/themed-title";
import { ThemedView } from "@/components/themed-view";
import { Ionicons } from "@expo/vector-icons"; // importacção dos ícones
import { useRouter } from "expo-router";
import React from "react";
import { SectionList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// --- 1. Definição dos tipos  ---
type NotificationType = "trip_invite" | "friend_request" | "friend_accept" | "alert";

// Estrutura de dados puros, ideal para o back-end
type NotificationData = {
  id: string;
  type: NotificationType;
  senderName: string | null; // pode ser nulo para alertas
  tripName: string | null; // Apenas para o trip_invite
  timestamp: string; // data e/ou hora
};

// --- 2. SEUS DADOS AGORA SEGUEM A NOVA ESTRUTURA ---
// Essa array agora é limpa e sem lógica de exibição
const RAW_NOTIFICATIONS_DATA: NotificationData[] = [
  {
    id: "1",
    type: "trip_invite",
    senderName: "Nicolas",
    tripName: "XXXXXXXX",
    timestamp: "11:00",
  },
  {
    id: "2",
    type: "friend_accept",
    senderName: "Nicolas",
    tripName: null,
    timestamp: "11:00",
  },
  {
    id: "3",
    type: "trip_invite",
    senderName: "Nicolas",
    tripName: "XXXXXXXX",
    timestamp: "11:00",
  },
  {
    id: "4",
    type: "friend_request",
    senderName: "Nicolas",
    tripName: null,
    timestamp: "11:00",
  },
];

// --- 3. AGRUPANDO OS DADOS PARA A SECTIONLIST ---
// (No futuro, você pode fazer esse agrupamento com base nos timestamps)
const NOTIFICATIONS_DATA = [
  {
    title: "Hoje",
    data: [RAW_NOTIFICATIONS_DATA[0], RAW_NOTIFICATIONS_DATA[1]],
  },
  {
    title: "Anteriores",
    data: [RAW_NOTIFICATIONS_DATA[2], RAW_NOTIFICATIONS_DATA[3]],
  },
];

export default function NotificationsScreen() {
  const router = useRouter();

  // --- 4. FUNÇÃO PARA GERAR OS PROPS DE EXIBIÇÃO ---
  // Essa função "traduz" os dados puros em dados visuais
  const getNotificationDetails = (item: NotificationData) => {
    let icon: keyof typeof Ionicons.glyphMap = "alert-circle";
    let text: string = "";
    let showActions: boolean = false;

    switch (item.type) {
      case "trip_invite":
        icon = "airplane";
        text = `Você recebeu um convite de ${item.senderName} para uma viagem para ${item.tripName}`;
        showActions = true;
        break;
      case "friend_request":
        icon = "person-add";
        text = `Você recebeu um pedido de amizade de ${item.senderName}`;
        showActions = true;
        break;
      case "friend_accept":
        icon = "person";
        text = `Solicitação de amizade aceita. Agora você é amigo de ${item.senderName}`;
        showActions = false;
        break;
      case "alert":
        icon = "warning";
        text = "Isto é um alerta geral do sistema."; // Exemplo de outro tipo
        showActions = false;
        break;
    }

    return { icon, text, showActions };
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView bgName="bgPrimary" style={styles.container}>
        <Header onBackPress={() => router.back()} hideNotificationIcon={true}>
          <ThemedTitle ballColor="secondary" title="Notificação" />
        </Header>

        <SectionList
          sections={NOTIFICATIONS_DATA}
          keyExtractor={(item) => item.id}
          // --- 5. RENDERITEM AGORA USA A LÓGICA DE TRADUÇÃO ---
          renderItem={({ item }) => {
            // "Traduz" os dados brutos para os props do componente
            const { icon, text, showActions } = getNotificationDetails(item);

            return (
              <NotificationItem
                icon={icon}
                text={text}
                time={item.timestamp} // O timestamp é pego diretamente
                showActions={showActions}
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
        />
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
});