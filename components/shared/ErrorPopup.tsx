import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { NEPALI_THEME } from '../../constants/theme';

interface ErrorPopupProps {
  visible: boolean;
  message: string;
  onDismiss: () => void;
}

export function ErrorPopup({ visible, message, onDismiss }: ErrorPopupProps) {
  if (!visible) return null;

  return (
    <BlurView intensity={80} style={styles.overlay}>
      <View style={styles.popup}>
        <Ionicons name="alert-circle" size={48} color={NEPALI_THEME.error} />
        <Text style={styles.title}>प्रशोधन त्रुटि</Text>
        <Text style={styles.message}>{message}</Text>
        <Text style={styles.fallbackMessage}>
          फलब्याक परिणामहरू देखाइँदैछ...
        </Text>
        <TouchableOpacity style={styles.button} onPress={onDismiss}>
          <Text style={styles.buttonText}>ठीक छ</Text>
        </TouchableOpacity>
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  popup: {
    backgroundColor: NEPALI_THEME.surface,
    borderRadius: 16,
    padding: 24,
    width: '80%',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  fallbackMessage: {
    fontSize: 14,
    color: NEPALI_THEME.secondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    backgroundColor: NEPALI_THEME.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 