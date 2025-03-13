import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NEPALI_THEME } from '../../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

interface AudioButtonProps {
  isPlaying: boolean;
  onPress: () => void;
  isLoading?: boolean;
  style?: any;
}

export function AudioButton({ isPlaying, onPress, isLoading, style }: AudioButtonProps) {
  return (
    <TouchableOpacity 
      style={[styles.container, style]}
      onPress={onPress}
      disabled={isLoading}>
      <LinearGradient
        colors={[NEPALI_THEME.primary, NEPALI_THEME.secondary]}
        style={styles.gradient}>
        {isLoading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <>
            <Ionicons 
              name={isPlaying ? "stop-circle" : "volume-high"} 
              size={24} 
              color="#fff" 
            />
            <Text style={styles.text}>
              {isPlaying ? 'रोक्नुहोस्' : 'सुन्नुहोस्'}
            </Text>
          </>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 