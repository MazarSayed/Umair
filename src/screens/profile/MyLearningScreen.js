import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView, Platform, LayoutAnimation, UIManager } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import * as Haptics from 'expo-haptics';
import CourseCard from '../../components/specific/CourseCard';
import { useTheme } from '../../theme/ThemeContext';
import { LEARNING_STATUS, updateLearningStatus } from '../../store/slices/learningSlice';
import { Feather } from '@expo/vector-icons';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function MyLearningScreen({ navigation }) {
  const learningList = useSelector(state => state.learning?.items || []);
  const dispatch = useDispatch();
  const { theme, isDark } = useTheme();
  const [activeFilter, setActiveFilter] = useState('All');

  const hapticFeedback = () => {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleFilterPress = (filter) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveFilter(filter);
    hapticFeedback();
  };

  const filters = ['All', ...Object.values(LEARNING_STATUS)];

  const filteredLearningList = activeFilter === 'All'
    ? learningList
    : learningList.filter(item => item.status === activeFilter);

  const renderFilterButton = (filter) => {
    const isActive = activeFilter === filter;
    const count = filter === 'All'
      ? learningList.length
      : learningList.filter(item => item.status === filter).length;

    return (
      <TouchableOpacity 
        key={filter}
        onPress={() => handleFilterPress(filter)}
        style={[
          styles.filterButton,
          { 
            backgroundColor: isActive ? theme.primary : theme.surface,
            borderColor: theme.border
          }
        ]}
      >
        <Text style={[
          styles.filterText,
          { color: isActive ? '#FFF' : theme.text, fontFamily: theme.fontBold }
        ]}>
          {filter}
          {count > 0 && ` (${count})`}
        </Text>
      </TouchableOpacity>
    );
  };

  const handleStatusChange = (courseKey, currentStatus) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    const statuses = Object.values(LEARNING_STATUS);
    const currentIndex = statuses.indexOf(currentStatus);
    const nextIndex = (currentIndex + 1) % statuses.length;
    dispatch(updateLearningStatus({ courseKey, status: statuses[nextIndex] }));
    hapticFeedback();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {filters.map(renderFilterButton)}
        </ScrollView>
      </View>

      {filteredLearningList.length === 0 ? (
        <View style={styles.emptyState}>
          <Feather name="book-open" size={64} color={theme.border} style={{ marginBottom: 16 }} />
          <Text style={[styles.emptyText, { color: theme.text, fontFamily: theme.fontBold }]}>
            {activeFilter === 'All' ? 'Your learning list is empty' : `No courses "${activeFilter}"`}
          </Text>
          <Text style={[styles.subText, { color: theme.textSub, fontFamily: theme.fontRegular }]}>
            {activeFilter === 'All' 
              ? 'Start exploring and enroll in courses to build your skills!' 
              : 'Try checking another category or enroll in more courses!'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredLearningList}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <CourseCard 
                course={item} 
                onPress={() => navigation.navigate('CourseDetails', { course: item })} 
              />
              <TouchableOpacity 
                style={[styles.statusBadge, { backgroundColor: theme.primary + '20', borderColor: theme.primary }]}
                onPress={() => handleStatusChange(item.key, item.status)}
              >
                <Feather name="refresh-cw" size={12} color={theme.primary} />
                <Text style={[styles.statusText, { color: theme.primary, fontFamily: theme.fontBold }]}>{item.status}</Text>
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  filterContainer: { paddingVertical: 12 },
  filterScroll: { paddingHorizontal: 16 },
  filterButton: { 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    borderRadius: 20, 
    marginRight: 10, 
    borderWidth: 1 
  },
  filterText: { fontSize: 14 },
  listContent: { padding: 16, paddingBottom: 100 },
  cardWrapper: { position: 'relative' },
  statusBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    zIndex: 10
  },
  statusText: { fontSize: 10, marginLeft: 4 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyText: { fontSize: 20, marginBottom: 8, textAlign: 'center' },
  subText: { fontSize: 14, textAlign: 'center', lineHeight: 22 },
});
