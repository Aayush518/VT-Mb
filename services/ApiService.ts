import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProcessedResult } from '../types/camera';

const BASE_URL_STORAGE_KEY = 'nepali_vision_base_url';
const DEFAULT_BASE_URL = 'https://d619-34-168-33-26.ngrok-free.app';

export class ApiService {
  private static instance: ApiService;
  private baseUrl: string | null = DEFAULT_BASE_URL;

  private constructor() {}

  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  async initialize(): Promise<void> {
    try {
      this.baseUrl = await AsyncStorage.getItem(BASE_URL_STORAGE_KEY);
    } catch (err) {
      console.error('Failed to load API configuration:', err);
    }
  }

  async setBaseUrl(url: string): Promise<void> {
    try {
      // Ensure URL ends with /
      const formattedUrl = url.endsWith('/') ? url : `${url}/`;
      await AsyncStorage.setItem(BASE_URL_STORAGE_KEY, formattedUrl);
      this.baseUrl = formattedUrl;
    } catch (err) {
      console.error('Failed to save base URL:', err);
      throw new Error('Failed to save base URL');
    }
  }

  getBaseUrl(): string | null {
    return this.baseUrl;
  }

  private getEndpoint(type: 'image' | 'video' | 'text'): string {
    if (!this.baseUrl) {
      throw new Error('API URL not configured');
    }
    
    const endpointMap = {
      'image': '/api/image_caption',
      'video': '/api/video_caption',
      'text': '/api/tts'
    };
    
    return `${this.baseUrl}${endpointMap[type]}`;
  }

  // Helper methods to get specific endpoints
  getImageEndpoint(): string {
    return this.getEndpoint('image');
  }

  getVideoEndpoint(): string {
    return this.getEndpoint('video');
  }

  getTextEndpoint(): string {
    return this.getEndpoint('text');
  }

  async processVideo(videoUri: string): Promise<ProcessedResult> {
    try {
      this.validateConfig();
      
      const formData = new FormData();
      formData.append('video', {
        uri: videoUri,
        type: 'video/mp4',
        name: 'video.mp4'
      } as any); // Type assertion to fix FormData typing issue

      const response = await fetch(`${this.baseUrl}/api/video_caption`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        }
      });

      if (!response.ok) throw new Error('API request failed');
      return await response.json();
    } catch (err) {
      console.error('Video processing failed:', err);
      throw err;
    }
  }

  async processImage(imageUri: string): Promise<ProcessedResult> {
    try {
      this.validateConfig();
      
      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'image.jpg'
      } as any);

      const response = await fetch(`${this.baseUrl}/api/image_caption`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        }
      });

      if (!response.ok) throw new Error('API request failed');
      return await response.json();
    } catch (err) {
      console.error('Image processing failed:', err);
      throw err;
    }
  }

  async processText(text: string): Promise<string> {
    try {
      this.validateConfig();

      const response = await fetch(`${this.baseUrl}/api/tts`, {
        method: 'POST',
        body: JSON.stringify({ text }),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });

      if (!response.ok) throw new Error('API request failed');
      const data = await response.json();
      return data.audio;
    } catch (err) {
      console.error('Text processing failed:', err);
      throw err;
    }
  }

  private validateConfig() {
    if (!this.baseUrl) {
      throw new Error('API configuration not set. Please set base URL.');
    }
  }
}