import React from 'react'
import CardTrip from '../cardTrip';
import { StyleSheet, View } from 'react-native';
type Guest = {
  id: number;
  name: string;
  avatar: string; // URL da imagem do avatar
}
type userTrips = {
  id: number;
  name: string;
  local: string;
  dateFrom: string;
  dateTo: string;
  image: number; // O resultado de require() no React Native é um número (asset reference)
  guest?: Guest[]; // Um array de objetos do tipo Guest
}
interface listTripsProps {
  userTrips: userTrips[]
}
export default function ListTrips({userTrips} : listTripsProps ) {
  return (
    <View style={styles.container}>
      {
        userTrips.map(trip => (
          <CardTrip key={trip.id} {...trip} />
        ))
      }
    </View>
  )
}
const styles = StyleSheet.create({
  container:{
    display: "flex",
    gap:12
  },
 
})