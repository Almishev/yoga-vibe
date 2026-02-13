import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/auth';
import { useTheme } from '../contexts/theme';
import { updateProfile, reload } from 'firebase/auth';
import { auth } from '../services/firebase';
import { updateUserData } from '../services/userService';
import { uploadProfileImage, deleteProfileImage } from '../services/storageService';
import EditProfile from '../componenets/EditProfile';

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const { user, refreshUser } = useAuth();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigation.goBack();
    }
  }, [user, navigation]);

  const handleSubmit = async (values) => {
    if (loading || !user) return;

    setLoading(true);
    const { name, photoURI, removePhoto } = values;
    let photoURL = user.photoURL || null;

    try {
      
      if (removePhoto) {
        const deleteResult = await deleteProfileImage(user.uid);
        if (deleteResult.error) {
          Alert.alert('Грешка', deleteResult.error);
          setLoading(false);
          return;
        }
        photoURL = null;
      } else if (photoURI) {
        
        if (user.photoURL) {
          const deleteResult = await deleteProfileImage(user.uid);
          if (deleteResult.error) {
            console.warn('Failed to delete old image, continuing with upload:', deleteResult.error);
          }
        }
        
        const uploadResult = await uploadProfileImage(user.uid, photoURI);
        if (uploadResult.error) {
          Alert.alert('Грешка', uploadResult.error);
          setLoading(false);
          return;
        }
        photoURL = uploadResult.url;
      }

      
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: name,
          photoURL: photoURL,
        });
        
        await reload(auth.currentUser);
      }

      
      const updateData = { name };
      if (photoURL !== null || removePhoto) {
        updateData.photoURL = photoURL;
      }

      const result = await updateUserData(user.uid, updateData);

      if (result.error) {
        Alert.alert('Грешка', result.error);
        setLoading(false);
      } else {
        
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
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['bottom']}>
      <EditProfile
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
        initialName={user.name || ''}
        initialPhotoURL={user.photoURL || null}
      />
    </SafeAreaView>
  );
}

