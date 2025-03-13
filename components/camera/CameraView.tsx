import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity, Platform } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { NEPALI_THEME } from '../../constants/theme';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

interface CameraViewProps {
  cameraRef: React.RefObject<Camera>;
  type: CameraType;
  onTypeChange: () => void;
  onTakePicture: () => Promise<void>;
  mode: 'photo' | 'video';
  onModeChange: () => void;
  isRecording: boolean;
  onStartRecording: () => Promise<void>;
  onStopRecording: () => Promise<void>;
  recordingDuration: number;
  onCameraReady: () => void;
}

export function CameraView({
  cameraRef,
  type,
  onTypeChange,
  onTakePicture,
  mode,
  onModeChange,
  isRecording,
  onStartRecording,
  onStopRecording,
  recordingDuration,
  onCameraReady,
}: CameraViewProps) {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  const handleCameraReady = useCallback(() => {
    console.log('Camera ready event fired');
    setIsReady(true);
    setError(null);
  }, []);

  const handleError = useCallback((err: any) => {
    console.error('Camera error:', err);
    setError('क्यामेरा चलाउन समस्या भयो');
    setIsReady(false);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCapture = async () => {
    if (mode === 'photo') {
      await onTakePicture();
    } else {
      if (isRecording) {
        await onStopRecording();
      } else {
        await onStartRecording();
      }
    }
  };

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => setError(null)}>
          <Text style={styles.retryText}>पुन: प्रयास गर्नुहोस्</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={type}
        ref={cameraRef}
        onCameraReady={onCameraReady}
        useCamera2Api={Platform.OS === 'android'}
        ratio="16:9"
        autoFocus={Camera.Constants.AutoFocus.ON}
        flashMode={Camera.Constants.FlashMode.AUTO}
        onMountError={(error) => {
          console.error('Camera mount error:', error);
          setError('क्यामेरा चलाउन समस्या भयो');
        }}
        onError={(error) => {
          console.error('Camera error:', error);
          setError('क्यामेरा चलाउन समस्या भयो');
        }}
      >
        <BlurView intensity={20} style={styles.controls}>
          {/* Top Controls */}
          <SafeAreaView style={styles.topControls}>
            <TouchableOpacity 
              style={styles.flipButton}
              onPress={onTypeChange}>
              <Ionicons name="camera-reverse" size={28} color="#fff" />
            </TouchableOpacity>

            {isRecording && (
              <View style={styles.recordingIndicator}>
                <View style={styles.recordingDot} />
                <Text style={styles.timerText}>
                  {formatDuration(recordingDuration)}
                </Text>
              </View>
            )}

            <View style={styles.modeSelector}>
              {['photo', 'video'].map((m) => (
                <TouchableOpacity 
                  key={m}
                  style={[
                    styles.modeOption,
                    mode === m && styles.activeModeOption
                  ]}
                  onPress={() => onModeChange()}>
                  <Ionicons 
                    name={m === 'photo' ? 'camera' : 'videocam'} 
                    size={24} 
                    color="#fff" 
                  />
                  <Text style={styles.modeText}>
                    {m === 'photo' ? 'फोटो' : 'भिडियो'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </SafeAreaView>

          {/* Bottom Controls */}
          <SafeAreaView style={styles.bottomControls}>
            <TouchableOpacity 
              style={[styles.captureButton, isRecording && styles.recordingButton]}
              onPress={handleCapture}>
              <LinearGradient
                colors={isRecording ? 
                  ['#ff0000', '#cc0000'] : 
                  [NEPALI_THEME.primary, NEPALI_THEME.secondary]
                }
                style={styles.captureGradient}>
                {mode === 'photo' ? (
                  <View style={styles.photoButton} />
                ) : (
                  <View style={[
                    styles.videoButton,
                    isRecording && styles.stopButton
                  ]} />
                )}
              </LinearGradient>
            </TouchableOpacity>
          </SafeAreaView>
        </BlurView>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  controls: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  flipButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modeSelector: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 30,
    padding: 6,
    gap: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  activeModeOption: {
    backgroundColor: NEPALI_THEME.primary,
  },
  modeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff0000',
    opacity: 0.8,
    animation: 'pulse 1s infinite',
  },
  timerText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomControls: {
    alignItems: 'center',
    paddingBottom: Platform.select({
      ios: 100,
      android: 80,
    }),
    marginBottom: Platform.select({
      ios: 20,
      android: 40,
    }),
  },
  captureButton: {
    width: 84,
    height: 84,
    borderRadius: 42,
    padding: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  captureGradient: {
    flex: 1,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  videoButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#ff0000',
  },
  stopButton: {
    width: 24,
    height: 24,
    borderRadius: 4,
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,0,0,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ff0000',
    gap: 8,
  },
  recordingTimer: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  recordingButton: {
    backgroundColor: 'rgba(255,0,0,0.3)',
    borderColor: '#ff0000',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: NEPALI_THEME.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: NEPALI_THEME.error,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: NEPALI_THEME.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});