import { Ionicons } from '@expo/vector-icons';
import { 
  StyleSheet, 
  View, 
  FlatList, 
  Pressable, 
  Image,
  Modal,
  Text
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
// importação necessária pra usar o ícone SVG do Figma
import { SvgXml } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import Header from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';

// --- XML DO SVG COPIADO DIRETAMENTE DO FIGMA ---
const NoFriendsSvg = `<svg width="82" height="82" viewBox="0 0 82 82" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M27.25 23.85c0 3.61 1.44 7.08 3.99 9.63 2.56 2.56 6.03 3.99 9.64 3.99 3.61 0 7.08-1.43 9.64-3.99 2.55-2.55 3.99-6.02 3.99-9.63 0-3.62-1.44-7.08-3.99-9.64-2.56-2.55-6.03-3.99-9.64-3.99-3.61 0-7.08 1.44-9.64 3.99-2.55 2.56-3.99 6.02-3.99 9.64zM20.44 71.54v-6.81c0-3.62 1.44-7.08 3.99-9.64 2.56-2.55 6.02-3.99 9.64-3.99h11.92M74.95 74.95L57.91 57.91M57.91 74.95L74.95 57.91" stroke="#C70039" stroke-width="6.81" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

// TIPO
type Friend = {
  id: string;
  name: string;
  email: string;
  avatar: string | null; 
};

// DADOS INICIAIS (Para recarregar ao dar reload)
const INITIAL_FRIENDS: Friend[] = [
  {
    id: '1',
    name: 'Raul Araujo',
    email: 'raul32@gmail.com',
    avatar: null, 
  },
  {
    id: '2',
    name: 'Leandro Rodrigues',
    email: 'leandro23@gmail.com',
    avatar: 'https://i.pravatar.cc/150?img=2', 
  },
  {
    id: '3',
    name: 'Gabriel Kendi',
    email: 'gabrielk@gmail.com',
    avatar: null, 
  },
  {
    id: '4',
    name: 'Miguel Lemos',
    email: 'lemos@gmail.com',
    avatar: 'https://i.pravatar.cc/150?img=13', 
  },
];

export default function ExploreScreen() {
  const { isLoading } = useAuth();

  // Enquanto carrega, não renderiza nada
  if (isLoading) {
    return null;
  }

  const router = useRouter();
  
  // --- ESTADOS ---
  const [friends, setFriends] = useState<Friend[]>(INITIAL_FRIENDS);
  const [friendToDelete, setFriendToDelete] = useState<string | null>(null);

  // --- HOOKS DE CORES ---
  const bgPrimary = useThemeColor({}, 'bgPrimary');
  const cardBg = useThemeColor({ light: '#FFFFFF', dark: '#252525' }, 'bgPrimary');
  const borderColor = useThemeColor({}, 'borderPrimary');
  const iconColor = useThemeColor({}, 'icon');
  const primaryColor = useThemeColor({}, 'primary');
  const secondaryColor = useThemeColor({}, 'secondary');
  const fabColor = '#FF0049'; 
  const avatarPlaceholderBg = useThemeColor({ light: '#F4F4F5', dark: '#3F3F46' }, 'bgSecondary');

  // Cores do Modal de Confirmação
  const btnNoColor = '#C70039';
  const btnYesColor = '#FF5733'; 

  const handleNavigateToNotifications = () => {
    router.push("/notifications");
  };

  // Funções de Controle do Modal
  const promptDelete = (id: string) => setFriendToDelete(id);
  
  const confirmDelete = () => {
    if (friendToDelete) {
      setFriends(current => current.filter(friend => friend.id !== friendToDelete));
      setFriendToDelete(null);
    }
  };

  const cancelDelete = () => setFriendToDelete(null);

  const renderFriendItem = ({ item }: { item: Friend }) => {
    return (
      <View style={[
        styles.card, 
        { backgroundColor: cardBg, borderColor: borderColor }
      ]}>
        <View style={styles.cardContent}>
          {/* Lógica do Avatar com Borda Laranja */}
          {item.avatar ? (
            <Image 
              source={{ uri: item.avatar }} 
              style={[styles.avatar, { borderColor: primaryColor }]} 
            />
          ) : (
            <View style={[
              styles.avatar, 
              styles.avatarPlaceholder, 
              { backgroundColor: avatarPlaceholderBg, borderColor: primaryColor }
            ]}>
              <Ionicons name="person" size={24} color={primaryColor} />
            </View>
          )}
          
          <View style={styles.infoContainer}>
            <ThemedText type="default" isSemiBold colorName="textPrimary" style={styles.nameText}>
              {item.name}
            </ThemedText>
            <ThemedText colorName="textSecondary" style={styles.emailText}>
              {item.email}
            </ThemedText>
          </View>
        </View>

        <Pressable onPress={() => promptDelete(item.id)} hitSlop={10}>
          <Ionicons name="trash-outline" size={24} color={iconColor} />
        </Pressable>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bgPrimary }}>
      <ThemedView style={styles.container} bgName="bgPrimary">
        
      {/* HEADER LIMPO: Sem ícones na direita */}
        <Header 
            onNotificationPress={handleNavigateToNotifications}
            hideThemeToggle={true}      // esconde o botão de tema
          //hideNotificationIcon={true}
        >
          <View style={styles.titleRow}>
            <ThemedText type="title" colorName="textTitle" style={styles.pageTitle}>
              Lista de amigos
            </ThemedText>
            <Ionicons name="ellipse" size={8} color="#3F0098" style={{ marginTop: 6 }} />
          </View>
        </Header>

        <View style={styles.descriptionContainer}>
          <ThemedText style={styles.descriptionText} colorName="textSecondary">
            Aqui ficam as pessoas que irão <ThemedText style={{ color: secondaryColor, fontWeight: '600' }} colorName={'textPrimary'}>planejar e viajar</ThemedText> junto com você!
          </ThemedText>
        </View>

        {/* --- LISTA OU EMPTY STATE --- */}
        {friends.length > 0 ? (
          <FlatList
            data={friends}
            keyExtractor={(item) => item.id}
            renderItem={renderFriendItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyStateContainer}>
            {/* Ícone SVG vindo do XML */}
            <View style={{ marginBottom: 24 }}>
              <SvgXml 
                xml={NoFriendsSvg} 
                width="120" 
                height="120" 
              />
            </View>
            
            <ThemedText style={styles.emptyTitle} colorName="textPrimary">
              Opa! Não há amigos aqui!
            </ThemedText>
            <ThemedText style={styles.emptySubtitle} colorName="textSecondary">
              Você ainda não adicionou nenhum amigo. Clique no botão para convidar amigos para suas viagens!
            </ThemedText>
          </View>
        )}

        {/* BOTÃO FLUTUANTE DE ADICIONAR */}
        <View style={styles.footerContainer}>
          <Pressable 
            style={[styles.addButton, { borderColor: fabColor, backgroundColor: cardBg }]} 
            onPress={() => router.push("/addFriend")}
          >
            <Ionicons name="person-add-outline" size={36} color={fabColor} />
          </Pressable>
        </View>

        {/* --- MODAL DE EXCLUSÃO --- */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={!!friendToDelete}
          onRequestClose={cancelDelete}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                 <Text style={[styles.modalTitle, { color: btnNoColor }]}>Removendo amigo :(</Text>
                 <Pressable onPress={cancelDelete} style={{ position: 'absolute', right: 0, top: -5 }}>
                    <Ionicons name="close" size={20} color="#999" />
                 </Pressable>
              </View>
              
              <Text style={styles.modalBodyText}>
                Você esta desfazendo uma amizade.{'\n'}
                Gostaria mesmo de remover este amigo?
              </Text>

              <View style={styles.modalButtons}>
                {/* Botão NÃO (Vermelho Escuro) */}
                <Pressable 
                    style={[styles.modalBtn, { backgroundColor: btnNoColor }]} 
                    onPress={cancelDelete}
                >
                  <Text style={styles.modalBtnText}>Não.</Text>
                </Pressable>

                {/* Botão SIM (Laranja) */}
                <Pressable 
                    style={[styles.modalBtn, { backgroundColor: btnYesColor }]} 
                    onPress={confirmDelete}
                >
                  <Text style={styles.modalBtnText}>Sim.</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  descriptionContainer: {
    marginTop: 32,
    marginBottom: 24,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 22,
  },
  listContent: {
    paddingBottom: 160,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2, // Borda laranja definida aqui
  },
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    justifyContent: 'center',
  },
  nameText: {
    fontSize: 16,
    marginBottom: 2,
  },
  emailText: {
    fontSize: 14,
  },
  footerContainer: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    zIndex: 10,
  },
  addButton: {
    width: 108,
    height: 64,
    borderRadius: 24, 
    borderWidth: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  
  // --- EMPTY STATE ---
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 90,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: '80%',
  },

  // --- MODAL STYLES ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalBodyText: {
    fontSize: 14,
    color: '#333', // Cor fixa cinza escuro para legibilidade no modal branco
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
    justifyContent: 'center',
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});