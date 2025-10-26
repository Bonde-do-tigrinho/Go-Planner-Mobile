import React from 'react'
import { StyleSheet, View, ScrollView  } from 'react-native'
import { ThemedView } from '../themed-view'
import { CreateTripFormData } from '../../app/createTrip'; 
import { Control, FieldErrors } from 'react-hook-form';
import { Link } from 'expo-router';
import { ThemedText } from '../themed-text';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/use-theme-color';

interface tripActivitiesProps {
  // O 'control' e 'errors' para os campos DESTA aba
  control: Control<CreateTripFormData>;
  errors: FieldErrors<CreateTripFormData>;
  
  // Os dados da aba anterior que queremos exibir
  destination: string;
  startDate?: Date;
  endDate?: Date;
};

export default function TripActivities({control, errors, destination, endDate, startDate} : tripActivitiesProps) {
  const iconColor = useThemeColor({}, "secondary");

  function formatDateRange(start?: Date, end?: Date) {
    if (!start || !end) {
      return <ThemedText type='sm' colorName="textSecondary">Selecione a data em <ThemedText isSemiBold type='sm' colorName='textPrimary'>Dados</ThemedText></ThemedText>;
    }
    // Formata para DD/MM/YYYY
    const startDateFormatted = start.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const endDateFormatted = end.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    return `${startDateFormatted} - ${endDateFormatted}`;
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <ThemedView bgName='bgPrimary' style={styles.cardInfo}>
          <View style={{display:"flex", flexDirection:"row",gap:2}}>
            <Ionicons
              name="pin"
              size={20}
              color={iconColor}
              style={{ paddingRight: 4 }}
            />
            {

            <ThemedText colorName="textPrimary" type="sm" isSemiBold={true}>
              {destination ? destination : "Sem destino"  }
            </ThemedText>
            }
          </View>

          <View style={{display:"flex", flexDirection:"row",gap:2}}>
            <Ionicons
              name="calendar"
              size={20}
              color={iconColor}
              style={{ paddingRight: 4 }}
            />
            {
            <ThemedText colorName="textTerciary" type="sm" isSemiBold={true}>
              {formatDateRange(startDate, endDate)}
            </ThemedText>
            }
          </View>
        </ThemedView>
      </ScrollView>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems:"center"
  },
  scrollContainer:{
    paddingVertical: 8,
    paddingHorizontal:1,
    width:"100%"
  },
  cardInfo:{
    paddingHorizontal: 16,
    paddingVertical: 10,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 3,
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    zIndex:10,
    width: "100%"
  }
})
