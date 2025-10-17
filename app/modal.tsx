import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, TouchableOpacity } from "react-native";

export default function ModalScreen() {
  return (
    <ThemedView bgName="bgPrimary" style={styles.container}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => router.back()}
      >
        <Ionicons name="close" size={28} color="#666" />
      </TouchableOpacity>

      <ThemedText colorName="textPrimary" type="lg" style={styles.title}>
        Nova Viagem
      </ThemedText>

      {/* Aqui você pode adicionar os campos do formulário para criar uma nova viagem */}

      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  closeButton: {
    position: "absolute",
    right: 20,
    top: 20,
    zIndex: 1,
  },
  title: {
    textAlign: "center",
    marginTop: 60,
    marginBottom: 20,
  },
});
