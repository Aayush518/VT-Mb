import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Linking } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NEPALI_THEME } from '../../constants/theme';
import { GradientButton } from '../../components/shared/GradientButton';
import { GradientCard } from '../../components/shared/GradientCard';
import { BlurView } from 'expo-blur';

// Extended project details
const PROJECT_DETAILS = {
  1: {
    title: 'नेपाली अर्पाबेट सिस्टम',
    subtitle: 'Rule Based G2P for Nepali Language',
    icon: 'language',
    description: 'नेपाली भाषाको लागि नियम-आधारित ग्राफिम-टु-फोनिम रूपान्तरण प्रणाली',
    gradient: ['#2563EB', '#7C3AED'],
    longDescription: `
      यो प्रणालीले नेपाली भाषाको लिपि र उच्चारणको बीचको सम्बन्धलाई नियम-आधारित तरिकाले व्याख्या गर्छ।
      
      मुख्य विशेषताहरू:
      • व्यञ्जन र स्वरको विस्तृत वर्गीकरण
      • हलन्त र संयुक्त अक्षरको विशेष प्रबन्ध
      • उच्चारण नियमहरूको व्यवस्थित संग्रह
      • सरल र छिटो कार्यान्वयन
    `,
    features: [
      {
        title: 'नियम-आधारित रूपान्तरण',
        description: 'व्याकरणिक नियमहरूमा आधारित स्वचालित रूपान्तरण',
        icon: 'git-branch'
      },
      {
        title: 'उच्च शुद्धता',
        description: '९८% भन्दा बढी शुद्धता दर',
        icon: 'checkmark-circle'
      },
      // Add more features
    ],
    techStack: [
      'Python',
      'Regular Expressions',
      'Unicode',
      'Phonetics',
    ],
    publications: [
      {
        title: 'Paper Title Here',
        conference: 'Conference Name 2023',
        link: 'https://example.com/paper'
      }
    ],
    demoUrl: 'https://example.com/demo',
    githubUrl: 'https://github.com/username/repo',
  },
  // Add other project details...
};

export default function ProjectDetailsScreen() {
  const { id } = useLocalSearchParams();
  const project = PROJECT_DETAILS[Number(id)];

  if (!project) return null;

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          headerShown: false,
        }}
      />
      
      <ScrollView style={styles.scrollView}>
        {/* Hero Section */}
        <LinearGradient
          colors={project.gradient}
          style={styles.hero}>
          <BlurView intensity={20} style={styles.heroContent}>
            <LinearGradient
              colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
              style={styles.iconContainer}>
              <Ionicons name={project.icon as any} size={32} color="#fff" />
            </LinearGradient>
            <Text style={styles.title}>{project.title}</Text>
            <Text style={styles.subtitle}>{project.subtitle}</Text>
          </BlurView>
        </LinearGradient>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Description */}
          <GradientCard style={styles.section}>
            <Text style={styles.sectionTitle}>परियोजना विवरण</Text>
            <Text style={styles.description}>{project.longDescription}</Text>
          </GradientCard>

          {/* Features */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>मुख्य विशेषताहरू</Text>
            <View style={styles.featuresGrid}>
              {project.features.map((feature, index) => (
                <GradientCard 
                  key={index}
                  style={styles.featureCard}
                  gradient={project.gradient}>
                  <Ionicons 
                    name={feature.icon as any} 
                    size={24} 
                    color="#fff" 
                    style={styles.featureIcon}
                  />
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>
                    {feature.description}
                  </Text>
                </GradientCard>
              ))}
            </View>
          </View>

          {/* Tech Stack */}
          <GradientCard style={styles.section}>
            <Text style={styles.sectionTitle}>प्रविधि स्ट्याक</Text>
            <View style={styles.techStack}>
              {project.techStack.map((tech, index) => (
                <View key={index} style={styles.techItem}>
                  <Text style={styles.techText}>{tech}</Text>
                </View>
              ))}
            </View>
          </GradientCard>

          {/* Publications */}
          {project.publications.length > 0 && (
            <GradientCard style={styles.section}>
              <Text style={styles.sectionTitle}>प्रकाशनहरू</Text>
              {project.publications.map((pub, index) => (
                <TouchableOpacity 
                  key={index}
                  style={styles.publication}
                  onPress={() => Linking.openURL(pub.link)}>
                  <Text style={styles.publicationTitle}>{pub.title}</Text>
                  <Text style={styles.publicationVenue}>{pub.conference}</Text>
                </TouchableOpacity>
              ))}
            </GradientCard>
          )}

          {/* Action Buttons */}
          <View style={styles.actions}>
            {project.demoUrl && (
              <GradientButton
                title="डेमो हेर्नुहोस्"
                icon="play"
                onPress={() => Linking.openURL(project.demoUrl)}
                style={styles.actionButton}
              />
            )}
            {project.githubUrl && (
              <GradientButton
                title="GitHub"
                icon="logo-github"
                variant="secondary"
                onPress={() => Linking.openURL(project.githubUrl)}
                style={styles.actionButton}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  hero: {
    height: 200,
    justifyContent: 'flex-end',
  },
  heroContent: {
    padding: 24,
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    ...NEPALI_THEME.shadows.md,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: NEPALI_THEME.text,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: NEPALI_THEME.text,
    lineHeight: 24,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  featureCard: {
    width: '45%',
    padding: 16,
  },
  featureIcon: {
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: NEPALI_THEME.text,
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: NEPALI_THEME.textSecondary,
    lineHeight: 20,
  },
  techStack: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  techItem: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  techText: {
    color: NEPALI_THEME.text,
    fontSize: 14,
  },
  publication: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
  },
  publicationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: NEPALI_THEME.text,
    marginBottom: 4,
  },
  publicationVenue: {
    fontSize: 14,
    color: NEPALI_THEME.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
  },
}); 