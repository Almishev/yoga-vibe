import React from 'react';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import HomeScreen from './src/screens/index';
import CoursesScreen from './src/screens/CoursesScreen';
import CourseDetailsScreen from './src/screens/CourseDetailsScreen';
import AsanaDetailsScreen from './src/screens/AsanaDetailsScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const HomeStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStackNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: {
          height: 44 + insets.top,
        },
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
          title: route.params?.asana?.name || 'Асана',
        })}
      />
    </HomeStack.Navigator>
  );
}

function AuthStackNavigator() {
  const insets = useSafeAreaInsets();
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return (
      <ProfileScreen />
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

function MainTabs() {
  const { isAuthenticated } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#000',
          borderTopColor: '#222',
        },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#777',
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'HomeTab') {
            iconName = 'home-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = 'person-outline';
          } else if (route.name === 'AuthTab') {
            iconName = isAuthenticated ? 'log-out-outline' : 'log-in-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="HomeTab" 
        options={{ title: 'Home' }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            const state = navigation.getState();
            const homeTabRoute = state.routes.find(r => r.name === 'HomeTab');
            
            if (homeTabRoute?.state?.index !== 0 || homeTabRoute?.state?.routes[0]?.name !== 'Home') {
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [
                    {
                      name: 'HomeTab',
                      state: {
                        routes: [{ name: 'Home' }],
                        index: 0,
                      },
                    },
                  ],
                })
              );
            }
          },
        })}
      >
        {() => <HomeStackNavigator />}
      </Tab.Screen>
      <Tab.Screen 
        name="ProfileTab" 
        options={{ title: 'Профил' }}
        component={ProfileScreen}
      />
      <Tab.Screen 
        name="AuthTab" 
        options={{ title: isAuthenticated ? 'LogOut' : 'Login' }}
      >
        {() => <AuthStackNavigator />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <MainTabs />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
