import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import HomeScreen from '../screens/home/HomeScreen';
import MyLearningScreen from '../screens/profile/MyLearningScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import RecommendationsScreen from '../screens/recommendations/RecommendationsScreen';
import { useTheme } from '../theme/ThemeContext';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  const { theme, isDark } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerStyle: { 
          backgroundColor: theme.primary,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: {
          fontFamily: theme.fontBold,
          fontSize: 20,
        },
        headerTintColor: '#FFF',
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSub,
        tabBarLabelStyle: {
          fontFamily: theme.fontBold,
          fontSize: 11,
          marginBottom: 4,
        },
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopWidth: 0,
          elevation: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -10 },
          shadowOpacity: 0.1,
          shadowRadius: 15,
          height: 70,
          paddingBottom: 12,
          paddingTop: 8,
          position: 'absolute',
          bottom: 25,
          left: 20,
          right: 20,
          borderRadius: 35,
          borderWidth: 1,
          borderColor: theme.border,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Discover') {
            iconName = 'home';
          } else if (route.name === 'My Learning') {
            iconName = 'book';
          } else if (route.name === 'For You') {
            iconName = 'award';
          } else if (route.name === 'Profile') {
            iconName = 'user';
          }

          return <Feather name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Discover" component={HomeScreen} options={{ title: 'EduPulse' }} />
      <Tab.Screen name="My Learning" component={MyLearningScreen} options={{ title: 'My Learning' }} />
      <Tab.Screen name="For You" component={RecommendationsScreen} options={{ title: 'Recommended' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'My Profile' }} />
    </Tab.Navigator>
  );
}
