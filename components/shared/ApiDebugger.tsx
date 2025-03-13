import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { ConfigService } from '../../services/ConfigService';
import axios, { AxiosError } from 'axios';
import { NEPALI_THEME } from '../../constants/theme';

export function ApiDebugger() {
  const [endpoints, setEndpoints] = useState<{
    baseUrl: string | null;
    imageToTextAPI: string | null;
    videoProcessingAPI: string | null;
    textToAudioAPI: string | null;
  }>({
    baseUrl: null,
    imageToTextAPI: null,
    videoProcessingAPI: null,
    textToAudioAPI: null,
  });

  const [testResults, setTestResults] = useState<{
    [key: string]: {
      status: 'idle' | 'loading' | 'success' | 'error';
      message: string;
    }
  }>({
    image: { status: 'idle', message: 'Not tested' },
    video: { status: 'idle', message: 'Not tested' },
    audio: { status: 'idle', message: 'Not tested' },
  });

  useEffect(() => {
    loadEndpoints();
  }, []);

  const loadEndpoints = async () => {
    const baseUrl = await ConfigService.getBaseUrl();
    const apiConfig = await ConfigService.getAPIEndpoints();
    
    setEndpoints({
      baseUrl,
      ...apiConfig
    });
  };

  const formatError = (error: Error | AxiosError): string => {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        return `नेटवर्क त्रुटि (${error.response.status}): ${error.response.statusText}`;
      }
      if (error.request) {
        return 'सर्भरमा पहुँच गर्न सकिएन';
      }
      return error.message;
    }
    return error.message;
  };

  const testEndpoint = async (type: 'image' | 'video' | 'audio') => {
    try {
      // Update state to loading
      setTestResults(prev => ({
        ...prev,
        [type]: { status: 'loading', message: 'Testing...' }
      }));

      let endpoint;
      let method = 'GET';
      let data;
      
      if (type === 'image') {
        endpoint = endpoints.imageToTextAPI;
        // Just check if the endpoint exists
        method = 'HEAD';
      } else if (type === 'video') {
        endpoint = endpoints.videoProcessingAPI;
        // Just check if the endpoint exists
        method = 'HEAD';
      } else {
        endpoint = endpoints.textToAudioAPI;
        method = 'POST';
        data = { text: 'नमस्ते, यो एक परीक्षण हो।', format: 'base64' };
      }

      if (!endpoint) {
        throw new Error('Endpoint not configured');
      }

      const response = await axios({
        method, 
        url: endpoint,
        data,
        timeout: 10000,
        // Only validate status for non-POST requests
        validateStatus: (status) => method === 'POST' ? true : status < 400
      });

      // For audio/POST endpoint, check for expected response format
      if (type === 'audio' && method === 'POST') {
        if (response.data && response.data.audio) {
          setTestResults(prev => ({
            ...prev,
            [type]: { 
              status: 'success', 
              message: 'सफलतापूर्वक जडान भयो। अडियो प्रतिक्रिया प्राप्त भयो।'
            }
          }));
        } else {
          throw new Error('अमान्य प्रतिक्रिया ढाँचा');
        }
      } else {
        setTestResults(prev => ({
          ...prev,
          [type]: { 
            status: 'success', 
            message: `सफलतापूर्वक जडान भयो (${response.status})` 
          }
        }));
      }

    } catch (err) {
      const errorMessage = formatError(err as Error);
      setTestResults(prev => ({
        ...prev,
        [type]: { 
          status: 'error', 
          message: `त्रुटि: ${errorMessage}` 
        }
      }));
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>API Connection Debugger</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Configuration</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Base URL:</Text>
          <Text style={styles.value}>{endpoints.baseUrl || 'Not set'}</Text>
        </View>
        <View style={styles.divider} />
        
        <Text style={styles.sectionTitle}>API Endpoints</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Image API:</Text>
          <Text style={styles.value}>{endpoints.imageToTextAPI || 'Not set'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Video API:</Text>
          <Text style={styles.value}>{endpoints.videoProcessingAPI || 'Not set'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Audio API:</Text>
          <Text style={styles.value}>{endpoints.textToAudioAPI || 'Not set'}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Connection Tests</Text>
        
        <View style={styles.testRow}>
          <Text style={styles.testLabel}>Image API:</Text>
          <View style={styles.testResult}>
            {testResults.image.status === 'loading' ? (
              <ActivityIndicator size="small" color={NEPALI_THEME.primary} />
            ) : (
              <Text style={[
                styles.testMessage,
                testResults.image.status === 'success' ? styles.success : 
                testResults.image.status === 'error' ? styles.error : undefined
              ]}>
                {testResults.image.message}
              </Text>
            )}
          </View>
          <TouchableOpacity 
            style={styles.testButton}
            onPress={() => testEndpoint('image')}
            disabled={testResults.image.status === 'loading'}>
            <Text style={styles.buttonText}>Test</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.testRow}>
          <Text style={styles.testLabel}>Video API:</Text>
          <View style={styles.testResult}>
            {testResults.video.status === 'loading' ? (
              <ActivityIndicator size="small" color={NEPALI_THEME.primary} />
            ) : (
              <Text style={[
                styles.testMessage,
                testResults.video.status === 'success' ? styles.success : 
                testResults.video.status === 'error' ? styles.error : undefined
              ]}>
                {testResults.video.message}
              </Text>
            )}
          </View>
          <TouchableOpacity 
            style={styles.testButton}
            onPress={() => testEndpoint('video')}
            disabled={testResults.video.status === 'loading'}>
            <Text style={styles.buttonText}>Test</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.testRow}>
          <Text style={styles.testLabel}>Audio API:</Text>
          <View style={styles.testResult}>
            {testResults.audio.status === 'loading' ? (
              <ActivityIndicator size="small" color={NEPALI_THEME.primary} />
            ) : (
              <Text style={[
                styles.testMessage,
                testResults.audio.status === 'success' ? styles.success : 
                testResults.audio.status === 'error' ? styles.error : undefined
              ]}>
                {testResults.audio.message}
              </Text>
            )}
          </View>
          <TouchableOpacity 
            style={styles.testButton}
            onPress={() => testEndpoint('audio')}
            disabled={testResults.audio.status === 'loading'}>
            <Text style={styles.buttonText}>Test</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.refreshButton}
        onPress={loadEndpoints}>
        <Text style={styles.refreshText}>Refresh Configuration</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: NEPALI_THEME.text,
    marginBottom: 16,
  },
  section: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: NEPALI_THEME.primary,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: NEPALI_THEME.text,
    width: 100,
  },
  value: {
    fontSize: 16,
    color: NEPALI_THEME.textSecondary,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 16,
  },
  testRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  testLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: NEPALI_THEME.text,
    width: 100,
  },
  testResult: {
    flex: 1,
  },
  testMessage: {
    fontSize: 14,
    color: NEPALI_THEME.textSecondary,
  },
  testButton: {
    backgroundColor: NEPALI_THEME.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  success: {
    color: NEPALI_THEME.success,
  },
  error: {
    color: NEPALI_THEME.error,
  },
  refreshButton: {
    backgroundColor: NEPALI_THEME.secondary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  refreshText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
