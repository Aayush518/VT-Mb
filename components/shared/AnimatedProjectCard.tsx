import React, { useEffect } from 'react';
import { Animated, TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import { Project } from '../../constants/projects';
import { GradientCard } from './GradientCard';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NEPALI_THEME } from '../../constants/theme';
import { GradientButton } from './GradientButton';

interface AnimatedProjectCardProps {
  project: Project;
  index: number;
}

export function AnimatedProjectCard({ project, index }: AnimatedProjectCardProps) {
  const scaleAnim = new Animated.Value(0);
  const opacityAnim = new Animated.Value(0);
  const translateYAnim = new Animated.Value(50);
  const router = useRouter();

  useEffect(() => {
    Animated.sequence([
      Animated.delay(index * 100),
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(translateYAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { scale: scaleAnim },
            { translateY: translateYAnim }
          ],
          opacity: opacityAnim,
        },
      ]}>
      <TouchableOpacity
        onPress={() => router.push(`/project/${project.id}`)}
        activeOpacity={0.8}>
        <GradientCard
          gradient={project.gradient}
          style={styles.card}>
          <View style={styles.header}>
            <LinearGradient
              colors={project.gradient}
              style={styles.iconContainer}>
              <Ionicons name={project.icon} size={24} color="#fff" />
            </LinearGradient>
            <View style={styles.statusContainer}>
              <View style={[
                styles.statusDot,
                { backgroundColor: getStatusColor(project.status) }
              ]} />
              <Text style={styles.statusText}>
                {getStatusText(project.status)}
              </Text>
            </View>
          </View>

          <Text style={styles.title}>{project.title}</Text>
          <Text style={styles.subtitle}>{project.subtitle}</Text>
          
          <Text style={styles.description}>
            {project.description}
          </Text>

          {project.techStack && project.techStack.length > 0 && (
            <View style={styles.techStack}>
              {project.techStack.slice(0, 3).map((tech, i) => (
                <View key={i} style={styles.techBadge}>
                  <Text style={styles.techText}>{tech}</Text>
                </View>
              ))}
              {project.techStack.length > 3 && (
                <View style={styles.techBadge}>
                  <Text style={styles.techText}>+{project.techStack.length - 3}</Text>
                </View>
              )}
            </View>
          )}

          <GradientButton
            title="थप जानकारी"
            icon="arrow-forward"
            onPress={() => router.push(`/project/${project.id}`)}
            variant="secondary"
            style={styles.button}
          />
        </GradientCard>
      </TouchableOpacity>
    </Animated.View>
  );
}

const getStatusColor = (status: Project['status']) => {
  switch (status) {
    case 'completed':
      return NEPALI_THEME.success;
    case 'ongoing':
      return NEPALI_THEME.warning;
    case 'planned':
      return NEPALI_THEME.info;
  }
};

const getStatusText = (status: Project['status']) => {
  switch (status) {
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
    marginBottom: 16,
  },
  card: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    color: NEPALI_THEME.text,
    opacity: 0.8,
  },
  techStack: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
    marginBottom: 20,
  },
  techBadge: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  techText: {
    fontSize: 12,
    color: NEPALI_THEME.text,
    opacity: 0.8,
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: NEPALI_THEME.text,
    opacity: 0.8,
  },
  description: {
    fontSize: 12,
    color: NEPALI_THEME.text,
    opacity: 0.8,
  },
  button: {
    marginTop: 16,
  },
}); 