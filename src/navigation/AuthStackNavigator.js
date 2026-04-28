import React from 'react';
import { Platform, Pressable } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/auth';
import { useTheme } from '../contexts/theme';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ProfileStackNavigator from './ProfileStackNavigator';

const AuthStack = createNativeStackNavigator();

export default function AuthStackNavigator() {
  const insets = useSafeAreaInsets();
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();

  if (isAuthenticated) {
    return (
      <ProfileStackNavigator />
    );
  }

  return (
    <AuthStack.Navigator
      screenOptions={({ navigation }) => ({
        gestureEnabled: true,
        fullScreenGestureEnabled: true,
        headerShadowVisible: false,
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
      <AuthStack.Screen 
        name="LoginMain" 
        options={{ title: 'Вход' }}
        component={LoginScreen}
      />
      <AuthStack.Screen 
        name="Register" 
        options={{ title: 'Регистрация' }}
        component={RegisterScreen}
      />
    </AuthStack.Navigator>
  );
}

