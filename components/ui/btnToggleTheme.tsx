import { Pressable, StyleSheet, useColorScheme } from 'react-native';
import { Appearance } from 'react-native'; // 👈 Importe a API Appearance
import { ThemedText } from '@/components/themed-text'; // Componente de texto do seu projeto
import { useTheme } from '@react-navigation/native'; // Para pegar as cores do tema

export function ThemeToggleButton() {
  // 1. Pega o esquema de cores ATUAL. Ele será 'light' ou 'dark'.
  const colorScheme = useColorScheme();
  
  // Pega as cores do tema atual para estilizar o botão
  const { colors } = useTheme();

  // 2. Cria a função que alterna o tema
  const toggleTheme = () => {
    // Calcula qual será o PRÓXIMO tema
    const nextTheme = colorScheme === 'dark' ? 'light' : 'dark';
    // 3. USA A API NATIVA PARA MUDAR O TEMA DO APP!
    Appearance.setColorScheme(nextTheme);
  };

  return (
    <Pressable
      onPress={toggleTheme}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: colors.primary, // Cor primária do tema atual
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <ThemedText style={{ }}>
        Mudar para tema {colorScheme === 'dark' ? 'Claro' : 'Escuro'}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});