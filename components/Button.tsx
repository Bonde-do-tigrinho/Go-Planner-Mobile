// components/Button.tsx
import React from 'react';
import { Pressable, Text, StyleSheet, View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// 1. Tipagem para os nomes das variantes e tamanhos (para autocomplete e segurança)
type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

// 2. Interface para definir as props do nosso componente
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant; // Opcional, usa o tipo que definimos acima
  size?: ButtonSize;      // Opcional, usa o tipo que definimos acima
  iconName?: React.ComponentProps<typeof Ionicons>['name']; // Tipagem avançada para todos os nomes de ícones do Ionicons
  loading?: boolean;
  disabled?: boolean;
}

// --- DEFINIÇÃO DAS VARIANTES DE ESTILO (com tipagem) ---

const variants: Record<ButtonVariant, { backgroundColor: string; textColor: string }> = {
  primary: { backgroundColor: '#007AFF', textColor: '#FFFFFF' },
  secondary: { backgroundColor: '#6c757d', textColor: '#FFFFFF' },
  success: { backgroundColor: '#28a745', textColor: '#FFFFFF' },
  danger: { backgroundColor: '#dc3545', textColor: '#FFFFFF' },
  warning: { backgroundColor: '#ffc107', textColor: '#212529' },
  ghost: { backgroundColor: 'transparent', textColor: '#007AFF' }
};

const sizes: Record<ButtonSize, { paddingVertical: number; paddingHorizontal: number; fontSize: number; iconSize: number }> = {
  sm: { paddingVertical: 8, paddingHorizontal: 16, fontSize: 14, iconSize: 16 },
  md: { paddingVertical: 12, paddingHorizontal: 24, fontSize: 16, iconSize: 20 },
  lg: { paddingVertical: 16, paddingHorizontal: 32, fontSize: 18, iconSize: 22 },
};

// --- O COMPONENTE DO BOTÃO (tipado como React.FC) ---

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  iconName,
  loading = false,
  disabled = false,
}) => {
  const isDisabled = loading || disabled;
  const variantStyles = variants[variant];
  const sizeStyles = sizes[size];

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.buttonBase,
        { backgroundColor: variantStyles.backgroundColor },
        { paddingVertical: sizeStyles.paddingVertical, paddingHorizontal: sizeStyles.paddingHorizontal },
        pressed && !isDisabled && styles.buttonPressed,
        isDisabled && styles.buttonDisabled,
      ]}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator color={variantStyles.textColor} />
        ) : (
          <>
            <Text
              style={[
                styles.textBase,
                { color: variantStyles.textColor, fontSize: sizeStyles.fontSize },
              ]}
            >
              {title}
            </Text>
            {iconName && (
              <Ionicons
                name={iconName}
                size={sizeStyles.iconSize}
                color={variantStyles.textColor}
                style={styles.icon}
              />
            )}
          </>
        )}
      </View>
    </Pressable>
  );
};

// Os estilos continuam os mesmos
const styles = StyleSheet.create({
  buttonBase: { borderRadius: 25, justifyContent: 'center', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.22, shadowRadius: 2.22, },
  content: { flexDirection: 'row', alignItems: 'center' },
  textBase: { fontWeight: 'bold', textAlign: 'center' },
  icon: { marginRight: 8 },
  buttonPressed: { opacity: 0.85 },
  buttonDisabled: { backgroundColor: '#a9a9a9', elevation: 0, shadowOpacity: 0 },
});

export default Button;