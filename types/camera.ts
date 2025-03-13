export type ProcessedResult = {
  type: 'image' | 'video';
  caption: string;
  summary: string;
  videoFrames?: {
    timestamp: number;
    image: string;
    caption: string;
  }[];
};

export type CameraPermissionStatus = 'undetermined' | 'granted' | 'denied';