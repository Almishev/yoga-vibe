import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/index';
import CoursesScreen from './src/screens/CoursesScreen';
import CourseDetailsScreen from './src/screens/CourseDetailsScreen';
import AsanaDetailsScreen from './src/screens/AsanaDetailsScreen';

const Stack = createNativeStackNavigator();

function NavigationStack() {
  const insets = useSafeAreaInsets();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          height: 44 + insets.top,
        },
        headerStatusBarHeight: insets.top,
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ 
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="Courses" 
        component={CoursesScreen}
        options={{ 
          title: 'Курсове',
        }}
      />
      <Stack.Screen 
        name="CourseDetails" 
        component={CourseDetailsScreen}
        options={({ route }) => ({ 
          title: route.params?.course?.title || 'Курс',
        })}
      />
      <Stack.Screen 
        name="AsanaDetails" 
        component={AsanaDetailsScreen}
        options={({ route }) => ({ 
          title: route.params?.asana?.name || 'Асана',
        })}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <NavigationStack />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
