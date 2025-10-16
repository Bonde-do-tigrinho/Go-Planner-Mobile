import { StyleSheet, View } from "react-native";
import { ThemedView } from "./themed-view";
import { ThemedText } from "./themed-text";

type Guest = {
  id: number;
  name: string;
  avatar: string;
};

interface cardTripsProps {
  id: number;
  name: string
  local: string;
  dateFrom: string;
  dateTo: string;
  image: any; // 'any' porque vem de require()
  guest: Guest[];
}
export default function CardTrip({...trip} : cardTripsProps){
  return(
    <ThemedView key={trip.id} bgName="bgPrimary" style={styles.container}>
      <View style={styles.containerInfo}>
        <ThemedText colorName="textSecondary" type="sm">{trip.name}</ThemedText>

        <View>
          
        </View>
      </View>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container:{
    paddingHorizontal: 8,
    paddingVertical: 4,
    display: "flex",
    justifyContent: "space-between",
    gap: 2,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4, // Deslocamento para baixo
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
  }
})