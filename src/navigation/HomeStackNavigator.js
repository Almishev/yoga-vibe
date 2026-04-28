import React from 'react';
import { Platform, Pressable } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/theme';
import HomeScreen from '../screens/HomeScreen';
import CoursesScreen from '../screens/CoursesScreen';
import CourseDetailsScreen from '../screens/CourseDetailsScreen';
import AsanaDetailsScreen from '../screens/AsanaDetailsScreen';

const HomeStack = createNativeStackNavigator();

export default function HomeStackNavigator() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  return (
    <HomeStack.Navigator
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
      <HomeStack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ 
          headerShown: false,
        }}
      />
      <HomeStack.Screen 
        name="Courses" 
        component={CoursesScreen}
        options={{ 
          title: 'Курсове',
        }}
      />
      <HomeStack.Screen 
        name="CourseDetails" 
        component={CourseDetailsScreen}
        options={({ route }) => ({ 
          title: route.params?.course?.title || 'Курс',
        })}
      />
      <HomeStack.Screen 
        name="AsanaDetails" 
        component={AsanaDetailsScreen}
        options={({ route }) => ({ 
          title: route.params?.asana?.name || 'Практика',
        })}
      />
    </HomeStack.Navigator>
  );
}

