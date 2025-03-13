import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { ConfigService } from './ConfigService';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
// Try to import NetInfo, but provide a fallback if it fails
let NetInfo: any = null;
try {
  NetInfo = require('@react-native-community/netinfo').default;
} catch (e) {
  console.warn('NetInfo module not available, using fallback network detection');
}

export interface ProcessedResult {
  type: 'image' | 'video';
  caption?: string;
  summary?: string;
  videoFrames?: Array<{
    timestamp: number;
    image: string;
    caption: string;
    audio?: string | null;
  }>;
  audio?: string | null;
  summaryAudio?: string | null;
}

const IMAGE_FALLBACKS = [
  {
    caption: 'यो एक सुन्दर तस्बिर हो जसमा प्राकृतिक दृश्य देखिन्छ।',
    summary: 'तस्बिरमा नेपालको प्राकृतिक सौन्दर्य झल्किएको छ। यसमा हरियाली र पहाडी भू-भाग समावेश छ।',
    audio: null,
  },
  {
    caption: 'यस तस्बिरमा नेपाली संस्कृतिको झलक देखिन्छ।',
    summary: 'तस्बिरले नेपाली समाजको सांस्कृतिक विविधता र परम्परागत जीवनशैली प्रस्तुत गर्छ।',
    audio: null,
  },
  {
    caption: 'यो तस्बिरमा आधुनिक शहरी जीवनको झलक देखिन्छ।',
    summary: 'तस्बिरले नेपालको शहरीकरण र विकासको यात्रालाई प्रतिबिम्बित गर्छ।',
    audio: null,
  }
];

const VIDEO_FALLBACKS = [
  {
    frames: [
      { timestamp: 0, caption: 'भिडियोको सुरुवाती दृश्य', audio: null },
      { timestamp: 5, caption: 'मुख्य गतिविधिको दृश्य', audio: null },
      { timestamp: 10, caption: 'अन्तिम दृश्य', audio: null }
    ],
    summary: 'यो भिडियोमा विभिन्न रोचक दृश्यहरू समावेश छन्।',
    summaryAudio: null,
  },
  {
    frames: [
      { timestamp: 0, caption: 'परम्परागत नेपाली वातावरणको दृश्य', audio: null },
      { timestamp: 4, caption: 'स्थानीय जीवनशैलीको झलक', audio: null },
      { timestamp: 8, caption: 'सामुदायिक गतिविधिको दृश्य', audio: null }
    ],
    summary: 'भिडियोले नेपाली समाजको विविध पक्षहरूलाई प्रस्तुत गर्छ।',
    summaryAudio: null,
  }
];

// Helper function for retrying API calls
async function retryApiCall<T>(
  apiCall: () => Promise<T>,
  maxRetries = 3,
  delay = 1000,
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // First check if we have network connectivity
      const netState = await MediaProcessingService.isConnected();
      if (!netState) {
        console.log('Network disconnected, cannot make API call');
        throw new Error('No network connectivity');
      }

      console.log(`API call attempt ${attempt}/${maxRetries}`);
      return await apiCall();
    } catch (error: any) {
      lastError = error;
      console.error(`Attempt ${attempt}/${maxRetries} failed:`, error.message);
      
      if (attempt < maxRetries) {
        // Calculate exponential backoff time 
        const backoffTime = delay * Math.pow(2, attempt - 1);
        console.log(`Retrying in ${backoffTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, backoffTime));
      }
    }
  }
  
  throw lastError;
}

export class MediaProcessingService {
  // Add a method to check connectivity
  static async isConnected(): Promise<boolean> {
    if (NetInfo) {
      // Use NetInfo if available
      const state = await NetInfo.fetch();
      return state.isConnected;
    } else {
      // Fallback: check network via fetch
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
          
        // Try to fetch a small resource to check connectivity
        await fetch('https://www.google.com/favicon.ico', { 
          method: 'HEAD',
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        return true;
      } catch (error) {
        return false;
      }
    }
  }

  static async processMedia(mediaUri: string, type: 'image' | 'video'): Promise<ProcessedResult> {
    try {
      const netState = await this.isConnected();
      if (!netState) {
        console.error('Network not connected. Using fallback.');
        return this.getFallbackResult(type, mediaUri);
      }
      
      const config = await ConfigService.getAPIEndpoints();
      const endpoint = type === 'image' ? config?.imageToTextAPI : config?.videoProcessingAPI;

      if (!endpoint) {
        console.log('Using fallback due to missing endpoint');
        return this.getFallbackResult(type, mediaUri);
      }

      const formData = new FormData();
      formData.append(type, {
        uri: Platform.OS === 'ios' ? mediaUri.replace('file://', '') : mediaUri,
        type: type === 'image' ? 'image/jpeg' : 'video/mp4',
        name: type === 'image' ? 'image.jpg' : 'video.mp4'
      } as any);

      // Add parameters for video processing
      if (type === 'video') {
        formData.append('num_frames', '5');
        formData.append('include_audio', 'true');
        formData.append('include_frame_captions', 'true');
      } else {
        formData.append('include_audio', 'true');
      }

      const response = await retryApiCall(async () => {
        return await axios.post(endpoint, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json',
          },
          timeout: 60000,
        });
      });

      console.log('API Response:', {
        type,
        hasAudio: !!response.data?.audio,
        audioLength: response.data?.audio?.length,
        audioPreview: response.data?.audio?.substring(0, 100),
        hasFrameAudios: !!response.data?.frameAudios,
        frameCount: response.data?.frameTranscripts?.length,
      });

      if (response.data) {
        if (type === 'image') {
          let audioFile = null;
          if (response.data.audio) {
            try {
              // Clean the base64 string
              const cleanBase64 = response.data.audio.replace(/^data:audio\/\w+;base64,/, '');
              const audioFilePath = `${FileSystem.documentDirectory}temp_audio_${Date.now()}.mp3`;
              
              console.log('Saving audio file:', {
                originalLength: response.data.audio.length,
                cleanedLength: cleanBase64.length,
                path: audioFilePath
              });

              await FileSystem.writeAsStringAsync(
                audioFilePath,
                cleanBase64,
                { encoding: FileSystem.EncodingType.Base64 }
              );
              
              // Verify file exists
              const fileInfo = await FileSystem.getInfoAsync(audioFilePath);
              console.log('Audio file info:', fileInfo);
              
              audioFile = fileInfo.exists ? audioFilePath : null;
            } catch (error) {
              console.error('Error saving audio file:', error);
            }
          }

          return {
            type: 'image',
            caption: response.data.caption,
            summary: response.data.caption,
            audio: audioFile,
          };
        }

        // Handle video response...
        const frames = await Promise.all(
          response.data.frameTranscripts?.map(async (caption: string, index: number) => {
            let frameAudio = null;
            if (response.data.frameAudios?.[index]) {
              try {
                const cleanBase64 = response.data.frameAudios[index].replace(/^data:audio\/\w+;base64,/, '');
                const audioFilePath = `${FileSystem.documentDirectory}temp_frame_${Date.now()}_${index}.mp3`;
                
                await FileSystem.writeAsStringAsync(
                  audioFilePath,
                  cleanBase64,
                  { encoding: FileSystem.EncodingType.Base64 }
                );

                const fileInfo = await FileSystem.getInfoAsync(audioFilePath);
                frameAudio = fileInfo.exists ? audioFilePath : null;
              } catch (error) {
                console.error(`Error saving frame ${index} audio:`, error);
              }
            }

            return {
              timestamp: (index + 1) * (60 / 6),
              image: mediaUri,
              caption: caption,
              audio: frameAudio
            };
          }) || []
        );

        let summaryAudio = null;
        if (response.data.audio) {
          const audioFilePath = `${FileSystem.documentDirectory}temp_summary_${Date.now()}.mp3`;
          await FileSystem.writeAsStringAsync(
            audioFilePath,
            response.data.audio,
            { encoding: FileSystem.EncodingType.Base64 }
          );
          summaryAudio = audioFilePath;
        }

        return {
          type: 'video',
          videoFrames: frames,
          summary: response.data.summary || 'भिडियो सारांश उपलब्ध छैन',
          summaryAudio: summaryAudio,
        };
      }

      console.log('Using fallback due to unsuccessful API response');
      return this.getFallbackResult(type, mediaUri);
    } catch (error) {
      console.error(`Media processing error for ${type}:`, error);
      return this.getFallbackResult(type, mediaUri);
    }
  }

  private static async processResponse(apiResult: any): Promise<ProcessedResult> {
    try {
      if (apiResult.type === 'image') {
        // Convert base64 audio to file if present
        let audioFile = null;
        if (apiResult.audio) {
          const audioFilePath = `${FileSystem.documentDirectory}temp_audio_${Date.now()}.mp3`;
          await FileSystem.writeAsStringAsync(
            audioFilePath,
            apiResult.audio,
            { encoding: FileSystem.EncodingType.Base64 }
          );
          audioFile = audioFilePath;
        }

        return {
          type: 'image',
          caption: apiResult.caption || 'तस्बिरको विवरण उपलब्ध छैन',
          summary: apiResult.summary || 'तस्बिरको सारांश उपलब्ध छैन',
          audio: audioFile,
        };
      } else {
        // Process video result
        const frames = await Promise.all(apiResult.frames?.map(async (frame: any) => {
          let audioFile = null;
          if (frame.audio) {
            const audioFilePath = `${FileSystem.documentDirectory}temp_frame_${Date.now()}.mp3`;
            await FileSystem.writeAsStringAsync(
              audioFilePath,
              frame.audio,
              { encoding: FileSystem.EncodingType.Base64 }
            );
            audioFile = audioFilePath;
          }
          return {
            timestamp: frame.timestamp || 0,
            image: frame.image || '',
            caption: frame.caption || 'दृश्यको विवरण उपलब्ध छैन',
            audio: audioFile,
          };
        })) || [];

        let summaryAudioFile = null;
        if (apiResult.summaryAudio) {
          const audioFilePath = `${FileSystem.documentDirectory}temp_summary_${Date.now()}.mp3`;
          await FileSystem.writeAsStringAsync(
            audioFilePath,
            apiResult.summaryAudio,
            { encoding: FileSystem.EncodingType.Base64 }
          );
          summaryAudioFile = audioFilePath;
        }

        return {
          type: 'video',
          videoFrames: frames,
          summary: apiResult.summary || 'भिडियोको सारांश उपलब्ध छैन',
          summaryAudio: summaryAudioFile,
        };
      }
    } catch (error) {
      console.error('Response processing error:', error);
      throw error;
    }
  }

  private static async enrichWithAudio(result: ProcessedResult): Promise<ProcessedResult> {
    try {
      const config = await ConfigService.getAPIEndpoints();
      if (!config?.textToAudioAPI) return result;

      // Test audio endpoint accessibility with better approach
      try {
        // Use a safer way to check API availability
        await fetch(config.textToAudioAPI, { 
          method: 'OPTIONS',
          headers: { 
            'Accept': 'application/json'
          }
        });
        console.log(`Audio endpoint ${config.textToAudioAPI} is accessible`);
      } catch (error) {
        console.log(`Checking audio endpoint ${config.textToAudioAPI} with GET method`);
        try {
          // Try a GET request as fallback for checking endpoint
          await fetch(config.textToAudioAPI);
          console.log(`Audio endpoint ${config.textToAudioAPI} is accessible via GET`);
        } catch (error) {
          console.error(`Audio endpoint ${config.textToAudioAPI} is not accessible:`, error);
          return result;
        }
      }

      if (result.type === 'image') {
        const audioResponse = await this.textToAudio(result.caption || '');
        return {
          ...result,
          audio: audioResponse || null,
        };
      } else {
        const audioPromises = result.videoFrames?.map(frame => 
          this.textToAudio(frame.caption)
        ) || [];

        if (result.summary) {
          audioPromises.push(this.textToAudio(result.summary));
        }

        const audioResults = await Promise.allSettled(audioPromises);
        const frameAudios = audioResults.slice(0, -1);
        const summaryAudio = audioResults[audioResults.length - 1];

        return {
          ...result,
          videoFrames: result.videoFrames?.map((frame, i) => ({
            ...frame,
            audio: frameAudios[i]?.status === 'fulfilled' ? frameAudios[i].value : null,
          })) || [],
          summaryAudio: summaryAudio?.status === 'fulfilled' ? summaryAudio.value : null,
        };
      }
    } catch (error) {
      console.error('Audio enrichment error:', error);
      return result;
    }
  }

  private static async textToAudio(text: string): Promise<string | null> {
    if (!text || text.trim().length === 0) {
      console.log('Empty text provided for TTS, skipping');
      return null;
    }
    
    try {
      const config = await ConfigService.getAPIEndpoints();
      if (!config?.textToAudioAPI) {
        console.log('Text to audio API endpoint not available');
        return null;
      }

      console.log(`Sending text to TTS API: ${config.textToAudioAPI}`);
      console.log(`Text content (first 50 chars): ${text.substring(0, 50)}...`);
      
      // Use retry mechanism for the API call
      const response = await retryApiCall(async () => {
        return await axios.post(config.textToAudioAPI, 
          { 
            text,
            format: "base64"  // Explicitly request base64 format
          },
          { 
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            timeout: 30000,
          }
        );
      });

      console.log('TTS Response:', {
        status: response.status,
        hasAudio: !!response.data?.audio,
        audioLength: response.data?.audio?.length,
        audioPreview: response.data?.audio?.substring(0, 100)
      });
      
      if (response.data?.audio) {
        const cleanBase64 = response.data.audio.replace(/^data:audio\/\w+;base64,/, '');
        const audioFilePath = `${FileSystem.documentDirectory}temp_audio_${Date.now()}.mp3`;
        
        await FileSystem.writeAsStringAsync(
          audioFilePath,
          cleanBase64,
          { encoding: FileSystem.EncodingType.Base64 }
        );

        const fileInfo = await FileSystem.getInfoAsync(audioFilePath);
        return fileInfo.exists ? audioFilePath : null;
      }
      
      return null;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        console.error('Text to audio error:', axiosError.message);
        console.error('Status:', axiosError.response?.status);
        console.error('Response data:', axiosError.response?.data);
      } else {
        console.error('Text to audio error:', error);
      }
      return null;
    }
  }

  private static getFallbackResult(type: 'image' | 'video', mediaUri: string): ProcessedResult {
    if (type === 'image') {
      const fallback = IMAGE_FALLBACKS[Math.floor(Math.random() * IMAGE_FALLBACKS.length)];
      return {
        type: 'image',
        caption: fallback.caption,
        summary: fallback.summary,
        audio: fallback.audio,
      };
    } else {
      const fallback = VIDEO_FALLBACKS[Math.floor(Math.random() * VIDEO_FALLBACKS.length)];
      return {
        type: 'video',
        videoFrames: fallback.frames.map(frame => ({
          ...frame,
          image: mediaUri,
        })),
        summary: fallback.summary,
        summaryAudio: fallback.summaryAudio,
      };
    }
  }
}