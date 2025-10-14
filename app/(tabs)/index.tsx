import { Image } from 'expo-image';
import { Platform, StyleSheet, Text, View, Button, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import { BtnThemeToggleButton } from '@/components/ui/btnToggleTheme';
import Header from '@/components/Header';
import GradientText from '@/components/GradientText';
import ThemedTitle from '@/components/themed-title';


export default function HomeScreen() {
  //resetar o AsyncStorage para eu poder ver a tela de onboarding
  const user = {
    name: 'Nicolas Yanase',
    avatar: 'https://avatars.githubusercontent.com/u/63155478?v=4',
  }
  const popularTrips = [
    {
      id: 1,
      country: "USA",
      local: "Disney",
      image: "assets/popularTrips/disney.png"
    },

  ]
  return (
  <>
    <ThemedView style={styles.container} bgName="bgPrimary">
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Header>
          <View style={styles.nameTitle}>
            <Image
              source={{ uri: user.avatar }}
              style={styles.avatar}
            />

            <ThemedText colorName='primary' type='subtitle' >
               Olá, {user.name}
            </ThemedText >
            {/* <GradientText>
              Olá, {user.name}
            </GradientText> */}
          </View>
        </Header>
        <ThemedView style={styles.mainContainer}>
          <ThemedTitle title='Viagens Populares' ballColor='primary'/>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.containerPopularTrips}
          >
            {
              popularTrips.map(trip => (
                <View key={trip.id} style={styles.containerTrip} >
                  <Image
                    source={{ uri: trip.image }}
                    style={styles.trip}
                  />
                  <ThemedText colorName='textSecondary'> {trip.local} - {trip.country} </ThemedText>
                </View>
              ))
            }
          </ScrollView>
        </ThemedView> 
      </ScrollView>
    </ThemedView>
    <StatusBar style="auto" />
  </>
  );
}

const styles = StyleSheet.create({
 container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    paddingVertical: 24, // Espaçamento vertical para o conteúdo não colar no topo/fundo
    paddingHorizontal: 16, // Espaçamento horizontal nas laterais da tela
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
  nameTitle: {
    display: "flex",
    alignItems: "center",
    gap: 10
  },
  mainContainer:{
    display: "flex",
    alignItems: "center",
    gap: 16
  },
  containerPopularTrips:{
    display: "flex",
    gap: 10
  },
  containerTrip: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column"
  },
  trip: {
    width: 120,

    height: 120,
    borderRadius: 50,
  }
});
