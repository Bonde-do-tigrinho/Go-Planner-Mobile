import { Ionicons } from '@expo/vector-icons';
import { 
  StyleSheet, 
  View, 
  FlatList, 
  TextInput, 
  Pressable, 
  Image,
  TouchableOpacity
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient'; // <--- importando o gradiente

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

type SearchResult = {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  isAdded: boolean; 
};

const MOCK_SEARCH_RESULTS: SearchResult[] = [
  {
    id: '2',
    name: 'Leandro Rodrigues',
    email: 'leandro23@gmail.com',
    avatar: 'https://i.pravatar.cc/150?img=2',
    isAdded: true, 
  },
  {
    id: '1',
    name: 'Raul Araujo',
    email: 'raul32@gmail.com',
    avatar: null,
    isAdded: false, 
  },
  {
    id: '5',
    name: 'Ana Silva',
    email: 'ana.silva@gmail.com',
    avatar: 'https://i.pravatar.cc/150?img=5',
    isAdded: false,
  },
];

export default function AddFriendScreen() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState(MOCK_SEARCH_RESULTS);

  // --- HOOKS DE CORES ---
  const bgPrimary = useThemeColor({}, 'bgPrimary');
  const cardBg = useThemeColor({ light: '#FFFFFF', dark: '#252525' }, 'bgPrimary');
  const borderColor = useThemeColor({}, 'borderPrimary');
  const primaryColor = useThemeColor({}, 'primary'); 
  const secondaryColor = useThemeColor({}, 'secondary');
  const textSecondary = useThemeColor({}, 'textSecondary');
  const textPrimary = useThemeColor({}, 'textPrimary'); 
  const avatarPlaceholderBg = useThemeColor({ light: '#F4F4F5', dark: '#3F3F46' }, 'bgSecondary');

  const toggleFriendStatus = (id: string) => {
    setResults(prev => prev.map(item => 
      item.id === id ? { ...item, isAdded: !item.isAdded } : item
    ));
  };

  const renderItem = ({ item }: { item: SearchResult }) => (
    <View style={[styles.card, { backgroundColor: cardBg, borderColor: borderColor }]}>
      <View style={styles.userInfo}>
        {item.avatar ? (
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder, { backgroundColor: avatarPlaceholderBg }]}>
            <Ionicons name="person" size={20} color={primaryColor} />
          </View>
        )}
        
        <View style={styles.textContainer}>
          <ThemedText type="default" isSemiBold colorName="textPrimary">{item.name}</ThemedText>
          <ThemedText style={styles.emailText} colorName="textSecondary">{item.email}</ThemedText>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => toggleFriendStatus(item.id)}
        style={[
          styles.actionButton,
          item.isAdded 
            ? { backgroundColor: '#E4E4E7' } 
            : { backgroundColor: primaryColor } 
        ]}
      >
        <ThemedText 
            style={[
                styles.actionButtonText,
                item.isAdded ? { color: '#71717A' } : { color: '#FFF' }
            ]} colorName={'primary'}        >
          {item.isAdded ? 'Adicionado' : 'Adicionar'}
        </ThemedText>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bgPrimary }}>
      <ThemedView style={styles.container} bgName="bgPrimary">
        
        {/* HEADER AJUSTADO */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={textPrimary} />
          </TouchableOpacity>
          
          <View style={styles.titleRow}>
            <ThemedText type="subtitle" colorName="textTitle" style={{ fontSize: 24 }}>
              Adicionar amigo
            </ThemedText>
            <Ionicons name="ellipse" size={10} color="#3F0098" style={{ marginTop: 10 }} />
          </View>
        </View>

        <View style={styles.descriptionContainer}>
          <ThemedText style={styles.descriptionText} colorName="textSecondary">
            Adicione amigos para <ThemedText style={{ color: secondaryColor, fontWeight: '600' }} colorName={'primary'}>planejar e viajar</ThemedText> junto com você!
          </ThemedText>
        </View>

        {/* 2. BARRA DE PESQUISA COM GRADIENTE */}
        <LinearGradient
          colors={[primaryColor, secondaryColor]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.searchGradientBorder} // usa o estilo da borda
        >
          {/* View interna com bgPrimary*/}
          <View style={[styles.searchInnerContainer, { backgroundColor: bgPrimary }]}>
            <Ionicons name="search-outline" size={20} color={'#FF0049'} style={{ marginRight: 8 }} />
            <TextInput
              style={[styles.searchInput, { color: textPrimary }]}
              placeholder="Pesquisar por nome ou email"
              placeholderTextColor={textSecondary}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </LinearGradient>

        {/* Lista de Resultados */}
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 10,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
    marginLeft: -8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 22,
  },
  
  // --- ESTILOS P/ O GRADIENTE ---
  searchGradientBorder: {
    padding: 1.5,
    borderRadius: 9,
    marginBottom: 24,
  },
  searchInnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8, 
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
 

  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 40,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  textContainer: {
    flex: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emailText: {
    fontSize: 12,
    marginTop: 2,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
});