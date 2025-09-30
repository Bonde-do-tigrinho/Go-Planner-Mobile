// components/ui/ThemedInput.tsx
import React, { useState } from 'react';
import {
  TextInput,
  StyleSheet,
  View,
  NativeSyntheticEvent,
  TextInputFocusEventData,
  TextInputProps,
  Pressable, // Importar Pressable
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
  // NOVA PROP: Para indicar se é um campo de senha
  isPassword?: boolean;
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
  textInputName = 'textSecondary', // Mudei o padrão para algo mais lógico para texto
  isPassword = false, // NOVA PROP: Padrão é false
  secureTextEntry, // Removido de textInputProps para ser controlado internamente
  ...textInputProps
}: ThemedInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  // NOVO ESTADO: Para controlar a visibilidade da senha
  const [showPassword, setShowPassword] = useState(false);

  const activeBorderName = isFocused ? 'primary' : 'borderPrimary';
  const defaultBorderName = error ? 'notification' : activeBorderName;

  const iconColor = useThemeColor({}, 'icon');
  const placeholderColor = useThemeColor({}, "textTerciary");
  const textColor = useThemeColor({ light: lightColor, dark: darkColor }, textInputName);

  const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsFocused(true);
    if (onFocus) {
      onFocus(e);
    }
  };
  const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsFocused(false);
    if (onBlur) {
      onBlur(e);
    }
  };

  // Função para alternar a visibilidade da senha
  const toggleShowPassword = () => {
     setShowPassword(prev => !prev); 
  };

  return (
    <View style={styles.wrapper}>
      {label && <ThemedText colorName="textPrimary" style={styles.label}>{label}</ThemedText>}
      <ThemedView
        style={[styles.container, error && styles.containerError]}
        bgName="bgPrimary"
        borderName={defaultBorderName}
        borderWidth={1}
        {...containerProps}
      >
        {/* Ícone normal (se existir) */}
        {icon && <Ionicons name={icon} size={20} color={iconColor} style={styles.icon} />}

        <TextInput
          style={[styles.input, { color: textColor }]}
          placeholderTextColor={placeholderColor}
          onFocus={handleFocus}
          onBlur={handleBlur}
          // Lógica para secureTextEntry
          secureTextEntry={isPassword && !showPassword} // Apenas segura se for senha E não estiver mostrando
          {...textInputProps}
        />

        {isPassword && (
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
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 12,
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
    paddingLeft: 8, // Espaçamento entre o input e o ícone de olho
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
  },
});