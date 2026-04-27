import { registerRootComponent } from 'expo';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import App from './App';

if (Platform.OS === 'web') {
  Ionicons.loadFont().catch(() => {});
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
