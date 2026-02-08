import React, { useState, useEffect, useContext } from 'react';
import { onAuthStateChange } from '../../services/authService';
import { getUserData, createUserData } from '../../services/userService';
import { registerPushToken } from '../../services/notificationService';
import { auth } from '../../services/firebase';
import AuthContext from './AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUserData = async (firebaseUser) => {
    if (firebaseUser) {
      const { data: userDataFromFirestore } = await getUserData(firebaseUser.uid);
      
      let userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Потребител',
        photoURL: firebaseUser.photoURL || null,
      };

      if (userDataFromFirestore) {
        userData = {
          ...userData,
          ...userDataFromFirestore,
          name: userDataFromFirestore.name || userData.name,
          // Използвай photoURL от Firestore, ако има, иначе от Firebase Auth
          photoURL: userDataFromFirestore.photoURL || userData.photoURL,
        };
      } else {
        await createUserData(firebaseUser.uid, {
          name: userData.name,
          email: userData.email,
          photoURL: userData.photoURL,
        });
      }

      setUser(userData);
      
      if (firebaseUser) {
        setTimeout(() => {
          registerPushToken().catch(error => {
            console.error('Error updating push token after login:', error);
          });
        }, 1000);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      await loadUserData(firebaseUser);
    });

    return () => unsubscribe();
  }, []);

  const refreshUser = async () => {
    if (auth.currentUser) {
      await loadUserData(auth.currentUser);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

