import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ResultView } from '../components/shared/ResultView';
import { ProcessedResult } from '../types/camera';
import { NEPALI_THEME } from '../constants/theme';

export default function ResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  
  const mediaUri = params.mediaUri as string;
  const result = JSON.parse(params.result as string) as ProcessedResult;

  const handleReset = () => {
    // Go back to capture screen
    router.back();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}>
        <ResultView
          result={result}
          mediaUri={mediaUri}
          onReset={handleReset}
        />
      </ScrollView>
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
  content: {
    padding: 16,
  },
}); 