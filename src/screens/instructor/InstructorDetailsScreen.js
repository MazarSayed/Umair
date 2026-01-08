import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator, FlatList } from 'react-native';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import { getInstructorCourses } from '../../services/api';
import CourseCard from '../../components/specific/CourseCard';

const { width } = Dimensions.get('window');

export default function InstructorDetailsScreen({ route, navigation }) {
  const { instructor } = route.params;
  const { theme, isDark } = useTheme();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const instructorCourses = await getInstructorCourses(instructor.id);
      setCourses(instructorCourses);
      setLoading(false);
    };
    loadData();
  }, [instructor.id]);

  const StatItem = ({ label, value, icon }) => (
    <View style={styles.statItem}>
      <View style={[styles.statIcon, { backgroundColor: theme.primary + '15' }]}>
        <Feather name={icon} size={16} color={theme.primary} />
      </View>
      <View>
        <Text style={[styles.statValue, { color: theme.text, fontFamily: theme.fontBold }]}>{value}</Text>
        <Text style={[styles.statLabel, { color: theme.textSub, fontFamily: theme.fontRegular }]}>{label}</Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <View style={styles.header}>
          <Image
            source={instructor.profile_path}
            style={styles.profileImage}
            contentFit="cover"
            transition={300}
          />
          <Text style={[styles.name, { color: theme.text, fontFamily: theme.fontBold }]}>{instructor.name}</Text>
          <Text style={[styles.credentials, { color: theme.primary, fontFamily: theme.fontBold }]}>{instructor.credentials}</Text>
          {instructor.experience && (
            <Text style={[styles.experience, { color: theme.textSub, fontFamily: theme.fontRegular }]}>{instructor.experience}</Text>
          )}
        </View>

        {/* Stats Row */}
        <View style={[styles.statsRow, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <StatItem icon="users" label="Students" value={instructor.students} />
          <StatItem icon="star" label="Rating" value={instructor.rating} />
          <StatItem icon="book-open" label="Courses" value={instructor.courses_count} />
        </View>

        {/* Skills Section */}
        {instructor.skills && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text, fontFamily: theme.fontBold }]}>Expertise</Text>
            <View style={styles.skillsContainer}>
              {instructor.skills.map((skill, index) => (
                <View key={index} style={[styles.skillBadge, { backgroundColor: theme.primary + '10', borderColor: theme.primary + '30' }]}>
                  <Text style={[styles.skillText, { color: theme.primary, fontFamily: theme.fontBold }]}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Bio Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text, fontFamily: theme.fontBold }]}>About Instructor</Text>
          <Text style={[styles.bio, { color: theme.textSub, fontFamily: theme.fontRegular }]}>
            {instructor.bio}
          </Text>
        </View>

        {/* Courses Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text, fontFamily: theme.fontBold }]}>Courses by {instructor.name.split(' ')[0]}</Text>
          {loading ? (
            <ActivityIndicator color={theme.primary} size="large" style={{ marginTop: 20 }} />
          ) : (
            <View style={styles.coursesList}>
              {courses.map(course => (
                <CourseCard 
                  key={course.key} 
                  course={course} 
                  onPress={() => navigation.navigate('CourseDetails', { course })} 
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Custom Back Button */}
      <TouchableOpacity 
        style={[styles.backButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
        onPress={() => navigation.goBack()}
      >
        <Feather name="arrow-left" size={24} color={theme.text} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 100,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 24,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    borderWidth: 4,
    borderColor: '#FFF',
  },
  name: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 4,
  },
  credentials: {
    fontSize: 16,
    textAlign: 'center',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  experience: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 24,
    paddingVertical: 20,
    borderRadius: 30,
    borderWidth: 1,
    marginBottom: 30,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
  },
  statLabel: {
    fontSize: 12,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  skillText: {
    fontSize: 12,
  },
  bio: {
    fontSize: 15,
    lineHeight: 24,
  },
  coursesList: {
    gap: 16,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  }
});
