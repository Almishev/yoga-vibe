import React from 'react';
import { Platform, Pressable } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
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
      screenOptions={({ navigation }) => ({
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
        ...(Platform.OS === 'web'
          ? {
              headerBackVisible: false,
              headerLeft: () =>
                navigation.canGoBack() ? (
                  <Pressable
                    onPress={() => navigation.goBack()}
                    style={{ paddingRight: 8, paddingVertical: 4 }}
                    accessibilityRole="button"
                    accessibilityLabel="Назад"
                  >
                    <Ionicons
                      name="chevron-back"
                      size={24}
                      color={theme.colors.text}
                      allowFontScaling={false}
                    />
                  </Pressable>
                ) : null,
            }
          : {}),
      })}
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

