import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ViewStyle, 
  TextStyle,
  ActivityIndicator 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NEPALI_THEME } from '../../constants/theme';

interface GradientButtonProps {
  onPress: () => void;
  title: string;
  icon?: keyof typeof Ionicons.glyphMap;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'accent';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function GradientButton({
  onPress,
  title,
  icon,
  loading,
  disabled,
  variant = 'primary',
  style,
  textStyle,
}: GradientButtonProps) {
  const getGradient = () => {
    switch (variant) {
      case 'secondary':
        return [NEPALI_THEME.secondary, NEPALI_THEME.primary];
      case 'accent':
        return NEPALI_THEME.gradients.accent;
      default:
        return NEPALI_THEME.gradients.primary;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.button, disabled && styles.disabled, style]}>
      <LinearGradient
        colors={getGradient()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            {icon && (
              <Ionicons name={icon} size={24} color="#fff" style={styles.icon} />
            )}
            <Text style={[styles.text, textStyle]}>{title}</Text>
          </>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: NEPALI_THEME.borderRadius.md,
    overflow: 'hidden',
    ...NEPALI_THEME.shadows.md,
  },
  gradient: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: NEPALI_THEME.text,
    fontSize: 16,
    fontWeight: '600',
  },
  icon: {
    marginRight: 8,
  },
  disabled: {
    opacity: 0.5,
  },
}); 