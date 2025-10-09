// src/features/profile/components/EditProfileForm.tsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ThemedInput } from '@/components/themed-input';
import Button from '@/components/CustomButton';

// Schema de validação com Zod
const editProfileSchema = z.object({
  phone: z
    .string()
    .min(1, 'Número de telefone é obrigatório')
    .regex(
      /^\+?[\d\s\-()]+$/,
      'Formato de telefone inválido'
    ),
  email: z
    .string()
    .min(1, 'E-mail é obrigatório')
    .email('Por favor, insira um e-mail válido'),
  password: z
    .string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres')
    .optional()
    .or(z.literal('')),
});

type EditProfileFormData = z.infer<typeof editProfileSchema>;

type EditProfileFormProps = {
  initialData?: {
    phone: string;
    email: string;
  };
  onSubmit: (data: EditProfileFormData) => void;
};

export default function EditProfileForm({
  initialData = {
    phone: '+55 11 97730-4028',
    email: 'nicolasyanase18@gmail.com',
  },
  onSubmit,

}: EditProfileFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      phone: initialData.phone,
      email: initialData.email,
      password: '',
    },
  });

  const handleFormSubmit = (data: EditProfileFormData) => {
    console.log('Dados do formulário:', data);
    onSubmit(data);
  };

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="phone"
        render={({ field: { onChange, onBlur, value } }) => (
          <ThemedInput
            textInputName="textSecondary"
            label="Número de telefone"
            icon="call-outline"
            placeholder="Digite seu telefone"
            keyboardType="phone-pad"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.phone?.message}
            returnKeyType="next"
          />
        )}
      />

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <ThemedInput
            textInputName="textSecondary"
            label="Email"
            icon="mail-outline"
            placeholder="Digite seu e-mail"
            keyboardType="email-address"
            autoCapitalize="none"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.email?.message}
            returnKeyType="next"
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <ThemedInput
            textInputName="textSecondary"
            label="Senha"
            icon="lock-closed-outline"
            placeholder="Digite uma nova senha (opcional)"
            isPassword={true}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.password?.message}
            returnKeyType="done"
          />
        )}
      />

      <View style={styles.buttonContainer}>
        <Button
          title="Salvar alterações"
          onPress={handleSubmit(handleFormSubmit)}
          disabled={isSubmitting}
          variant="gradient-primary"
          size="xl"
          width="100%"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  buttonContainer: {
    marginTop: 8,
    gap: 12,
  },
  cancelButton: {
    marginTop: 0,
  },
});