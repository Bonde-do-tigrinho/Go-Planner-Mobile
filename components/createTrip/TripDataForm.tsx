import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Platform 
} from 'react-native';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { CreateTripFormData } from '../../app/createTrip'; 

// Importa os pacotes de seleção de data e imagem
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

// Componentes de ícone simples para manter o código limpo
const CalendarIcon = () => <Text>📅</Text>;
const CloudIcon = () => <Text>☁️</Text>;

type TripDataFormProps = {
  control: Control<CreateTripFormData>;
  errors: FieldErrors<CreateTripFormData>;
}

export function TripDataForm({ control, errors }: TripDataFormProps) {
  
  // Estado para controlar a visibilidade dos seletores de data
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  // Função para abrir a galeria e selecionar uma imagem
  const pickImage = async (onChange: (uri: string) => void) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Desculpe, precisamos de permissão para acessar suas fotos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      // Atualiza o formulário com a URI da imagem selecionada
      onChange(result.assets[0].uri);
    }
  };

  return (
    <View style={formStyles.formContainer}>
      {/* 1. Nome da sua viagem */}
      <Text style={formStyles.label}>Nome da sua viagem:</Text>
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[ formStyles.input, errors.name && formStyles.inputError ]}
            placeholder="Ex: Viagem para o Japão"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.name && (
        <Text style={formStyles.errorText}>{errors.name.message}</Text>
      )}

      {/* 2. Local de partida */}
      <Text style={formStyles.label}>Local de partida:</Text>
      <Controller
        control={control}
        name="departure_location"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[ formStyles.input, errors.departure_location && formStyles.inputError ]}
            placeholder="Ex: São Paulo, Brasil"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.departure_location && (
        <Text style={formStyles.errorText}>{errors.departure_location.message}</Text>
      )}

      {/* 3. Local de destino */}
      <Text style={formStyles.label}>Local de destino:</Text>
      <Controller
        control={control}
        name="destination"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[ formStyles.input, errors.destination && formStyles.inputError ]}
            placeholder="Ex: Tóquio, Japão"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.destination && (
        <Text style={formStyles.errorText}>{errors.destination.message}</Text>
      )}

      {/* 4. Datas (Início e Fim) */}
      <View style={formStyles.dateRow}>
        <View style={formStyles.dateField}>
          <Text style={formStyles.label}>Início da viagem:</Text>
          <Controller
            control={control}
            name="start_date"
            render={({ field: { onChange, value } }) => (
              <>
                <TouchableOpacity 
                  style={[formStyles.dateInput, errors.start_date && formStyles.inputError]} 
                  onPress={() => setShowStartDatePicker(true)} 
                >
                  <CalendarIcon />
                  <Text>{value ? value.toLocaleDateString('pt-BR') : "Selecione..."}</Text>
                </TouchableOpacity>

                {showStartDatePicker && (
                  <DateTimePicker
                    value={value || new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
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
            <Text style={formStyles.errorText}>{errors.start_date.message}</Text>
          )}
        </View>

        <View style={formStyles.dateField}>
          <Text style={formStyles.label}>Fim da viagem:</Text>
          <Controller
            control={control}
            name="end_date"
            render={({ field: { onChange, value } }) => (
              <>
                <TouchableOpacity 
                  style={[formStyles.dateInput, errors.end_date && formStyles.inputError]} 
                  onPress={() => setShowEndDatePicker(true)}
                >
                  <CalendarIcon />
                  <Text>{value ? value.toLocaleDateString('pt-BR') : "Selecione..."}</Text>
                </TouchableOpacity>

                {showEndDatePicker && (
                  <DateTimePicker
                    value={value || new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
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
      <Text style={formStyles.label}>Descrição:</Text>
      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[formStyles.input, formStyles.multilineInput]}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            multiline
            numberOfLines={4}
            placeholder="Detalhes sobre a viagem, como roteiros, dicas, etc."
          />
        )}
      />

      {/* 6. Anexar Imagem */}
      <Text style={formStyles.label}>Anexe uma imagem do local</Text>
      <Controller
        control={control}
        name="image_uri"
        render={({ field: { onChange, value } }) => (
          <TouchableOpacity 
            style={[formStyles.imagePicker, errors.image_uri && formStyles.inputError]}
            onPress={() => pickImage(onChange)}
          >
            {value ? (
              <Image source={{ uri: value }} style={formStyles.previewImage} />
            ) : (
              <>
                <CloudIcon />
                <Text>Clique para enviar uma imagem</Text>
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
    width: '100%',
    gap: 10,
  },
  label: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    minHeight: 50,
  },
  multilineInput: {
    height: 120,
    textAlignVertical: 'top',
    paddingVertical: 12,
  },
  dateInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  dateField: {
    flex: 1,
  },
  imagePicker: {
    height: 150,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  inputError: {
    borderColor: '#EF4444', // Vermelho mais suave
    borderWidth: 1.5,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
  },
});
