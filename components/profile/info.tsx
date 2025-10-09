import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import SheetModal from '@/components/modal';
import { ThemedView } from '../themed-view';
import Button from '../CustomButton';
import { ThemedText } from '../themed-text';

import { ThemedInput } from '@/components/themed-input';
import EditProfileForm from './editProfileForm';

export default function Info() {
  const [isModalVisible, setModalVisible] = useState(false);

  // 🔹 Dados simulando o usuário logado
  const [userData, setUserData] = useState({
    phone: '+55 11 97730-4028',
    email: 'nicolasyanase18@gmail.com',
    password: '************',
    name: 'Nicolas Yanase',
    avatar: 'https://avatars.githubusercontent.com/u/63155478?v=4',
  });

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  // 🔹 Função para atualizar as informações do usuário
  const handleUpdateProfile = (data: {
    phone: string;
    email: string;
    password?: string;
  }) => {
    console.log('Novos dados:', data);
    setUserData((prev) => ({
      ...prev,
      phone: data.phone,
      email: data.email,
      password: data.password ? '************' : prev.password,
    }));
    closeModal();
  };

  return (
    <ThemedView bgName="bgPrimary" style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: userData.avatar }}
            style={styles.avatar}
          />
          <View style={styles.userInfoContainer}>
            <ThemedText colorName="textPrimary" style={styles.name}>
              {userData.name}
            </ThemedText>
            <ThemedText colorName="textSecondary" style={styles.phone}>
              {userData.phone}
            </ThemedText>
          </View>
        </View>

        <View 
            style={styles.formContainer} pointerEvents="none"
        >
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
        <View style={{marginTop:20}} />
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
          initialData={userData}
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
  profileHeader: {
    marginBottom: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfoContainer: {
    marginLeft: 25,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  phone: {
    fontSize: 16,
    marginTop: 4,
  },
  formContainer: {
    width: '100%',
    gap: 16,
    opacity: 0.6,
    
  },
});
