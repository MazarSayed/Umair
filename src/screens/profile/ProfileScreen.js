import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Modal, FlatList, Dimensions, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme/ThemeContext';
import { logoutUser, updateUserAvatar } from '../../store/slices/authSlice';

const { width } = Dimensions.get('window');

const AVATARS = ['🎓', '📚', '💡', '🧪', '🧬', '🎨', '🎹', '💻', '🧘', '🌍', '🚀', '🏆'];

export default function ProfileScreen({ navigation }) {
  const user = useSelector(state => state.auth.user);
  const learningList = useSelector(state => state.learning?.items || []);
  const dispatch = useDispatch();
  const { theme, isDark, toggleTheme } = useTheme();
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);

  // Derived stats for educational theme
  const coursesCount = learningList.length;
  const completedCount = learningList.filter(item => item.status === 'Completed').length;
  const inProgressCount = learningList.filter(item => item.status === 'In Progress').length;

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive', 
          onPress: () => dispatch(logoutUser()) 
        },
      ]
    );
  };

  const handleSelectAvatar = (avatar) => {
    dispatch(updateUserAvatar(avatar));
    setAvatarModalVisible(false);
  };

  const ProfileItem = ({ icon, label, value, onPress, showArrow = false, danger = false }) => (
    <TouchableOpacity
      style={[styles.profileItem, { backgroundColor: theme.surface, borderColor: theme.border }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.profileItemLeft}>
        <View style={[styles.iconContainer, { backgroundColor: danger ? theme.error + '15' : theme.primary + '15' }]}>
          <Feather 
            name={icon} 
            size={18} 
            color={danger ? theme.error : theme.primary} 
          />
        </View>
        <View style={styles.profileItemText}>
          <Text style={[styles.profileLabel, { color: theme.text, fontFamily: theme.fontBold }]}>{label}</Text>
          {value && <Text style={[styles.profileValue, { color: theme.textSub, fontFamily: theme.fontRegular }]}>{value}</Text>}
        </View>
      </View>
      {showArrow && (
        <Feather name="chevron-right" size={18} color={theme.textSub} />
      )}
    </TouchableOpacity>
  );

  const StatItem = ({ label, value, icon, color }) => (
    <View style={[styles.statItem, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <Feather name={icon} size={16} color={color} />
      <Text style={[styles.statValue, { color: theme.text, fontFamily: theme.fontBold }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: theme.textSub, fontFamily: theme.fontRegular }]}>{label}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={true}
        alwaysBounceVertical={true}
      >
        {/* Modern Header Section */}
        <LinearGradient
          colors={[theme.primary, theme.secondary || theme.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity 
              style={styles.avatarWrapper}
              onPress={() => setAvatarModalVisible(true)}
            >
              <View style={[styles.avatarCircle, { backgroundColor: '#FFF' }]}>
                <Text style={styles.avatarEmoji}>
                  {user?.avatar || user?.name?.charAt(0).toUpperCase() || 'L'}
                </Text>
              </View>
              <View style={[styles.editIconBadge, { backgroundColor: '#FFF' }]}>
                <Feather name="camera" size={12} color={theme.primary} />
              </View>
            </TouchableOpacity>
            
            <View style={styles.userInfoText}>
              <Text style={[styles.userName, { color: '#FFF', fontFamily: theme.fontBold }]}>
                {user?.name || 'Learner'}
              </Text>
              <View style={styles.tierBadge}>
                <Feather name="award" size={12} color="#FFF" />
                <Text style={styles.tierText}>EduPulse Scholar</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Stats Section */}
        <View style={styles.statsRow}>
          <StatItem label="Courses" value={coursesCount} icon="book-open" color={theme.primary} />
          <StatItem label="Completed" value={completedCount} icon="check-circle" color="#10B981" />
          <StatItem label="In Progress" value={inProgressCount} icon="trending-up" color="#F59E0B" />
        </View>

        {/* Profile Navigation Sections */}
        <View style={styles.menuContainer}>
          <Text style={[styles.menuTitle, { color: theme.text, fontFamily: theme.fontBold }]}>Account Settings</Text>
          <ProfileItem
            icon="user"
            label="Personal Information"
            value={user?.email || 'learner@edupulse.com'}
            showArrow={true}
          />
          <ProfileItem
            icon="smile"
            label="Change Avatar"
            value="Customize your profile emoji"
            onPress={() => setAvatarModalVisible(true)}
            showArrow={true}
          />
          
          <Text style={[styles.menuTitle, { color: theme.text, fontFamily: theme.fontBold, marginTop: 24 }]}>Preferences</Text>
          <ProfileItem
            icon={isDark ? "sun" : "moon"}
            label="Appearance"
            value={isDark ? "Dark Theme Enabled" : "Light Theme Enabled"}
            onPress={toggleTheme}
            showArrow={true}
          />
          <ProfileItem
            icon="bell"
            label="Notifications"
            value="Manage learning reminders"
            showArrow={true}
          />

          <Text style={[styles.menuTitle, { color: theme.text, fontFamily: theme.fontBold, marginTop: 24 }]}>Support</Text>
          <ProfileItem
            icon="help-circle"
            label="Help Center"
            showArrow={true}
          />
          <ProfileItem
            icon="info"
            label="About EduPulse"
            value="Version 2.1.0"
            showArrow={true}
          />

          <TouchableOpacity
            style={[styles.logoutBtn, { backgroundColor: theme.error + '10', borderColor: theme.error + '30' }]}
            onPress={handleLogout}
          >
            <Feather name="log-out" size={18} color={theme.error} style={{ marginRight: 10 }} />
            <Text style={[styles.logoutBtnText, { color: theme.error, fontFamily: theme.fontBold }]}>Logout Session</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Avatar Selection Modal */}
      <Modal
        visible={avatarModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setAvatarModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalBox, { backgroundColor: theme.background }]}>
            <View style={styles.modalTop}>
              <Text style={[styles.modalTitleText, { color: theme.text, fontFamily: theme.fontBold }]}>Select Avatar</Text>
              <TouchableOpacity onPress={() => setAvatarModalVisible(false)}>
                <Feather name="x" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={AVATARS}
              numColumns={4}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[
                    styles.avatarGridItem, 
                    { backgroundColor: theme.surface, borderColor: user?.avatar === item ? theme.primary : theme.border }
                  ]}
                  onPress={() => handleSelectAvatar(item)}
                >
                  <Text style={styles.avatarGridEmoji}>{item}</Text>
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.avatarGridList}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  contentContainer: { paddingBottom: 100 },
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 60,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  avatarEmoji: { fontSize: 48 },
  editIconBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  userInfoText: { marginLeft: 20 },
  userName: { fontSize: 24, marginBottom: 6 },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  tierText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: -30,
  },
  statItem: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 15,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statValue: { fontSize: 18, marginTop: 5 },
  statLabel: { fontSize: 11, marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.5 },
  menuContainer: { paddingHorizontal: 20, marginTop: 30 },
  menuTitle: { fontSize: 14, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 15 },
  profileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 12,
  },
  profileItemLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  profileItemText: { flex: 1 },
  profileLabel: { fontSize: 16 },
  profileValue: { fontSize: 12, marginTop: 2 },
  logoutBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 40,
  },
  logoutBtnText: { fontSize: 16 },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBox: {
    width: '100%',
    borderRadius: 30,
    padding: 24,
    maxHeight: '80%',
  },
  modalTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitleText: { fontSize: 20 },
  avatarGridList: { paddingBottom: 20 },
  avatarGridItem: {
    flex: 1,
    aspectRatio: 1,
    margin: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  avatarGridEmoji: { fontSize: 32 },
});
