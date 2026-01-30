import React, { useState, useEffect, useContext } from 'react';
import { onAuthStateChange } from '../../services/authService';
import { getUserData, createUserData } from '../../services/userService';
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

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        const { data: userDataFromFirestore } = await getUserData(firebaseUser.uid);
        
        let userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Потребител',
          level: 'Начинаещ',
        };

        if (userDataFromFirestore) {
          userData = {
            ...userData,
            ...userDataFromFirestore,
            name: userDataFromFirestore.name || userData.name,
          };
        } else {
          await createUserData(firebaseUser.uid, {
            name: userData.name,
            email: userData.email,
            level: 'Начинаещ',
          });
        }

        setUser(userData);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

