import React, { useEffect, useState, useCallback, useRef, memo } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TextInput, TouchableOpacity, RefreshControl, Alert, Dimensions, ScrollView, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Image } from 'expo-image';
import { useSelector } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import { searchCourses, getTrendingCourses, getPosterUrl, PLACEHOLDER_POSTER } from '../../services/api';
import CourseCard from '../../components/specific/CourseCard';
import { CourseCardSkeleton } from '../../components/common/SkeletonLoader';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width } = Dimensions.get('window');

const SUBJECTS = [
  { id: null, name: 'All' },
  { id: 'Coding', name: 'Coding' },
  { id: 'Design', name: 'Design' },
  { id: 'Business', name: 'Business' },
  { id: 'Marketing', name: 'Marketing' },
  { id: 'Science', name: 'Science' },
  { id: 'Arts', name: 'Arts' },
];

// Pre-fetch images helper
const prefetchImages = (courses) => {
  if (!courses) return;
  const urls = courses
    .map(c => getPosterUrl(c.thumbnail))
    .filter(url => url && url.startsWith('http'));
  Image.prefetch(urls);
};

const SearchBar = memo(({ searchQuery, onChangeText, onSearch, onClear, theme, isDark }) => (
  <View style={[styles.searchContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
    <Feather name="search" size={20} color={theme.textSub} style={styles.searchIcon} />
    <TextInput 
      style={[styles.searchInput, { color: theme.text, fontFamily: theme.fontRegular }]}
      placeholder="Search for skills, instructors..."
      placeholderTextColor={theme.textSub}
      value={searchQuery}
      onChangeText={onChangeText}
      onSubmitEditing={onSearch}
      returnKeyType="search"
      autoCorrect={false}
      autoCapitalize="none"
    />
    {searchQuery.length > 0 && (
      <TouchableOpacity onPress={onClear} style={styles.clearButton}>
        <Feather name="x" size={18} color={theme.textSub} />
      </TouchableOpacity>
    )}
    <TouchableOpacity onPress={onSearch} style={[styles.searchButton, { backgroundColor: theme.primary }]}>
      <Feather name="search" size={18} color="#FFF" />
    </TouchableOpacity>
  </View>
));

export default function HomeScreen({ navigation }) {
  const user = useSelector(state => state.auth.user);
  const { theme, isDark, toggleTheme } = useTheme();
  
  const [courses, setCourses] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isListLoading, setIsListLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [activeSubject, setActiveSubject] = useState(null);
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const loadInitialData = useCallback(async (isRefreshing = false) => {
    try {
      if (!isRefreshing) setLoading(true);
      setError(null);
      
      const [trendingData, discoverData] = await Promise.all([
        getTrendingCourses(),
        searchCourses(null)
      ]);
      
      setTrending(trendingData);
      setCourses(discoverData);
      setIsSearching(false);
      setActiveSubject(null);
      
      prefetchImages([...trendingData, ...discoverData.slice(0, 5)]);
    } catch (err) {
      setError("Failed to load courses");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const handleSearch = async (query) => {
    const trimmedQuery = query?.trim();
    if (!trimmedQuery) {
      loadInitialData();
      return;
    }

    try {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setIsListLoading(true);
      setIsSearching(true);
      setActiveSubject(null);
      const searchData = await searchCourses(trimmedQuery);
      setCourses(searchData);
    } catch (err) {
      setError("Search failed");
    } finally {
      setIsListLoading(false);
    }
  };

  const handleSubjectSelect = async (subjectId) => {
    // Prevent duplicate clicks unless searching
    if (activeSubject === subjectId && !isSearching) return;
    
    try {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setIsListLoading(true);
      setIsSearching(false);
      setSearchQuery('');
      setActiveSubject(subjectId);
      
      const filteredCourses = await searchCourses(null, 50, subjectId);
      setCourses(filteredCourses);
      
      prefetchImages(filteredCourses.slice(0, 5));
    } catch (err) {
      console.error(err);
      setError("Failed to load subjects");
    } finally {
      setIsListLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const onRefresh = () => {
    setRefreshing(true);
    setSearchQuery('');
    loadInitialData(true);
  };

  const renderHeader = () => {
    if (isSearching && searchQuery) {
      return (
        <View style={[styles.sectionHeader, { marginTop: 10, marginBottom: 20 }]}>
          <Text style={[styles.sectionTitle, { color: theme.text, fontFamily: theme.fontBold }]}>
            Results for "{searchQuery}"
          </Text>
          <TouchableOpacity onPress={() => { setSearchQuery(''); loadInitialData(); }}>
            <Text style={{ color: theme.primary, fontFamily: theme.fontRegular }}>Clear</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.listHeader}>
        {trending.length > 0 && (
          <View style={styles.featuredContainer}>
            <TouchableOpacity 
              activeOpacity={0.9}
              onPress={() => navigation.navigate('CourseDetails', { course: trending[0] })}
            >
            <Image 
              source={getPosterUrl(trending[0].thumbnail)} 
              placeholder={PLACEHOLDER_POSTER}
              style={[styles.featuredImage, { backgroundColor: theme.surface }]}
              contentFit="cover"
              transition={300}
            />
              <View style={styles.featuredOverlay}>
                <Text style={[styles.featuredTag, { backgroundColor: theme.primary, color: '#FFF' }]}>COURSE OF THE DAY</Text>
                <Text style={styles.featuredTitle}>{trending[0].title}</Text>
                <Text style={styles.featuredSubtitle}>by {trending[0].instructor}</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text, fontFamily: theme.fontBold }]}>Popular Skills</Text>
          <Feather name="trending-up" size={18} color={theme.primary} />
        </View>
        
        <FlatList
          data={trending.slice(1, 10)}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => `trending-${item.key}`}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.trendingCard}
              onPress={() => navigation.navigate('CourseDetails', { course: item })}
            >
              <Image 
                source={getPosterUrl(item.thumbnail)} 
                placeholder={PLACEHOLDER_POSTER}
                style={[styles.trendingImage, { backgroundColor: theme.surface }]} 
                contentFit="cover"
                transition={200}
              />
              <Text style={[styles.trendingTitle, { color: theme.text }]} numberOfLines={1}>{item.title}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.horizontalList}
        />

        <View style={[styles.sectionHeader, { marginTop: 24, marginBottom: 12 }]}>
          <Text style={[styles.sectionTitle, { color: theme.text, fontFamily: theme.fontBold }]}>
            Explore Subjects
          </Text>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.subjectScroll}
        >
          {SUBJECTS.map((subject) => (
            <TouchableOpacity
              key={subject.id || 'all'}
              style={[
                styles.subjectBadge,
                { 
                  backgroundColor: activeSubject === subject.id ? theme.primary : theme.surface,
                  borderColor: theme.border
                }
              ]}
              onPress={() => handleSubjectSelect(subject.id)}
            >
              <Text style={[
                styles.subjectText,
                { 
                  color: activeSubject === subject.id ? '#FFF' : theme.text,
                  fontFamily: activeSubject === subject.id ? theme.fontBold : theme.fontRegular
                }
              ]}>
                {subject.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={[styles.sectionHeader, { marginTop: 24 }]}>
          <Text style={[styles.sectionTitle, { color: theme.text, fontFamily: theme.fontBold }]}>
            {activeSubject ? `Top ${activeSubject} Courses` : "Discover More"}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.fixedSearchContainer, { backgroundColor: theme.background }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.greeting, { color: theme.text, fontFamily: theme.fontBold }]}>{getGreeting()}, {user?.name?.split(' ')[0] || 'Learner'} 👋</Text>
            <Text style={[styles.subGreeting, { color: theme.textSub, fontFamily: theme.fontRegular }]}>Ready to learn something new?</Text>
          </View>
          <TouchableOpacity onPress={toggleTheme} style={[styles.themeToggle, { borderColor: theme.border }]}>
            <Feather name={isDark ? 'sun' : 'moon'} size={20} color={theme.primary} />
          </TouchableOpacity>
        </View>

        <SearchBar
          searchQuery={searchQuery}
          onChangeText={setSearchQuery}
          onSearch={() => handleSearch(searchQuery)}
          onClear={() => { setSearchQuery(''); loadInitialData(); }}
          theme={theme}
          isDark={isDark}
        />
      </View>

      <FlatList
        data={isListLoading ? [] : courses}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <CourseCard course={item} onPress={() => navigation.navigate('CourseDetails', { course: item })} />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          loading || isListLoading ? (
            <View style={{ paddingVertical: 20 }}>
              {[1, 2, 3, 4, 5].map(i => <CourseCardSkeleton key={i} />)}
            </View>
          ) : (
            !loading && !isListLoading && courses.length === 0 && (
              <View style={styles.emptyContainer}>
                <Feather name="search" size={50} color={theme.textSub} />
                <Text style={[styles.emptyText, { color: theme.textSub, fontFamily: theme.fontRegular }]}>
                  No courses found.
                </Text>
                <TouchableOpacity 
                  style={[styles.clearSearchBtn, { backgroundColor: theme.primary }]}
                  onPress={() => { setSearchQuery(''); loadInitialData(); }}
                >
                  <Text style={[styles.clearSearchText, { color: '#FFF' }]}>Show All Courses</Text>
                </TouchableOpacity>
              </View>
            )
          )
        }
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  fixedSearchContainer: { padding: 16, paddingTop: Platform.OS === 'ios' ? 50 : 20 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  greeting: { fontSize: 24 },
  subGreeting: { fontSize: 14, marginTop: 2 },
  themeToggle: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  searchContainer: { flexDirection: 'row', borderRadius: 20, paddingHorizontal: 16, height: 50, alignItems: 'center', borderWidth: 1 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16 },
  searchButton: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  clearButton: { padding: 8 },
  listContent: { paddingHorizontal: 16, paddingBottom: 100 },
  listHeader: { marginBottom: 20 },
  featuredContainer: { height: 220, borderRadius: 30, overflow: 'hidden', marginBottom: 24, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 },
  featuredImage: { width: '100%', height: '100%' },
  featuredOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: 'rgba(0,0,0,0.5)' },
  featuredTag: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, marginBottom: 8, fontSize: 10, fontWeight: 'bold' },
  featuredTitle: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },
  featuredSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 4 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  sectionTitle: { fontSize: 18 },
  horizontalList: { paddingBottom: 8 },
  trendingCard: { marginRight: 16, width: 140 },
  trendingImage: { width: 140, height: 90, borderRadius: 20, marginBottom: 8 },
  trendingTitle: { fontSize: 12, fontWeight: '600', textAlign: 'center' },
  subjectScroll: { paddingHorizontal: 4, paddingBottom: 10 },
  subjectBadge: { 
    paddingHorizontal: 16, 
    paddingVertical: 10, 
    borderRadius: 20, 
    marginRight: 10, 
    borderWidth: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  subjectText: { fontSize: 14 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyText: { marginTop: 16, fontSize: 16, textAlign: 'center' },
  clearSearchBtn: { marginTop: 24, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  clearSearchText: { fontWeight: '600' }
});
