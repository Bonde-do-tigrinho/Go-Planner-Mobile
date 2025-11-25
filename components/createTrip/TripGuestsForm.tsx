import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useState } from "react";
import { Control, FieldErrors } from "react-hook-form";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Menu } from "react-native-paper";
import { CreateTripFormData } from "../../app/createTrip";
import { ThemedText } from "../themed-text";
import { ThemedView } from "../themed-view";
import CardInfo from "./CardInfo";

interface tripGuestsProps {
  control: Control<CreateTripFormData>;
  errors: FieldErrors<CreateTripFormData>;
  destination: string;
  startDate?: Date;
  endDate?: Date;
}

export default function TripGuestsForm({
  control,
  errors,
  destination,
  endDate,
  startDate,
}: tripGuestsProps) {
  const guestsList = [
    {
      id: 1,
      name: "Kendi",
      role: "Editor",
      avatar: "https://i.pravatar.cc/150?img=54",
    },
    {
      id: 2,
      name: "Raul",
      role: "Editor",
      avatar: "https://i.pravatar.cc/150?img=33",
    },
    {
      id: 3,
      name: "Leandro",
      role: "Editor",
      avatar: "https://i.pravatar.cc/150?img=2",
    },
    {
      id: 4,
      name: "Miguel",
      role: "Editor",
      avatar: "https://i.pravatar.cc/150?img=13",
    },
    {
      id: 5,
      name: "João",
      role: "Editor",
      avatar: "https://i.pravatar.cc/150?img=51",
    },
    {
      id: 6,
      name: "Vitória",
      role: "Editor",
      avatar: "https://i.pravatar.cc/150?img=5",
    },
  ];
  const iconColor = useThemeColor({}, "textTerciary");
  const bgMenu = useThemeColor({}, "bgPrimary");
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [selectedRole, setSelectedRole] = useState("");
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollContainer}
        >
          <CardInfo
            destination={destination}
            startDate={startDate}
            endDate={endDate}
          />
          <View style={{ marginTop: 20 }}>
            <ThemedText colorName="textPrimary" type="default" isSemiBold>
              Lista de amigos
            </ThemedText>
            <View style={styles.listCardGuests}>
              {guestsList.map((guest) => (
                <ThemedView
                  key={guest.id}
                  style={styles.containerCard}
                  borderWidth={1}
                  borderName="borderPrimary"
                >
                  <View
                    style={{ display: "flex", flexDirection: "row", gap: 4 }}
                  >
                    <Image
                      key={guest.id}
                      style={styles.guestImage}
                      source={{ uri: guest.avatar }}
                    />
                    <ThemedText
                      style={{ paddingLeft: 8 }}
                      colorName="textSecondary"
                      type="sm"
                    >
                      {guest.name}
                    </ThemedText>
                  </View>

                  <View>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 10,
                        alignItems: "center",
                      }}
                    >
                      <Menu
                        contentStyle={{ backgroundColor: bgMenu }}
                        visible={openMenuId === guest.id}
                        onDismiss={() => setOpenMenuId(null)}
                        anchor={
                          <Button onPress={() => setOpenMenuId(guest.id)}>
                            <ThemedText colorName="textSecondary" type="sm">
                              {guest.role}{" "}
                              <Ionicons name="chevron-down" size={14} />
                            </ThemedText>
                          </Button>
                        }
                      >
                        <Menu.Item
                          onPress={() => {
                            setSelectedRole("Visualizar");
                            setOpenMenuId(null);
                          }}
                          title="Visualizar"
                        />
                        <Menu.Item
                          onPress={() => {
                            setSelectedRole("Editor");
                            setOpenMenuId(null);
                          }}
                          title="Editor"
                        />
                        <Menu.Item
                          onPress={() => {
                            setSelectedRole("Admin");
                            setOpenMenuId(null);
                          }}
                          title="Admin"
                        />
                      </Menu>
                      <ThemedView
                        bgName="bgTerciary"
                        style={{ height: 22, width: 2, borderRadius: 4 }}
                      />
                      <Ionicons name="trash" size={20} color={iconColor} />
                    </View>
                  </View>
                </ThemedView>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: "relative",
  },
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  scrollContainer: {
    paddingVertical: 8,
    paddingHorizontal: 1,
    width: "100%",
  },
  listCardGuests: {
    marginTop: 6,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  containerCard: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 8,
  },
  guestImage: {
    width: 30,
    height: 30,
    borderRadius: 40,
  },
});
