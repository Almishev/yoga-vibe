import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/auth';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ProfileStackNavigator from './ProfileStackNavigator';

const AuthStack = createNativeStackNavigator();

export default function AuthStackNavigator() {
  const insets = useSafeAreaInsets();
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return (
      <ProfileStackNavigator />
    );
  }

  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: {
          height: 44 + insets.top,
        },
        headerStatusBarHeight: insets.top,
      }}
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

