import { Stack } from 'expo-router';
import React from 'react';

export default function AuthLayout() {
  return (
    // O Stack gerenciará o histórico e o botão de voltar automaticamente
    <Stack
      screenOptions={{
        headerShown: false, // Queremos o header para o botão "voltar"
        headerStyle: {
          backgroundColor: '#151718', // Cor de fundo do header
        },
        headerTintColor: '#fff', // Cor da seta e do título
        headerTitle: '', // Deixa o título em branco para um visual limpo
        headerShadowVisible: false, // Remove a sombra sob o header
      }}
    />
  );
}