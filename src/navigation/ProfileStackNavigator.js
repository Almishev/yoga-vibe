import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/theme';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';

const ProfileStack = createNativeStackNavigator();

export default function ProfileStackNavigator() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  return (
    <ProfileStack.Navigator
      screenOptions={{
        gestureEnabled: true,
        fullScreenGestureEnabled: true,
        headerShadowVisible: false,
        headerBackVisible: true,
        headerBackTitleVisible: false,
        headerStyle: {
          backgroundColor: theme.colors.surface,
          height: 44 + insets.top,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: { color: theme.colors.text },
        contentStyle: { backgroundColor: theme.colors.background },
        headerStatusBarHeight: insets.top,
      }}
    >
      <ProfileStack.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ 
          title: 'Профил',
          headerShown: false,
        }}
      />
      <ProfileStack.Screen 
        name="EditProfile" 
        component={EditProfileScreen}
        options={{ 
          title: 'Редактирай профил',
        }}
      />
    </ProfileStack.Navigator>
  );
}

