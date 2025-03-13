import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Image, Dimensions } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { LinearGradient } from 'expo-linear-gradient';
import { NEPALI_THEME } from '../../constants/theme';
import type { ProcessedResult } from '../../types/camera';

type ResultViewProps = {
  result: ProcessedResult;
  isTablet: boolean;
  mediaUri: string;
  onReset: () => void;
};

export function ResultView({ result, isTablet, mediaUri, onReset }: ResultViewProps) {
  const video = React.useRef<Video>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [status, setStatus] = React.useState({});
  const { height: screenHeight } = Dimensions.get('window');
  const BOTTOM_TAB_HEIGHT = Platform.select({ ios: 80, android: 60, default: 60 });
  React.useEffect(() => {
    return () => {
      // Cleanup speech when component unmounts or resets
      Speech.stop();
    };
  }, []);

  const handleReset = () => {
    Speech.stop();
    setIsPlaying(false);
    onReset();
  };

  const speakSummary = async () => {
    try {
      await Speech.stop();
      const voices = await Speech.getAvailableVoicesAsync();
      const nepaliVoice = voices.find(voice => 
        voice.language === 'ne-NP' || 
        voice.identifier.toLowerCase().includes('nepali') ||
        voice.language === 'hi-IN'
      );

      setIsPlaying(true);
      await Speech.speak(result.summary, {
        language: nepaliVoice?.language || 'ne-NP',
        voice: nepaliVoice?.identifier,
        pitch: 1.0,
        rate: 0.75,
      });
    } catch (error) {
      console.error('Speech error:', error);
    } finally {
      setIsPlaying(false);
    }
  };

  return (
    <ScrollView 
      style={[styles.container, isTablet && styles.containerTablet]}
      contentContainerStyle={[styles.contentContainer, { paddingBottom: BOTTOM_TAB_HEIGHT + 20 }]}
      showsVerticalScrollIndicator={false}>
      <View style={styles.previewContainer}>
        {result.type === 'image' ? (
          <Image 
            source={{ uri: mediaUri }} 
            style={[styles.preview, isTablet && styles.previewTablet]} 
            resizeMode="contain"
          />
        ) : (
          <View style={[styles.preview, isTablet && styles.previewTablet]}>
            <Video
              ref={video}
              style={styles.video}
              source={{ uri: mediaUri }}
              useNativeControls={false}
              resizeMode={ResizeMode.CONTAIN}
              isLooping={true}
              onPlaybackStatusUpdate={status => setStatus(() => status)}
            />
            <View style={styles.videoControls}>
              <TouchableOpacity 
                style={styles.videoButton}
                onPress={() => {
                  if (isPlaying) {
                    video.current?.pauseAsync();
                  } else {
                    video.current?.playAsync();
                  }
                  setIsPlaying(!isPlaying);
                }}>
                <Ionicons 
                  name={isPlaying ? 'pause' : 'play'} 
                  size={32} 
                  color="#fff" 
                />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.videoButton}
                onPress={() => {
                  video.current?.setPositionAsync(0);
                  video.current?.pauseAsync();
                  setIsPlaying(false);
                }}>
                <Ionicons name="refresh" size={32} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      <View style={styles.card}>
        {result.type === 'image' ? (
          <>
            <View style={styles.headerSection}>
              <Ionicons name="image" size={24} color={NEPALI_THEME.primary} />
              <Text style={[styles.title, isTablet && styles.titleTablet]}>
                तस्विर विश्लेषण
              </Text>
            </View>
            
            <View style={styles.captionContainer}>
              <Text style={[styles.caption, isTablet && styles.captionTablet]}>
                {result.caption}
              </Text>
              <TouchableOpacity style={styles.copyButton}>
                <Ionicons name="copy-outline" size={20} color={NEPALI_THEME.primary} />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <View style={styles.headerSection}>
              <Ionicons name="videocam" size={24} color={NEPALI_THEME.primary} />
              <Text style={[styles.title, isTablet && styles.titleTablet]}>
                भिडियो विश्लेषण
              </Text>
            </View>
            
            <View style={styles.framesGrid}>
              {result.videoFrames?.slice(0, 5).map((frame, index) => (
                <View key={index} style={styles.frameContainer}>
                  <View style={styles.frameImageContainer}>
                    <Image 
                      source={{ uri: frame.image }} 
                      style={styles.frameImage}
                      resizeMode="cover"
                    />
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.8)']}
                      style={styles.frameGradient}
                    />
                    <View style={styles.frameTimeBadge}>
                      <Text style={styles.frameTimeText}>
                        {frame.timestamp}s
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.frameCaption}>
                    {frame.caption}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}

        <View style={styles.divider} />

        <TouchableOpacity 
          style={[styles.recaptureButton, isTablet && styles.recaptureButtonTablet]} 
          onPress={handleReset}
        >
          <Ionicons name="camera-reverse" size={24} color="#fff" />
          <Text style={styles.recaptureText}>अर्को लिनुहोस्</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <View style={styles.headerSection}>
          <Ionicons name="document-text" size={24} color={NEPALI_THEME.primary} />
          <Text style={[styles.title, isTablet && styles.titleTablet]}>
            सारांश
          </Text>
        </View>

        <View style={styles.summaryContainer}>
          <Text style={[styles.summary, isTablet && styles.summaryTablet]}>
            {result.summary}
          </Text>
          <TouchableOpacity 
            style={styles.audioButton}
            onPress={speakSummary}
            disabled={isPlaying}>
            <Ionicons name="volume-high" size={24} color="#fff" />
            <Text style={styles.audioButtonText}>सारांश सुन्नुहोस्</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  video: {
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
  },
  videoControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  videoButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: NEPALI_THEME.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  previewContainer: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: NEPALI_THEME.primary,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: 'black',
  },
  preview: {
    width: '100%',
    height: 350,
    backgroundColor: 'black',
  },
  previewTablet: {
    height: 450,
  },
  recaptureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: NEPALI_THEME.primary,
    padding: 12,
    borderRadius: 12,
    gap: 8,
    marginVertical: 16,
  },
  recaptureButtonTablet: {
    padding: 16,
    borderRadius: 16,
  },
  recaptureText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  container: {
    flex: 1,
    padding: Platform.select({ web: 40, default: 16 }),
    backgroundColor: '#f5f5f5',
  },
  containerTablet: {
    padding: 40,
  },
  card: {
    backgroundColor: NEPALI_THEME.surface,
    borderRadius: 24,
    padding: Platform.select({ web: 32, default: 20 }),
    borderWidth: 1,
    borderColor: `${NEPALI_THEME.primary}30`,
    shadowColor: NEPALI_THEME.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginHorizontal: 2,
  },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  titleTablet: {
    fontSize: 28,
  },
  captionContainer: {
    backgroundColor: `${NEPALI_THEME.primary}10`,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: `${NEPALI_THEME.primary}20`,
  },
  framesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  frameContainer: {
    flex: 1,
    minWidth: Platform.select({ web: 200, default: '45%' }),
    maxWidth: Platform.select({ web: 300, default: '45%' }),
    backgroundColor: `${NEPALI_THEME.primary}10`,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: `${NEPALI_THEME.primary}20`,
  },
  frameImageContainer: {
    position: 'relative',
    width: '100%',
    height: 150,
  },
  frameImage: {
    width: '100%',
    height: '100%',
  },
  frameGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  frameTimeBadge: {
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
    fontWeight: 'bold',
  },
  frameCaption: {
    color: '#fff',
    fontSize: 14,
    padding: 12,
    lineHeight: 20,
  },
  caption: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
  },
  captionTablet: {
    fontSize: 18,
    lineHeight: 28,
  },
  copyButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 8,
    borderRadius: 12,
    backgroundColor: `${NEPALI_THEME.primary}20`,
  },
  divider: {
    height: 1,
    backgroundColor: `${NEPALI_THEME.primary}30`,
    marginVertical: 32,
  },
  summaryContainer: {
    backgroundColor: `${NEPALI_THEME.primary}10`,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: `${NEPALI_THEME.primary}20`,
  },
  summary: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  summaryTablet: {
    fontSize: 18,
    lineHeight: 28,
  },
  audioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: NEPALI_THEME.primary,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  audioButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});