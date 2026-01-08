import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector, useDispatch } from 'react-redux'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

import AuthStack from './AuthStack';
import MainTabs from './MainTabs';
import CourseDetailsScreen from '../screens/home/CourseDetailsScreen';
import InstructorDetailsScreen from '../screens/instructor/InstructorDetailsScreen';
import OnboardingScreen from '../screens/auth/OnboardingScreen';
import { loadUser } from '../store/slices/authSlice';
import { loadLearning } from '../store/slices/learningSlice';
import { loadHistory } from '../store/slices/historySlice';
import { loadReviews } from '../store/slices/reviewsSlice';
import { useTheme } from '../theme/ThemeContext';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.auth);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(null);
  
  // Get Theme Data
  const { theme, isDark } = useTheme();

  useEffect(() => {
    const initApp = async () => {
      // Load user session
      await dispatch(loadUser());
      
      // Load other data
      dispatch(loadLearning());
      dispatch(loadHistory());
      dispatch(loadReviews());
      
      // Check onboarding status
      try {
        const value = await AsyncStorage.getItem('@has_seen_onboarding');
        // Uncomment the line below if you want to FORCE onboarding to show again for testing
        // await AsyncStorage.removeItem('@has_seen_onboarding'); 
        setHasSeenOnboarding(value !== null);
      } catch (e) {
        setHasSeenOnboarding(true);
      }
    };

    initApp();
  }, [dispatch]);

  if (isLoading || hasSeenOnboarding === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  // Define Navigation Theme for React Navigation internals
  const navigationTheme = isDark ? DarkTheme : DefaultTheme;

  // Determine the initial route
  const getInitialRoute = () => {
    if (user) return "MainTabs";
    if (hasSeenOnboarding === false) return "Onboarding";
    return "Auth";
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator 
        screenOptions={{ headerShown: false }}
        initialRouteName={getInitialRoute()}
      >
        {user ? (
          // Authenticated Stack
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen 
              name="CourseDetails" 
              component={CourseDetailsScreen} 
              options={{ 
                headerShown: true, 
                title: '', 
                headerTransparent: true, 
                headerTintColor: '#FFF', 
                headerShadowVisible: false,
                headerBackTitleVisible: false,
              }} 
            />
            <Stack.Screen 
              name="InstructorDetails" 
              component={InstructorDetailsScreen} 
              options={{ 
                headerShown: false,
              }} 
            />
          </>
        ) : (
          // Unauthenticated Stack
          <>
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Auth" component={AuthStack} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
