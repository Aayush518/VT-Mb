import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { NEPALI_THEME } from '../../constants/theme';
import { ConfigService } from '../../services/ConfigService';
import axios from 'axios';
import { MediaProcessingService } from '../../services/MediaProcessingService';

export default function TTSScreen() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const [text, setText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableVoices, setAvailableVoices] = useState<Speech.Voice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [useCustomApi, setUseCustomApi] = useState(true);

  useEffect(() => {
    loadVoices();
    // Initialize audio
    return () => {
      // Clean up any sound when component unmounts
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const loadVoices = async () => {
    try {
      const voices = await Speech.getAvailableVoicesAsync();
      setAvailableVoices(voices);
    } catch (err) {
      console.error('Failed to load voices:', err);
    }
  };

  const findBestNepaliVoice = () => {
    return availableVoices.find(voice => 
      voice.language === 'ne-NP' || 
      voice.identifier.toLowerCase().includes('nepali') ||
      voice.language === 'hi-IN' // Fallback to Hindi if Nepali not available
    );
  };

  const speakText = async () => {
    try {
      setError(null);
      if (!text.trim()) {
        setError('कृपया बोल्नको लागि केही पाठ लेख्नुहोस्');
        return;
      }

      setIsPlaying(true);
      setIsLoading(true);
      
      if (useCustomApi) {
        await speakWithCustomApi();
      } else {
        await speakWithExpoSpeech();
      }
    } catch (err) {
      console.error('TTS error:', err);
      setError('स्पीच इनिसियलाइज गर्न असफल। कृपया पुन: प्रयास गर्नुहोस्।');
      setIsPlaying(false);
      setIsLoading(false);
    }
  };

  // Use custom API for TTS
  const speakWithCustomApi = async () => {
    try {
      // First check network connectivity
      const isConnected = await MediaProcessingService.isConnected();
      if (!isConnected) {
        throw new Error('No network connectivity');
      }

      const config = await ConfigService.getAPIEndpoints();
      if (!config?.textToAudioAPI) {
        throw new Error('TTS API endpoint not configured');
      }

      console.log(`Sending text to TTS API: ${config.textToAudioAPI}`);
      
      const response = await axios.post(
        config.textToAudioAPI,
        { 
          text,
          format: "base64"
        },
        { 
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          timeout: 30000,
        }
      );

      if (response.data && response.data.audio) {
        console.log('Successfully received audio data in base64 format');
        const audioBase64 = response.data.audio;
        const audioFilePath = `${FileSystem.documentDirectory}temp_tts_${Date.now()}.mp3`;
        
        await FileSystem.writeAsStringAsync(
          audioFilePath,
          audioBase64,
          { encoding: FileSystem.EncodingType.Base64 }
        );

        // Play the audio
        await playAudioFile(audioFilePath);
      } else {
        console.log('No audio data in response, falling back to expo-speech');
        await speakWithExpoSpeech();
      }
    } catch (error) {
      console.error('Custom TTS API error:', error);
      console.log('Falling back to expo-speech');
      await speakWithExpoSpeech();
    }
  };

  // Play audio from file
  const playAudioFile = async (audioPath: string) => {
    try {
      // Unload any previous sound
      if (sound) {
        await sound.unloadAsync();
      }
      
      console.log(`Playing audio from: ${audioPath}`);
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioPath },
        { shouldPlay: true }
      );
      
      setSound(newSound);
      setIsLoading(false);
      
      // Listen for playback status
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          if (status.didJustFinish) {
            setIsPlaying(false);
          }
        }
      });
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
      setIsLoading(false);
      setError('अडियो प्ले गर्न असफल। कृपया पुन: प्रयास गर्नुहोस्।');
    }
  };

  // Fallback to Expo Speech
  const speakWithExpoSpeech = async () => {
    const nepaliVoice = findBestNepaliVoice();
    
    await Speech.speak(text, {
      language: nepaliVoice?.language || 'ne-NP',
      voice: nepaliVoice?.identifier,
      pitch: 1.0,
      rate: 0.85,
      onDone: () => {
        setIsPlaying(false);
        setIsLoading(false);
      },
      onError: (error) => {
        setError('अडियो प्ले गर्न असफल। कृपया पुन: प्रयास गर्नुहोस्।');
        setIsPlaying(false);
        setIsLoading(false);
      },
    });
  };

  const stopSpeaking = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    } else {
      Speech.stop();
    }
    setIsPlaying(false);
  };

  const toggleTtsProvider = () => {
    setUseCustomApi(!useCustomApi);
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['rgba(228, 0, 55, 0.2)', 'transparent']}
        style={[styles.header, isTablet && styles.headerTablet]}>
        <Text style={[styles.title, isTablet && styles.titleTablet]}>
          नेपाली पाठ वाचक
        </Text>
        <Text style={[styles.subtitle, isTablet && styles.subtitleTablet]}>
          पाठलाई आवाजमा परिवर्तन गर्नुहोस्
        </Text>
      </LinearGradient>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={[styles.inputContainer, isTablet && styles.inputContainerTablet]}>
        <TextInput
          style={[styles.input, isTablet && styles.inputTablet]}
          multiline
          placeholder="नेपाली भाषामा पाठ लेख्नुहोस्..."
          placeholderTextColor="#666"
          value={text}
          onChangeText={setText}
        />

        <View style={styles.buttonContainer}>
          {isPlaying ? (
            <TouchableOpacity
              style={[styles.button, styles.stopButton]}
              onPress={stopSpeaking}>
              <Ionicons name="stop" size={24} color="#fff" />
              <Text style={styles.buttonText}>रोक्नुहोस्</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.button, styles.playButton]}
              onPress={speakText}>
              <Ionicons name="play" size={24} color="#fff" />
              <Text style={styles.buttonText}>सुन्नुहोस्</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity 
          style={styles.providerToggle} 
          onPress={toggleTtsProvider}>
          <Text style={styles.providerText}>
            {useCustomApi ? 'नेपाली TTS API प्रयोग गर्दै' : 'डिफल्ट स्पीच इन्जिन प्रयोग गर्दै'}
          </Text>
          <Ionicons 
            name={useCustomApi ? 'cloud' : 'phone-portrait'} 
            size={18} 
            color={NEPALI_THEME.primary} 
          />
        </TouchableOpacity>

        {isLoading && (
          <View style={styles.playingContainer}>
            <ActivityIndicator color={NEPALI_THEME.accent} size="large" />
            <Text style={styles.playingText}>लोड गर्दै...</Text>
          </View>
        )}
        
        {isPlaying && !isLoading && (
          <View style={styles.playingContainer}>
            <ActivityIndicator color={NEPALI_THEME.accent} size="large" />
            <Text style={styles.playingText}>बोल्दै...</Text>
          </View>
        )}
      </View>

      <View style={[styles.presets, isTablet && styles.presetsTablet]}>
        <Text style={styles.presetsTitle}>द्रुत वाक्यहरू</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.presetScrollContent}>
          <TouchableOpacity
            style={styles.presetButton}
            onPress={() => setText('नमस्ते, तपाईंलाई कस्तो छ?')}>
            <Text style={styles.presetText}>नमस्ते</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.presetButton}
            onPress={() => setText('धन्यवाद, तपाईंको सहयोगको लागि')}>
            <Text style={styles.presetText}>धन्यवाद</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.presetButton}
            onPress={() => setText('माफ गर्नुहोस्, मलाई थाहा भएन')}>
            <Text style={styles.presetText}>माफ गर्नुहोस्</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.presetButton}
            onPress={() => setText('नमस्कार, म तपाईंलाई कसरी सहयोग गर्न सक्छु?')}>
            <Text style={styles.presetText}>स्वागत</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NEPALI_THEME.background,
  },
  header: {
    padding: 20,
    paddingTop: Platform.select({ ios: 60, android: 40, default: 40 }),
    borderBottomWidth: 1,
    borderBottomColor: `${NEPALI_THEME.primary}30`,
  },
  headerTablet: {
    padding: 40,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(228, 0, 55, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  titleTablet: {
    fontSize: 42,
  },
  subtitle: {
    fontSize: 18,
    color: NEPALI_THEME.primary,
    textAlign: 'center',
    marginTop: 12,
  },
  subtitleTablet: {
    fontSize: 22,
  },
  inputContainer: {
    padding: 20,
  },
  inputContainerTablet: {
    padding: 40,
  },
  input: {
    backgroundColor: NEPALI_THEME.surface,
    borderRadius: 16,
    padding: 20,
    color: '#fff',
    fontSize: 18,
    minHeight: 150,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: `${NEPALI_THEME.primary}50`,
  },
  inputTablet: {
    fontSize: 20,
    minHeight: 200,
    borderRadius: 20,
    padding: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    gap: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    minWidth: 160,
    justifyContent: 'center',
    borderWidth: 2,
  },
  playButton: {
    backgroundColor: NEPALI_THEME.accent,
    borderColor: `${NEPALI_THEME.accent}80`,
  },
  stopButton: {
    backgroundColor: NEPALI_THEME.error,
    borderColor: `${NEPALI_THEME.error}80`,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  playingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    gap: 12,
    backgroundColor: `${NEPALI_THEME.accent}20`,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: `${NEPALI_THEME.accent}40`,
  },
  playingText: {
    color: NEPALI_THEME.accent,
    fontSize: 18,
    fontWeight: '600',
  },
  errorContainer: {
    margin: 20,
    padding: 16,
    backgroundColor: `${NEPALI_THEME.error}20`,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: `${NEPALI_THEME.error}40`,
  },
  errorText: {
    color: NEPALI_THEME.error,
    fontSize: 16,
    textAlign: 'center',
  },
  presets: {
    padding: 20,
  },
  presetsTablet: {
    padding: 40,
  },
  presetsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  presetScrollContent: {
    gap: 12,
    paddingRight: 20,
  },
  presetButton: {
    backgroundColor: NEPALI_THEME.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: `${NEPALI_THEME.primary}30`,
    minWidth: 120,
  },
  presetText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  providerToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    gap: 8,
    padding: 8,
    borderRadius: 16,
    backgroundColor: `${NEPALI_THEME.surface}60`,
    borderWidth: 1,
    borderColor: `${NEPALI_THEME.primary}30`,
  },
  providerText: {
    color: NEPALI_THEME.primary,
    fontSize: 14,
  }
});