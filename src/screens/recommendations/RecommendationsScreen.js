import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, RefreshControl, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import { getRecommendations } from '../../services/api';
import CourseCard from '../../components/specific/CourseCard';

export default function RecommendationsScreen({ navigation }) {
  const learningList = useSelector(state => state.learning?.items || []);
  const history = useSelector(state => state.history?.items || []);
  const { theme, isDark } = useTheme();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecommendations = useCallback(async (showError = true) => {
    try {
      setError(null);
      // Collect unique course IDs from learning list and history
      const courseIds = Array.from(new Set([...learningList, ...history].map(course => course.key)));

      if (courseIds.length === 0) {
        setCourses([]);
        if (showError) {
          setError('Enroll in courses or view subjects to get personalized recommendations.');
        }
        return;
      }

      // Collect keys to exclude (already in learning list or history)
      const excludeKeys = new Set([...learningList, ...history].map(course => course.key));

      const data = await getRecommendations(courseIds, Array.from(excludeKeys));
      setCourses(data || []);
      if ((!data || data.length === 0) && showError) {
        setError('No specific recommendations found. Try exploring more subjects!');
      }
    } catch (error) {
      console.error('Fetch recommendations error:', error);
      setError('Failed to fetch recommendations. Please check your connection.');
      if (showError) {
        Alert.alert('Error', 'Failed to fetch skill recommendations.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [learningList, history]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchRecommendations(false);
  }, [fetchRecommendations]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  const renderEmptyState = useCallback(() => {
    if (loading) return null;

    return (
      <View style={styles.emptyContainer}>
        <Feather name="award" size={64} color={theme.textSub} />
        <Text style={[styles.emptyTitle, { color: theme.text, fontFamily: theme.fontBold }]}>No skill recommendations yet</Text>
        <Text style={[styles.emptySubtitle, { color: theme.textSub, fontFamily: theme.fontRegular }]}>
          {error || 'Enroll in courses or browse skills to get personalized learning recommendations.'}
        </Text>
      </View>
    );
  }, [loading, theme, error]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        <Text style={[styles.title, { color: theme.text, fontFamily: theme.fontBold }]}>Recommended for You</Text>
        <Text style={[styles.subtitle, { color: theme.textSub, fontFamily: theme.fontRegular }]}>
          Based on your learning history and interests
        </Text>
      </View>

      {loading && !refreshing ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={{ marginTop: 10, color: theme.textSub, fontFamily: theme.fontRegular }}>Personalizing your path...</Text>
        </View>
      ) : (
        <FlatList
          data={courses}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <CourseCard
              course={item}
              onPress={() => navigation.navigate('CourseDetails', { course: item })}
            />
          )}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={
            courses.length === 0
              ? styles.emptyListContent
              : styles.listContent
          }
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.primary}
              colors={[theme.primary]}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 120,
    paddingTop: 16
  },
  emptyListContent: {
    flexGrow: 1,
    paddingBottom: 120,
    paddingHorizontal: 16
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  title: { fontSize: 24 },
  subtitle: { fontSize: 14, marginTop: 4 },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    minHeight: 400
  },
  emptyTitle: {
    fontSize: 20,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center'
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22
  }
});
