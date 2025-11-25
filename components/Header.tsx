import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet } from "react-native";
import { ThemedView } from "./themed-view";
import { BtnThemeToggleButton } from "./ui/btnToggleTheme";
import React from "react";

interface HeaderProps {
  children: React.ReactNode;
  onNotificationPress?: () => void;
  onBackPress?: () => void;
  hideNotificationIcon?: boolean; // Prop para esconder o sino
  hideThemeToggle?: boolean;      // Prop para esconder o sol/lua
}

export default function Header(props: HeaderProps) {
  const iconColor = useThemeColor({}, "textSecondary");
  const borderColor = useThemeColor({}, "borderPrimary");

  return (
    <ThemedView
      style={[styles.container, { borderColor: borderColor }]}
      bgName="bgPrimary"
    >
      <ThemedView style={styles.leftContainer} bgName="bgPrimary">
        {props.onBackPress && (
          <Pressable onPress={props.onBackPress} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={iconColor} />
          </Pressable>
        )}
        {props.children}
      </ThemedView>

      <ThemedView bgName="bgPrimary" style={styles.iconsContainer}>
        
        {/* LÓGICA: Só mostra o botão se hideThemeToggle for FALSO ou INDEFINIDO */}
        {!props.hideThemeToggle && (
           <BtnThemeToggleButton />
        )}

        {/* LÓGICA: Só mostra o sino se hideNotificationIcon for FALSO ou INDEFINIDO */}
        {!props.hideNotificationIcon && (
          <Pressable
            onPress={props.onNotificationPress}
            disabled={!props.onNotificationPress}
          >
            <Ionicons
              name="notifications-outline"
              size={20}
              color={iconColor}
            />
          </Pressable>
        )}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    width: "100%",
  },
  leftContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  backButton: {},
  iconsContainer: {
    gap: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
});