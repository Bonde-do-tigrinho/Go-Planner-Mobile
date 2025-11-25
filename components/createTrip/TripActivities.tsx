import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useState, useEffect } from "react";
import { Control, FieldErrors } from "react-hook-form";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { CreateTripFormData } from "../../app/createTrip";
import GradientText from "../GradientText";
import SheetModal from "../modal";
import { ThemedText } from "../themed-text";
import { ThemedView } from "../themed-view";
import CardInfo from "./CardInfo";

interface tripActivitiesProps {
  // O 'control' e 'errors' para os campos DESTA aba
  control: Control<CreateTripFormData>;
  errors: FieldErrors<CreateTripFormData>;

  // Os dados da aba anterior que queremos exibir
  destination: string;
  startDate?: Date;
  endDate?: Date;
}

export default function TripActivities({
  control,
  errors,
  destination,
  endDate,
  startDate,
}: tripActivitiesProps) {
  const btnPlus = useThemeColor({}, "btnPlus");
  const bgBtnPlus = useThemeColor({}, "bgBtnPlus");
  const iconColor = useThemeColor({}, "textTerciary");

  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastDestination, setLastDestination] = useState<string>("");

  // Limpar sugestões quando o destino mudar
  useEffect(() => {
    if (lastDestination && lastDestination !== destination) {
      setSuggestions(null);
      setError(null);
    }
    setLastDestination(destination);
  }, [destination]);

  const toggleModalVisible = () => {
    setModalVisible(!isModalVisible);
  };

  const fetchSuggestions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "https://goplanner-api-bot.onrender.com/api/chat/activities",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            destination: destination,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar sugestões, selecione um destino");
      }

      const data = await response.json();
      setSuggestions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setIsLoading(false);
    }
  };

  const activitiesList = [
    {
      id: "1",
      desc: "Churrasco na praia",
      horario: "12:00",
      concluida: true,
    },
    {
      id: "2",
      desc: "Reunião de projeto",
      horario: "09:00",
      concluida: true,
    },
    {
      id: "3",
      desc: "Ir à academia",
      horario: "18:00",
      concluida: false,
    },
    {
      id: "4",
      desc: "Comprar leite",
      horario: "17:30",
      concluida: false,
    },
    {
      id: "5",
      desc: "Consulta no dentista",
      horario: "14:00",
      concluida: true,
    },
    {
      id: "6",
      desc: "Estudar para a prova",
      horario: "20:00",
      concluida: false,
    },
  ];

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.addButtonContainer}
        onPress={() => toggleModalVisible()}
      ></Pressable>
      <ScrollView style={styles.scrollContainer}>
        <CardInfo
          destination={destination}
          startDate={startDate}
          endDate={endDate}
        />
        <Pressable onPress={toggleModalVisible}>
          <ThemedView bgName="bgPrimary" style={styles.btnAi}>
            <ThemedText colorName="textSecondary" type="sm">
              Peça uma sugestão de Atividade
            </ThemedText>

            <Image
              source={require("@/assets/icons/iconAiPlanner.svg")}
              style={styles.socialIcon}
              contentFit="contain"
            />
          </ThemedView>
        </Pressable>
        <View style={{ marginTop: 20 }}>
          <ThemedText colorName="textPrimary" type="default" isSemiBold>
            {" "}
            Dia 20
          </ThemedText>
          <View style={styles.listCardActivities}>
            {activitiesList.map((activity) => (
              <ThemedView
                key={activity.id}
                style={styles.containerCard}
                borderWidth={1}
                borderName="borderPrimary"
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 8,
                    alignItems: "center",
                  }}
                >
                  {activity.concluida === true ? (
                    <ThemedView
                      bgName="primary"
                      style={[styles.check, { padding: 2 }]}
                    >
                      <Ionicons name="checkmark" size={18} color="white" />
                    </ThemedView>
                  ) : (
                    <ThemedView
                      borderName="primary"
                      borderWidth={0.5}
                      style={[styles.notCheck, { padding: 2 }]}
                    ></ThemedView>
                  )}
                  <ThemedText type="sm" colorName="textSecondary">
                    {activity.desc}
                  </ThemedText>
                </View>

                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 10,
                    alignItems: "center",
                  }}
                >
                  <ThemedText type="px" colorName="textSecondary">
                    {activity.horario}
                  </ThemedText>
                  <ThemedView
                    bgName="bgTerciary"
                    style={{ height: 22, width: 2, borderRadius: 4 }}
                  />
                  <Ionicons name="trash" size={20} color={iconColor} />
                </View>
              </ThemedView>
            ))}
          </View>
        </View>

        <View style={{ marginTop: 20 }}>
          <ThemedText colorName="textPrimary" type="default" isSemiBold>
            {" "}
            Dia 21
          </ThemedText>
          <View style={styles.listCardActivities}>
            {activitiesList.map((activity) => (
              <ThemedView
                key={activity.id}
                style={styles.containerCard}
                borderWidth={1}
                borderName="borderPrimary"
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 8,
                    alignItems: "center",
                  }}
                >
                  {activity.concluida === true ? (
                    <ThemedView
                      bgName="primary"
                      style={[styles.check, { padding: 2 }]}
                    >
                      <Ionicons name="checkmark" size={18} color="white" />
                    </ThemedView>
                  ) : (
                    <ThemedView
                      borderName="primary"
                      borderWidth={0.5}
                      style={[styles.notCheck, { padding: 2 }]}
                    ></ThemedView>
                  )}
                  <ThemedText type="sm" colorName="textSecondary">
                    {activity.desc}
                  </ThemedText>
                </View>

                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 10,
                    alignItems: "center",
                  }}
                >
                  <ThemedText type="px" colorName="textSecondary">
                    {activity.horario}
                  </ThemedText>
                  <ThemedView
                    bgName="bgTerciary"
                    style={{ height: 22, width: 2, borderRadius: 4 }}
                  />
                  <Ionicons name="trash" size={20} color={iconColor} />
                </View>
              </ThemedView>
            ))}
          </View>
        </View>
      </ScrollView>
      <SheetModal
        visible={isModalVisible}
        onClose={toggleModalVisible}
        title="Sugestão da AI.planner"
      >
        <ScrollView
          style={styles.modalContent}
          showsVerticalScrollIndicator={false}
        >
          <GradientText style={styles.gradientName}>
            Olá, Nicolas Yanase
          </GradientText>
          <ThemedText style={{marginTop: 10}} type="default" isSemiBold colorName="textPrimary">
            Como posso ajudar?
          </ThemedText>
          <ThemedText style={{marginBottom: 10}} type="sm" colorName="textSecondary">
            Selecione alguma opção para nossa inteligência artificial
          </ThemedText>

          <Pressable
            style={styles.suggestionCard}
            onPress={fetchSuggestions}
            disabled={isLoading}
          >
            <View style={styles.suggestionContent}>
              <Ionicons name="location" size={24} color="#FF5733" />
              <View style={styles.suggestionTextContainer}>
                <GradientText style={styles.suggestionTitle}>
                  Sugerir atividades para seu destino
                </GradientText>
                <ThemedText type="px" colorName="textSecondary">
                  Receba sugestões personalizadas baseadas no seu destino
                </ThemedText>
              </View>
            </View>
          </Pressable>

          {isLoading && (
            <View style={styles.loadingContainer}>
              <Image
                source={require("@/assets/images/loading.gif")}
                style={styles.loadingGif}
                contentFit="contain"
              />
              <ThemedText type="sm" colorName="textSecondary">
                Buscando sugestões...
              </ThemedText>
            </View>
          )}

          {error && (
            <ThemedView style={styles.errorContainer} bgName="bgSecondary">
              <Ionicons name="alert-circle" size={20} color="#FF5733" />
              <ThemedText type="sm" colorName="textSecondary">
                {error}
              </ThemedText>
            </ThemedView>
          )}

          {suggestions && suggestions.activities && (
            <View style={styles.activitiesContainer}>
              <ThemedText
                type="default"
                isSemiBold
                colorName="textPrimary"
                style={{ marginBottom: 12 }}
              >
                {suggestions.response}
              </ThemedText>

              {suggestions.activities.map((activity: any, index: number) => (
                <ThemedView
                  key={index}
                  style={styles.activityCard}
                  bgName="bgPrimary"
                  borderWidth={1}
                  borderName="borderPrimary"
                >
                  <View style={styles.activityHeader}>
                    <GradientText style={styles.activityTitle}>
                      {activity.title}
                    </GradientText>
                    <View style={styles.categoryBadge}>
                      <ThemedText type="px" colorName="primary">
                        {activity.category}
                      </ThemedText>
                    </View>
                  </View>

                  <ThemedText
                    type="sm"
                    colorName="textSecondary"
                    style={{ marginTop: 8 }}
                  >
                    {activity.description}
                  </ThemedText>

                  <View style={styles.activityDetails}>
                    <View style={styles.detailItem}>
                      <Ionicons name="time-outline" size={16} color="#666" />
                      <ThemedText type="px" colorName="textSecondary">
                        {activity.estimated_duration}
                      </ThemedText>
                    </View>

                    <View style={styles.detailItem}>
                      <Ionicons name="cash-outline" size={16} color="#666" />
                      <ThemedText type="px" colorName="textSecondary">
                        {activity.estimated_cost}
                      </ThemedText>
                    </View>
                  </View>
                </ThemedView>
              ))}
            </View>
          )}
        </ScrollView>
      </SheetModal>
    </View>
  );
}
const styles = StyleSheet.create({
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
  addButtonContainer: {
    position: "absolute",
    bottom: 130,
    right: 0,
    zIndex: 999,
  },
  addButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 3,
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  check: {
    width: 20,
    height: 20,
    borderRadius: 4,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  notCheck: {
    width: 20,
    height: 20,
    borderRadius: 4,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  listCardActivities: {
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
  modalContent: {
    paddingBottom: 20,
  },
  gradientName: {
    fontSize: 24, // Tamanho 'default' do ThemedText
    lineHeight: 24, // LineHeight 'default' do ThemedText
    fontWeight: "bold",
    marginRight: 16,
  },
  btnAi: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 87, 51, 0.3)",
    shadowColor: "#FF5733",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 6,
  },
  socialIcon: {
    width: 32,
    height: 32,
  },
  suggestionCard: {
    marginTop: 8,
    borderRadius: 12,
    overflow: "hidden",
  },
  suggestionContent: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
    alignItems: "flex-start",
    backgroundColor: "rgba(255, 87, 51, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 87, 51, 0.2)",
  },
  suggestionTextContainer: {
    flex: 1,
    gap: 4,
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  loadingContainer: {
    marginTop: 16,
    paddingVertical: 16,
    alignItems: "center",
    gap: 8,
    display: "flex",
    flexDirection: "row",
  },
  loadingGif: {
    width: 40,
    height: 40,
  },
  errorContainer: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  activitiesContainer: {
    marginTop: 16,
  },
  activityCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  activityHeader: {
    display: "flex",
    flexDirection: "column",
    marginBottom: 4,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    marginRight: 8,
  },
  categoryBadge: {
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "rgba(255, 87, 51, 0.1)",
  },
  activityDetails: {
    flexDirection: "row",
    gap: 16,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.1)",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  addActivityButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "rgba(255, 87, 51, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 87, 51, 0.3)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
});
