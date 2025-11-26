import SheetModal from "@/components/modal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import Button from "../CustomButton";
import { ThemedText } from "../themed-text";
import { ThemedView } from "../themed-view";

import { ThemedInput } from "@/components/themed-input";
import EditProfileForm from "./editProfileForm";

const API_URL = "http://192.168.15.10:8082/api";

export default function Info() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 🔹 Dados do usuário vindos da API
  const [userData, setUserData] = useState({
    email: "",
    password: "************",
    name: "",
    avatar: "https://avatars.githubusercontent.com/u/63155478?v=4",
  });

  // 🔹 Buscar dados do usuário ao montar o componente
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem("userToken");

      if (!token) {
        Alert.alert("Erro", "Token não encontrado. Faça login novamente.");
        return;
      }

      const response = await fetch(`${API_URL}/users/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Dados do usuário:", data);

        setUserData({
          email: data.email,
          password: "************",
          name: data.nome,
          avatar:
            data.foto || "https://avatars.githubusercontent.com/u/63155478?v=4",
        });
      } else {
        const errorData = await response.json();
        console.error("Erro ao buscar dados:", errorData);
        Alert.alert("Erro", "Não foi possível carregar seus dados.");
      }
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
      Alert.alert("Erro", "Não foi possível conectar ao servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  // 🔹 Função para atualizar as informações do usuário
  const handleUpdateProfile = async (data: {
    nome: string;
    email: string;
    senhaAtual?: string;
    novaSenha?: string;
    confirmarSenha?: string;
  }) => {
    console.log("Novos dados:", data);

    try {
      const token = await AsyncStorage.getItem("userToken");

      if (!token) {
        Alert.alert("Erro", "Token não encontrado. Faça login novamente.");
        return;
      }

      // Prepara o body da requisição
      const requestBody: any = {
        nome: data.nome,
        email: data.email,
      };

      // Adiciona campos de senha apenas se foram preenchidos
      if (data.senhaAtual && data.novaSenha) {
        requestBody.senhaAtual = data.senhaAtual;
        requestBody.senhaNova = data.novaSenha;
      }

      const response = await fetch(`${API_URL}/users/me`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        // Atualiza os dados localmente
        setUserData((prev) => ({
          ...prev,
          name: data.nome,
          email: data.email,
        }));

        Alert.alert("Sucesso", "Informações atualizadas com sucesso!");
        closeModal();
      } else {
        const errorData = await response.json();
        console.error("Erro ao atualizar dados:", errorData);

        if (response.status === 400) {
          Alert.alert("Erro", errorData.message || "Senha atual incorreta.");
        } else {
          Alert.alert("Erro", "Não foi possível atualizar seus dados.");
        }
      }
    } catch (error) {
      console.error("Erro ao atualizar dados:", error);
      Alert.alert("Erro", "Não foi possível conectar ao servidor.");
    }
  };

  if (isLoading) {
    return (
      <ThemedView
        bgName="bgPrimary"
        style={[styles.container, styles.centered]}
      >
        <ActivityIndicator size="large" color="#FF5733" />
        <ThemedText colorName="textSecondary" style={{ marginTop: 12 }}>
          Carregando dados...
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView bgName="bgPrimary" style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.profileHeader}>
          <Image source={{ uri: userData.avatar }} style={styles.avatar} />
          <View style={styles.userInfoContainer}>
            <ThemedText colorName="textPrimary" style={styles.name}>
              {userData.name}
            </ThemedText>
          </View>
        </View>

        <View style={styles.formContainer} pointerEvents="none">
          <ThemedInput
            textInputName="textSecondary"
            label="Email"
            icon="mail-outline"
            value={userData.email}
            editable={false}
          />

          <ThemedInput
            textInputName="textSecondary"
            label="Senha"
            icon="lock-closed-outline"
            value={userData.password}
            isPassword={true}
            editable={false}
          />
        </View>
        <View style={{ marginTop: 20 }} />
        <Button
          title="Editar informações"
          onPress={openModal}
          variant="outline-orange"
          iconName="pencil"
          size="xl"
          width="100%"
        />
      </ScrollView>

      {/* 🔹 Modal com formulário de edição */}
      <SheetModal
        visible={isModalVisible}
        onClose={closeModal}
        title="Editar informações"
      >
        <EditProfileForm
          initialData={{ nome: userData.name, email: userData.email }}
          onSubmit={handleUpdateProfile}
        />
      </SheetModal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  profileHeader: {
    marginBottom: 30,
    flexDirection: "row",
    alignItems: "center",
  },
  userInfoContainer: {
    marginLeft: 25,
    maxWidth: 240
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
  },
  formContainer: {
    width: "100%",
    gap: 16,
    opacity: 0.6,
  },
});
