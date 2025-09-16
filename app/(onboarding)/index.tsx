// app/(onboarding)/index.tsx
import React, { useRef, useState } from 'react';
import { View, ScrollView, Text, StyleSheet, useWindowDimensions, Pressable } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image, ImageBackground } from 'expo-image'; // Usar ImageBackground da expo-image para melhor performance
import { BlurView } from 'expo-blur';
// Dados para as telas de onboarding
const onboardingSteps = [
  {
    id: '1',
    image: require('@/assets/images/onboarding/onboarding01.png'), // Substitua pelos caminhos corretos
    title: 'Bem vindo ao\nGo.planner',
    description: 'Vamos começar sua jornada.',
  },
  {
    id: '2',
    image: require('@/assets/images/onboarding/onboarding02.png'),
    title: 'Descubra',
    description: 'Encontre destinos incríveis que combinam com você.',
  },
  {
    id: '3',
    image: require('@/assets/images/onboarding/onboarding03.png'),
    title: 'Planeje',
    description: 'Organize cada detalhe e viaje sem preocupações.',
  },
  {
    id: '4',
    image: require('@/assets/images/onboarding/onboarding04.png'),
    title: 'Explore',
    description: 'Viva experiências únicas em cada lugar.',
  },
];

export default function OnboardingScreen() {
  const { width } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  // Função chamada ao finalizar o onboarding
  const handleComplete = async () => {
    try {
      await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
      router.replace("/(tabs)"); // Navega para a tela de login/cadastro
    } catch (e) {
      console.error('Erro ao salvar no AsyncStorage', e);
    }
  };

  // Função para rolar para o próximo slide
  const handleNext = () => {
    if (activeIndex < onboardingSteps.length - 1) {
      scrollRef.current?.scrollTo({ x: width * (activeIndex + 1), animated: true });
    }
  };
  
  // Atualiza o índice ativo ao rolar
  const handleScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  const isLastStep = activeIndex === onboardingSteps.length - 1;

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        bounces={false}
      >
        {onboardingSteps.map((step) => (
          <ImageBackground key={step.id} source={step.image} style={[styles.slide, { width }]}>

            <View style={styles.overlay} />
            <Image
              source={require('@/assets/images/logo-white.svg')}
              style={styles.logo}
            />
            <Text style={styles.title}>{step.title}</Text>
            <Text style={styles.description}>{step.description}</Text>
          </ImageBackground>
        ))}
      </ScrollView>
      
      {/* Indicador de progresso e botão */}
      <BlurView 
        style={[styles.footer, { width }]}
        tint="dark" intensity={80}>
        <View style={styles.dotsContainer}>
          {onboardingSteps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                { backgroundColor: index === activeIndex ? '#FF5733' : '#FFF' },
              ]}
            />
          ))}
        </View>

        <Pressable style={styles.button} onPress={isLastStep ? handleComplete : handleNext}>
          <Text style={styles.buttonText}>{isLastStep ? 'Começar' : 'Continuar'}</Text>
        </Pressable>
      </BlurView>
    </View>
  );
}

// ESTILOS (Ajuste as cores, fontes e espaçamentos para corresponder ao seu design)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  slide: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 140
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Overlay escuro para legibilidade
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#eee',
    textAlign: 'center',
  },
  logo: {
    width: 67,
    height: 80,
    marginBottom: 8
  },
  footer: {
    position: 'absolute',
    bottom:0,
    left: 0,
    paddingHorizontal: 20,
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 40,
    borderRadius: 16,
    overflow: 'hidden', // Importante para o borderRadius funcionar com o blur
    // Cor de fundo semitransparente para o efeito de vidro fosco
    
  },
  dotsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
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
});