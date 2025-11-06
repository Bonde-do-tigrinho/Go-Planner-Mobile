import Button from "@/components/CustomButton";
import { ThemedView } from "@/components/themed-view";
import { Fonts } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { ImageBackground } from "expo-image";
import { Link } from "expo-router";
import React, { useEffect } from "react";
import { Appearance, StyleSheet, Text, useWindowDimensions } from "react-native";

export default function AuthScreen() {
  const { width } = useWindowDimensions();

  useEffect(() => {
    Appearance.setColorScheme("light");
  }, [])
  return (
    <ImageBackground
      source={require("@/assets/images/background-auth.png")}
      style={styles.container}
    >
      <Text style={styles.title}>
        Bem vindo ao Go
        <Ionicons name="ellipse" size={9} color="#FF5733" />
        planner
      </Text>

      <ThemedView
        style={[styles.footer, { width }]}
        darkBg="#fff"
        lightBg="#fff"
      >
        <Link href={"/(auth)/login"} asChild>
          <Button
            title="Já tenho uma conta"
            onPress={() => {}}
            variant="gradient-primary"
            size="xl"
            width="100%"
          />
        </Link>
        <Link href={"/(auth)/register"} asChild>
          <Button
            title="Criar uma conta nova"
            onPress={() => {}}
            variant="outline-orange"
            size="xl"
            width="100%"
          />
        </Link>
        {/* <Link href={"/(tabs)"} asChild>
          <Button
            title="Ir para home"
            onPress={() => {}}
            variant="secondary"
            size="xl"
            width="100%"
          />
        </Link> */}
      </ThemedView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)", // Adiciona um overlay escuro para legibilidade
    width: "100%", // Garante que o container de conteúdo também ocupe toda a largura
  },
  title: {
    fontSize: 38,
    color: "#fff",
    marginHorizontal: 68,
    textAlign: "center",
    fontFamily: Fonts.sansSemiBold,
    marginTop: 130,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    paddingHorizontal: 20,
    alignItems: "center",
    paddingVertical: 40,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: "hidden",
    height: "55%",
    display: "flex",
    gap: 32,
  },
  button: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#FF5733",
    fontSize: 16,
    fontWeight: "bold",
  },
});
