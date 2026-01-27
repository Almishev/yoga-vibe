import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
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

function AuthStackNavigator({ loggedIn, setLoggedIn }) {
  const insets = useSafeAreaInsets();

  if (loggedIn) {
    // Прост екран за LogOut, когато потребителят е "логнат"
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
      >
        {(props) => <LoginScreen {...props} setLoggedIn={setLoggedIn} />}
      </AuthStack.Screen>
      <AuthStack.Screen 
        name="Register" 
        options={{ title: 'Регистрация' }}
      >
        {(props) => <RegisterScreen {...props} setLoggedIn={setLoggedIn} />}
      </AuthStack.Screen>
    </AuthStack.Navigator>
  );
}

function MainTabs() {
  const [loggedIn, setLoggedIn] = useState(false);

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
            iconName = loggedIn ? 'log-out-outline' : 'log-in-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="HomeTab" 
        options={{ title: 'Home' }}
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
        options={{ title: loggedIn ? 'LogOut' : 'Login' }}
      >
        {() => (
          <AuthStackNavigator 
            loggedIn={loggedIn} 
            setLoggedIn={setLoggedIn} 
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <MainTabs />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
