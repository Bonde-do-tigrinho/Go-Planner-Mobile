// src/features/profile/components/EditProfileForm.tsx

import Button from "@/components/CustomButton";
import { ThemedInput } from "@/components/themed-input";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, StyleSheet, View } from "react-native";
import { z } from "zod";

// Schema de validação com Zod
const editProfileSchema = z
  .object({
    nome: z
      .string()
      .min(1, "Nome é obrigatório")
      .min(3, "Nome deve ter pelo menos 3 caracteres"),
    email: z
      .string()
      .min(1, "E-mail é obrigatório")
      .email("Por favor, insira um e-mail válido"),
    senhaAtual: z.string().optional(),
    novaSenha: z
      .string()
      .min(9, "A nova senha deve ter pelo menos 9 caracteres")
      .optional()
      .or(z.literal("")),
    confirmarSenha: z.string().optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      // Se preencheu senha atual, deve preencher nova senha
      if (data.senhaAtual && data.senhaAtual.length > 0) {
        return data.novaSenha && data.novaSenha.length >= 9;
      }
      return true;
    },
    {
      message: "Você deve preencher a nova senha",
      path: ["novaSenha"],
    }
  )
  .refine(
    (data) => {
      // Se preencheu nova senha, as senhas devem ser iguais
      if (data.novaSenha && data.novaSenha.length > 0) {
        return data.novaSenha === data.confirmarSenha;
      }
      return true;
    },
    {
      message: "As senhas não conferem",
      path: ["confirmarSenha"],
    }
  );

type EditProfileFormData = z.infer<typeof editProfileSchema>;

type EditProfileFormProps = {
  initialData?: {
    nome: string;
    email: string;
  };
  onSubmit: (data: EditProfileFormData) => void;
};

export default function EditProfileForm({
  initialData = {
    nome: "Nome do Usuário",
    email: "usuarioemail@gmail.com",
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
      nome: initialData.nome,
      email: initialData.email,
      senhaAtual: "",
      novaSenha: "",
      confirmarSenha: "",
    },
  });

  const handleFormSubmit = (data: EditProfileFormData) => {
    console.log("Dados do formulário:", data);
    onSubmit(data);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled={true}
    >
      <View style={styles.container}>
        <Controller
          control={control}
          name="nome"
          render={({ field: { onChange, onBlur, value } }) => (
            <ThemedInput
              textInputName="textSecondary"
              label="Nome"
              icon="person-outline"
              placeholder="Digite seu nome"
              autoCapitalize="words"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.nome?.message}
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
          name="senhaAtual"
          render={({ field: { onChange, onBlur, value } }) => (
            <ThemedInput
              textInputName="textSecondary"
              label="Senha atual (opcional)"
              icon="lock-closed-outline"
              placeholder="Digite sua senha atual"
              isPassword={true}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.senhaAtual?.message}
              returnKeyType="next"
            />
          )}
        />

        <Controller
          control={control}
          name="novaSenha"
          render={({ field: { onChange, onBlur, value } }) => (
            <ThemedInput
              textInputName="textSecondary"
              label="Nova senha (opcional)"
              icon="lock-closed-outline"
              placeholder="Digite a nova senha"
              isPassword={true}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.novaSenha?.message}
              returnKeyType="next"
            />
          )}
        />

        <Controller
          control={control}
          name="confirmarSenha"
          render={({ field: { onChange, onBlur, value } }) => (
            <ThemedInput
              textInputName="textSecondary"
              label="Confirmar nova senha"
              icon="lock-closed-outline"
              placeholder="Confirme a nova senha"
              isPassword={true}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.confirmarSenha?.message}
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  container: {
    width: "100%",
  },
  buttonContainer: {
    marginTop: 8,
    gap: 12,
  },
  cancelButton: {
    marginTop: 0,
  },
});
