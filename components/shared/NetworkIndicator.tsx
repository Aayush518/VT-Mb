import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, AppState, AppStateStatus } from 'react-native';
import { NEPALI_THEME } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

// Try to import NetInfo, but provide a fallback if it fails
let NetInfo: any = null;
try {
  NetInfo = require('@react-native-community/netinfo');
} catch (e) {
  console.warn('NetInfo module not available, using fallback network detection');
}

export function NetworkIndicator() {
  const [isConnected, setIsConnected] = useState<boolean | null>(true);
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    let unsubscribeNetInfo: (() => void) | null = null;
    
    // Only use NetInfo if available
    if (NetInfo) {
      unsubscribeNetInfo = NetInfo.addEventListener((state: any) => {
        setIsConnected(state.isConnected);
      });

      // Check connection on mount
      NetInfo.fetch().then((state: any) => {
        setIsConnected(state.isConnected);
      });
    } else {
      // Fallback: check network via fetch when app becomes active
      const checkConnection = async () => {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);
          
          // Try to fetch a small resource to check connectivity
          await fetch('https://www.google.com/favicon.ico', { 
            method: 'HEAD',
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          setIsConnected(true);
        } catch (error) {
          setIsConnected(false);
        }
      };
      
      // Subscribe to app state changes
      const handleAppStateChange = (nextAppState: AppStateStatus) => {
        if (appState !== 'active' && nextAppState === 'active') {
          checkConnection();
        }
        setAppState(nextAppState);
      };
      
      const subscription = AppState.addEventListener('change', handleAppStateChange);
      
      // Initial connection check
      checkConnection();
      
      return () => {
        subscription.remove();
      };
    }

    // Cleanup NetInfo subscription if we used it
    return () => {
      if (unsubscribeNetInfo) {
        unsubscribeNetInfo();
      }
    };
  }, [appState]);

  if (isConnected === null) {
    return null;
  }

  if (isConnected) {
    return null; // Don't show anything when connected
  }

  return (
    <View style={styles.container}>
      <Ionicons name="wifi-off" size={18} color={NEPALI_THEME.error} />
      <Text style={styles.text}>इन्टरनेट कनेक्सन छैन</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 59, 48, 0.15)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  text: {
    color: NEPALI_THEME.error,
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
});
