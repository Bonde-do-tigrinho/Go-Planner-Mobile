import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";
import { BtnThemeToggleButton } from "./ui/btnToggleTheme";

const ballColors = {
  primary: "#FF5733",
  secondary: "#C70039",
} as const;

interface headerProps {
  title: string;
  ballColor: keyof typeof ballColors;
}

export default function Header(props: headerProps) {
  const iconColor = useThemeColor({}, "textSecondary");
  return (
    <ThemedView style={styles.container} bgName="bgPrimary">
      <View style={styles.titleContainer}>
        <ThemedText type="subtitle" colorName="textPrimary">
          {props.title}
        </ThemedText>
        {/* Agora o ícone é um irmão, não um filho, e recebe a cor corretamente */}
        <Ionicons
          name={"ellipse"}
          color={ballColors[props.ballColor]}
          size={10}
          style={{ paddingBottom: 4 }}
        />
      </View>
      <ThemedView bgName="bgPrimary" style={styles.iconsContainer}>
        <BtnThemeToggleButton />
        <Link href={"/(tabs)"}>
          <Pressable onPress={() => console.log("Login com Facebook")}>
            <Ionicons
              name="notifications-outline"
              size={24}
              color={iconColor}
            />
          </Pressable>
        </Link>
      </ThemedView>
    </ThemedView>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 10, // aumentei um pouco para dar mais espaço
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "100%",
  },
  iconsContainer: {
    gap: 1,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8, // Espaçamento entre o título e a bolinha
  },
});
