import TripActivities from "@/components/createTrip/TripActivities";
import { TripDataForm } from "@/components/createTrip/TripDataForm";
import Button from "@/components/CustomButton";
import SheetModal from "@/components/modal";
import TabSelector from "@/components/tab-selector";
import { ThemedInput } from "@/components/themed-input";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { z } from "zod";

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
  const tabs = ["Dados", "Atividades", "Convidar"];

  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const btnPlus = useThemeColor({}, "btnPlus");
  const bgBtnPlus = useThemeColor({}, "bgBtnPlus");
  const iconColor = useThemeColor({}, "textTerciary");
  const borderColor = useThemeColor({}, "borderPrimary");
  const primaryColor = useThemeColor({}, "primary");

  const toggleModalVisible = () => {
    setModalVisible(!isModalVisible);
  };

  const {
    control,
    handleSubmit,
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

  const handleSaveTrip = (data: CreateTripFormData) => {
    console.log("Dados da viagem validados:", data);
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
          />
        );
      case "Convidar":
        return (
          <View>
            <Text>Conteúdo da Aba Convidar</Text>
          </View>
        );
    }
  };

  return (
    <ThemedView style={styles.mainContainer} bgName="bgPrimary">
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

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSubmit(handleSaveTrip)}
        >
          <Text style={styles.saveButtonText}>Salvar</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* FAB FIXO - FORA DO SCROLLVIEW */}
      {activeTab === "Atividades" && (
        <Pressable
          style={styles.fabContainer}
          onPress={() => toggleModalVisible()}
        >
          <View style={[styles.fab, { backgroundColor: bgBtnPlus }]}>
            <ThemedText
              type="sm"
              isSemiBold={true}
              colorName="secondary"
              darkColor="#fff"
            >
              Nova viagem
            </ThemedText>
            <Ionicons name="add" size={40} color={btnPlus} />
          </View>
        </Pressable>
      )}

      <SheetModal
        visible={isModalVisible}
        onClose={toggleModalVisible}
        title="Nova Atividade"
      >
        <View style={styles.modalContent}>
          <ThemedText colorName="textTerciary" type="sm">
            Crie a atividade que você irá fazer no dia x e hora xx:xx
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
          
          <View style={{marginTop: 10}} />
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
  scrollContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 20,
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
  saveButton: {
    backgroundColor: "#FF4500",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
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
