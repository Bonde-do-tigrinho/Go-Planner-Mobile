import React, { useState } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CreateTripFormData } from "../../app/createTrip";

// Componentes Nativos e Customizados
import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { ThemedInput } from "../themed-input"; // <-- Importado
import { ThemedText } from "../themed-text";

type TripDataFormProps = {
  control: Control<CreateTripFormData>;
  errors: FieldErrors<CreateTripFormData>;
};

export function TripDataForm({ control, errors }: TripDataFormProps) {
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const pickImage = async (onChange: (uri: string) => void) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Desculpe, precisamos de permissão para acessar suas fotos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      onChange(result.assets[0].uri);
    }
  };

  const iconColor = useThemeColor({}, "textTerciary");
  const borderColor = useThemeColor({}, "borderPrimary");
  return (
    <View style={formStyles.formContainer}>
      {/* 1. Nome da sua viagem */}
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <ThemedInput
            label="Nome da sua viagem:"
            placeholder="Ex: Viagem para o Japão"
            icon="airplane-outline"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.name?.message}
            returnKeyType="next"
          />
        )}
      />

      {/* 2. Local de partida */}
      <Controller
        control={control}
        name="departure_location"
        render={({ field: { onChange, onBlur, value } }) => (
          <ThemedInput
            label="Local de partida:"
            placeholder="São Paulo, Brasil"
            icon="location-outline"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.departure_location?.message}
            returnKeyType="next"
          />
        )}
      />

      {/* 3. Local de destino */}
      <Controller
        control={control}
        name="destination"
        render={({ field: { onChange, onBlur, value } }) => (
          <ThemedInput
            label="Local de destino:"
            placeholder="Ex: Tóquio, Japão"
            icon="flag-outline"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.destination?.message}
            returnKeyType="next"
          />
        )}
      />

      {/* 4. Datas (Início e Fim) - Mantido como TouchableOpacity */}
      <View style={formStyles.dateRow}>
        <View style={[formStyles.dateField]}>
          <ThemedText colorName="textPrimary" type="default">
            Início da viagem:
          </ThemedText>
          <Controller
            control={control}
            name="start_date"
            render={({ field: { onChange, value } }) => (
              <>
                <TouchableOpacity
                  style={[
                    formStyles.dateInput,
                    { borderColor: borderColor },
                    errors.start_date && formStyles.inputError,
                  ]}
                  onPress={() => setShowStartDatePicker(true)}
                >
                  <Ionicons
                    name="calendar-outline"
                    size={24}
                    color={iconColor}
                  />
                  <ThemedText colorName="textTerciary" type="default">
                    {value ? value.toLocaleDateString("pt-BR") : "Selecione..."}
                  </ThemedText>
                </TouchableOpacity>

                {showStartDatePicker && (
                  <DateTimePicker
                    value={value || new Date()}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={(event, selectedDate) => {
                      setShowStartDatePicker(false);
                      if (selectedDate) {
                        onChange(selectedDate);
                      }
                    }}
                  />
                )}
              </>
            )}
          />
          {errors.start_date && (
            <Text style={formStyles.errorText}>
              {errors.start_date.message}
            </Text>
          )}
        </View>

        <View style={formStyles.dateField}>
          <ThemedText colorName="textPrimary" type="default">
            Fim da viagem:
          </ThemedText>
          <Controller
            control={control}
            name="end_date"
            render={({ field: { onChange, value } }) => (
              <>
                <TouchableOpacity
                  style={[
                    formStyles.dateInput,
                    { borderColor: borderColor },
                    errors.end_date && formStyles.inputError,
                  ]}
                  onPress={() => setShowEndDatePicker(true)}
                >
                  <Ionicons
                    name="calendar-outline"
                    size={24}
                    color={iconColor}
                  />
                  <ThemedText colorName="textTerciary" type="default">
                    {value ? value.toLocaleDateString("pt-BR") : "Selecione..."}
                  </ThemedText>
                </TouchableOpacity>

                {showEndDatePicker && (
                  <DateTimePicker
                    value={value || new Date()}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={(event, selectedDate) => {
                      setShowEndDatePicker(false);
                      if (selectedDate) {
                        onChange(selectedDate);
                      }
                    }}
                  />
                )}
              </>
            )}
          />
          {errors.end_date && (
            <Text style={formStyles.errorText}>{errors.end_date.message}</Text>
          )}
        </View>
      </View>

      {/* 5. Descrição */}
      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, onBlur, value } }) => (
          <ThemedInput
            label="Descrição:"
            placeholder="Detalhes sobre a viagem, como roteiros, dicas, etc."
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.description?.message}
            multiline={true}
            numberOfLines={5}
          />
        )}
      />
      <ThemedText colorName="textPrimary" type="default">
        Anexe uma imagem do local
      </ThemedText>
      <Controller
        control={control}
        name="image_uri"
        render={({ field: { onChange, value } }) => (
          <TouchableOpacity
            style={[
              formStyles.imagePicker,
              { borderColor: borderColor },
              errors.image_uri && formStyles.inputError,
            ]}
            onPress={() => pickImage(onChange)}
          >
            {value ? (
              <Image source={{ uri: value }} style={formStyles.previewImage} />
            ) : (
              <>
                <Ionicons
                  name="cloud-upload-outline"
                  size={24}
                  color={iconColor}
                />
                <ThemedText
                  colorName="textSecondary"
                  type="default"
                  style={{ textAlign: "center" }}
                >
                  Clique para enviar uma imagem
                </ThemedText>
              </>
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const formStyles = StyleSheet.create({
  formContainer: {
    width: "100%",
    gap: 16,
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
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  dateField: {
    flex: 1,
    gap: 8,
  },
  imagePicker: {
    height: 160,
    width: 160,
    borderWidth: 2,
    alignSelf: "center",
    borderStyle: "dashed",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    gap: 8,
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  inputError: {
    borderColor: "#EF4444",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: 4,
    marginBottom: 8,
  },
});
