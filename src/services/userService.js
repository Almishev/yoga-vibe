import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

export const getUserData = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { data: userSnap.data(), error: null };
    } else {
      return { data: null, error: null };
    }
  } catch (error) {
    return { data: null, error: error.message };
  }
};

export const createUserData = async (userId, userData) => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

export const updateUserData = async (userId, updates) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};


