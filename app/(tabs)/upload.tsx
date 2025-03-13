import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  useWindowDimensions,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { LinearGradient } from 'expo-linear-gradient';
import { NEPALI_THEME } from '../../constants/theme';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ResultView } from '../../components/shared/ResultView';
import { MediaProcessingService } from '../../services/MediaProcessingService';
import type { ProcessedResult } from '../../types/camera';
import { BlurView } from 'expo-blur';

const MOCK_CAPTIONS = [
  'सुरुवाती दृश्य: परम्परागत नेपाली वातावरण',
  'मध्य भाग: स्थानीय जीवनशैली',
  'महत्वपूर्ण क्षण: सामुदायिक गतिविधि',
  'विशेष दृश्य: सांस्कृतिक कार्यक्रम',
  'अन्तिम दृश्य: समापन दृश्य'
];

export default function UploadScreen() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ProcessedResult | null>(null);
  const [mediaUri, setMediaUri] = useState<string | null>(null);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        handleMediaUpload(result.assets[0].uri, 'image');
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('त्रुटि', 'तस्बिर छान्न सकिएन');
    }
  };

  const pickVideo = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 1,
        videoMaxDuration: 60,
      });

      if (!result.canceled && result.assets[0]) {
        handleMediaUpload(result.assets[0].uri, 'video');
      }
    } catch (error) {
      console.error('Video picker error:', error);
      Alert.alert('त्रुटि', 'भिडियो छान्न सकिएन');
    }
  };

  const handleMediaUpload = async (uri: string, type: 'image' | 'video') => {
    try {
      setIsProcessing(true);
      const processedResult = await MediaProcessingService.processMedia(uri, type);
      setResult(processedResult);
      setMediaUri(uri);
    } catch (error) {
      console.error('Upload processing error:', error);
      Alert.alert('त्रुटि', 'फाइल प्रशोधन गर्न सकिएन');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setMediaUri(null);
  };

  if (result && mediaUri) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Stack.Screen
          options={{
            title: 'अपलोड',
            headerStyle: {
              backgroundColor: NEPALI_THEME.background,
            },
            headerTintColor: NEPALI_THEME.text,
          }}
        />
        <ScrollView style={styles.scrollView}>
          <ResultView
            result={result}
            mediaUri={mediaUri}
            onReset={handleReset}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen
        options={{
          title: 'अपलोड',
          headerStyle: {
            backgroundColor: NEPALI_THEME.background,
          },
          headerTintColor: NEPALI_THEME.text,
        }}
      />
      
      <BlurView intensity={20} style={styles.content}>
        <View style={styles.uploadOptions}>
          <TouchableOpacity 
            style={styles.uploadButton}
            onPress={pickImage}
            disabled={isProcessing}>
            <LinearGradient
              colors={[NEPALI_THEME.primary, NEPALI_THEME.secondary]}
              style={styles.buttonGradient}>
              <Ionicons name="image" size={32} color="#fff" />
              <Text style={styles.buttonText}>तस्बिर अपलोड</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.uploadButton}
            onPress={pickVideo}
            disabled={isProcessing}>
            <LinearGradient
              colors={[NEPALI_THEME.primary, NEPALI_THEME.secondary]}
              style={styles.buttonGradient}>
              <Ionicons name="videocam" size={32} color="#fff" />
              <Text style={styles.buttonText}>भिडियो अपलोड</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {isProcessing && (
          <View style={styles.processingOverlay}>
            <ActivityIndicator size="large" color={NEPALI_THEME.primary} />
            <Text style={styles.processingText}>
              फाइल प्रशोधन गरिँदैछ...
            </Text>
          </View>
        )}
      </BlurView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NEPALI_THEME.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  uploadOptions: {
    gap: 20,
  },
  uploadButton: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonGradient: {
    padding: 20,
    alignItems: 'center',
    gap: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  processingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
});