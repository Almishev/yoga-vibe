import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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
      screenOptions={{
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
      }}
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

