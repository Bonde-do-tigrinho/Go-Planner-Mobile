import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Pressable, StyleSheet} from "react-native";
import { ThemedView } from "./themed-view";
import { BtnThemeToggleButton } from "./ui/btnToggleTheme";

interface headerProps {
  children: React.ReactNode
}


export default function Header(props: headerProps) {
  const iconColor = useThemeColor({}, "textSecondary");
  const borderColor = useThemeColor({}, "borderPrimary");
  return (
    <ThemedView style={[styles.container, {borderColor: borderColor}]} bgName="bgPrimary">
      {props.children}
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
    paddingHorizontal: 10,
    paddingVertical: 10, // aumentei um pouco para dar mais espaço
    borderBottomWidth: 1,
    width: "100%",
  },
  iconsContainer: {
    gap: 1,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
});
