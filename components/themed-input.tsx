// components/ui/ThemedInput.tsx
import React, { useState } from 'react';
import { TextInput, StyleSheet, TextInputProps, View, NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';
import { ThemedView, ThemedViewProps } from './themed-view';
import { ThemedText } from './themed-text';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

type ThemedInputProps = TextInputProps & {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  containerProps?: ThemedViewProps;
  error?: string;
  lightColor?: string;
  darkColor?: string;
  textInputName?: keyof typeof Colors.light & keyof typeof Colors.dark;
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
  textInputName = "bgPrimary", // Usando "text" como padrão
  ...textInputProps
}: ThemedInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const activeBorderName = isFocused ? 'primary' : 'borderPrimary';
  const defaultBorderName = error ? 'notification' : activeBorderName;

  const iconColor = useThemeColor({}, 'icon');
  // Aqui buscamos a string da cor
  const textColor = useThemeColor({ light: lightColor, dark: darkColor }, textInputName);

   // MUDANÇA: Nova função para lidar com o evento de foco
  const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsFocused(true); // Executa a lógica interna
    if (onFocus) {
      onFocus(e); // Executa a lógica externa (do React Hook Form)
    }
  };
   const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsFocused(false); // Executa a lógica interna
    if (onBlur) {
      onBlur(e); // Executa a lógica externa (do React Hook Form)
    }
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
        {icon && <Ionicons name={icon} size={20} color={iconColor} style={styles.icon} />}
        <TextInput
          // E aqui a aplicamos dentro de um objeto { color: ... }
          style={[styles.input, { color: textColor }]}
          placeholderTextColor={iconColor}
          onFocus={handleFocus} // MUDANÇA: Usando a nova função
          onBlur={handleBlur}  
          {...textInputProps}
        />
      </ThemedView>
      {error && <ThemedText colorName="notification" style={styles.errorText}>{error}</ThemedText>}
    </View>
  );
}

// ... (seus estilos)
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
    borderWidth: 1.5
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
  },
});