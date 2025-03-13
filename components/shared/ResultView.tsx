import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  useWindowDimensions,
  Alert,
  Platform,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';
import * as Speech from 'expo-speech';
import { LinearGradient } from 'expo-linear-gradient';
import { NEPALI_THEME } from '../../constants/theme';
import type { ProcessedResult as MediaProcessedResult } from '../../types/camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as FileSystem from 'expo-file-system';
import { BlurView } from 'expo-blur';
import { ErrorPopup } from './ErrorPopup';
import { AudioButton } from './AudioButton';
import { Audio } from 'expo-av';

interface ResultViewProps {
  result: MediaProcessedResult;
  mediaUri: string;
  onReset: () => void;
}

// Update the fallback images
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1581591524425-c7e0978865fc?w=800';
const LOADING_PLACEHOLDER = 'https://images.unsplash.com/photo-1614850715649-1d0106293bd1?w=800';

const FALLBACK_RESULTS = {
  image: {
    caption: "माफ गर्नुहोस्, तस्बिर प्रशोधन गर्न सकिएन। कृपया पुन: प्रयास गर्नुहोस्।",
    audio: null,
    type: 'image' as const,
  },
  video: {
    type: 'video' as const,
    videoFrames: [
      {
        timestamp: 0,
        image: FALLBACK_IMAGE,
        caption: "भिडियो प्रशोधन गर्न सकिएन",
        audio: null
      }
    ],
    summary: "माफ गर्नुहोस्, भिडियो प्रशोधन गर्न सकिएन। कृपया पुन: प्रयास गर्नुहोस्।",
    summaryAudio: null
  }
};

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

interface VideoFrame {
  timestamp: number;
  image: string;
  caption: string;
  audio?: string | null;
}

interface ProcessedResult {
  type: 'image' | 'video';
  caption?: string;
  summary?: string;
  videoFrames?: VideoFrame[];
  audio?: string | null;
  summaryAudio?: string | null;
}

export function ResultView({ result, mediaUri, onReset }: ResultViewProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedFrame, setSelectedFrame] = useState<VideoFrame | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<Video>(null);
  const insets = useSafeAreaInsets();
  const [error, setError] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const playAudio = async (audioUri: string | null) => {
    try {
      if (!audioUri) {
        console.log('No audio URI provided');
        return false;
      }

      console.log('Playing audio from:', audioUri);

      // Check if file exists
      const fileInfo = await FileSystem.getInfoAsync(audioUri);
      if (!fileInfo.exists) {
        console.error('Audio file does not exist:', audioUri);
        return false;
      }

      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
      }

      console.log('Loading audio...');
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUri },
        { shouldPlay: true },
        (status) => {
          console.log('Loading status:', status);
        }
      );

      console.log('Audio loaded successfully');
      setSound(newSound);
      setIsSpeaking(true);

      newSound.setOnPlaybackStatusUpdate(status => {
        if (status.isLoaded) {
          if (status.didJustFinish) {
            console.log('Audio playback finished');
            setIsSpeaking(false);
          } else if (status.error) {
            console.error('Audio playback error:', status.error);
            setIsSpeaking(false);
            setError('आवाज चलाउन सकिएन');
          }
        }
      });

      return true;
    } catch (error) {
      console.error('Error playing audio:', error);
      setError('आवाज चलाउन सकिएन');
      return false;
    }
  };

  const handleSpeech = async () => {
    try {
      if (isSpeaking) {
        if (sound) {
          await sound.stopAsync();
          await sound.unloadAsync();
          setSound(null);
        }
        setIsSpeaking(false);
        return;
      }

      // Determine which audio to play
      let audioToPlay = null;
      if (result.type === 'image') {
        audioToPlay = result.audio;
        console.log('Using image audio:', audioToPlay);
      } else if (selectedFrame?.audio) {
        audioToPlay = selectedFrame.audio;
        console.log('Using frame audio:', audioToPlay);
      } else if (result.summaryAudio) {
        audioToPlay = result.summaryAudio;
        console.log('Using summary audio:', audioToPlay);
      }

      // Try to play audio file first
      const played = await playAudio(audioToPlay);
      
      if (!played) {
        console.log('Audio playback failed, falling back to TTS');
        const textToSpeak = result.type === 'image' 
          ? `${result.caption}. ${result.summary}`
          : selectedFrame?.caption || result.summary || '';

        const voices = await Speech.getAvailableVoicesAsync();
        const nepaliVoice = voices.find(v => v.language === 'ne-NP');
        const hindiVoice = voices.find(v => v.language === 'hi-IN');
        
        setIsSpeaking(true);
        await Speech.speak(textToSpeak, {
          language: nepaliVoice ? 'ne-NP' : 'hi-IN',
          voice: nepaliVoice?.identifier || hindiVoice?.identifier,
          pitch: 1.0,
          rate: 0.75,
          onDone: () => setIsSpeaking(false),
          onError: () => {
            setIsSpeaking(false);
            Alert.alert('Error', 'आवाज चलाउन सकिएन');
          }
        });
      }
    } catch (err) {
      console.error('Speech error:', err);
      setIsSpeaking(false);
      setError('आवाज चलाउन सकिएन');
    }
  };

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const handleProcessingError = (err: Error) => {
    setError(err.message);
    // Show error popup for 3 seconds
    setTimeout(() => setError(null), 3000);
  };

  return (
    <View style={styles.container}>
      <ErrorPopup
        visible={!!error}
        message={error || ''}
        onDismiss={() => setError(null)}
      />

      <ScrollView style={styles.scrollView}>
        {/* Media Section */}
        <View style={styles.mediaSection}>
          {result.type === 'video' ? (
            <Video
              ref={videoRef}
              source={{ uri: mediaUri }}
              style={styles.media}
              resizeMode={ResizeMode.CONTAIN}
              useNativeControls
              isLooping
              onPlaybackStatusUpdate={status => {
                if (status.isLoaded) {
                  setIsPlaying(status.isPlaying);
                }
              }}
            />
          ) : (
            <Image
              source={{ uri: mediaUri }}
              style={styles.media}
              resizeMode="contain"
              onLoad={() => setIsImageLoaded(true)}
            />
          )}
        </View>

        {/* Caption Card */}
        <LinearGradient
          colors={[NEPALI_THEME.surface, 'rgba(42,42,42,0.8)']}
          style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>विवरण</Text>
            <AudioButton
              isPlaying={isSpeaking}
              onPress={handleSpeech}
              isLoading={false}
            />
          </View>
          <Text style={styles.captionText}>{result.caption}</Text>
        </LinearGradient>

        {/* Video Frames */}
        {result.type === 'video' && result.videoFrames && (
          <View style={styles.framesSection}>
            <Text style={styles.sectionTitle}>महत्वपूर्ण दृश्यहरू</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.framesScroll}>
              {result.videoFrames.map((frame, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.frameCard}
                  onPress={() => setSelectedFrame(frame)}>
                  <Image
                    source={{ uri: frame.image }}
                    style={styles.frameImage}
                    resizeMode="cover"
                  />
                  <BlurView intensity={80} style={styles.frameCaption}>
                    <Text style={styles.frameCaptionText} numberOfLines={2}>
                      {frame.caption}
                    </Text>
                    <Text style={styles.frameTimestamp}>
                      {formatTime(frame.timestamp)}
                    </Text>
                  </BlurView>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Summary Section */}
        <LinearGradient
          colors={[NEPALI_THEME.surface, 'rgba(42,42,42,0.8)']}
          style={[styles.card, styles.summaryCard]}>
          <Text style={styles.cardTitle}>सारांश</Text>
          <Text style={styles.summaryText}>{result.summary}</Text>
        </LinearGradient>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.resetButton}
            onPress={onReset}>
            <LinearGradient
              colors={[NEPALI_THEME.secondary, NEPALI_THEME.primary]}
              style={styles.buttonGradient}>
              <Ionicons name="camera" size={24} color="#fff" />
              <Text style={styles.buttonText}>नयाँ तस्बिर</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Frame Detail Modal */}
      <Modal
        visible={!!selectedFrame}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedFrame(null)}>
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSelectedFrame(null)}>
          <View style={styles.modalContent}>
            <Image 
              source={{ uri: selectedFrame?.image }}
              style={styles.modalImage}
              resizeMode="contain"
            />
            <BlurView intensity={80} style={styles.modalCaption}>
              <Text style={styles.modalCaptionText}>
                {selectedFrame?.caption}
              </Text>
            </BlurView>
            <TouchableOpacity 
              style={styles.modalClose}
              onPress={() => setSelectedFrame(null)}>
              <Ionicons name="close-circle" size={32} color="#fff" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NEPALI_THEME.background,
  },
  scrollView: {
    flex: 1,
  },
  mediaSection: {
    width: '100%',
    aspectRatio: 16/9,
    backgroundColor: '#000',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  media: {
    width: '100%',
    height: '100%',
  },
  card: {
    backgroundColor: NEPALI_THEME.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: `${NEPALI_THEME.primary}20`,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: NEPALI_THEME.primary,
  },
  captionText: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 24,
  },
  framesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: NEPALI_THEME.primary,
    marginBottom: 12,
  },
  framesScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  frameCard: {
    width: 160,
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: NEPALI_THEME.surface,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  frameImage: {
    width: '100%',
    height: 120,
  },
  frameCaption: {
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  frameCaptionText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
  },
  frameTimestamp: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: NEPALI_THEME.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  frameTimeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  summaryCard: {
    backgroundColor: `${NEPALI_THEME.primary}10`,
  },
  summaryText: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  resetButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: NEPALI_THEME.surface,
    borderRadius: 20,
    overflow: 'hidden',
  },
  modalImage: {
    width: '100%',
    height: 300,
  },
  modalCaption: {
    padding: 20,
  },
  modalCaptionText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
  },
  modalClose: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  }
});