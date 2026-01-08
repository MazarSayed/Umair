import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Share, Alert, Platform, TextInput, Modal, Dimensions, LayoutAnimation, UIManager, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useSelector, useDispatch } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import YoutubePlayer from 'react-native-youtube-iframe';
import { getPosterUrl, PLACEHOLDER_POSTER, getCoursePreview, getCourseInstructors, getCourseReviews } from '../../services/api';
import { toggleLearning, updateLearningStatus, LEARNING_STATUS } from '../../store/slices/learningSlice';
import { addToRecentlyViewed } from '../../store/slices/historySlice';
import { addOrUpdateReview, deleteReview } from '../../store/slices/reviewsSlice';
import { useTheme } from '../../theme/ThemeContext';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width } = Dimensions.get('window');
const HEADER_HEIGHT = 400;

const hapticFeedback = () => {
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
};

const StarRating = ({ rating, onRatingChange, size = 24, interactive = false, theme }) => {
  return (
    <View style={styles.starContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          disabled={!interactive}
          onPress={() => onRatingChange(star)}
          style={interactive ? styles.interactiveStar : styles.staticStar}
        >
          <Feather
            name="star"
            size={size}
            color={star <= rating ? '#FFD700' : theme.textSub}
            fill={star <= rating ? '#FFD700' : 'none'}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const CommunityReviewCard = ({ review, theme }) => (
  <View style={[styles.communityReviewCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
    <View style={styles.communityReviewHeader}>
      <Image 
        source={{ uri: review.avatar }} 
        style={styles.communityReviewAvatar}
        contentFit="cover"
      />
      <View style={styles.communityReviewInfo}>
        <Text style={[styles.communityReviewName, { color: theme.text, fontFamily: theme.fontBold }]}>{review.userName}</Text>
        <StarRating rating={review.rating} size={12} theme={theme} />
      </View>
      <Text style={[styles.communityReviewDate, { color: theme.textSub }]}>{review.date}</Text>
    </View>
    <Text style={[styles.communityReviewComment, { color: theme.textSub, fontFamily: theme.fontRegular }]}>
      {review.comment}
    </Text>
  </View>
);

export default function CourseDetailsScreen({ route, navigation }) {
  const { course } = route.params;
  const dispatch = useDispatch();
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [imageError, setImageError] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [userRating, setUserRating] = useState(0);
  
  const [previewId, setPreviewId] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [instructors, setInstructors] = useState([]);
  const [communityReviews, setCommunityReviews] = useState([]);
  const [loadingMedia, setLoadingMedia] = useState(true);
  const [videoError, setVideoError] = useState(false);

  const learningItems = useSelector(state => state.learning?.items || []);
  const reviews = useSelector(state => state.reviews?.items || {});
  const learningItem = learningItems.find(item => item.key === course.key);
  const isEnrolled = !!learningItem;
  const courseReview = reviews[course.key];
  
  const thumbnailUri = getPosterUrl(course.thumbnail);
  const imageSource = imageError || !thumbnailUri 
    ? { uri: PLACEHOLDER_POSTER } 
    : { uri: thumbnailUri };

  useEffect(() => {
    const loadMediaData = async () => {
      setLoadingMedia(true);
      setVideoError(false);
      const [id, credits, commReviews] = await Promise.all([
        getCoursePreview(course.key),
        getCourseInstructors(course.key),
        getCourseReviews(course.key)
      ]);
      setPreviewId(id);
      setInstructors(credits);
      setCommunityReviews(commReviews);
      setLoadingMedia(false);
    };
    loadMediaData();
  }, [course.key]);

  useEffect(() => {
    if (reviewModalVisible && courseReview) {
      setReviewText(courseReview.text);
      setUserRating(courseReview.rating || 0);
    } else if (reviewModalVisible) {
      setReviewText('');
      setUserRating(0);
    }
  }, [reviewModalVisible, courseReview]);

  useEffect(() => {
    if (course) {
      dispatch(addToRecentlyViewed(course));
    }
  }, [course, dispatch]);

  const onStateChange = useCallback((state) => {
    if (state === "ended") {
      setPlaying(false);
    }
  }, []);

  const onVideoError = useCallback((error) => {
    console.warn("YouTube Video Error:", error);
    setVideoError(true);
  }, []);

  const handleToggleLearning = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    hapticFeedback();
    dispatch(toggleLearning(course));
  };

  const handleStatusToggle = () => {
    if (!isEnrolled) return;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    const statuses = Object.values(LEARNING_STATUS);
    const currentIndex = statuses.indexOf(learningItem.status);
    const nextIndex = (currentIndex + 1) % statuses.length;
    dispatch(updateLearningStatus({ courseKey: course.key, status: statuses[nextIndex] }));
    hapticFeedback();
  };

  const handleShare = async () => {
    try {
      const courseInfo = `🎓 Course: ${course.title}\n\n` +
        `Instructor: ${course.instructor}\n` +
        `Subject: ${course.subject}\n\n` +
        `Start learning on EduPulse!`;
      
      await Share.share({
        message: courseInfo,
        title: course.title,
      });
      hapticFeedback();
    } catch (error) {
      Alert.alert('Error', 'Failed to share course.');
    }
  };

  const handleSaveReview = () => {
    if (reviewText.trim() || userRating > 0) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      dispatch(addOrUpdateReview({ 
        courseKey: course.key, 
        text: reviewText.trim(),
        rating: userRating
      }));
      hapticFeedback();
      setReviewModalVisible(false);
    }
  };

  const handleDeleteReview = () => {
    Alert.alert('Delete Review', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        dispatch(deleteReview(course.key));
        setReviewModalVisible(false);
        hapticFeedback();
      }},
    ]);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Hero Header - Always Visible */}
      <View style={styles.headerImageContainer}>
        <Image 
          source={imageSource}
          placeholder={PLACEHOLDER_POSTER}
          style={styles.headerPoster}
          contentFit="cover"
          transition={300}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.4)', theme.background]}
          style={styles.headerGradient}
        />
      </View>

      <View style={[styles.detailsContainer, { backgroundColor: theme.background, marginTop: -60 }]}>
        <View style={styles.titleRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.subject, { color: theme.primary, fontFamily: theme.fontBold }]}>{course.subject}</Text>
            <Text style={[styles.title, { color: theme.text, fontFamily: theme.fontBold }]}>{course.title}</Text>
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
              <Feather name="share-2" size={24} color={theme.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleToggleLearning} style={styles.actionButton}>
              <Feather 
                name="bookmark" 
                size={28} 
                fill={isEnrolled ? theme.primary : 'none'}
                color={isEnrolled ? theme.primary : theme.textSub} 
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.badgeRow}>
          <View style={[styles.badge, { backgroundColor: theme.primary + '20' }]}>
            <Feather name="user" size={12} color={theme.primary} />
            <Text style={[styles.badgeText, { color: theme.primary, fontFamily: theme.fontBold, marginLeft: 4 }]}>
              {course.instructor}
            </Text>
          </View>
          <View style={[styles.badge, { backgroundColor: theme.secondary + '20' }]}>
            <Feather name="clock" size={12} color={theme.secondary} />
            <Text style={[styles.badgeText, { color: theme.secondary, fontFamily: theme.fontBold, marginLeft: 4 }]}>
              {course.duration}
            </Text>
          </View>
          <View style={[styles.badge, { backgroundColor: theme.success + '20' }]}>
            <Feather name="book-open" size={12} color={theme.success} />
            <Text style={[styles.badgeText, { color: theme.success, fontFamily: theme.fontBold, marginLeft: 4 }]}>
              {course.lessons_count} lessons
            </Text>
          </View>
        </View>

        {isEnrolled && (
          <TouchableOpacity 
            onPress={handleStatusToggle}
            style={[styles.statusToggle, { backgroundColor: theme.surface, borderColor: theme.border }]}
          >
            <Text style={[styles.statusLabel, { color: theme.textSub }]}>Course Status:</Text>
            <View style={[styles.statusValue, { backgroundColor: theme.primary + '15' }]}>
              <Text style={[styles.statusValueText, { color: theme.primary, fontFamily: theme.fontBold }]}>
                {learningItem.status}
              </Text>
              <Feather name="refresh-cw" size={12} color={theme.primary} style={{ marginLeft: 8 }} />
            </View>
          </TouchableOpacity>
        )}

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        {/* Video Preview Section */}
        {previewId && !videoError && (
          <View style={styles.videoSection}>
            <Text style={[styles.sectionTitle, { color: theme.text, fontFamily: theme.fontBold }]}>Course Preview</Text>
            <View style={[styles.videoWrapper, { borderColor: theme.border }]}>
              <YoutubePlayer
                height={200}
                play={playing}
                videoId={previewId}
                onChangeState={onStateChange}
                onError={onVideoError}
                initialPlayerParams={{
                  preventFullScreen: false,
                  cc_load_policy: 0,
                  rel: 0,
                }}
                webViewProps={{
                  allowsFullscreenVideo: true,
                  androidLayerType: Platform.OS === 'android' ? 'hardware' : 'none',
                  origin: 'http://localhost:3000',
                }}
              />
            </View>
            <View style={[styles.divider, { backgroundColor: theme.border, marginTop: 24 }]} />
          </View>
        )}

        <Text style={[styles.sectionTitle, { color: theme.text, fontFamily: theme.fontBold }]}>Course Overview</Text>
        <Text style={[styles.description, { color: theme.textSub, fontFamily: theme.fontRegular }]}>
          {course.overview || 'No overview available for this course.'}
        </Text>

        {course.what_you_will_learn && (
          <>
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <Text style={[styles.sectionTitle, { color: theme.text, fontFamily: theme.fontBold }]}>What You Will Learn</Text>
            {course.what_you_will_learn.map((item, index) => (
              <View key={index} style={styles.learnItem}>
                <Feather name="check-circle" size={16} color={theme.success} style={{ marginTop: 2 }} />
                <Text style={[styles.learnText, { color: theme.textSub, fontFamily: theme.fontRegular }]}>{item}</Text>
              </View>
            ))}
          </>
        )}

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        {/* Instructors Section */}
        <Text style={[styles.sectionTitle, { color: theme.text, fontFamily: theme.fontBold, marginBottom: 16 }]}>Expert Instructors</Text>
        {loadingMedia ? (
          <ActivityIndicator color={theme.primary} style={{ alignSelf: 'flex-start' }} />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.instructorScroll}>
            {instructors.map((instructor) => (
              <TouchableOpacity 
                key={instructor.id} 
                style={styles.instructorCard}
                onPress={() => navigation.navigate('InstructorDetails', { instructor })}
              >
                <Image 
                  source={instructor.profile_path || 'https://via.placeholder.com/100x100?text=No+Photo'} 
                  placeholder="https://via.placeholder.com/100x100?text=..."
                  style={[styles.instructorImage, { backgroundColor: theme.surface }]} 
                  contentFit="cover"
                  transition={200}
                />
                <Text style={[styles.instructorName, { color: theme.text }]} numberOfLines={1}>{instructor.name}</Text>
                <Text style={[styles.instructorCredentials, { color: theme.textSub }]} numberOfLines={1}>{instructor.credentials}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <View style={styles.reviewsSection}>
          <View style={styles.reviewsHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text, fontFamily: theme.fontBold }]}>Your Review</Text>
            <TouchableOpacity
              onPress={() => setReviewModalVisible(true)}
              style={[styles.reviewButton, { backgroundColor: theme.primary }]}
            >
              <Text style={[styles.reviewButtonText, { color: '#FFF', fontFamily: theme.fontBold }]}>
                {courseReview ? 'Edit' : 'Add'} Review
              </Text>
            </TouchableOpacity>
          </View>
          
          {courseReview ? (
            <TouchableOpacity
              onPress={() => setReviewModalVisible(true)}
              style={[styles.reviewPreview, { backgroundColor: theme.surface, borderColor: theme.border, marginBottom: 24 }]}
            >
              {courseReview.rating > 0 && (
                <View style={styles.ratingPreviewContainer}>
                  <Text style={[styles.ratingLabel, { color: theme.textSub }]}>My Rating:</Text>
                  <StarRating rating={courseReview.rating} size={14} theme={theme} />
                </View>
              )}
              {courseReview.text ? (
                <Text style={[styles.reviewPreviewText, { color: theme.text, fontFamily: theme.fontRegular }]} numberOfLines={5}>
                  {courseReview.text}
                </Text>
              ) : null}
              <Text style={[styles.reviewDate, { color: theme.textSub, fontFamily: theme.fontRegular }]}>
                Last edited {new Date(courseReview.updatedAt).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          ) : (
            <Text style={[styles.noReviewText, { color: theme.textSub, fontFamily: theme.fontRegular, marginBottom: 24 }]}>
              You haven't reviewed this course yet.
            </Text>
          )}

          <Text style={[styles.sectionTitle, { color: theme.text, fontFamily: theme.fontBold, marginBottom: 16 }]}>Community Reviews</Text>
          {loadingMedia ? (
            <ActivityIndicator color={theme.primary} />
          ) : (
            communityReviews.map((review) => (
              <CommunityReviewCard key={review.id} review={review} theme={theme} />
            ))
          )}
        </View>
      </View>

      <Modal visible={reviewModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text, fontFamily: theme.fontBold }]}>Course Review</Text>
              <TouchableOpacity onPress={() => setReviewModalVisible(false)}>
                <Feather name="x" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.ratingPickerContainer}>
              <Text style={[styles.ratingPickerLabel, { color: theme.text, fontFamily: theme.fontRegular }]}>Course Rating</Text>
              <StarRating rating={userRating} onRatingChange={setUserRating} size={36} interactive={true} theme={theme} />
            </View>

            <TextInput
              style={[styles.reviewInput, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text, fontFamily: theme.fontRegular }]}
              placeholder="Share your experience with this course..."
              placeholderTextColor={theme.textSub}
              multiline
              value={reviewText}
              onChangeText={setReviewText}
            />
            <View style={styles.modalActions}>
              {courseReview && (
                <TouchableOpacity onPress={handleDeleteReview} style={[styles.modalButton, { borderColor: theme.error }]}>
                  <Text style={[styles.modalButtonText, { color: theme.error, fontFamily: theme.fontBold }]}>Delete</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity 
                onPress={handleSaveReview} 
                style={[styles.modalButton, { backgroundColor: theme.primary, borderWidth: 0, opacity: (reviewText.trim() || userRating > 0) ? 1 : 0.5 }]}
                disabled={!(reviewText.trim() || userRating > 0)}
              >
                <Text style={[styles.modalButtonText, { color: '#FFF', fontFamily: theme.fontBold }]}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerImageContainer: { height: HEADER_HEIGHT, width: width, position: 'relative' },
  headerPoster: { width: '100%', height: '100%' },
  headerGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 200 },
  trailerContainer: { width: width, backgroundColor: '#000' },
  detailsContainer: { padding: 24, borderTopLeftRadius: 30, borderTopRightRadius: 30 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  subject: { fontSize: 12, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4 },
  title: { fontSize: 24, flex: 1, marginRight: 10, lineHeight: 32 },
  actionButtons: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  actionButton: { padding: 4 },
  badgeRow: { flexDirection: 'row', marginTop: 16, gap: 8, flexWrap: 'wrap' },
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  badgeText: { fontSize: 13 },
  statusToggle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20, padding: 12, borderRadius: 20, borderWidth: 1 },
  statusLabel: { fontSize: 14 },
  statusValue: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  statusValueText: { fontSize: 13 },
  divider: { height: 1, marginVertical: 24, opacity: 0.3 },
  sectionTitle: { fontSize: 18, marginBottom: 12 },
  description: { fontSize: 15, lineHeight: 24 },
  learnItem: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  learnText: { fontSize: 14, flex: 1 },
  instructorScroll: { paddingRight: 24 },
  instructorCard: { width: 110, marginRight: 16 },
  instructorImage: { width: 80, height: 80, borderRadius: 40, marginBottom: 8, alignSelf: 'center' },
  instructorName: { fontSize: 13, fontWeight: 'bold', textAlign: 'center' },
  instructorCredentials: { fontSize: 11, textAlign: 'center', opacity: 0.7, marginTop: 2 },
  reviewsSection: { marginTop: 8 },
  reviewsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  reviewButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  reviewButtonText: { fontSize: 13 },
  reviewPreview: { padding: 20, borderRadius: 24, borderWidth: 1 },
  reviewPreviewText: { fontSize: 14, lineHeight: 22, marginBottom: 12 },
  reviewDate: { fontSize: 11, opacity: 0.6 },
  noReviewText: { fontSize: 14, fontStyle: 'italic', opacity: 0.7 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 24, minHeight: '60%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 22 },
  reviewInput: { borderRadius: 20, padding: 20, minHeight: 200, fontSize: 15, marginBottom: 20, borderWidth: 1, textAlignVertical: 'top' },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
  modalButton: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24, borderWidth: 1 },
  modalButtonText: { fontSize: 15 },
  starContainer: { flexDirection: 'row', alignItems: 'center' },
  interactiveStar: { paddingHorizontal: 4 },
  staticStar: { marginRight: 2 },
  ratingPreviewContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  ratingLabel: { fontSize: 12, marginRight: 8 },
  ratingPickerContainer: { alignItems: 'center', marginBottom: 24 },
  ratingPickerLabel: { fontSize: 15, marginBottom: 12 },
  videoSection: {
    marginBottom: 8,
  },
  videoWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    backgroundColor: '#000',
  },
  videoErrorOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoErrorText: {
    color: '#FFF',
    marginTop: 10,
    fontSize: 14,
    fontWeight: 'bold',
  },
  communityReviewCard: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 16,
  },
  communityReviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  communityReviewAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  communityReviewInfo: {
    flex: 1,
  },
  communityReviewName: {
    fontSize: 14,
    marginBottom: 2,
  },
  communityReviewDate: {
    fontSize: 11,
  },
  communityReviewComment: {
    fontSize: 13,
    lineHeight: 20,
  },
});
