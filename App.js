import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/contexts/auth';
import RootNavigator from './src/navigation/RootNavigator';
import { initializeNotifications } from './src/services/notificationService';
import { useCourseNotifications } from './src/hooks/useCourseNotifications';

function AppContent() {
  useEffect(() => {
    initializeNotifications();
  }, []);

  useCourseNotifications();

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
