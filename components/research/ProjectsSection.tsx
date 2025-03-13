import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { NEPALI_THEME } from '../../constants/theme';
import { Project } from '../../constants/projects';
import { AnimatedProjectCard } from '../shared/AnimatedProjectCard';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

interface ProjectsSectionProps {
  projects: Project[];
}

type FilterStatus = 'all' | 'completed' | 'ongoing' | 'planned';

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<FilterStatus>('all');

  const filteredProjects = useCallback(() => {
    return projects.filter(project => {
      const matchesSearch = 
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = 
        selectedStatus === 'all' || project.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [projects, searchQuery, selectedStatus]);

  const getStatusCount = (status: FilterStatus) => {
    if (status === 'all') return projects.length;
    return projects.filter(p => p.status === status).length;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* Search Bar */}
        <LinearGradient
          colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.searchContainer}>
          <Ionicons 
            name="search" 
            size={20} 
            color={NEPALI_THEME.textSecondary} 
          />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="खोज्नुहोस्..."
            placeholderTextColor={NEPALI_THEME.textSecondary}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}>
              <Ionicons 
                name="close-circle" 
                size={20} 
                color={NEPALI_THEME.textSecondary} 
              />
            </TouchableOpacity>
          )}
        </LinearGradient>

        {/* Filter Tabs */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}>
          {(['all', 'completed', 'ongoing', 'planned'] as FilterStatus[]).map((status) => (
            <TouchableOpacity
              key={status}
              onPress={() => setSelectedStatus(status)}
              style={styles.filterTab}>
              <LinearGradient
                colors={
                  selectedStatus === status 
                    ? [NEPALI_THEME.primary, NEPALI_THEME.secondary]
                    : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.filterGradient}>
                <Text style={[
                  styles.filterText,
                  selectedStatus === status && styles.filterTextActive
                ]}>
                  {getStatusText(status)} ({getStatusCount(status)})
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Projects List */}
      <ScrollView 
        style={styles.projectsList}
        contentContainerStyle={styles.projectsContent}
        showsVerticalScrollIndicator={false}>
        {filteredProjects().map((project, index) => (
          <AnimatedProjectCard
            key={project.id}
            project={project}
            index={index}
          />
        ))}
        {filteredProjects().length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons 
              name="search-outline" 
              size={48} 
              color={NEPALI_THEME.textSecondary} 
            />
            <Text style={styles.emptyText}>
              कुनै परियोजना फेला परेन
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const getStatusText = (status: FilterStatus) => {
  switch (status) {
    case 'all':
      return 'सबै';
    case 'completed':
      return 'सम्पन्न';
    case 'ongoing':
      return 'जारी';
    case 'planned':
      return 'योजनाबद्ध';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 16,
    paddingHorizontal: 16,
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    paddingBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    color: NEPALI_THEME.text,
    fontSize: 16,
    height: 24,
  },
  clearButton: {
    padding: 4,
  },
  filterContainer: {
    flexGrow: 0,
  },
  filterContent: {
    gap: 8,
  },
  filterTab: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  filterGradient: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterText: {
    color: NEPALI_THEME.textSecondary,
    fontSize: 14,
  },
  filterTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  projectsList: {
    flex: 1,
  },
  projectsContent: {
    padding: 16,
    gap: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
  },
  emptyText: {
    color: NEPALI_THEME.textSecondary,
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
}); 