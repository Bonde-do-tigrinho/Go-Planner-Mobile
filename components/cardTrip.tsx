import { useThemeColor } from "@/hooks/use-theme-color";
import { ParticipantApiResponse } from "@/service/api/tripsApi";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";

interface cardTripsProps {
  id: string;
  name: string;
  local: string;
  dateFrom: string;
  dateTo: string;
  image: string;
  participants?: ParticipantApiResponse[];
}

export default function CardTrip({ ...trip }: cardTripsProps) {
  const iconColor = useThemeColor({}, "secondary");
  const participantCount = trip.participants?.length || 0;
  const router = useRouter();

  // Formata as datas ISO para DD/MM/YYYY
  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  // Placeholder image se não houver imagem
  const tripImageSource = trip.image
    ? { uri: trip.image }
    : require("../assets/images/popularTrips/tokyo.png");

  const handleCardPress = () => {
    router.push({
      pathname: "/createTrip",
      params: { tripId: trip.id },
    });
  };

  return (
    <TouchableOpacity onPress={handleCardPress} activeOpacity={0.7}>
      <ThemedView
        key={trip.id}
        bgName="bgPrimary"
        darkBg="#222"
        style={styles.container}
      >
        <View style={styles.containerInfo}>
          <ThemedText colorName="textSecondary" style={{}} type="sm">
            {trip.name}
          </ThemedText>

          <View style={styles.localDateContainer}>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Ionicons
                name="pin"
                size={20}
                color={iconColor}
                style={{ paddingRight: 4 }}
              />
              <ThemedText colorName="textPrimary" type="px" isSemiBold={true}>
                {trip.local}
              </ThemedText>
            </View>

            <View style={{ display: "flex", flexDirection: "row" }}>
              <Ionicons
                name="calendar"
                size={20}
                color={iconColor}
                style={{ paddingRight: 4 }}
              />
              <ThemedText colorName="textPrimary" type="px" isSemiBold={true}>
                {formatDate(trip.dateFrom)} - {formatDate(trip.dateTo)}
              </ThemedText>
            </View>
          </View>

          <View style={styles.guestContainer}>
            {participantCount === 0 ? (
              <ThemedText
                type="px"
                colorName="textTerciary"
                style={{ paddingRight: 4 }}
              >
                Sem participantes
              </ThemedText>
            ) : (
              <>
                <ThemedText
                  type="px"
                  colorName="textTerciary"
                  style={{ paddingRight: 4 }}
                >
                  Participantes: {participantCount}
                </ThemedText>

                {/* Mostra até 3 ícones de participantes */}
                {trip.participants?.slice(0, 3).map((participant, index) => (
                  <ThemedView
                    key={`${participant.userId}-${index}`}
                    bgName="bgSecondary"
                    style={styles.participantCircle}
                    lightBg="#E4E4E7"
                    darkBg="#3F3F46"
                  >
                    <Ionicons name="person" size={14} color={iconColor} />
                  </ThemedView>
                ))}

                {/* Se houver mais de 3, mostra o número restante */}
                {participantCount > 3 && (
                  <ThemedView
                    bgName="bgSecondary"
                    style={styles.moreGuestsCircle}
                    lightBg="#ddd"
                  >
                    <ThemedText
                      colorName="textPrimary"
                      darkColor="#E4E4E7"
                      style={styles.moreGuestsText}
                    >
                      {`+${participantCount - 3}`}
                    </ThemedText>
                  </ThemedView>
                )}
              </>
            )}
          </View>
        </View>

        <Image
          key={trip.id}
          style={styles.tripImage}
          source={tripImageSource}
        />
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 2,
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
  containerInfo: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  localDateContainer: {
    display: "flex",
    gap: 3,
  },
  guestContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  participantCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  guestImage: {
    width: 24,
    height: 24,
    borderRadius: 40,
  },
  tripImage: {
    width: 90,
    height: 90,
    borderRadius: 8,
  },
  moreGuestsCircle: {
    width: 24,
    height: 24,
    borderRadius: 12, // Exatamente metade da largura/altura
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden", // Garante que o conteúdo não ultrapasse as bordas
  },
  moreGuestsText: {
    fontSize: 10,
    fontWeight: "bold",
  },
});
