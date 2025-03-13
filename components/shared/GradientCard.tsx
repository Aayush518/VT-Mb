import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { NEPALI_THEME } from '../../constants/theme';

interface GradientCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
  gradient?: string[];
}

export function GradientCard({ 
  children, 
  style, 
  intensity = 20,
  gradient = NEPALI_THEME.gradients.card 
}: GradientCardProps) {
  return (
    <LinearGradient
      colors={gradient}
      style={[styles.container, style]}>
      <BlurView intensity={intensity} style={styles.content}>
        {children}
      </BlurView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: NEPALI_THEME.borderRadius.lg,
    overflow: 'hidden',
    ...NEPALI_THEME.shadows.md,
  },
  content: {
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
}); 