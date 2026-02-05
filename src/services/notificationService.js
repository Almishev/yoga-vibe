import * as Notifications from 'expo-notifications';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from './firebase';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const initializeNotifications = async () => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.warn('Notification permissions not granted');
      return false;
    }

    await registerPushToken();
    
    return true;
  } catch (error) {
    console.error('Error initializing notifications:', error);
    return false;
  }
};

export const registerPushToken = async () => {
  try {
    if (!auth.currentUser) {
      console.log('No user logged in, skipping push token registration');
      return;
    }

    const token = await Notifications.getExpoPushTokenAsync({
      projectId: 'yoga-vibe-4bdc3',
    });

    if (token?.data) {
      const userId = auth.currentUser.uid;
      const tokenRef = doc(db, 'pushTokens', userId);
      
      await setDoc(tokenRef, {
        expoPushToken: token.data,
        userId: userId,
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      console.log('Push token registered:', token.data);
    }
  } catch (error) {
    console.error('Error registering push token:', error);
  }
};

