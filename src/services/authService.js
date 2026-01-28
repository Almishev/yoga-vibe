import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth } from './firebase';

export const registerUser = async (email, password, name) => {
  try {
    if (!auth) {
      throw new Error('Firebase Authentication не е инициализиран');
    }
    
    if (!auth.app) {
      throw new Error('Firebase Auth app не е инициализиран');
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    if (name) {
      await updateProfile(user, {
        displayName: name
      });
    }
    
    return { user, error: null };
  } catch (error) {
    let errorMessage = error.message;
    
    if (error.code) {
      switch (error.code) {
        case 'auth/api-key-not-valid.-undefined':
        case 'auth/invalid-api-key':
          errorMessage = 'Невалиден API ключ. Моля проверете Firebase конфигурацията.';
          break;
        case 'auth/email-already-in-use':
          errorMessage = 'Този email адрес вече се използва.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Невалиден email адрес.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Паролата е твърде слаба. Моля използвайте поне 6 символа.';
          break;
        default:
          errorMessage = error.message || 'Възникна грешка при регистрацията.';
      }
    }
    
    return { user: null, error: errorMessage };
  }
};

export const loginUser = async (email, password) => {
  try {
    if (!auth) {
      throw new Error('Firebase Authentication не е инициализиран');
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error) {
    let errorMessage = error.message;
    
    if (error.code) {
      switch (error.code) {
        case 'auth/api-key-not-valid.-undefined':
        case 'auth/invalid-api-key':
          errorMessage = 'Невалиден API ключ. Моля проверете Firebase конфигурацията.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'Потребител с този email не съществува.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Грешна парола.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Невалиден email адрес.';
          break;
        default:
          errorMessage = error.message || 'Възникна грешка при влизането.';
      }
    }
    
    return { user: null, error: errorMessage };
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export const getCurrentUser = () => {
  return auth.currentUser;
};

