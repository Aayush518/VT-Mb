import AsyncStorage from '@react-native-async-storage/async-storage';

interface APIConfig {
  imageToTextAPI: string | null;
  videoProcessingAPI: string | null;
  textToAudioAPI: string | null;
}

const API_BASE_URL_KEY = 'API_BASE_URL';
const DEFAULT_BASE_URL = 'https://d619-34-168-33-26.ngrok-free.app';

export class ConfigService {
  private static baseUrl: string | null = null;
  
  private static getEndpoints(baseUrl: string): APIConfig {
    // Ensure baseUrl doesn't end with a trailing slash
    const normalizedBaseUrl = baseUrl.endsWith('/') 
      ? baseUrl.slice(0, -1) 
      : baseUrl;
    
    return {
      imageToTextAPI: `${normalizedBaseUrl}/api/image_caption`,
      videoProcessingAPI: `${normalizedBaseUrl}/api/video_caption`,
      textToAudioAPI: `${normalizedBaseUrl}/api/tts`,
    };
  }

  static async initialize() {
    try {
      console.log('Initializing ConfigService...');
      const savedBaseUrl = await AsyncStorage.getItem(API_BASE_URL_KEY);
      console.log(`Loaded base URL from storage: ${savedBaseUrl || 'not found, using default'}`);
      
      if (savedBaseUrl) {
        this.baseUrl = this.normalizeUrl(savedBaseUrl);
      } else {
        this.baseUrl = DEFAULT_BASE_URL;
      }
      
      console.log(`ConfigService initialized with base URL: ${this.baseUrl}`);
    } catch (error) {
      console.error('Failed to load API base URL:', error);
      this.baseUrl = DEFAULT_BASE_URL;
      console.log(`Falling back to default base URL: ${DEFAULT_BASE_URL}`);
    }
  }

  static async getAPIEndpoints(): Promise<APIConfig> {
    try {
      if (!this.baseUrl) {
        console.log('Base URL not initialized, initializing now...');
        await this.initialize();
      }

      if (!this.baseUrl) {
        console.error('API base URL is still null after initialization');
        throw new Error('API base URL not set');
      }

      console.log(`Using API base URL: ${this.baseUrl}`);
      const endpoints = this.getEndpoints(this.baseUrl);
      console.log('Generated endpoints:', JSON.stringify(endpoints));
      
      return endpoints;
    } catch (error) {
      console.error('Failed to get API endpoints:', error);
      return {
        imageToTextAPI: null,
        videoProcessingAPI: null,
        textToAudioAPI: null,
      };
    }
  }

  static async setBaseUrl(newBaseUrl: string): Promise<boolean> {
    try {
      const normalizedUrl = this.normalizeUrl(newBaseUrl);
      await AsyncStorage.setItem(API_BASE_URL_KEY, normalizedUrl);
      this.baseUrl = normalizedUrl;
      console.log(`Base URL set to: ${normalizedUrl}`);
      return true;
    } catch (error) {
      console.error('Failed to save API base URL:', error);
      return false;
    }
  }

  static async getBaseUrl(): Promise<string | null> {
    if (!this.baseUrl) {
      await this.initialize();
    }
    return this.baseUrl;
  }

  static async clearConfig(): Promise<void> {
    try {
      await AsyncStorage.removeItem(API_BASE_URL_KEY);
      this.baseUrl = null;
    } catch (error) {
      console.error('Failed to clear config:', error);
    }
  }

  // Helper method to ensure URLs are properly formatted
  private static normalizeUrl(url: string): string {
    let normalizedUrl = url.trim();
    
    // Add http:// if protocol is missing
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = `https://${normalizedUrl}`;
    }
    
    // Remove trailing slash if present
    if (normalizedUrl.endsWith('/')) {
      normalizedUrl = normalizedUrl.slice(0, -1);
    }
    
    return normalizedUrl;
  }
}