import { useEffect, useState, useRef, useCallback } from 'react';
import { Camera, CameraType, CameraProps } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { Alert, Platform } from 'react-native';

export function useCamera() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [type, setType] = useState(CameraType.back);
  const [isReady, setIsReady] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const cameraRef = useRef<Camera>(null);
  const mountedRef = useRef(true);

  const requestPermissions = useCallback(async () => {
    try {
      const [cameraStatus, mediaStatus, audioStatus] = await Promise.all([
        Camera.requestCameraPermissionsAsync(),
        MediaLibrary.requestPermissionsAsync(),
        Camera.requestMicrophonePermissionsAsync()
      ]);

      if (mountedRef.current) {
        if (cameraStatus.granted && mediaStatus.granted && audioStatus.granted) {
          setHasPermission(true);
          return true;
        } else {
          Alert.alert(
            'अनुमति आवश्यक छ',
            'क्यामेरा, माइक्रोफोन र मिडिया स्टोरेज प्रयोग गर्न अनुमति दिनुहोस्',
            [
              { 
                text: 'ठीक छ',
                onPress: requestPermissions
              }
            ]
          );
          setHasPermission(false);
          return false;
        }
      }
      return false;
    } catch (err) {
      console.error('Permission error:', err);
      if (mountedRef.current) {
        setHasPermission(false);
      }
      return false;
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    requestPermissions();

    return () => {
      mountedRef.current = false;
      setIsReady(false);
      setIsInitialized(false);
    };
  }, [requestPermissions]);

  const handleCameraReady = useCallback(() => {
    console.log('Camera is ready');
    setIsReady(true);
  }, []);

  const takePicture = async () => {
    if (!cameraRef.current) {
      throw new Error('Camera reference not found');
    }

    if (!isReady) {
      throw new Error('Camera is not ready');
    }

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
        base64: false,
        exif: false,
        skipProcessing: Platform.OS === 'android',
      });
      
      await MediaLibrary.saveToLibraryAsync(photo.uri);
      return photo.uri;
    } catch (error) {
      console.error('Camera capture error:', error);
      throw error;
    }
  };

  const flipCamera = useCallback(() => {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }, []);

  const getCameraProps = useCallback((): Partial<CameraProps> => ({
    type,
    onCameraReady: handleCameraReady,
    useCamera2Api: Platform.OS === 'android',
    ratio: '16:9',
    onMountError: (error: any) => {
      console.error('Camera mount error:', error);
      setIsInitialized(false);
      setIsReady(false);
    },
    autoFocus: Camera.Constants.AutoFocus.ON,
    flashMode: Camera.Constants.FlashMode.AUTO,
    zoom: 0,
  }), [type, handleCameraReady]);

  return {
    hasPermission,
    type,
    cameraRef,
    isReady,
    isInitialized,
    takePicture,
    flipCamera,
    handleCameraReady,
    getCameraProps,
  };
}