import { CreateTripApiResponse } from "@/service/api/tripsApi";
import React from "react";
import { StyleSheet, View } from "react-native";
import CardTrip from "../cardTrip";

interface listTripsProps {
  userTrips: CreateTripApiResponse[];
}

export default function ListTrips({ userTrips }: listTripsProps) {
  return (
    <View style={styles.container}>
      {userTrips.map((trip) => (
        <CardTrip
          key={trip.id}
          id={trip.id}
          name={trip.titulo}
          local={trip.localDestino}
          dateFrom={trip.dataPartida}
          dateTo={trip.dataRetorno}
          image={trip.imagem}
          participants={trip.participantes}
        />
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    display: "flex",
    gap: 12,
  },
});
