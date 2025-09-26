import { Fonts } from "@/constants/theme"
import { Ionicons } from "@expo/vector-icons"
import { BlurView } from "expo-blur"
import { ImageBackground } from "expo-image"
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native"

export default function AuthScreen(){
  const { width } = useWindowDimensions();
  return(
    <ImageBackground 
      source={require('@/assets/images/background-auth.png')} 
      style={styles.container}
    >
      
      <Text style={styles.title}>Bem vindo ao Go 
        <Ionicons name="ellipse" size={8} color="#FF5733" /> planner
      </Text>
      
      <BlurView 
        style={[styles.footer, { width }]}
        tint="dark" 
        intensity={100}
      >
              <Pressable style={styles.button} onPress={() => {}}>
                <Text style={styles.buttonText}>aa</Text>
              </Pressable>
            </BlurView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)', // Adiciona um overlay escuro para legibilidade
    width: '100%', // Garante que o container de conteúdo também ocupe toda a largura
  },
  title:{
    fontSize: 32,
    color: '#fff',
    marginHorizontal: 68,
    textAlign: 'center',
    fontFamily: Fonts.sansSemiBold,
    marginTop: 130
  },
  footer: {
    position: 'absolute',
    bottom:0,
    left: 0,
    paddingHorizontal: 20,
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 40,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
    height: '60%',
  },
    button: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: '80%',
    alignItems: 'center',
  },
   buttonText: {
    color: '#FF5733',
    fontSize: 16,
    fontWeight: 'bold',
  }, 
})