import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { RESEARCH_DATA } from '../../constants/researchData';
import { NEPALI_THEME } from '../../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProjectsSection } from '../../components/research/ProjectsSection';
import { RESEARCH_PROJECTS } from '../../constants/projects';
import { Stack } from 'expo-router';
import { BlurView } from 'expo-blur';
import { TeamSection } from '../../components/research/TeamSection';
import { HighlightsSection } from '../../components/research/HighlightsSection';
import { TEAM_DATA } from '../../constants/team';
import { RESEARCH_HIGHLIGHTS } from '../../constants/research';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400';

type TabType = 'projects' | 'team' | 'highlights';

export default function ResearchScreen() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabType>('projects');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen 
        options={{
          title: 'अनुसन्धान',
          headerStyle: {
            backgroundColor: NEPALI_THEME.background,
          },
          headerTintColor: NEPALI_THEME.text,
          headerShadowVisible: false,
        }}
      />
      
      <View style={styles.tabBar}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'projects' && styles.activeTab]}
            onPress={() => setActiveTab('projects')}>
            <Ionicons 
              name="library" 
              size={20} 
              color={activeTab === 'projects' ? '#fff' : NEPALI_THEME.textSecondary} 
            />
            <Text style={[styles.tabText, activeTab === 'projects' && styles.activeTabText]}>
              परियोजनाहरू
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'team' && styles.activeTab]}
            onPress={() => setActiveTab('team')}>
            <Ionicons 
              name="people" 
              size={20} 
              color={activeTab === 'team' ? '#fff' : NEPALI_THEME.textSecondary} 
            />
            <Text style={[styles.tabText, activeTab === 'team' && styles.activeTabText]}>
              टोली
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'highlights' && styles.activeTab]}
            onPress={() => setActiveTab('highlights')}>
            <Ionicons 
              name="star" 
              size={20} 
              color={activeTab === 'highlights' ? '#fff' : NEPALI_THEME.textSecondary} 
            />
            <Text style={[styles.tabText, activeTab === 'highlights' && styles.activeTabText]}>
              हाइलाइट्स
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      
      <LinearGradient
        colors={[
          NEPALI_THEME.background,
          'rgba(30,41,59,0.98)',
        ]}
        style={styles.content}>
        {activeTab === 'projects' && <ProjectsSection projects={RESEARCH_PROJECTS} />}
        {activeTab === 'team' && <TeamSection team={TEAM_DATA} />}
        {activeTab === 'highlights' && <HighlightsSection highlights={RESEARCH_HIGHLIGHTS} />}
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NEPALI_THEME.background,
  },
  tabBar: {
    backgroundColor: NEPALI_THEME.surface,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  tabContainer: {
    padding: 8,
    gap: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  activeTab: {
    backgroundColor: NEPALI_THEME.primary,
  },
  tabText: {
    color: NEPALI_THEME.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    padding: 24,
    paddingTop: 48,
    paddingBottom: 48,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 32,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: NEPALI_THEME.text,
    marginBottom: 20,
  },
  projectCard: {
    width: 300,
    backgroundColor: NEPALI_THEME.surface,
    borderRadius: 16,
    padding: 20,
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(228,0,55,0.2)',
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  projectTags: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    backgroundColor: 'rgba(228,0,55,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    color: NEPALI_THEME.primary,
    fontSize: 12,
  },
  projectTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: NEPALI_THEME.text,
    marginBottom: 8,
  },
  projectDescription: {
    fontSize: 14,
    color: NEPALI_THEME.textSecondary,
    marginBottom: 16,
  },
  projectLinks: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: NEPALI_THEME.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  linkText: {
    color: '#fff',
    fontWeight: '600',
  },
  paperCard: {
    backgroundColor: NEPALI_THEME.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(228,0,55,0.2)',
  },
  paperTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: NEPALI_THEME.text,
    marginBottom: 8,
  },
  paperAuthors: {
    fontSize: 14,
    color: NEPALI_THEME.textSecondary,
    marginBottom: 4,
  },
  paperVenue: {
    fontSize: 14,
    color: NEPALI_THEME.textSecondary,
    marginBottom: 16,
  },
  paperLinks: {
    flexDirection: 'row',
    gap: 16,
  },
  paperLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  paperLinkText: {
    color: NEPALI_THEME.primary,
    fontWeight: '600',
  },
  teamGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    justifyContent: 'center',
  },
  memberCard: {
    width: Platform.select({ tablet: '45%', default: '100%' }),
    backgroundColor: NEPALI_THEME.surface,
    borderRadius: 16,
    overflow: 'hidden',
  },
  memberImage: {
    width: '100%',
    height: 200,
  },
  memberInfo: {
    padding: 16,
  },
  memberName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: NEPALI_THEME.text,
    marginBottom: 4,
  },
  memberRole: {
    fontSize: 16,
    color: NEPALI_THEME.textSecondary,
    marginBottom: 16,
  },
  memberLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
});