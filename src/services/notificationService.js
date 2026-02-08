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
    const token = await Notifications.getExpoPushTokenAsync({
      projectId: 'yoga-vibe-4bdc3',
    });

    if (token?.data) {
      const tokenId = token.data.replace(/[^a-zA-Z0-9]/g, '_');
      const tokenRef = doc(db, 'pushTokens', tokenId);
      
      const tokenData = {
        expoPushToken: token.data,
        updatedAt: new Date().toISOString(),
      };

      if (auth.currentUser) {
        tokenData.userId = auth.currentUser.uid;
        tokenData.userEmail = auth.currentUser.email;
      } else {
        tokenData.userId = null;
        tokenData.isGuest = true;
      }
      
      await setDoc(tokenRef, tokenData, { merge: true });

      console.log('Push token registered:', token.data, auth.currentUser ? `(User: ${auth.currentUser.uid})` : '(Guest)');
    }
  } catch (error) {
    console.error('Error registering push token:', error);
  }
};

