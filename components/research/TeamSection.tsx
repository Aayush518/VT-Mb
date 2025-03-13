import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { NEPALI_THEME } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { PROJECT_INFO } from '../../constants/team';

interface TeamMember {
  name: string;
  role: string;
  image: string;
  expertise: string[];
  contributions: string[];
  description: string;
  contact: {
    email: string;
    github: string;
    linkedin: string;
  };
}

interface TeamSectionProps {
  team: TeamMember[];
}

export function TeamSection({ team }: TeamSectionProps) {
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      
      {/* Project Info Card */}
      <View style={styles.projectInfoCard}>
        <LinearGradient
          colors={[NEPALI_THEME.primary, NEPALI_THEME.secondary]}
          style={styles.projectInfoContent}>
          <Text style={styles.projectTitle}>{PROJECT_INFO.title}</Text>
          <Text style={styles.projectDescription}>{PROJECT_INFO.description}</Text>
          <View style={styles.institutionInfo}>
            <Text style={styles.institutionText}>{PROJECT_INFO.institution}</Text>
            <Text style={styles.institutionText}>{PROJECT_INFO.department}</Text>
            <Text style={styles.institutionText}>{PROJECT_INFO.year}</Text>
          </View>
          <View style={styles.supervisor}>
            <Text style={styles.supervisorTitle}>Project Supervisor</Text>
            <Text style={styles.supervisorName}>{PROJECT_INFO.supervisor.name}</Text>
            <Text style={styles.supervisorRole}>{PROJECT_INFO.supervisor.role}</Text>
            <Text style={styles.supervisorDept}>{PROJECT_INFO.supervisor.department}</Text>
          </View>
          <View style={styles.technologies}>
            <Text style={styles.techTitle}>Technologies Used</Text>
            {Object.entries(PROJECT_INFO.technologies).map(([category, techs]) => (
              <View key={category} style={styles.techCategory}>
                <Text style={styles.categoryTitle}>{category}</Text>
                <View style={styles.techTags}>
                  {techs.map((tech, i) => (
                    <View key={i} style={styles.techTag}>
                      <Text style={styles.techText}>{tech}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </LinearGradient>
      </View>

      {/* Team Members */}
      {team.map((member, index) => (
        <View key={index} style={styles.memberCard}>
          <LinearGradient
            colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
            style={styles.cardContent}>
            <Image 
              source={{ uri: member.image }} 
              style={styles.memberImage}
            />
            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>{member.name}</Text>
              <Text style={styles.memberRole}>{member.role}</Text>
              <Text style={styles.memberDescription}>{member.description}</Text>
              
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>विशेषज्ञता</Text>
                <View style={styles.tags}>
                  {member.expertise.map((skill, i) => (
                    <View key={i} style={styles.tag}>
                      <Text style={styles.tagText}>{skill}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>योगदान</Text>
                {member.contributions.map((contribution, i) => (
                  <View key={i} style={styles.contributionItem}>
                    <Ionicons name="checkmark-circle" size={16} color={NEPALI_THEME.success} />
                    <Text style={styles.contributionText}>{contribution}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>सम्पर्क</Text>
                <View style={styles.contactLinks}>
                  <TouchableOpacity 
                    style={styles.contactLink}
                    onPress={() => Linking.openURL(`mailto:${member.contact.email}`)}>
                    <Ionicons name="mail" size={20} color={NEPALI_THEME.primary} />
                    <Text style={styles.linkText}>Email</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.contactLink}
                    onPress={() => Linking.openURL(`https://${member.contact.github}`)}>
                    <Ionicons name="logo-github" size={20} color={NEPALI_THEME.primary} />
                    <Text style={styles.linkText}>GitHub</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.contactLink}
                    onPress={() => Linking.openURL(`https://${member.contact.linkedin}`)}>
                    <Ionicons name="logo-linkedin" size={20} color={NEPALI_THEME.primary} />
                    <Text style={styles.linkText}>LinkedIn</Text>
                  </TouchableOpacity>
                </View>
              </View>
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
  memberCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardContent: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  memberImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
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
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: NEPALI_THEME.text,
    marginBottom: 8,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    color: NEPALI_THEME.text,
    fontSize: 14,
  },
  contributionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  contributionText: {
    color: NEPALI_THEME.text,
    fontSize: 14,
    flex: 1,
  },
  projectInfoCard: {
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  projectInfoContent: {
    padding: 20,
  },
  projectTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  projectDescription: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 24,
    marginBottom: 16,
  },
  institutionInfo: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
    paddingTop: 16,
  },
  institutionText: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 4,
  },
  memberDescription: {
    fontSize: 14,
    color: NEPALI_THEME.textSecondary,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  contactLinks: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  contactLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
  },
  linkText: {
    color: NEPALI_THEME.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  supervisor: {
    marginTop: 16,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
  },
  supervisorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  supervisorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  supervisorRole: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  supervisorDept: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  technologies: {
    marginTop: 16,
  },
  techTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  techCategory: {
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    textTransform: 'capitalize',
    marginBottom: 8,
  },
  techTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  techTag: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  techText: {
    color: '#fff',
    fontSize: 14,
  },
}); 