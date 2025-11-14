import React, { useState } from 'react'
import { StyleSheet, View, ScrollView, Text, Pressable  } from 'react-native'
import { ThemedView } from '../themed-view'
import { CreateTripFormData } from '../../app/createTrip'; 
import { Control, FieldErrors } from 'react-hook-form';
import { Link, router } from 'expo-router';
import { ThemedText } from '../themed-text';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/use-theme-color';
import CardInfo from './CardInfo';
import ListTrips from '../home/listTrips';
import SheetModal from '../modal';

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
  const btnPlus = useThemeColor({}, "btnPlus");
  const bgBtnPlus = useThemeColor({}, "bgBtnPlus");
  const iconColor = useThemeColor({}, "textTerciary");
  
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModalVisible = () => {
    setModalVisible(!isModalVisible)
  }
  const activitiesList = [
  {
    "id": "1",
    "desc": "Churrasco na praia",
    "horario": "12:00",
    "concluida": true
  },
  {
    "id": "2",
    "desc": "Reunião de projeto",
    "horario": "09:00",
    "concluida": true
  },
  {
    "id": "3",
    "desc": "Ir à academia",
    "horario": "18:00",
    "concluida": false
  },
  {
    "id": "4",
    "desc": "Comprar leite",
    "horario": "17:30",
    "concluida": false
  },
  {
    "id": "5",
    "desc": "Consulta no dentista",
    "horario": "14:00",
    "concluida": true
  },
  {
    "id": "6",
    "desc": "Estudar para a prova",
    "horario": "20:00",
    "concluida": false
  }
]

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.addButtonContainer}
        onPress={() => toggleModalVisible()}
      >
        <View style={[styles.addButton, { backgroundColor: bgBtnPlus }]}>
          <ThemedText type="sm" isSemiBold={true} colorName="secondary" darkColor="#fff">
            {" "}
            Nova viagem{" "}
          </ThemedText>
          <Ionicons name="add" size={40} color={btnPlus} />
        </View>
      </Pressable>
      <ScrollView style={styles.scrollContainer}>
        <CardInfo
          destination={destination}
          startDate={startDate}
          endDate={endDate}
        />
        <View style={{marginTop: 20}} >
          <ThemedText colorName='textPrimary' type='default' isSemiBold > Dia 20</ThemedText>
          <View style={styles.listCardActivities}>
              {
                activitiesList.map(activity => (
                  <ThemedView key={activity.id} style={styles.containerCard}  borderWidth={1} borderName='borderPrimary'>
                    <View style={{display: "flex", flexDirection: "row", gap:8, alignItems: "center"}}>
                      {
                        activity.concluida === true ?
                        <ThemedView bgName='primary' style={[styles.check, {padding: 2} ]}>
                          <Ionicons
                            name="checkmark"
                            size={18}
                            color="white"
                          />
                        </ThemedView>
                        :
                         <ThemedView borderName='primary' borderWidth={0.5} style={[styles.notCheck, {padding: 2}]}>
                          
                        </ThemedView >
                      }
                      <ThemedText type='sm' colorName='textSecondary'>
                        {activity.desc}
                      </ThemedText>
                    </View>

                    <View style={{display: "flex", flexDirection: "row", gap:10, alignItems: "center"}}>
                      <ThemedText type='px' colorName='textSecondary'>
                        {activity.horario}
                      </ThemedText>
                      <ThemedView  bgName='bgTerciary' style={{height: 22, width: 2, borderRadius: 4}}/>
                      <Ionicons
                          name="trash"
                          size={20}
                          color={iconColor}
                        />
                    </View>
                  </ThemedView>
                  ))
            } 
          </View>
        </View>

        <View style={{marginTop: 20}} >
          <ThemedText colorName='textPrimary' type='default' isSemiBold > Dia 21</ThemedText>
          <View style={styles.listCardActivities}>
              {
                activitiesList.map(activity => (
                  <ThemedView key={activity.id} style={styles.containerCard}  borderWidth={1} borderName='borderPrimary'>
                    <View style={{display: "flex", flexDirection: "row", gap:8, alignItems: "center"}}>
                      {
                        activity.concluida === true ?
                        <ThemedView bgName='primary' style={[styles.check, {padding: 2} ]}>
                          <Ionicons
                            name="checkmark"
                            size={18}
                            color="white"
                          />
                        </ThemedView>
                        :
                         <ThemedView borderName='primary' borderWidth={0.5} style={[styles.notCheck, {padding: 2}]}>
                          
                        </ThemedView >
                      }
                      <ThemedText type='sm' colorName='textSecondary'>
                        {activity.desc}
                      </ThemedText>
                    </View>

                    <View style={{display: "flex", flexDirection: "row", gap:10, alignItems: "center"}}>
                      <ThemedText type='px' colorName='textSecondary'>
                        {activity.horario}
                      </ThemedText>
                      <ThemedView  bgName='bgTerciary' style={{height: 22, width: 2, borderRadius: 4}}/>
                      <Ionicons
                          name="trash"
                          size={20}
                          color={iconColor}
                        />
                    </View>
                  </ThemedView>
                  ))
            } 
          </View>
        </View>
      </ScrollView>
      <SheetModal
        visible={isModalVisible}
        onClose={toggleModalVisible}
        title="Criar nova atividade"
      >
        <Text>Modal de atividades</Text>
      </SheetModal>
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
  check:{
    width: 20,
    height: 20,
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: "center"
  },
  notCheck:{
    width: 20,
    height: 20,
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  listCardActivities: {
    marginTop: 6,
    display: "flex",
    flexDirection: "column",
    gap: 12
  },
  containerCard: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 8
  }
})
