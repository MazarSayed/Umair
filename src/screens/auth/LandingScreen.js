import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { useTheme } from '../../theme/ThemeContext';

const { width, height } = Dimensions.get('window');

// Educational background grid for Hero
const POSTER_GRID = [
  'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=200&q=40', // Learning
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&q=40', // Digital
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=200&q=40', // Collaboration
  'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&q=40', // Studying
  'https://images.unsplash.com/photo-1523240715630-991cd2f70ac2?w=200&q=40', // Success
  'https://images.unsplash.com/photo-1513258496099-48168024aec0?w=200&q=40', // Online
  'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=200&q=40', // Classroom
  'https://images.unsplash.com/photo-1454165833767-027ffea7028c?w=200&q=40', // Skill
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=200&q=40', // Development
];

const FeatureCard = ({ icon, title, description, theme }) => (
  <View style={[styles.featureCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
    <View style={[styles.featureIconContainer, { backgroundColor: theme.primary + '15' }]}>
      <Text style={styles.featureEmoji}>{icon}</Text>
    </View>
    <Text style={[styles.featureTitle, { color: theme.text, fontFamily: theme.fontBold }]}>{title}</Text>
    <Text style={[styles.featureDescription, { color: theme.textSub, fontFamily: theme.fontRegular }]}>{description}</Text>
  </View>
);

const ReviewCard = ({ review, theme }) => (
  <View style={[styles.reviewCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
    <View style={styles.reviewStars}>
      {[1, 2, 3, 4, 5].map(s => (
        <Text key={s} style={styles.starSmall}>{s <= review.rating ? '⭐' : '☆'}</Text>
      ))}
    </View>
    <Text style={[styles.reviewQuote, { color: theme.text, fontFamily: theme.fontRegular }]}>"{review.review}"</Text>
    <View style={styles.reviewerMeta}>
      <View style={[styles.reviewerAvatar, { backgroundColor: theme.primary }]}>
        <Text style={styles.avatarLetter}>{review.name[0]}</Text>
      </View>
      <View>
        <Text style={[styles.reviewerName, { color: theme.text, fontFamily: theme.fontBold }]}>{review.name}</Text>
        <Text style={[styles.reviewerRole, { color: theme.textSub, fontFamily: theme.fontRegular }]}>{review.role}</Text>
      </View>
    </View>
  </View>
);

export default function LandingScreen({ navigation }) {
  const { theme, isDark, toggleTheme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const reviews = [
    {
      name: "Alex Rivera",
      role: "Software Engineer",
      review: "EduPulse helped me pivot my career into Web Development. The structured path and review features are incredible!",
      rating: 5
    },
    {
      name: "Dr. Sarah Chen",
      role: "Lifelong Learner",
      review: "I've tried many platforms, but the clean interface and personalized recommendations here keep me coming back.",
      rating: 5
    },
    {
      name: "James Wilson",
      role: "Business Student",
      review: "The ability to preview lessons and track my progress module by module has made learning so much more efficient.",
      rating: 5
    }
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Academic Hero */}
        <View style={styles.heroContainer}>
          <View style={styles.posterGrid}>
            {POSTER_GRID.map((url, i) => (
              <Image key={i} source={url} style={styles.bgPoster} contentFit="cover" />
            ))}
          </View>
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.5)', theme.background]}
            style={StyleSheet.absoluteFill}
          />
          
          <Animated.View style={[styles.heroContent, { opacity: fadeAnim }]}>
            <Text style={[styles.heroTag, { color: theme.primary, fontFamily: theme.fontBold }]}>WORLD-CLASS LEARNING</Text>
            <Text style={[styles.heroTitle, { color: isDark ? '#FFF' : '#1E293B', fontFamily: theme.fontBold }]}>EduPulse</Text>
            <Text style={[styles.heroSubtitle, { color: isDark ? 'rgba(255,255,255,0.8)' : '#475569', fontFamily: theme.fontRegular }]}>
              Ignite your curiosity and master new skills with expert-led courses designed for your future.
            </Text>
            
            <TouchableOpacity 
              style={[styles.mainCta, { backgroundColor: theme.primary }]}
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={[styles.mainCtaText, { color: '#FFF', fontFamily: theme.fontBold }]}>Start Learning Free</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.secondaryCta}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={[styles.secondaryCtaText, { color: theme.primary, fontFamily: theme.fontBold }]}>Sign In to Your Classroom</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Features Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionHeading, { color: theme.text, fontFamily: theme.fontBold }]}>Elevate Your Skills</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.featureScroll}>
            <FeatureCard 
              icon="🎓" 
              title="Expert Content" 
              description="Learn from industry leaders and academic professors worldwide."
              theme={theme}
            />
            <FeatureCard 
              icon="📚" 
              title="Personal Library" 
              description="Save courses and build your custom curriculum path."
              theme={theme}
            />
            <FeatureCard 
              icon="💡" 
              title="Smart Insights" 
              description="Get AI-powered recommendations based on your learning goals."
              theme={theme}
            />
          </ScrollView>
        </View>

        {/* Stats Row */}
        <View style={[styles.statsRow, { backgroundColor: theme.surface }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statNum, { color: theme.primary }]}>500+</Text>
            <Text style={[styles.statLabel, { color: theme.textSub }]}>Courses</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNum, { color: theme.primary }]}>50K+</Text>
            <Text style={[styles.statLabel, { color: theme.textSub }]}>Learners</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNum, { color: theme.primary }]}>4.9</Text>
            <Text style={[styles.statLabel, { color: theme.textSub }]}>User Rating</Text>
          </View>
        </View>

        {/* Reviews Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionHeading, { color: theme.text, fontFamily: theme.fontBold }]}>Learner Success Stories</Text>
          {reviews.map((r, i) => (
            <ReviewCard key={i} review={r} theme={theme} />
          ))}
        </View>

        <View style={styles.footerSpacer} />
      </ScrollView>
      
      {/* Floating Toggle */}
      <TouchableOpacity 
        style={[styles.themeFab, { backgroundColor: theme.surface, borderColor: theme.border }]}
        onPress={toggleTheme}
      >
        <Text style={{fontSize: 20}}>{isDark ? '☀️' : '🌙'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heroContainer: { height: height * 0.75, width: '100%', justifyContent: 'flex-end', paddingBottom: 40 },
  posterGrid: { 
    ...StyleSheet.absoluteFillObject, 
    flexDirection: 'row', 
    flexWrap: 'wrap',
    opacity: 0.3
  },
  bgPoster: { width: width / 3, height: height / 4 },
  heroContent: { paddingHorizontal: 30, alignItems: 'center' },
  heroTag: { fontSize: 12, letterSpacing: 2, marginBottom: 10 },
  heroTitle: { fontSize: 50, fontWeight: '900', marginBottom: 10, letterSpacing: -1 },
  heroSubtitle: { fontSize: 16, textAlign: 'center', marginBottom: 30, lineHeight: 24 },
  mainCta: { width: '100%', height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 15, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 },
  mainCtaText: { fontSize: 18 },
  secondaryCta: { padding: 10 },
  secondaryCtaText: { fontSize: 16 },
  section: { paddingVertical: 30 },
  sectionHeading: { fontSize: 24, paddingHorizontal: 30, marginBottom: 20 },
  featureScroll: { paddingHorizontal: 20 },
  featureCard: { 
    width: width * 0.7, 
    marginHorizontal: 10, 
    padding: 25, 
    borderRadius: 30, 
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 3
  },
  featureIconContainer: { width: 60, height: 60, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  featureEmoji: { fontSize: 30 },
  featureTitle: { fontSize: 20, marginBottom: 10 },
  featureDescription: { fontSize: 14, lineHeight: 22 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 30, marginHorizontal: 20, borderRadius: 30, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10 },
  statItem: { alignItems: 'center' },
  statNum: { fontSize: 28, fontWeight: 'bold' },
  statLabel: { fontSize: 12, marginTop: 5, letterSpacing: 1 },
  reviewCard: { marginHorizontal: 25, marginBottom: 15, padding: 25, borderRadius: 30, borderWidth: 1 },
  reviewStars: { flexDirection: 'row', marginBottom: 15 },
  starSmall: { fontSize: 14 },
  reviewQuote: { fontSize: 16, lineHeight: 24, fontStyle: 'italic', marginBottom: 20 },
  reviewerMeta: { flexDirection: 'row', alignItems: 'center' },
  reviewerAvatar: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarLetter: { color: '#FFF', fontWeight: 'bold', fontSize: 18 },
  reviewerName: { fontSize: 16 },
  reviewerRole: { fontSize: 12 },
  footerSpacer: { height: 100 },
  themeFab: { position: 'absolute', top: 50, right: 20, width: 50, height: 50, borderRadius: 25, borderWidth: 1, justifyContent: 'center', alignItems: 'center', zIndex: 100 }
});
