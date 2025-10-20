import React, { useState } from 'react';
import {
  TextInput,
  StyleSheet,
  View,
  NativeSyntheticEvent,
  TextInputFocusEventData,
  TextInputProps,
  Pressable,
} from 'react-native';
import { ThemedView, ThemedViewProps } from './themed-view';
import { ThemedText } from './themed-text';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

type ThemedInputProps = Omit<TextInputProps, 'onFocus' | 'onBlur'> & {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  containerProps?: ThemedViewProps;
  error?: string;
  lightColor?: string;
  darkColor?: string;
  textInputName?: keyof typeof Colors.light & keyof typeof Colors.dark;
  onFocus?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  isPassword?: boolean;
  // --- MUDANÇA 1: Simplificado para 'multiline' para bater com a prop nativa ---
  multiline?: boolean; 
};

export function ThemedInput({
  label,
  icon,
  lightColor,
  darkColor,
  containerProps,
  error,
  onFocus,
  onBlur,
  textInputName = 'textSecondary',
  multiline = false, // <-- Renomeado
  isPassword = false,
  secureTextEntry,
  ...textInputProps
}: ThemedInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const activeBorderName = isFocused ? 'primary' : 'borderPrimary';
  const defaultBorderName = error ? 'notification' : activeBorderName;

  const iconColor = useThemeColor({}, 'icon');
  const placeholderColor = useThemeColor({}, "textTerciary");
  const textColor = useThemeColor({ light: lightColor, dark: darkColor }, textInputName);

  const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };
  const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  const toggleShowPassword = () => {
    setShowPassword(prev => !prev);  
  };

  // --- MUDANÇA 2: Lógica de estilo movida para cá para maior clareza ---
  // Estilo dinâmico para o contêiner
  const containerStyle = [
    styles.container,
    error && styles.containerError,
    // Se for multiline, alinha os itens ao topo
    multiline && styles.multilineContainer,
  ];

  // Estilo dinâmico para o TextInput
  const textInputStyle = [
    styles.input,
    { color: textColor },
    // Se for multiline, aplica os estilos de área de texto
    multiline && styles.multilineInput,
  ];

  return (
    <View style={styles.wrapper}>
      {label && <ThemedText colorName="textPrimary" style={styles.label}>{label}</ThemedText>}
      <ThemedView
        style={containerStyle}
        bgName="bgPrimary"
        borderName={defaultBorderName}
        borderWidth={1}
        {...containerProps}
      >
        {/* --- MUDANÇA 3: Ícone só aparece se NÃO for multiline --- */}
        {icon && !multiline && <Ionicons name={icon} size={20} color={iconColor} style={styles.icon} />}

        <TextInput
          style={textInputStyle}
          placeholderTextColor={placeholderColor}
          onFocus={handleFocus}
          onBlur={handleBlur}
          multiline={multiline}
          secureTextEntry={isPassword && !showPassword}
          {...textInputProps}
        />

        {/* --- MUDANÇA 4: Ícone de senha só aparece se for senha E NÃO for multiline --- */}
        {isPassword && !multiline && (
          <Pressable onPress={toggleShowPassword} style={styles.passwordToggle}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={iconColor}
            />
          </Pressable>
        )}
      </ThemedView>
      {error && <ThemedText colorName="notification" style={styles.errorText}>{error}</ThemedText>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    // marginBottom removido para ser controlado pelo gap do formulário pai
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center', // Padrão para inputs de uma linha
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  // --- MUDANÇA 5: Novo estilo para o contêiner multiline ---
  multilineContainer: {
    alignItems: 'flex-start', // Alinha o ícone (se existisse) e o texto no topo
  },
  containerError: {
    borderWidth: 1.5,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  passwordToggle: {
    paddingLeft: 8,
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
  },
  multilineInput: {
    height: 120, // Altura inicial para a área de texto
    textAlignVertical: 'top', // Alinha o texto no topo no Android
    paddingVertical: 12, // Adiciona um padding vertical
  },
});
