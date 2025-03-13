import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { NEPALI_THEME } from '../../constants/theme';
import { BlurView } from 'expo-blur';

interface VideoUploadPreviewProps {
  uri: string;
  onProcess: () => void;
  onRetry: () => void;
  isProcessing?: boolean;
}

export function VideoUploadPreview({ uri, onProcess, onRetry, isProcessing }: VideoUploadPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const videoRef = useRef<Video>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setIsPlaying(status.isPlaying);
      setPosition(status.positionMillis / 1000);
      if (duration === 0 && status.durationMillis) {
        setDuration(status.durationMillis / 1000);
      }
    }
  };

  const togglePlayback = async () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      await videoRef.current.pauseAsync();
    } else {
      await videoRef.current.playAsync();
    }
  };

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={{ uri }}
        style={styles.video}
        resizeMode={ResizeMode.CONTAIN}
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        isLooping
      />

      <BlurView intensity={30} style={styles.controls}>
        <TouchableOpacity onPress={togglePlayback} style={styles.playButton}>
          <Ionicons 
            name={isPlaying ? "pause" : "play"} 
            size={32} 
            color="#fff" 
          />
        </TouchableOpacity>
        
        <Text style={styles.timeText}>
          {formatTime(position)} / {formatTime(duration)}
        </Text>
      </BlurView>

      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.button, styles.retryButton]} 
          onPress={onRetry}>
          <Ionicons name="refresh" size={24} color="#fff" />
          <Text style={styles.buttonText}>पुन: प्रयास</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.processButton]}
          onPress={onProcess}
          disabled={isProcessing}>
          {isProcessing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="arrow-forward" size={24} color="#fff" />
              <Text style={styles.buttonText}>प्रशोधन गर्नुहोस्</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NEPALI_THEME.background,
  },
  video: {
    flex: 1,
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeText: {
    color: '#fff',
    fontSize: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 16,
    padding: 16,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  retryButton: {
    backgroundColor: NEPALI_THEME.error,
  },
  processButton: {
    backgroundColor: NEPALI_THEME.success,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 