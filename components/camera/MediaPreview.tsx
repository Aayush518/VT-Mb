import React from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NEPALI_THEME } from '../../constants/theme';

type MediaPreviewProps = {
  uri: string;
  isTablet: boolean;
  onReset: () => void;
};

export function MediaPreview({ uri, isTablet, onReset }: MediaPreviewProps) {
  return (
    <View style={[styles.container, isTablet && styles.containerTablet]}>
      <Image 
        source={{ uri }} 
        style={[styles.preview, isTablet && styles.previewTablet]} 
      />
      <TouchableOpacity
        style={[styles.resetButton, isTablet && styles.resetButtonTablet]}
        onPress={onReset}>
        <Ionicons name="refresh" size={20} color="#fff" />
        <Text style={styles.resetText}>अर्को लिनुहोस्</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  containerTablet: {
    padding: 40,
  },
  preview: {
    width: '100%',
    height: 400,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: NEPALI_THEME.primary,
  },
  previewTablet: {
    height: 600,
    borderRadius: 30,
  },
  resetButton: {
    backgroundColor: NEPALI_THEME.surface,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: NEPALI_THEME.primary,
  },
  resetButtonTablet: {
    padding: 16,
    borderRadius: 16,
    marginTop: 24,
  },
  resetText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});