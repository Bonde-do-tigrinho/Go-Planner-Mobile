import TabSelector from "@/components/tab-selector"
import { ThemedView } from "@/components/themed-view"
import { useState } from "react"
import { useForm, useWatch } from "react-hook-form" 
import { ScrollView, StyleSheet, View, Button, Text, TextInput, TouchableOpacity, Pressable } from "react-native"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { TripDataForm } from "@/components/createTrip/TripDataForm"
import TripActivities from "@/components/createTrip/TripActivities"
import { ThemedText } from "@/components/themed-text"
import { Ionicons } from '@expo/vector-icons'
import { useThemeColor } from '@/hooks/use-theme-color'
import SheetModal from "@/components/modal"

const guestSchema = z.object({
  id: z.string(), 
  email: z.string().email({ message: "Formato de e-mail inválido." }),
  role: z.enum(['Visualizar', 'Editor']),
});

const activitySchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, { message: "A atividade deve ter um nome." }),
  occurs_at: z.date({ message: "Defina a data e hora." }),
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
  .refine((data) => {
    if (data.start_date && data.end_date) {
      return data.end_date > data.start_date;
    }
    return true; 
  }, {
    message: "A data de fim deve ser após a data de início.",
    path: ['end_date'],
  });

export type CreateTripFormData = z.infer<typeof createTripSchema>;

export default function CreateTrip(){
  const tabs = ["Dados", "Atividades", "Convidar"]
  
  const [activeTab, setActiveTab] = useState(tabs[0])
  const [isModalVisible, setModalVisible] = useState(false);
  
  const btnPlus = useThemeColor({}, "btnPlus");
  const bgBtnPlus = useThemeColor({}, "bgBtnPlus");

  const toggleModalVisible = () => {
    setModalVisible(!isModalVisible)
  }

  const { 
    control, 
    handleSubmit,
    formState: { errors } 
  } = useForm<CreateTripFormData>({
    resolver: zodResolver(createTripSchema),
    defaultValues: {
      name: "",
      departure_location: "",
      destination: "",
      description: "",
      activities: [],
      guests: [],
    }
  });

  const destination = useWatch({ control, name: 'destination' });
  const startDate = useWatch({ control, name: 'start_date' });
  const endDate = useWatch({ control, name: 'end_date' });

  const handleSaveTrip = (data: CreateTripFormData) => {
    console.log("Dados da viagem validados:", data)
  }

  const renderTabContent = () => {
    switch(activeTab){
      case "Dados":
        return <TripDataForm 
                  control={control} 
                  errors={errors} 
                />
      case "Atividades":
        return  <TripActivities 
                  control={control}
                  errors={errors}
                  destination={destination}
                  startDate={startDate}
                  endDate={endDate}
                />
      case "Convidar":
        return <View><Text>Conteúdo da Aba Convidar</Text></View>
    }
  }
 
  return(
    <ThemedView style={styles.mainContainer}  bgName="bgPrimary">
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
            <ThemedText type="sm" isSemiBold={true} colorName="secondary" darkColor="#fff">
              Nova viagem
            </ThemedText>
            <Ionicons name="add" size={40} color={btnPlus} />
          </View>
        </Pressable>
      )}

      <SheetModal
        visible={isModalVisible}
        onClose={toggleModalVisible}
        title="Criar nova"
      >
        <Text>Modal de atividades</Text>
      </SheetModal>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  mainContainer: { 
    flex: 1,
    position: 'relative'
  },
  scrollContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 20,
  },
  saveButton: {
    backgroundColor: '#FF4500',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  fabContainer: {
    position: "absolute",
    bottom: 100,
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