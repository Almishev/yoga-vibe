import React, { useEffect } from 'react';
import { StatusBar as RNStatusBar, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './src/contexts/theme';
import { AuthProvider } from './src/contexts/auth';
import RootNavigator from './src/navigation/RootNavigator';
import { initializeNotifications } from './src/services/notificationService';

function AppContent() {
  const { isDark, theme } = useTheme();

  useEffect(() => {
    initializeNotifications();
  }, []);

  return (
    <NavigationContainer>
      <RNStatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.surface}
        translucent={false}
      />
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={styles.flex}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
