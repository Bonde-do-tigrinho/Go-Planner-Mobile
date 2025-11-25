import Button from "@/components/CustomButton";
import { ThemedInput } from "@/components/themed-input";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { z } from "zod";

const registerSchema = z
  .object({
    name: z
      .string()
      .trim() // 1. Remove espaços extras do início e do fim
      .min(3, { message: "O nome deve ter pelo menos 3 caracteres." }) // 2. Validação de tamanho mínimo
      .refine(
        (name) => name.split(" ").length >= 2, // 3. Verifica se há pelo menos duas palavras
        { message: "Por favor, insira seu nome completo (nome e sobrenome)." }
      ),
    email: z.string().email("Por favor, insira um e-mail válido."),
    password: z.string().min(9, "A senha deve ter pelo menos 9 caracteres."),
    passwordConfirm: z.string().min(9, "A senha devem ser iguais."),
  }) // NOVO: Adicionando a verificação de senhas
  .refine((data) => data.password === data.passwordConfirm, {
    message: "As senhas não correspondem",
    path: ["passwordConfirm"], // Mostra o erro no campo de confirmação de senha
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    const { name, email, password } = data;
    try {
      const apiUrl =
        process.env.EXPO_PUBLIC_API_URL || "http://192.168.15.10:8082/api";
      console.log("API URL:", apiUrl);
      
      const response = await fetch(`${apiUrl}/users/cadastrar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: name,
          email: email,
          senha: password,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Cadastro bem-sucedido:", responseData);

        router.push({
          pathname: "/(auth)/verify-code",
          params: { email: data.email, name: data.name },
        });
      } else {
        // ERRO DA API: O servidor respondeu com um erro (ex: e-mail já existe)
        const errorData = await response.json();
        console.error("Erro da API:", response.status, errorData);

        if (response.status === 400) {
          Alert.alert(
            "E-mail já cadastrado",
            errorData.message ||
              "Este e-mail já está cadastrado. Por favor, use outro e-mail ou faça login."
          );
        } else {
          Alert.alert(
            "Erro no cadastro",
            errorData.message ||
              "Não foi possível criar sua conta. Tente novamente."
          );
        }
        // Retornar para não deixar o Expo mostrar o erro padrão
        return;
      }
    } catch (error) {
      console.error("Erro completo:", error);

      // Verificar qual tipo de erro ocorreu
      if (error instanceof TypeError) {
        Alert.alert(
          "Erro de Conexão",
          "Verifique se:\n1. A API está rodando\n2. O IP está correto\n3. Você está na mesma rede\n\nErro: " +
            error.message
        );
      } else {
        Alert.alert(
          "Erro",
          "Não foi possível se conectar ao servidor. Verifique sua internet."
        );
      }
      // Retornar para não deixar o Expo mostrar o erro padrão
      return;
    }
  };

  const iconColor = useThemeColor({}, "primary");
  return (
    <ThemedView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* MUDANÇA: Usando ThemedText para o título */}
          <ThemedText type="title" colorName="textPrimary" style={styles.title}>
            Crie sua conta
            <Ionicons name={"ellipse"} color={iconColor} size={10} />
          </ThemedText>

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <ThemedInput
                textInputName="textSecondary"
                label="Nome:"
                icon="person-outline"
                placeholder="Digite seu nome"
                keyboardType="default"
                autoCapitalize="none"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <ThemedInput
                textInputName="textSecondary"
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
                textInputName="textSecondary"
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
                textInputName="textSecondary"
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
          <View style={styles.separator} />
          <Button
            title="Cadastrar"
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            variant="gradient-primary"
            iconName="arrow-forward"
            size="xl"
            width="100%"
          />

          <View style={styles.separatorContainer}>
            <ThemedView style={styles.line} bgName="borderPrimary" />
            <ThemedText colorName="icon" style={styles.separatorText}>
              ou
            </ThemedText>
            <ThemedView style={styles.line} bgName="borderPrimary" />
          </View>

          {/* MUDANÇA: Botões sociais agora usam componentes temáticos */}
          <Pressable onPress={() => console.log("Login com Google")}>
            <ThemedView
              style={styles.socialButton}
              borderName="borderPrimary"
              borderWidth={1}
            >
              <Image
                source={require("@/assets/images/google.png")}
                style={styles.socialIcon}
              />
              <ThemedText colorName="textTerciary">
                Continue com Google
              </ThemedText>
            </ThemedView>
          </Pressable>

          <Pressable onPress={() => console.log("Login com Facebook")}>
            <ThemedView
              style={styles.socialButton}
              borderName="borderPrimary"
              borderWidth={1}
            >
              <Image
                source={require("@/assets/images/facebook.png")}
                style={styles.socialIcon}
              />
              <ThemedText colorName="textTerciary">
                Continue com Facebook
              </ThemedText>
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
    justifyContent: "flex-start",
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  title: {
    marginBottom: 40,
  },
  forgotPassword: {
    textAlign: "right",
    marginBottom: 24,
    fontWeight: "500",
    fontSize: 14,
  },
  separator: {
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: "#ccc", // Podemos criar uma cor 'disabled' no tema
  },
  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
