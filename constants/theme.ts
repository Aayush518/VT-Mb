export const NEPALI_THEME = {
  // Primary Colors
  primary: '#2563EB',    // Bright Blue
  secondary: '#7C3AED',  // Purple
  accent: '#F59E0B',     // Amber
  
  // Background Colors
  background: '#0F172A',  // Dark Blue
  surface: '#1E293B',    // Lighter Dark Blue
  card: 'rgba(30, 41, 59, 0.8)', // Semi-transparent Surface
  
  // Text Colors
  text: '#F8FAFC',       // Almost White
  textSecondary: '#94A3B8', // Gray
  
  // Status Colors
  success: '#22C55E',    // Green
  error: '#EF4444',      // Red
  warning: '#F59E0B',    // Amber
  info: '#3B82F6',       // Blue
  
  // Gradients
  gradients: {
    primary: ['#2563EB', '#7C3AED'],
    accent: ['#F59E0B', '#DC2626'],
    surface: ['rgba(30, 41, 59, 0.95)', 'rgba(15, 23, 42, 0.95)'],
    card: ['rgba(30, 41, 59, 0.8)', 'rgba(15, 23, 42, 0.8)'],
  },
  
  // Common Styles
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
  
  shadows: {
    sm: {
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
    },
    md: {
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    lg: {
      elevation: 6,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
    },
  },
  
  // Common Component Styles
  components: {
    card: {
      backgroundColor: 'rgba(30, 41, 59, 0.8)',
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.1)',
    },
    button: {
      primary: {
        backgroundColor: '#2563EB',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
      },
      secondary: {
        backgroundColor: '#7C3AED',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
      },
    },
    input: {
      backgroundColor: 'rgba(30, 41, 59, 0.8)',
      borderRadius: 12,
      padding: 12,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.1)',
      color: '#F8FAFC',
    },
  },
};