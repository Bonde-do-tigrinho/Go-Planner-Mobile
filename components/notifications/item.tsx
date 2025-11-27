import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../themed-text";
import { ThemedView } from "../themed-view";

type NotificationItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
  time: string;
  showActions?: boolean;
  onAccept?: () => void;
  onDecline?: () => void;
};

export default function NotificationItem({
  icon,
  text,
  time,
  showActions = false,
  onAccept,
  onDecline,
}: NotificationItemProps) {
  // Pega as cores do tema (constants/theme.ts)
  const iconColor = useThemeColor({}, "primary");

  console.log("NotificationItem recebeu:", { text, time, showActions, icon });

  return (
    <ThemedView bgName="bgPrimary" style={styles.container}>
      {/* usando bgSecondary para o ícone, como no design */}
      <ThemedView bgName="primary" style={styles.iconContainer}>
        <Ionicons name={icon} size={24} color="white" />
      </ThemedView>
      <View style={styles.contentContainer}>
        <View style={styles.textRow}>
          <ThemedText colorName="textPrimary" style={styles.mainText}>
            {text}
          </ThemedText>
          <ThemedText
            colorName="textSecondary"
            type="sm"
            style={styles.timeText}
          >
            {time}
          </ThemedText>
        </View>
        {showActions && (
          <View style={styles.actionsRow}>
            {/* Botão Aceitar */}
            <TouchableOpacity onPress={onAccept}>
              <ThemedView bgName="btnAccept" style={styles.button}>
                <ThemedText colorName="primary" isSemiBold>
                  Aceitar
                </ThemedText>
              </ThemedView>
            </TouchableOpacity>
            {/* Botão Recusar (usando bgTertiary) */}
            <TouchableOpacity onPress={onDecline}>
              <ThemedView bgName="btnDecline" style={styles.button}>
                <ThemedText colorName="secondary" isSemiBold>
                  Recusar
                </ThemedText>
              </ThemedView>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: 16,
    alignItems: "flex-start",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  contentContainer: { flex: 1 },
  textRow: { flexDirection: "row", justifyContent: "space-between" },
  mainText: { flex: 1, marginRight: 8, lineHeight: 20 },
  timeText: {},
  actionsRow: { flexDirection: "row", marginTop: 12, gap: 18 },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 8,
  },
});
