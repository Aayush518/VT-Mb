import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, SafeAreaView, useWindowDimensions } from 'react-native';
import { Link, Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NEPALI_THEME } from '../../constants/theme';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GradientCard } from '../../components/shared/GradientCard';
import { GradientButton } from '../../components/shared/GradientButton';

const RESEARCH_PROJECTS = [
  {
    id: 1,
    title: 'नेपाली अर्पाबेट सिस्टम',
    subtitle: 'Rule Based G2P for Nepali Language',
    icon: 'language',
    description: 'नेपाली भाषाको लागि नियम-आधारित ग्राफिम-टु-फोनिम रूपान्तरण प्रणाली',
    gradient: ['#2563EB', '#1D4ED8'],
  },
  {
    id: 2,
    title: 'सिक्वेन्स-टु-सिक्वेन्स G2P',
    subtitle: 'SEQ-SEQ Approach for Nepali G2P',
    icon: 'git-network',
    description: 'नेपाली भाषाको लागि डिप लर्निङ आधारित G2P प्रणाली',
    gradient: ['#7C3AED', '#5B21B6'],
  },
  {
    id: 3,
    title: 'सब्जेक्टिभ नेपाली अर्पाबेट',
    subtitle: 'Subjective NepaliArpabet with TT2',
    icon: 'analytics',
    description: 'टीटी२ इन्फरेन्समा कडा परीक्षणसहित तयार पारिएको सब्जेक्टिभ नेपाली अर्पाबेट',
    gradient: ['#EC4899', '#BE185D'],
  },
  {
    id: 4,
    title: 'नेपाली TTS एब्लेसन',
    subtitle: 'Multiple Ablations for Nepali TTS',
    icon: 'pulse',
    description: 'नेपाली टेक्स्ट-टु-स्पीच प्रणालीको विभिन्न एब्लेसन अध्ययन',
    gradient: ['#EF4444', '#B91C1C'],
  },
  {
    id: 5,
    title: 'CMUDict अनुकूलन',
    subtitle: 'Adapted CMUDict for Nepali',
    icon: 'library',
    description: 'नेपाली भाषाको लागि CMUDict क्लिनर्स अनुकूलन र पाइपलाइन विकास',
    gradient: ['#22C55E', '#15803D'],
  },
  // ... continue with other projects
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  return (
    <SafeAreaView style={styles.mainContainer} edges={['top']}>
      <Stack.Screen
        options={{
          title: 'होम',
          headerStyle: {
            backgroundColor: NEPALI_THEME.background,
          },
          headerTintColor: NEPALI_THEME.text,
        }}
      />

      <ScrollView 
        style={styles.container}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top }
        ]}
        showsVerticalScrollIndicator={false}>
        
        {/* Hero Section */}
        <LinearGradient
          colors={[NEPALI_THEME.primary, NEPALI_THEME.accent]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}>
          <BlurView intensity={20} style={styles.heroContent}>
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                style={styles.logoCircle}>
                <Ionicons 
                  name="eye-outline" 
                  size={48} 
                  color="#fff"
                />
              </LinearGradient>
            </View>
            <View style={styles.titleContainer}>
              <Text style={styles.heroTitle}>नेपाली</Text>
              <Text style={styles.heroTitleAccent}>भिजन प्लस</Text>
            </View>
            <Text style={styles.heroSubtitle}>
              तस्बिर र भिडियोको स्वचालित विश्लेषण
            </Text>
          </BlurView>
        </LinearGradient>

        {/* Features Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>मुख्य सुविधाहरू</Text>
          <View style={styles.featuresGrid}>
            <Link href="/capture" asChild>
              <TouchableOpacity style={styles.featureCard}>
                <BlurView intensity={20} style={styles.cardContent}>
                  <LinearGradient
                    colors={[NEPALI_THEME.primary, NEPALI_THEME.secondary]}
                    style={styles.iconContainer}>
                    <Ionicons name="camera" size={32} color="#fff" />
                  </LinearGradient>
                  <Text style={styles.featureTitle}>क्यामेरा</Text>
                  <Text style={styles.featureDescription}>
                    तस्बिर वा भिडियो खिच्नुहोस्
                  </Text>
                </BlurView>
              </TouchableOpacity>
            </Link>

            <Link href="/upload" asChild>
              <TouchableOpacity style={styles.featureCard}>
                <BlurView intensity={20} style={styles.cardContent}>
                  <LinearGradient
                    colors={[NEPALI_THEME.primary, NEPALI_THEME.secondary]}
                    style={styles.iconContainer}>
                    <Ionicons name="cloud-upload" size={32} color="#fff" />
                  </LinearGradient>
                  <Text style={styles.featureTitle}>अपलोड</Text>
                  <Text style={styles.featureDescription}>
                    ग्यालरीबाट फाइल छान्नुहोस्
                  </Text>
                </BlurView>
              </TouchableOpacity>
            </Link>

            <Link href="/research" asChild>
              <TouchableOpacity style={styles.featureCard}>
                <BlurView intensity={20} style={styles.cardContent}>
                  <LinearGradient
                    colors={[NEPALI_THEME.primary, NEPALI_THEME.secondary]}
                    style={styles.iconContainer}>
                    <Ionicons name="library" size={32} color="#fff" />
                  </LinearGradient>
                  <Text style={styles.featureTitle}>अनुसन्धान</Text>
                  <Text style={styles.featureDescription}>
                    हाम्रा अनुसन्धान परियोजनाहरू हेर्नुहोस्
                  </Text>
                </BlurView>
              </TouchableOpacity>
            </Link>

            <Link href="/settings" asChild>
              <TouchableOpacity style={styles.featureCard}>
                <BlurView intensity={20} style={styles.cardContent}>
                  <LinearGradient
                    colors={[NEPALI_THEME.primary, NEPALI_THEME.secondary]}
                    style={styles.iconContainer}>
                    <Ionicons name="settings" size={32} color="#fff" />
                  </LinearGradient>
                  <Text style={styles.featureTitle}>सेटिङ्स</Text>
                  <Text style={styles.featureDescription}>
                    एप कन्फिगर गर्नुहोस्
                  </Text>
                </BlurView>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        {/* Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>विशेषताहरू</Text>
          <View style={styles.infoSection}>
            <View style={styles.infoItem}>
              <LinearGradient
                colors={[NEPALI_THEME.primary, NEPALI_THEME.secondary]}
                style={styles.infoIcon}>
                <Ionicons name="scan" size={24} color="#fff" />
              </LinearGradient>
              <Text style={styles.infoText}>तस्बिर र भिडियोको स्वचालित विश्लेषण</Text>
            </View>
            <View style={styles.infoItem}>
              <LinearGradient
                colors={[NEPALI_THEME.primary, NEPALI_THEME.secondary]}
                style={styles.infoIcon}>
                <Ionicons name="language" size={24} color="#fff" />
              </LinearGradient>
              <Text style={styles.infoText}>नेपाली भाषामा व्याख्या</Text>
            </View>
            <View style={styles.infoItem}>
              <LinearGradient
                colors={[NEPALI_THEME.primary, NEPALI_THEME.secondary]}
                style={styles.infoIcon}>
                <Ionicons name="volume-high" size={24} color="#fff" />
              </LinearGradient>
              <Text style={styles.infoText}>आवाज सुविधा</Text>
            </View>
          </View>
        </View>

        {/* Research Projects Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>अनुसन्धान परियोजनाहरू</Text>
          <View style={styles.projectsGrid}>
            {RESEARCH_PROJECTS.map(project => (
              <GradientCard
                key={project.id}
                style={styles.projectCard}
                gradient={project.gradient}>
                <View style={styles.projectContent}>
                  <LinearGradient
                    colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                    style={styles.projectIcon}>
                    <Ionicons name={project.icon} size={24} color="#fff" />
                  </LinearGradient>
                  
                  <Text style={styles.projectTitle}>{project.title}</Text>
                  <Text style={styles.projectSubtitle}>{project.subtitle}</Text>
                  <Text style={styles.projectDescription}>{project.description}</Text>
                  
                  <TouchableOpacity 
                    style={styles.projectButton}
                    onPress={() => {}}>
                    <Text style={styles.buttonText}>थप जानकारी</Text>
                    <Ionicons name="arrow-forward" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              </GradientCard>
            ))}
          </View>
        </View>

        {/* Bottom Padding */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: NEPALI_THEME.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  hero: {
    borderRadius: 24,
    margin: 16,
    marginTop: 24,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  heroContent: {
    padding: 32,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroTitleAccent: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    opacity: 0.9,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9,
  },
  section: {
    marginTop: 32,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: NEPALI_THEME.primary,
    marginBottom: 24,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
  },
  featureCard: {
    width: '45%',
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.05)',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 20,
  },
  infoSection: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  infoIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  infoText: {
    fontSize: 16,
    color: '#fff',
    flex: 1,
    lineHeight: 24,
  },
  projectsGrid: {
    gap: 16,
  },
  projectCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  projectContent: {
    padding: 20,
    gap: 12,
  },
  projectIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  projectTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  projectSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 12,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  projectDescription: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.95,
    lineHeight: 24,
    marginBottom: 16,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  projectButton: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
});