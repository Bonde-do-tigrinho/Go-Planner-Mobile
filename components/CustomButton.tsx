// components/Button.tsx
import React from 'react';
import { Pressable, Text, StyleSheet, View, ActivityIndicator, DimensionValue } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

type ButtonVariant =
  | 'primary'
  | 'confirm'
  | 'outline-orange'
  | 'outline-white'
  | 'gradient-primary'
  | 'light-pink'
  | 'secondary';

type ButtonSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface ButtonProps {
  title: string;
  style?: string
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconName?: React.ComponentProps<typeof Ionicons>['name'];
  loading?: boolean;
  disabled?: boolean;
  width?: DimensionValue; // Prop para definir uma largura fixa (ex: '80%' ou 250)
}

interface VariantStyles {
  backgroundColor?: string;
  textColor: string;
  borderColor?: string;
  borderWidth?: number;
  gradient?: string[];
}

const variants: Record<ButtonVariant, VariantStyles> = {
  primary: { backgroundColor: '#D81E5B', textColor: '#FFFFFF', borderWidth: 0 },
  confirm: { backgroundColor: '#F05D28', textColor: '#FFFFFF', borderWidth: 0 },
  'light-pink': { backgroundColor: '#FEEBEE', textColor: '#D81E5B', borderWidth: 0 },
  secondary: { backgroundColor: '#FFFFFF', textColor: '#424242', borderColor: '#E0E0E0', borderWidth: 1 },
  'gradient-primary': {
    gradient: ['#F05D28', '#D81E5B'],
    textColor: '#FFFFFF',
    borderWidth: 0,
  },
  'outline-orange': {
    backgroundColor: 'transparent',
    textColor: '#F05D28',
    borderColor: '#F05D28',
    borderWidth: 1,
  },
  'outline-white': {
    backgroundColor: 'transparent',
    textColor: '#FFFFFF',
    borderColor: '#FFFFFF',
    borderWidth: 1,
  },
};

const sizes: Record<ButtonSize, { paddingVertical: number; paddingHorizontal: number; fontSize: number; iconSize: number }> = {
  sm: { paddingVertical: 8, paddingHorizontal: 16, fontSize: 14, iconSize: 16 },
  md: { paddingVertical: 12, paddingHorizontal: 24, fontSize: 16, iconSize: 20 },
  lg: { paddingVertical: 16, paddingHorizontal: 32, fontSize: 18, iconSize: 22 },
  xl: { paddingVertical: 16, paddingHorizontal: 48, fontSize: 18, iconSize: 22 },
  '2xl': { paddingVertical: 16, paddingHorizontal: 64, fontSize: 18, iconSize: 22 },
};

const Button: React.FC<ButtonProps> = ({
  style,
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  iconName,
  loading = false,
  disabled = false,
  width, // Nova prop de largura
}) => {
  const isDisabled = loading || disabled;
  const variantStyles = variants[variant];
  const sizeStyles = sizes[size];

  const ButtonContent = (
    <>
      {loading ? (
        <ActivityIndicator color={variantStyles.textColor} />
      ) : (
        <>
          <Text style={[{ color: variantStyles.textColor, fontSize: sizeStyles.fontSize }, styles.textBase]}>
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
    </>
  );

  if (variantStyles.gradient) {
    return (
      <Pressable
        onPress={onPress}
        disabled={isDisabled}
        style={({ pressed }) => [{ width }, pressed && styles.buttonPressed]}
      >
        <LinearGradient
          colors={variantStyles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.gradientBase,
            { 
              paddingVertical: sizeStyles.paddingVertical, 
              paddingHorizontal: sizeStyles.paddingHorizontal,
            },
            isDisabled && styles.buttonDisabled,
          ]}
        >
          {ButtonContent}
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.buttonBase,
        {
          width, // Aplicando a largura aqui
          backgroundColor: variantStyles.backgroundColor,
          borderColor: variantStyles.borderColor,
          borderWidth: variantStyles.borderWidth,
          paddingVertical: sizeStyles.paddingVertical,
          paddingHorizontal: sizeStyles.paddingHorizontal,
        },
        pressed && styles.buttonPressed,
        isDisabled && styles.buttonDisabled,
      ]}
    >
      {ButtonContent}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  buttonBase: {
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientBase: {
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBase: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  icon: {
    marginLeft: 8,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonDisabled: {
    backgroundColor: '#a9a9a9',
    borderColor: '#a9a9a9',
    opacity: 0.7,
  },
});

export default Button;