import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { NEPALI_THEME } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface ResearchHighlight {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  papers: string[];
}

interface HighlightsSectionProps {
  highlights: ResearchHighlight[];
}

export function HighlightsSection({ highlights }: HighlightsSectionProps) {
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      {highlights.map((highlight, index) => (
        <View key={index} style={styles.highlightCard}>
          <LinearGradient
            colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
            style={styles.cardContent}>
            <View style={styles.header}>
              <LinearGradient
                colors={[NEPALI_THEME.primary, NEPALI_THEME.secondary]}
                style={styles.iconContainer}>
                <Ionicons name={highlight.icon} size={24} color="#fff" />
              </LinearGradient>
              <Text style={styles.title}>{highlight.title}</Text>
            </View>
            
            <Text style={styles.description}>{highlight.description}</Text>
            
            <View style={styles.papers}>
              <Text style={styles.papersTitle}>प्रकाशनहरू</Text>
              {highlight.papers.map((paper, i) => (
                <View key={i} style={styles.paperItem}>
                  <Ionicons name="document-text" size={16} color={NEPALI_THEME.primary} />
                  <Text style={styles.paperText}>{paper}</Text>
                </View>
              ))}
            </View>
          </LinearGradient>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  highlightCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 16,
    borderRadius: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: NEPALI_THEME.text,
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: NEPALI_THEME.text,
    opacity: 0.8,
    marginBottom: 16,
    lineHeight: 20,
  },
  papers: {
    marginTop: 8,
  },
  papersTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: NEPALI_THEME.text,
    marginBottom: 8,
  },
  paperItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  paperText: {
    color: NEPALI_THEME.text,
    fontSize: 14,
    flex: 1,
  },
}); 