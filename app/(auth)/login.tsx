import Button from "@/components/CustomButton";
import { ThemedInput } from "@/components/themed-input";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useAuth } from "@/hooks/useAuth";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
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

const loginSchema = z.object({
  email: z.string().email("Por favor, insira um e-mail válido."),
  password: z.string().min(9, "A senha deve ter pelo menos 9 caracteres."),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  const { signIn } = useAuth();

  const onSubmit = async (data: LoginFormData) => {
    const { email, password } = data;
    try {
      // Usa a variável de ambiente com o IP da rede
      const apiUrl =
        process.env.EXPO_PUBLIC_API_URL || "http://192.168.15.10:8082/api";
      console.log("API URL:", apiUrl);

      const response = await fetch(`${apiUrl}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          senha: password,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Login bem-sucedido:", responseData);

        // Usar o hook useAuth para salvar o token e userId
        if (responseData.token) {
          await signIn(responseData.token, email, responseData.userInfo.id);
          console.log("Token e userId salvos com sucesso");
        }

        // O redirecionamento é feito automaticamente pelo useAuth
      } else {
        // ERRO DA API: O servidor respondeu com um erro
        const errorData = await response.json();
        console.error("Erro da API:", response.status, errorData);

        if (response.status === 400) {
          Alert.alert(
            "Credenciais inválidas",
            errorData.message ||
              "E-mail ou senha incorretos. Por favor, tente novamente."
          );
        } else if (response.status === 404) {
          Alert.alert(
            "Usuário não encontrado",
            errorData.message ||
              "Este e-mail não está cadastrado. Por favor, crie uma conta."
          );
        } else {
          Alert.alert(
            "Erro no login",
            errorData.message ||
              "Não foi possível fazer login. Tente novamente."
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
            Bem-vindo de volta
            <Ionicons name={"ellipse"} color={iconColor} size={10} />
          </ThemedText>

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
          <Link href="/(auth)/forgot-password" asChild>
            <Pressable>
              <ThemedText colorName="tint" style={styles.forgotPassword}>
                Esqueceu sua senha?
              </ThemedText>
            </Pressable>
          </Link>
          <Button
            title="Fazer login"
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
  loginButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
