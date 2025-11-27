import TripActivities from "@/components/createTrip/TripActivities";
import { TripDataForm } from "@/components/createTrip/TripDataForm";
import TripGuestsForm from "@/components/createTrip/TripGuestsForm";
import Button from "@/components/CustomButton";
import SheetModal from "@/components/modal";
import TabSelector from "@/components/tab-selector";
import { ThemedInput } from "@/components/themed-input";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import {
  createTrip,
  CreateTripApiRequest,
  getMyTrips,
  updateTrip,
  UpdateTripApiRequest,
} from "@/service/api/tripsApi";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { z } from "zod";

const API_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://192.168.15.10:8082/api";

const guestSchema = z.object({
  id: z.string(),
  email: z.string().email({ message: "Formato de e-mail inválido." }),
  role: z.enum(["Visualizar", "Editor"]),
});

const activitySchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, { message: "A atividade deve ter um nome." }),
  date: z.date({ message: "Defina a data" }),
  time: z.date({ message: "Defina a hora." }),
  is_completed: z.boolean(),
});

export const createTripSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: "O nome da viagem deve ter no mínimo 3 caracteres." }),
    departure_location: z
      .string()
      .min(3, { message: "O local de partida é obrigatório." }),
    destination: z
      .string()
      .min(3, { message: "O local de destino é obrigatório." }),
    start_date: z.date({
      message: "A data de início é obrigatória.",
    }),
    end_date: z.date({
      message: "A data de fim é obrigatória.",
    }),
    description: z.string().optional(),
    image_uri: z.string().optional(),

    activities: z.array(activitySchema),

    guests: z.array(guestSchema),
  })
  .refine(
    (data) => {
      if (data.start_date && data.end_date) {
        return data.end_date > data.start_date;
      }
      return true;
    },
    {
      message: "A data de fim deve ser após a data de início.",
      path: ["end_date"],
    }
  );

export type CreateTripFormData = z.infer<typeof createTripSchema>;

export default function CreateTrip() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const tripId = params.tripId as string | undefined;
  const isEditMode = !!tripId;

  const tabs = ["Dados", "Atividades", "Convidar"];

  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [isActivityModalVisible, setActivityModalVisible] = useState(false);
  const [isGuestModalVisible, setGuestModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingTrip, setIsLoadingTrip] = useState(isEditMode);

  // Estados para o formulário de atividade
  const [activityTitle, setActivityTitle] = useState("");
  const [activityDate, setActivityDate] = useState<Date | undefined>();
  const [activityTime, setActivityTime] = useState<Date | undefined>();

  const btnPlus = useThemeColor({}, "btnPlus");
  const bgBtnPlus = useThemeColor({}, "bgBtnPlus");
  const iconColor = useThemeColor({}, "textTerciary");
  const borderColor = useThemeColor({}, "borderPrimary");
  const primaryColor = useThemeColor({}, "primary");

  const toggleActivityModalVisible = () => {
    setActivityModalVisible(!isActivityModalVisible);
  };
  const toggleGuestModalVisible = () => {
    setGuestModalVisible(!isGuestModalVisible);
  };

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateTripFormData>({
    resolver: zodResolver(createTripSchema),
    defaultValues: {
      name: "",
      departure_location: "",
      destination: "",
      description: "",
      activities: [],
      guests: [],
    },
  });

  const destination = useWatch({ control, name: "destination" });
  const startDate = useWatch({ control, name: "start_date" });
  const endDate = useWatch({ control, name: "end_date" });
  const activities = useWatch({ control, name: "activities" }) || [];
  const guests = useWatch({ control, name: "guests" }) || [];

  // Carrega os dados da viagem se estiver em modo de edição
  useEffect(() => {
    if (isEditMode && tripId) {
      loadTripData();
    }
  }, [tripId, isEditMode]);

  const loadTripData = async () => {
    try {
      setIsLoadingTrip(true);
      const trips = await getMyTrips();
      const trip = trips.find((t) => t.id === tripId);

      if (!trip) {
        Alert.alert("Erro", "Viagem não encontrada");
        router.back();
        return;
      }

      // Busca a lista de amigos do usuário logado
      const [token, userId] = await Promise.all([
        AsyncStorage.getItem("userToken"),
        AsyncStorage.getItem("userId"),
      ]);

      let friendsData: any[] = [];

      if (token && userId) {
        try {
          const response = await fetch(`${API_URL}/friends/${userId}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            friendsData = await response.json();
          }
        } catch (error) {
          console.warn("Não foi possível carregar amigos:", error);
        }
      }

      // Mapeia participantes com informações dos amigos
      const guestsWithInfo = trip.participantes.map((participant) => {
        // Busca o amigo correspondente pelo ID
        const friendInfo = friendsData.find((f) => f.id === participant.userId);

        return {
          id: participant.userId,
          email: friendInfo?.email || `user_${participant.userId}@unknown.com`, // Fallback
          role:
            participant.role === "EDITOR"
              ? "Editor"
              : ("Visualizar" as "Editor" | "Visualizar"),
        };
      });

      // Preenche o formulário com os dados da viagem
      reset({
        name: trip.titulo,
        departure_location: trip.localPartida,
        destination: trip.localDestino,
        start_date: new Date(trip.dataPartida),
        end_date: new Date(trip.dataRetorno),
        description: trip.descricao || "",
        image_uri: trip.imagem || "",
        activities: trip.atividades.map((act) => {
          const dateTime = new Date(act.dataHora);
          return {
            id: act.id,
            title: act.titulo,
            date: dateTime,
            time: dateTime,
            is_completed: act.concluida,
          };
        }),
        guests: guestsWithInfo,
      });
    } catch (error) {
      console.error("Erro ao carregar viagem:", error);
      Alert.alert("Erro", "Não foi possível carregar os dados da viagem");
      router.back();
    } finally {
      setIsLoadingTrip(false);
    }
  };

  const handleAddActivity = () => {
    if (!activityTitle.trim()) {
      Alert.alert("Atenção", "Digite um título para a atividade");
      return;
    }
    if (!activityDate) {
      Alert.alert("Atenção", "Selecione a data da atividade");
      return;
    }
    if (!activityTime) {
      Alert.alert("Atenção", "Selecione o horário da atividade");
      return;
    }

    // Valida se a data está dentro do período da viagem
    if (!startDate || !endDate) {
      Alert.alert(
        "Atenção",
        "Defina as datas de início e fim da viagem na aba 'Dados' antes de criar atividades."
      );
      return;
    }

    const activityDateOnly = new Date(activityDate);
    activityDateOnly.setHours(0, 0, 0, 0);

    const tripStartDate = new Date(startDate);
    tripStartDate.setHours(0, 0, 0, 0);

    const tripEndDate = new Date(endDate);
    tripEndDate.setHours(0, 0, 0, 0);

    if (activityDateOnly < tripStartDate || activityDateOnly > tripEndDate) {
      Alert.alert(
        "Data Inválida",
        `A atividade deve estar entre ${tripStartDate.toLocaleDateString(
          "pt-BR"
        )} e ${tripEndDate.toLocaleDateString("pt-BR")}.`
      );
      return;
    }

    const currentActivities = activities;
    const newActivity = {
      id: `activity_${Date.now()}`,
      title: activityTitle,
      date: activityDate,
      time: activityTime,
      is_completed: false,
    };

    // Adiciona a nova atividade ao array
    const updatedActivities = [...currentActivities, newActivity];

    // Atualiza o formulário usando setValue
    setValue("activities", updatedActivities);

    // Limpa os campos e fecha o modal
    setActivityTitle("");
    setActivityDate(undefined);
    setActivityTime(undefined);
    setActivityModalVisible(false);

    Alert.alert("Sucesso", "Atividade adicionada!");
  };

  const handleDeleteActivity = (activityId: string) => {
    const updatedActivities = activities.filter((a) => a.id !== activityId);
    setValue("activities", updatedActivities);
  };

  const handleToggleActivity = (activityId: string) => {
    const updatedActivities = activities.map((activity) => {
      if (activity.id === activityId) {
        return { ...activity, is_completed: !activity.is_completed };
      }
      return activity;
    });
    setValue("activities", updatedActivities);
  };

  const handleDeleteGuest = (guestId: string) => {
    const updatedGuests = guests.filter((g) => g.id !== guestId);
    setValue("guests", updatedGuests);
  };

  const handleAddGuest = (guest: any) => {
    const updatedGuests = [...guests, guest];
    setValue("guests", updatedGuests);
  };

  const handleUpdateGuestRole = (
    guestId: string,
    role: "Visualizar" | "Editor"
  ) => {
    const updatedGuests = guests.map((guest) => {
      if (guest.id === guestId) {
        return { ...guest, role };
      }
      return guest;
    });
    setValue("guests", updatedGuests);
  };

  const handleSaveTrip = async (data: CreateTripFormData) => {
    try {
      setIsSubmitting(true);

      if (isEditMode && tripId) {
        // Modo de edição - apenas atualiza dados básicos
        const updatePayload: UpdateTripApiRequest = {
          titulo: data.name,
          localPartida: data.departure_location,
          localDestino: data.destination,
          dataPartida: data.start_date.toISOString(),
          dataRetorno: data.end_date.toISOString(),
          descricao: data.description || "",
        };

        console.log("📋 Dados validados do formulário:", data);
        console.log("📤 Atualizando viagem:", tripId, updatePayload);

        const response = await updateTrip(tripId, updatePayload);

        Alert.alert(
          "Sucesso! 🎉",
          `Viagem "${response.titulo}" atualizada com sucesso!`,
          [
            {
              text: "OK",
              onPress: () => router.back(),
            },
          ]
        );
      } else {
        // Modo de criação - cria viagem completa
        const payload: CreateTripApiRequest = {
          titulo: data.name,
          localPartida: data.departure_location,
          localDestino: data.destination,
          dataPartida: data.start_date.toISOString(),
          dataRetorno: data.end_date.toISOString(),
          descricao: data.description || "",
          imagem: data.image_uri || "",
          atividades: data.activities.map((activity) => {
            // Combina data + hora em um único ISO string
            const dateTime = new Date(activity.date);
            const time = new Date(activity.time);
            dateTime.setHours(time.getHours(), time.getMinutes(), 0, 0);

            return {
              titulo: activity.title,
              dataHora: dateTime.toISOString(),
            };
          }),
          participantes: data.guests.map((guest) => guest.email),
        };

        console.log("📋 Dados validados do formulário:", data);
        console.log("📤 Payload para API:", payload);

        const response = await createTrip(payload);

        Alert.alert(
          "Sucesso! 🎉",
          `Viagem "${response.titulo}" criada com sucesso!`,
          [
            {
              text: "OK",
              onPress: () => router.back(),
            },
          ]
        );
      }
    } catch (error: any) {
      console.error("Erro ao salvar viagem:", error);
      Alert.alert(
        "Erro",
        error.message ||
          `Não foi possível ${
            isEditMode ? "atualizar" : "criar"
          } a viagem. Tente novamente.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitError = (errors: any) => {
    console.log("❌ Erros de validação:", errors);

    // Identifica qual campo está com erro
    if (errors.name) {
      Alert.alert("Erro de Validação", errors.name.message);
      setActiveTab("Dados");
    } else if (errors.departure_location) {
      Alert.alert("Erro de Validação", errors.departure_location.message);
      setActiveTab("Dados");
    } else if (errors.destination) {
      Alert.alert("Erro de Validação", errors.destination.message);
      setActiveTab("Dados");
    } else if (errors.start_date) {
      Alert.alert("Erro de Validação", errors.start_date.message);
      setActiveTab("Dados");
    } else if (errors.end_date) {
      Alert.alert("Erro de Validação", errors.end_date.message);
      setActiveTab("Dados");
    } else if (errors.activities) {
      Alert.alert("Erro de Validação", "Verifique as atividades cadastradas");
      setActiveTab("Atividades");
    } else if (errors.guests) {
      Alert.alert("Erro de Validação", "Verifique os convidados");
      setActiveTab("Convidar");
    } else {
      Alert.alert(
        "Erro de Validação",
        "Por favor, preencha todos os campos obrigatórios"
      );
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Dados":
        return <TripDataForm control={control} errors={errors} />;
      case "Atividades":
        return (
          <TripActivities
            control={control}
            errors={errors}
            destination={destination}
            startDate={startDate}
            endDate={endDate}
            activities={activities}
            onDeleteActivity={handleDeleteActivity}
            onToggleActivity={handleToggleActivity}
          />
        );
      case "Convidar":
        return (
          <TripGuestsForm
            control={control}
            errors={errors}
            destination={destination}
            startDate={startDate}
            endDate={endDate}
            guests={guests}
            onDeleteGuest={handleDeleteGuest}
            onAddGuest={handleAddGuest}
            onUpdateGuestRole={handleUpdateGuestRole}
          />
        );
    }
  };

  return (
    <ThemedView style={styles.mainContainer} bgName="bgPrimary">
      {isLoadingTrip ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={primaryColor} />
          <ThemedText colorName="textSecondary" style={{ marginTop: 12 }}>
            Carregando dados da viagem...
          </ThemedText>
        </View>
      ) : (
        <>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <TabSelector
              activeTab={activeTab}
              onTabPress={setActiveTab}
              tabs={tabs}
            />

            {renderTabContent()}
          </ScrollView>

          {/* BOTÃO FIXO - FORA DO SCROLLVIEW */}
          <ThemedView style={styles.saveButtonContainer} bgName="bgPrimary">
            <TouchableOpacity
              style={[
                styles.saveButton,
                isSubmitting && styles.saveButtonDisabled,
              ]}
              onPress={handleSubmit(handleSaveTrip, onSubmitError)}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.saveButtonText}>
                  {isEditMode ? "Salvar Alterações" : "Criar Viagem"}
                </Text>
              )}
            </TouchableOpacity>
          </ThemedView>
        </>
      )}

      {/* FAB FIXO - FORA DO SCROLLVIEW */}
      {activeTab === "Atividades" && (
        <Pressable
          style={styles.fabContainer}
          onPress={() => {
            if (!startDate || !endDate) {
              Alert.alert(
                "Atenção",
                "Defina as datas de início e fim da viagem na aba 'Dados' antes de criar atividades."
              );
              return;
            }
            toggleActivityModalVisible();
          }}
        >
          <View style={[styles.fab, { backgroundColor: bgBtnPlus }]}>
            <ThemedText
              type="sm"
              isSemiBold={true}
              colorName="secondary"
              darkColor="#fff"
            >
              Nova atividade
            </ThemedText>
            <Ionicons name="add" size={40} color={btnPlus} />
          </View>
        </Pressable>
      )}

      <SheetModal
        visible={isActivityModalVisible}
        onClose={toggleActivityModalVisible}
        title="Nova Atividade"
      >
        <View style={styles.modalContent}>
          <ThemedText colorName="textTerciary" type="sm">
            Crie a atividade que você irá fazer no dia x e hora xx:xx
          </ThemedText>

          {/* 1. Descrição da atividade */}
          <ThemedInput
            label="Descrição"
            placeholder="Ex: Visitar o Templo Sensoji"
            icon="create-outline"
            onChangeText={setActivityTitle}
            value={activityTitle}
            returnKeyType="next"
          />

          {/* 2. Data*/}
          <View style={styles.dateField}>
            <ThemedText colorName="textPrimary" type="default">
              Escolha o dia:
            </ThemedText>
            <TouchableOpacity
              style={[styles.dateInput, { borderColor: borderColor }]}
              onPress={() => setShowDatePicker(true)}
            >
              <Ionicons name="calendar-outline" size={24} color={iconColor} />
              <ThemedText colorName="textTerciary" type="default">
                {activityDate
                  ? activityDate.toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : "Selecione..."}
              </ThemedText>
            </TouchableOpacity>

            {showDatePicker && startDate && endDate && (
              <DateTimePicker
                value={activityDate || startDate}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                minimumDate={startDate}
                maximumDate={endDate}
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setActivityDate(selectedDate);
                  }
                }}
                textColor={primaryColor}
                accentColor={primaryColor}
              />
            )}

            {startDate && endDate && (
              <ThemedText
                colorName="textTerciary"
                type="px"
                style={{ marginTop: 4 }}
              >
                Período da viagem: {startDate.toLocaleDateString("pt-BR")} até{" "}
                {endDate.toLocaleDateString("pt-BR")}
              </ThemedText>
            )}
          </View>

          {/* 3. Horário*/}
          <View style={styles.dateField}>
            <ThemedText colorName="textPrimary" type="default">
              Escolha o horário:
            </ThemedText>
            <TouchableOpacity
              style={[styles.dateInput, { borderColor: borderColor }]}
              onPress={() => setShowTimePicker(true)}
            >
              <Ionicons name="time-outline" size={24} color={iconColor} />
              <ThemedText colorName="textTerciary" type="default">
                {activityTime
                  ? activityTime.toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Selecione..."}
              </ThemedText>
            </TouchableOpacity>

            {showTimePicker && (
              <DateTimePicker
                value={activityTime || new Date()}
                mode="time"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(event, selectedTime) => {
                  setShowTimePicker(false);
                  if (selectedTime) {
                    setActivityTime(selectedTime);
                  }
                }}
                textColor={primaryColor}
                accentColor={primaryColor}
              />
            )}
          </View>

          <View style={{ marginTop: 10 }} />
          <Button
            title="Criar atividade"
            onPress={handleAddActivity}
            variant="gradient-primary"
            size="xl"
            width="100%"
          />
        </View>
      </SheetModal>

      <SheetModal
        visible={isGuestModalVisible}
        onClose={toggleGuestModalVisible}
        title="Adicionar Convidado"
      >
        <View style={styles.modalContent}>
          <ThemedText colorName="textTerciary" type="sm">
            Convide a pessoa que irá planejar e viajar junto com você!
          </ThemedText>

          {/* 1. Descrição da atividade */}
          <Controller
            control={control}
            name="activities.0.title"
            rules={{ required: "A descrição da atividade é obrigatória" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <ThemedInput
                label="Descrição"
                placeholder="Ex: Visitar o Templo Sensoji"
                icon="create-outline"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.activities?.[0]?.title?.message}
                returnKeyType="next"
              />
            )}
          />

          {/* 2. Data*/}
          <View style={styles.dateField}>
            <ThemedText colorName="textPrimary" type="default">
              Escolha o dia:
            </ThemedText>
            <Controller
              control={control}
              name="activities.0.date"
              rules={{ required: "A data é obrigatória" }}
              render={({ field: { onChange, value } }) => (
                <>
                  <TouchableOpacity
                    style={[styles.dateInput, { borderColor: borderColor }]}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Ionicons
                      name="calendar-outline"
                      size={24}
                      color={iconColor}
                    />
                    <ThemedText colorName="textTerciary" type="default">
                      {value
                        ? value.toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                        : "Selecione..."}
                    </ThemedText>
                  </TouchableOpacity>

                  {showDatePicker && (
                    <DateTimePicker
                      value={value || new Date()}
                      mode="date"
                      display={Platform.OS === "ios" ? "spinner" : "default"}
                      onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        if (selectedDate) {
                          onChange(selectedDate);
                        }
                      }}
                      textColor={primaryColor}
                      accentColor={primaryColor}
                    />
                  )}
                </>
              )}
            />
            {errors.activities?.[0]?.date && (
              <Text style={styles.errorText}>
                {errors.activities[0].date?.message}
              </Text>
            )}
          </View>

          {/* 3. Horário*/}
          <View style={styles.dateField}>
            <ThemedText colorName="textPrimary" type="default">
              Escolha o horário:
            </ThemedText>
            <Controller
              control={control}
              name="activities.0.time"
              rules={{ required: "O horário é obrigatório" }}
              render={({ field: { onChange, value } }) => (
                <>
                  <TouchableOpacity
                    style={[styles.dateInput, { borderColor: borderColor }]}
                    onPress={() => setShowTimePicker(true)}
                  >
                    <Ionicons name="time-outline" size={24} color={iconColor} />
                    <ThemedText colorName="textTerciary" type="default">
                      {value
                        ? value.toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Selecione..."}
                    </ThemedText>
                  </TouchableOpacity>

                  {showTimePicker && (
                    <DateTimePicker
                      value={value || new Date()}
                      mode="time"
                      display={Platform.OS === "ios" ? "spinner" : "default"}
                      onChange={(event, selectedTime) => {
                        setShowTimePicker(false);
                        if (selectedTime) {
                          onChange(selectedTime);
                        }
                      }}
                      textColor={primaryColor}
                      accentColor={primaryColor}
                    />
                  )}
                </>
              )}
            />
            {errors.activities?.[0]?.time && (
              <Text style={styles.errorText}>
                {errors.activities[0].time?.message}
              </Text>
            )}
          </View>

          <View style={{ marginTop: 10 }} />
          <Button
            title="Criar ativiade"
            onPress={() => {}}
            variant="gradient-primary"
            size="xl"
            width="100%"
          />
        </View>
      </SheetModal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    position: "relative",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  scrollContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 20,
    paddingBottom: 100, // Espaço para o botão fixo
  },
  modalContent: {
    paddingBottom: 30,
    gap: 16,
  },
  dateField: {
    gap: 8,
  },
  dateInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: 4,
  },
  saveButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(128, 128, 128, 0.2)",
  },
  saveButton: {
    backgroundColor: "#FF4500",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonDisabled: {
    backgroundColor: "#999",
    opacity: 0.6,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  fabContainer: {
    position: "absolute",
    bottom: 140,
    right: 16,
    zIndex: 999,
  },
  fab: {
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
    elevation: 5,
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
});
