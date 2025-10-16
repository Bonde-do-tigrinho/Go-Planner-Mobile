import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";

type Guest = {
  id: number;
  name: string;
  avatar: string;
};

interface cardTripsProps {
  id: number;
  name: string;
  local: string;
  dateFrom: string;
  dateTo: string;
  image: any;
  guest?: Guest[];
}

export default function CardTrip({ ...trip }: cardTripsProps) {
  const iconColor = useThemeColor({}, "secondary");
  const guestCount = trip.guest?.length || 0;
  return (
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
              {trip.dateFrom} - {trip.dateTo}
            </ThemedText>
          </View>
        </View>

        <View style={styles.guestContainer}>
          {guestCount === 0 ? (
            <ThemedText
              type="px"
              colorName="textTerciary"
              style={{ paddingRight: 4 }}
            >
              Não há convidados
            </ThemedText>
          ) : (
            <>
              <ThemedText
                type="px"
                colorName="textTerciary"
                style={{ paddingRight: 4 }}
              >
                Convidados:
              </ThemedText>

              {/* 1. Mapeia e mostra APENAS os 4 primeiros convidados */}
              {trip.guest?.slice(0, 3).map((guest) => (
                <Image
                  key={guest.id}
                  style={styles.guestImage}
                  source={{ uri: guest.avatar }}
                />
              ))}

              {/* 2. Se houver mais de 4, mostra o círculo com o número restante */}
              {guestCount > 4 && (
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
                    {`+${guestCount - 4}`}
                  </ThemedText>
                </ThemedView>
              )}
            </>
          )}
        </View>
      </View>

      <Image key={trip.id} style={styles.tripImage} source={trip.image} />
    </ThemedView>
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
