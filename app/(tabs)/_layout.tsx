// app/(tabs)/_layout.tsx
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons"; // Importamos o Ionicons
import { Tabs } from "expo-router";
import  React from "react";
import { Platform } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarShowLabel: false,

        tabBarStyle: {
          position: "absolute",
          marginHorizontal: 40, // Cuidado: marginHorizontal + left/right pode causar problemas. Escolha um ou outro.
          bottom: 25,
          // Removido left e right para usar marginHorizontal, que centraliza melhor.
          height: 65,
          borderRadius: 30,
          borderTopWidth: 0,
          backgroundColor: colorScheme === "dark" ? "#1e1e1e" : "#fff",

          ...Platform.select({
            ios: {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 5,
            },
            android: {
              elevation: 8,
            },
          }),
        },

        tabBarItemStyle: {
          justifyContent: "flex-start",
          paddingTop: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={32} // Usar o 'size' padrão da tab bar é uma boa prática
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "people" : "people-outline"}
              size={32}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={28}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="teste"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "bug" : "bug-outline"}
              size={28}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
