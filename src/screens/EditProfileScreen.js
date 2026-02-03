import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/auth';
import { updateProfile, reload } from 'firebase/auth';
import { auth } from '../services/firebase';
import { updateUserData } from '../services/userService';
import EditProfile from '../componenets/EditProfile';

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigation.goBack();
    }
  }, [user, navigation]);

  const handleSubmit = async (values) => {
    if (loading || !user) return;

    setLoading(true);
    const { name } = values;

    try {
      // Обнови Firebase Auth displayName
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: name,
        });
        // Reload current user за да се обновят данните
        await reload(auth.currentUser);
      }

      // Обнови Firestore name
      const result = await updateUserData(user.uid, { name });

      if (result.error) {
        Alert.alert('Грешка', result.error);
        setLoading(false);
      } else {
        // Обнови данните в контекста веднага
        await refreshUser();
        setLoading(false);
        Alert.alert('Успех', 'Профилът е обновен успешно!', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      }
    } catch (error) {
      Alert.alert('Грешка', error.message || 'Възникна грешка при обновяването на профила.');
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  if (!user) {
    return null;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['bottom']}>
      <EditProfile
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
        initialName={user.name || ''}
      />
    </SafeAreaView>
  );
}

