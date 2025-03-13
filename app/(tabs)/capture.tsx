import React, { useCallback, useState, useRef } from 'react';
import { useFocusEffect } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import { CameraView } from '../../components/camera/CameraView';
import { ResultView } from '../../components/shared/ResultView';
import { useCamera } from '../../hooks/useCamera';
import { NEPALI_THEME } from '../../constants/theme';
import { MediaProcessingService } from '../../services/MediaProcessingService';
import type { ProcessedResult } from '../../types/camera';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Camera } from 'expo-camera';

export default function CaptureScreen() {
  const {
    cameraRef,
    type,
    hasPermission,
    isReady,
    handleCameraReady,
    flipCamera,
  } = useCamera();

  const [mode, setMode] = useState<'photo' | 'video'>('photo');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ProcessedResult | null>(null);
  const [capturedMedia, setCapturedMedia] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const recordingTimer = useRef<NodeJS.Timeout>();
  const insets = useSafeAreaInsets();

  useFocusEffect(
    useCallback(() => {
      return () => {
        if (recordingTimer.current) {
          clearInterval(recordingTimer.current);
        }
      };
    }, [])
  );

  const handleCapture = async () => {
    if (!cameraRef.current || !isReady) {
      Alert.alert('त्रुटि', 'क्यामेरा तयार छैन');
      return;
    }

    try {
      setIsProcessing(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
        base64: false,
      });

      const result = await MediaProcessingService.processMedia(photo.uri, 'image');
      setResult(result);
      setCapturedMedia(photo.uri);
    } catch (error) {
      console.error('Capture error:', error);
      Alert.alert('त्रुटि', 'तस्बिर खिच्न सकिएन');
    } finally {
      setIsProcessing(false);
    }
  };

  const startRecording = async () => {
    if (!cameraRef.current || !isReady) {
      Alert.alert('त्रुटि', 'क्यामेरा तयार छैन');
      return;
    }

    try {
      setIsRecording(true);
      setRecordingDuration(0);
      
      recordingTimer.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

      const video = await cameraRef.current.recordAsync({
        maxDuration: 60,
        quality: Camera.Constants.VideoQuality['720p'],
        mute: false,
      });

      const result = await MediaProcessingService.processMedia(video.uri, 'video');
      setResult(result);
      setCapturedMedia(video.uri);
    } catch (error) {
      console.error('Recording error:', error);
      Alert.alert('त्रुटि', 'भिडियो रेकर्ड गर्न सकिएन');
    } finally {
      setIsRecording(false);
      if (recordingTimer.current) {
        clearInterval(recordingTimer.current);
      }
    }
  };

  const stopRecording = async () => {
    try {
      if (!cameraRef.current) return;
      await cameraRef.current.stopRecording();
    } catch (error) {
      console.error('Stop recording error:', error);
    }
  };

  const handleReset = () => {
    setCapturedMedia(null);
    setResult(null);
    setIsProcessing(false);
    setRecordingDuration(0);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={NEPALI_THEME.primary} />
        <Text style={styles.loadingText}>क्यामेरा तयार गर्दै...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>क्यामेरा चलाउन अनुमति छैन</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => Camera.requestCameraPermissionsAsync()}>
          <Text style={styles.retryText}>अनुमति दिनुहोस्</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (capturedMedia && result) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={{ 
            paddingBottom: insets.bottom + 80 
          }}>
          <ResultView
            result={result}
            mediaUri={capturedMedia}
            onReset={handleReset}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <CameraView
        cameraRef={cameraRef}
        type={type}
        onTypeChange={flipCamera}
        onTakePicture={handleCapture}
        mode={mode}
        onModeChange={() => setMode(current => current === 'photo' ? 'video' : 'photo')}
        isRecording={isRecording}
        onStartRecording={startRecording}
        onStopRecording={stopRecording}
        recordingDuration={recordingDuration}
        onCameraReady={handleCameraReady}
      />
      {isProcessing && (
        <View style={styles.processingOverlay}>
          <ActivityIndicator size="large" color={NEPALI_THEME.primary} />
          <Text style={styles.processingText}>
            {mode === 'photo' ? 'तस्बिर' : 'भिडियो'} प्रशोधन गरिँदैछ...
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NEPALI_THEME.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: NEPALI_THEME.background,
  },
  loadingText: {
    color: NEPALI_THEME.text,
    fontSize: 16,
    marginTop: 12,
  },
  errorText: {
    color: NEPALI_THEME.text,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: NEPALI_THEME.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 14,
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