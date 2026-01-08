import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useTheme } from '../../theme/ThemeContext';
import { getPosterUrl, PLACEHOLDER_POSTER } from '../../services/api';

export default function CourseCard({ course, onPress }) {
  const { theme, isDark } = useTheme();
  const thumbnail = getPosterUrl(course.thumbnail);
  
  return (
    <TouchableOpacity 
      style={[styles.card, { borderColor: theme.border }]} 
      onPress={onPress} 
      activeOpacity={0.7}
    >
      <BlurView intensity={isDark ? 30 : 50} style={StyleSheet.absoluteFill} tint={isDark ? 'dark' : 'light'} />
      <View style={[styles.innerContainer, { backgroundColor: isDark ? 'rgba(15, 23, 42, 0.6)' : 'rgba(255, 255, 255, 0.6)' }]}>
        <Image 
          source={thumbnail || PLACEHOLDER_POSTER}
          placeholder={PLACEHOLDER_POSTER}
          contentFit="cover"
          transition={200}
          style={[styles.thumbnail, { backgroundColor: theme.border }]}
        />
        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Text style={[styles.subject, { color: theme.primary, fontFamily: theme.fontBold }]}>
              {course.subject}
            </Text>
            <View style={[styles.ratingContainer, { backgroundColor: theme.secondary + '20' }]}>
              <Feather name="star" size={10} color={theme.secondary} />
              <Text style={[styles.rating, { color: theme.secondary, fontFamily: theme.fontBold }]}>
                {course.rating}
              </Text>
            </View>
          </View>
          
          <Text style={[styles.title, { color: theme.text, fontFamily: theme.fontBold }]} numberOfLines={2}>
            {course.title}
          </Text>
          
          <Text style={[styles.instructor, { color: theme.textSub, fontFamily: theme.fontRegular }]} numberOfLines={1}>
            {course.instructor}
          </Text>
          
          <View style={styles.footer}>
            <View style={styles.metaRow}>
              <Feather name="clock" size={12} color={theme.textSub} />
              <Text style={[styles.metaText, { color: theme.textSub }]}>{course.duration}</Text>
              <View style={styles.metaDivider} />
              <Feather name="book-open" size={12} color={theme.textSub} />
              <Text style={[styles.metaText, { color: theme.textSub }]}>{course.lessons_count} lessons</Text>
            </View>
            <Feather name="chevron-right" size={20} color={theme.primary} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 30,
    overflow: 'hidden',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  innerContainer: {
    flexDirection: 'row',
    padding: 12,
  },
  thumbnail: {
    width: 80,
    height: 110,
    borderRadius: 20,
  },
  content: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  subject: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: 16,
    marginBottom: 4,
    lineHeight: 22,
  },
  instructor: {
    fontSize: 13,
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 11,
    marginLeft: 4,
  },
  metaDivider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  rating: {
    fontSize: 10,
    marginLeft: 3,
  }
});
