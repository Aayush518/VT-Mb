import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { ConfigService } from '../../services/ConfigService';
import { NEPALI_THEME } from '../../constants/theme';
import { ApiService } from '../../services/ApiService';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { ApiDebugger } from '../../components/shared/ApiDebugger';
import { NetworkIndicator } from '../../components/shared/NetworkIndicator';

export default function SettingsScreen() {
  const [baseUrl, setBaseUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadCurrentUrl();
  }, []);

  const loadCurrentUrl = async () => {
    try {
      const currentUrl = await ConfigService.getBaseUrl();
      if (currentUrl) {
        setBaseUrl(currentUrl);
      }
    } catch (error) {
      console.error('Failed to load base URL:', error);
      Alert.alert('त्रुटि', 'सेटिङ्स लोड गर्न सकिएन');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!baseUrl.trim()) {
      Alert.alert('त्रुटि', 'कृपया API URL प्रविष्ट गर्नुहोस्');
      return;
    }

    setIsSaving(true);
    try {
      const success = await ConfigService.setBaseUrl(baseUrl.trim());
      if (success) {
        Alert.alert('सफल', 'API URL सफलतापूर्वक सेट गरियो');
      } else {
        Alert.alert('त्रुटि', 'API URL सेट गर्न सकिएन');
      }
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('त्रुटि', 'API URL सेट गर्न सकिएन');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={NEPALI_THEME.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen
        options={{
          title: 'सेटिङ्स',
          headerStyle: {
            backgroundColor: NEPALI_THEME.background,
          },
          headerTintColor: NEPALI_THEME.text,
        }}
      />

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <NetworkIndicator />
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>API बेस URL</Text>
            <TextInput
              style={styles.input}
              value={baseUrl}
              onChangeText={setBaseUrl}
              placeholder="उदाहरण: http://api.example.com"
              placeholderTextColor={NEPALI_THEME.textSecondary}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <TouchableOpacity
            onPress={handleSave}
            disabled={isSaving}
            style={styles.buttonContainer}>
            <LinearGradient
              colors={[NEPALI_THEME.primary, NEPALI_THEME.secondary]}
              style={styles.button}>
              {isSaving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>सेभ गर्नुहोस्</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          {/* API Debugger */}
          <Text style={styles.sectionTitle}>API डिबगर</Text>
          <ApiDebugger />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NEPALI_THEME.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: NEPALI_THEME.background,
  },
  content: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: NEPALI_THEME.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 12,
    color: NEPALI_THEME.text,
    fontSize: 16,
  },
  buttonContainer: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  button: {
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: NEPALI_THEME.text,
    marginBottom: 16,
  },
});