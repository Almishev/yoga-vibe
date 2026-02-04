import { initializeApp, getApps } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBts_ZuMMY0vXxsRdIi2Wbs6YTGs1SqiHc",
  authDomain: "yoga-vibe-4bdc3.firebaseapp.com",
  projectId: "yoga-vibe-4bdc3",
  storageBucket: "yoga-vibe-4bdc3.firebasestorage.app",
  messagingSenderId: "988839844294",
  appId: "1:988839844294:web:b23d7323760f2f6c31bac7"
};

let app;
if (getApps().length === 0) {
  try {
    app = initializeApp(firebaseConfig);
  } catch (error) {
    throw error;
  }
} else {
  app = getApps()[0];
}

let auth;

const isReactNative = typeof navigator !== 'undefined' && navigator.product === 'ReactNative';

try {
  if (isReactNative) {
    try {
      auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage)
      });
    } catch (initError) {
      if (initError.code === 'auth/already-initialized' || initError.message?.includes('already initialized')) {
        auth = getAuth(app);
      } else {
        auth = getAuth(app);
      }
    }
  } else {
    auth = getAuth(app);
  }
  
  if (!auth) {
    throw new Error('Firebase Auth object is null');
  }
} catch (error) {
  try {
    auth = getAuth(app);
  } catch (fallbackError) {
    throw fallbackError;
  }
}

export { auth };

export const db = getFirestore(app);

export const storage = getStorage(app);

export default app;

