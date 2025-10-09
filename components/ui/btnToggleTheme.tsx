import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import {
  Appearance,
  Pressable,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";

export function BtnThemeToggleButton() {
  // 1. Pega o esquema de cores ATUAL. Ele será 'light' ou 'dark'.
  const colorScheme = useColorScheme();

  // 2. Cria a função que alterna o tema
  const toggleTheme = () => {
    // Calcula qual será o PRÓXIMO tema
    const nextTheme = colorScheme === "dark" ? "light" : "dark";
    // 3. USA A API NATIVA PARA MUDAR O TEMA DO APP!
    Appearance.setColorScheme(nextTheme);
  };
  const iconColor = useThemeColor({}, "textSecondary");
  return (
    <Pressable onPress={toggleTheme}>
      <View style={styles.button}>
        {colorScheme === "dark" ? (
          <Ionicons name={"moon-outline"} color={iconColor} size={20} />
        ) : (
          <Ionicons name={"sunny-outline"} color={iconColor} size={20} />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
