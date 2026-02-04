import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';
import * as ImageManipulator from 'expo-image-manipulator';


export const uploadProfileImage = async (userId, imageUri) => {
  try {
    
    const manipulatedImage = await ImageManipulator.manipulateAsync(
      imageUri,
      [
        { resize: { width: 400 } },
      ],
      {
        compress: 0.8, 
        format: ImageManipulator.SaveFormat.JPEG,
      }
    );

   
    const response = await fetch(manipulatedImage.uri);
    const blob = await response.blob();

    
    const imageRef = ref(storage, `profile-images/${userId}/profile.jpg`);

   
    await uploadBytes(imageRef, blob);

    
    const downloadURL = await getDownloadURL(imageRef);

    return { url: downloadURL, error: null };
  } catch (error) {
    console.error('Error uploading profile image:', error);
    return { url: null, error: error.message || 'Грешка при качване на снимката' };
  }
};

export const deleteProfileImage = async (userId) => {
  try {
    const imageRef = ref(storage, `profile-images/${userId}/profile.jpg`);
    await deleteObject(imageRef);
    return { error: null };
  } catch (error) {
    if (error.code === 'storage/object-not-found') {
      return { error: null };
    }
    console.error('Error deleting profile image:', error);
    return { error: error.message || 'Грешка при изтриване на снимката' };
  }
};

