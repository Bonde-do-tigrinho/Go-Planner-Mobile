import React from 'react'
import { ThemedView } from '../themed-view'
import { StyleSheet, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useThemeColor } from '@/hooks/use-theme-color';
import { ThemedText } from '../themed-text';

interface cardInfoProps {
  destination: string;
  startDate?: Date;
  endDate?: Date;
}
export default function CardInfo({destination, endDate, startDate} : cardInfoProps) {
  
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
     <ThemedView borderName='borderPrimary'  borderWidth={1} bgName='bgPrimary' style={styles.cardInfo}>
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
          !startDate && !endDate ? 
          <ThemedText colorName="textTerciary" type="sm" isSemiBold={true}>
            {formatDateRange(startDate, endDate)}
          </ThemedText>
          :
          <ThemedText colorName="textPrimary" type="sm" isSemiBold={true}>
            {formatDateRange(startDate, endDate)}
          </ThemedText>
        }
      </View>
    </ThemedView>
  )
}
const styles = StyleSheet.create({
  cardInfo:{
    paddingHorizontal: 10,
    paddingVertical: 10,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
    borderRadius: 16,
    shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 4,
    // },
    // elevation: 3,
    // shadowOpacity: 0.3,
    // shadowRadius: 4.65,
    zIndex:10,
    width: "100%"
  }
})