import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform, View, StyleSheet } from 'react-native';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { NEPALI_THEME } from '../constants/theme';
import { FloatingActionButton } from '../components/shared/FloatingActionButton';

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.frameworkReady?.();
    }
  }, []);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={styles.container}>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'fade',
            headerStyle: {
              backgroundColor: NEPALI_THEME.background,
            },
            headerTintColor: NEPALI_THEME.text,
            contentStyle: {
              backgroundColor: NEPALI_THEME.background,
            },
          }}>
          <Stack.Screen 
            name="(tabs)" 
            options={{ 
              headerShown: false,
            }} 
          />
          <Stack.Screen 
            name="result" 
            options={{
              presentation: 'card',
              animation: 'slide_from_bottom',
            }}
          />
          <Stack.Screen 
            name="+not-found" 
            options={{ 
              title: 'Oops!',
              presentation: 'modal',
            }} 
          />
        </Stack>
        <StatusBar style="light" />
      </GestureHandlerRootView>
      <FloatingActionButton />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
});