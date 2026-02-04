import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, Image, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import Button from './Button';

export default function EditProfile({ onSubmit, onCancel, loading = false, initialName = '', initialPhotoURL = null }) {
  const [name, setName] = useState(initialName);
  const [selectedImage, setSelectedImage] = useState(initialPhotoURL);

  const requestPermissions = async (source) => {
    if (source === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Разрешения',
          'Нужно е разрешение за достъп до камерата, за да можете да снимате.',
          [{ text: 'OK' }]
        );
        return false;
      }
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Разрешения',
          'Нужно е разрешение за достъп до галерията, за да можете да изберете снимка.',
          [{ text: 'OK' }]
        );
        return false;
      }
    }
    return true;
  };

  const handlePickImage = async (source) => {
    try {
      const hasPermission = await requestPermissions(source);
      if (!hasPermission) return;

      let result;
      
      if (source === 'camera') {
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      }

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('ImagePicker error:', error);
      Alert.alert('Грешка', error.message || 'Възникна грешка при избора на снимка.');
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert(
      'Избери снимка',
      'Откъде искате да изберете снимка?',
      [
        {
          text: 'Камера',
          onPress: () => handlePickImage('camera'),
        },
        {
          text: 'Галерия',
          onPress: () => handlePickImage('gallery'),
        },
        {
          text: 'Отказ',
          style: 'cancel',
        },
      ]
    );
  };

  const handleRemoveImage = () => {
    Alert.alert(
      'Премахни снимка',
      'Сигурни ли сте, че искате да премахнете профилната снимка?',
      [
        {
          text: 'Отказ',
          style: 'cancel',
        },
        {
          text: 'Премахни',
          style: 'destructive',
          onPress: () => setSelectedImage(null),
        },
      ]
    );
  };

  const handleSubmit = () => {
    if (name.trim() && onSubmit && !loading) {
      onSubmit({ 
        name: name.trim(),
        photoURI: selectedImage !== initialPhotoURL ? selectedImage : null,
        removePhoto: selectedImage === null && initialPhotoURL !== null,
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Редактирай профил</Text>

        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            {selectedImage ? (
              <Image source={{ uri: selectedImage }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={40} color="#9B59B6" />
              </View>
            )}
            <TouchableOpacity
              style={styles.changePhotoButton}
              onPress={showImagePickerOptions}
              disabled={loading}
            >
              <Ionicons name="camera" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          {selectedImage && (
            <TouchableOpacity
              style={styles.removePhotoButton}
              onPress={handleRemoveImage}
              disabled={loading}
            >
              <Text style={styles.removePhotoText}>Премахни снимка</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Име</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Вашето име"
              placeholderTextColor="#999"
              autoCapitalize="words"
            />
          </View>
        </View>

        <Button
          title={loading ? 'Запазване...' : 'Запази'}
          onPress={handleSubmit}
          disabled={loading || !name.trim()}
          style={styles.primaryButton}
        />

        <Button
          title="Отказ"
          onPress={onCancel}
          variant="outline"
          disabled={loading}
          style={styles.cancelButton}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 24,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  input: {
    flex: 1,
    paddingVertical: 0,
    color: '#333',
    fontSize: 16,
  },
  primaryButton: {
    marginTop: 24,
    shadowColor: '#9B59B6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  cancelButton: {
    marginTop: 12,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#f8f8f8',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e8e0f0',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  changePhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#9B59B6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#fff',
    shadowColor: '#9B59B6',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 8,
  },
  removePhotoButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#ff4444',
  },
  removePhotoText: {
    color: '#ff4444',
    fontSize: 14,
    fontWeight: '600',
  },
});

