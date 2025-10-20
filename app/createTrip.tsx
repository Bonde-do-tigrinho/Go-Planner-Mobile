import TabSelector from "@/components/tab-selector"
import { ThemedView } from "@/components/themed-view"
import { useState } from "react"
import { useForm } from "react-hook-form" 
import { ScrollView, StyleSheet, View, Button, Text, TextInput, TouchableOpacity } from "react-native"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { TripDataForm } from "@/components/createTrip/TripDataForm"

const guestSchema = z.object({
  id: z.string(), 
  email: z.string().email({ message: "Formato de e-mail inválido." }),
  role: z.enum(['Visualizar', 'Editor']),
});

const activitySchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, { message: "A atividade deve ter um nome." }),
  occurs_at: z.date({ message: "Defina a data e hora." }), // <-- MUDANÇA AQUI
  is_completed: z.boolean(),
});

export const createTripSchema = z
  .object({
    // Aba "Dados"
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
    // Se uma das datas não estiver definida, a validação 'required' (message) acima
    // já terá pego o erro, então podemos retornar true aqui.
    return true; 
  }, {
    message: "A data de fim deve ser após a data de início.",
    path: ['end_date'],
  });

export type CreateTripFormData = z.infer<typeof createTripSchema>;

export default function CreateTrip(){
  const tabs = ["Dados", "Atividades", "Convidar"]
  
  const [activeTab, setActiveTab] = useState(tabs[0])

  const { 
    control, 
    handleSubmit,
    // Pega o 'formState' para acessar os 'errors'
    formState: { errors } 
  } = useForm<CreateTripFormData>({
    // Conecta o Zod ao React Hook Form
    resolver: zodResolver(createTripSchema),
    // Define valores padrão, especialmente para os 'field arrays'
    defaultValues: {
      name: "",
      departure_location: "",
      destination: "",
      description: "",
      activities: [],
      guests: [],
    }
  });
  
  // A função de submit agora recebe os dados 100% tipados e validados
  const handleSaveTrip = (data: CreateTripFormData) => {
    console.log("Dados da viagem validados:", data)
    // Se chegou aqui, os dados passaram na validação do Zod
    // (Lógica de API/mutati on)
  }

  const renderTabContent = () => {
    switch(activeTab){
      case "Dados":
        // --- 4. PASSAR 'errors' PARA O COMPONENTE FILHO ---
        return <TripDataForm control={control} errors={errors} />
      case "Atividades":
        // (Aqui você passaria o control e errors para o 'TripActivitiesForm')
        return <View><Text>Conteúdo da Aba Atividades</Text></View>
      case "Convidar":
         // (Aqui você passaria o control e errors para o 'TripGuestsForm')
        return <View><Text>Conteúdo da Aba Convidar</Text></View>
    }
  }
 
  return(
    <ThemedView style={styles.container}  bgName="bgPrimary">
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <TabSelector
          activeTab={activeTab}
          onTabPress={setActiveTab}
          tabs={tabs}
        />
        
        {renderTabContent()}
      
        <TouchableOpacity 
          style={styles.saveButton} 
          // O handleSubmit aqui vai primeiro rodar o Zod resolver
          // e SÓ VAI chamar 'handleSaveTrip' se tudo for válido.
          onPress={handleSubmit(handleSaveTrip)}
        >
          <Text style={styles.saveButtonText}>Salvar</Text>
        </TouchableOpacity>

      </ScrollView>
    </ThemedView>
  )
}

// (Estilos permanecem os mesmos)
const styles = StyleSheet.create({
  container: { flex: 1 },
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
  }
});