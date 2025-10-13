import { StyleSheet, View } from "react-native";
import { ThemedText } from "./themed-text";
import { Ionicons } from "@expo/vector-icons";
const ballColors = {
  primary: "#FF5733",
  secondary: "#C70039",
} as const;

interface titleProps {
  title: string;
  ballColor: keyof typeof ballColors;
}

export default function ThemedTitle({ballColor, title} : titleProps){
  return(
    <View style={styles.titleContainer}>
      <ThemedText type="subtitle" colorName="textPrimary">
        {title}
      </ThemedText>
      <Ionicons
        name={"ellipse"}
        color={ballColors[ballColor]}
        size={10}
        style={{ paddingBottom: 4 }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
    titleContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8, // Espaçamento entre o título e a bolinha
  },
})