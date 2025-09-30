import React, { useState } from 'react';
import {
  StyleSheet, ScrollView, Pressable, KeyboardAvoidingView, Platform, SafeAreaView, View, Image
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useRouter } from 'expo-router';
import { ThemedInput } from '@/components/themed-input';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import Button from '@/components/CustomButton';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/use-theme-color';

const registerSchema = z.object({
  name: z.string() .trim() // 1. Remove espaços extras do início e do fim
    .min(3, { message: 'O nome deve ter pelo menos 3 caracteres.' }) // 2. Validação de tamanho mínimo
    .refine(
      (name) => name.split(' ').length >= 2, // 3. Verifica se há pelo menos duas palavras
      { message: 'Por favor, insira seu nome completo (nome e sobrenome).' }
    ),
  email: z.string().email('Por favor, insira um e-mail válido.'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.'),
  passwordConfirm: z.string().min(6, 'A senha devem ser iguais.'),
  
})// NOVO: Adicionando a verificação de senhas
.refine((data) => data.password === data.passwordConfirm, {
  message: "As senhas não correspondem",
  path: ["passwordConfirm"], // Mostra o erro no campo de confirmação de senha
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const router = useRouter();
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
    resolver: zodResolver (registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    console.log('Enviando dados de cadastro:', data);
    router.push({
        pathname: '/(auth)/verify-code',
        params: { email: data.email, name: data.name }
      });
  };

  const iconColor = useThemeColor({}, 'primary');
  return (
    <ThemedView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* MUDANÇA: Usando ThemedText para o título */}
          <ThemedText type="title" colorName='textPrimary' style={styles.title}>
            Crie sua conta
            <Ionicons name={'ellipse'} color={iconColor} size={10} />
          </ThemedText>

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <ThemedInput
                textInputName='textSecondary'
                label="Nome:"
                icon="person-outline"
                placeholder="Digite seu nome"
                keyboardType="default"
                autoCapitalize="none"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <ThemedInput
                textInputName='textSecondary'
                label="E-mail:"
                icon="mail-outline"
                placeholder="Digite seu e-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <ThemedInput
                textInputName='textSecondary'
                label="Senha:"
                icon="lock-closed-outline"
                placeholder="Digite sua senha"
                secureTextEntry
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.password?.message}
                isPassword
              />
            )}
          />

          <Controller
            control={control}
            name="passwordConfirm"
            render={({ field: { onChange, onBlur, value } }) => (
              <ThemedInput
                textInputName='textSecondary'
                label="Senha:"
                icon="lock-closed-outline"
                placeholder="Confirme sua senha"
                secureTextEntry
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.passwordConfirm?.message}
                isPassword
              />
            )}
          />
          <View style={styles.separator}/>
          <Button
            title="Cadastrar"
            onPress={handleSubmit(onSubmit)}
            disabled= {isSubmitting}
            variant="gradient-primary"
            iconName="arrow-forward"
            size="xl"
            width="100%"
          />

          <View style={styles.separatorContainer}>
            <ThemedView style={styles.line} bgName="borderPrimary" />
            <ThemedText colorName="icon" style={styles.separatorText}>ou</ThemedText>
            <ThemedView style={styles.line} bgName="borderPrimary" />
          </View>
          
          {/* MUDANÇA: Botões sociais agora usam componentes temáticos */}
          <Pressable onPress={() => console.log('Login com Google')}>
            <ThemedView style={styles.socialButton} borderName="borderPrimary" borderWidth={1}>
              <Image source={require('@/assets/images/google.png')} style={styles.socialIcon} />
              <ThemedText  colorName='textTerciary'>Continue com Google</ThemedText>
            </ThemedView>
          </Pressable>

          <Pressable onPress={() => console.log('Login com Facebook')}>
            <ThemedView style={styles.socialButton} borderName="borderPrimary" borderWidth={1}>
              <Image source={require('@/assets/images/facebook.png')} style={styles.socialIcon} />
              <ThemedText colorName='textTerciary'>Continue com Facebook</ThemedText>
            </ThemedView>
          </Pressable>

        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  title: {
    marginBottom: 40,
  },
  forgotPassword: {
    textAlign: 'right',
    marginBottom: 24,
    fontWeight: '500',
    fontSize: 14
  },
  separator: {
    marginTop: 20
  },
  buttonDisabled: {
    backgroundColor: '#ccc', // Podemos criar uma cor 'disabled' no tema
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 32,
  },
  line: {
    flex: 1,
    height: 1,
  },
  separatorText: {
    marginHorizontal: 12,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    paddingVertical: 14,
    marginBottom: 12,
  },
  socialIcon: {
    width: 24,
    height: 24,
    marginRight: 16,
  },
});
      
