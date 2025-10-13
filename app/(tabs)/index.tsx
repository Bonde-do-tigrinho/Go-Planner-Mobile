import { Image } from 'expo-image';
import { Platform, StyleSheet, Text, View, Button } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import { BtnThemeToggleButton } from '@/components/ui/btnToggleTheme';
import { ScrollView } from 'react-native-gesture-handler';
import Header from '@/components/Header';
import GradientText from '@/components/GradientText';


export default function HomeScreen() {
  //resetar o AsyncStorage para eu poder ver a tela de onboarding
  const user = {
    name: 'Nicolas Yanase',
    avatar: 'https://avatars.githubusercontent.com/u/63155478?v=4',
  }
  
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

            <GradientText>
              Olá, {user.name}
            </GradientText>
          </View>
        </Header>
       <View>
        oi
       </View>
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
  }
});
