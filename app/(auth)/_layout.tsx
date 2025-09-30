import { Stack } from 'expo-router';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
export default function AuthLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: true, // Queremos o header para o botão "voltar"
          headerStyle: {
            backgroundColor: '#fff', // Cor de fundo do header
          },
          headerTintColor: '#999', // Cor da seta e do título
          headerTitle: '', // Deixa o título em branco para um visual limpo
          headerShadowVisible: false, // Remove a sombra sob o header
        }}
      >

        {/* 2. Opção específica APENAS para a tela 'index' */}
        <Stack.Screen
          name="index"
          options={{
            headerShown: false, // Esconde o header somente nesta tela
          }}
        />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}