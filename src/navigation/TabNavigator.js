import React from 'react';
import { CommonActions } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/auth';
import { useTheme } from '../contexts/theme';
import HomeStackNavigator from './HomeStackNavigator';
import AuthStackNavigator from './AuthStackNavigator';
import ProfileStackNavigator from './ProfileStackNavigator';
import AboutScreen from '../screens/AboutScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'HomeTab') {
            iconName = 'home-outline';
          } else if (route.name === 'AboutTab') {
            iconName = 'information-circle-outline';
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
        name="AboutTab" 
        options={{ title: 'За нас' }}
        component={AboutScreen}
      />
      <Tab.Screen 
        name="ProfileTab" 
        options={{ title: 'Профил' }}
      >
        {() => <ProfileStackNavigator />}
      </Tab.Screen>
      <Tab.Screen 
        name="AuthTab" 
        options={{ title: isAuthenticated ? 'LogOut' : 'Login' }}
      >
        {() => <AuthStackNavigator />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

