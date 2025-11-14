import { SafeAreaView, Text, StyleSheet, View, Alert } from 'react-native';
import React, { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

import { ThemedText } from '@/components/themed-text';
import Button from '@/components/CustomButton'; // Seu componente de botão
import { ThemedView } from '@/components/themed-view';

const CELL_COUNT = 6;

export default function VerifyCodeScreen() {
  const { name, email } = useLocalSearchParams<{ name:string, email: string }>();
  const [value, setValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const router = useRouter();
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`http://192.168.15.10:8082/api/users/confirm-account`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                codigo: value
            }),
        });

        if (response.ok) {
           router.push('/(auth)/login');
        } else {
        console.log('Código incorreto!');
        Alert.alert('Erro', 'O código de verificação está incorreto. Tente novamente.');
      }
    } catch (error) {
      console.error('Falha na verificação', error);
      alert('Código inválido ou expirado. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ThemedView lightBg='#fff' darkBg='#fff'  style={styles.container}>
      <ThemedText type="title" colorName='textPrimary'>Estamos quase lá {name} </ThemedText>
      <ThemedText style={styles.subtitle} type='default' colorName='textSecondary'>
        Enviamos um código de verificação para {email} 

      </ThemedText>

      <CodeField
        ref={ref}
        {...props}
        value={value}
        onChangeText={setValue}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={({ index, symbol, isFocused }) => (
          <View
            key={index}
            style={[styles.cell, isFocused && styles.focusCell]}
            onLayout={getCellOnLayoutHandler(index)}
          >
            <Text style={styles.cellText}>
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          </View>
        )}
      />

      <Button
        title="Continuar"
        onPress={handleSubmit}
        disabled={value.length !== CELL_COUNT || isSubmitting}
        variant="gradient-primary"
        iconName="arrow-forward"
        size="xl"
        width="100%"
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  // Adicione seus estilos aqui para combinar com o design
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  subtitle: { marginVertical: 18 },
  codeFieldRoot: { marginTop: 20, marginBottom: 40 },
  cell: {
    width: 40,
    height: 50,
    lineHeight: 48,
    fontSize: 24,
    borderWidth: 2,
    borderColor: '#ccc',
    textAlign: 'center',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  focusCell: {
    borderColor: '#FF0049', 
  },
  cellText: {
    fontSize: 24,
    color: '#333',
    textAlign: 'center',
  }
});