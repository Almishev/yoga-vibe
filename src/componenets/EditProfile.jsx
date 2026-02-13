import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, Image, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/theme';
import Button from './Button';

export default function EditProfile({ onSubmit, onCancel, loading = false, initialName = '', initialPhotoURL = null }) {
  const { theme } = useTheme();
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
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Редактирай профил</Text>

        <View style={[styles.avatarSection, { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.border }]}>
          <View style={styles.avatarContainer}>
            {selectedImage ? (
              <Image source={{ uri: selectedImage }} style={[styles.avatarImage, { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.surface }]} />
            ) : (
              <View style={[styles.avatarPlaceholder, { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.surface }]}>
                <Ionicons name="person" size={40} color={theme.colors.primary} />
              </View>
            )}
            <TouchableOpacity
              style={[styles.changePhotoButton, { backgroundColor: theme.colors.primary, borderColor: theme.colors.surface, shadowColor: theme.colors.primary }]}
              onPress={showImagePickerOptions}
              disabled={loading}
            >
              <Ionicons name="camera" size={20} color={theme.colors.onPrimary} />
            </TouchableOpacity>
          </View>
          {selectedImage && (
            <TouchableOpacity
              style={[styles.removePhotoButton, { backgroundColor: theme.colors.surface, borderColor: '#ff4444' }]}
              onPress={handleRemoveImage}
              disabled={loading}
            >
              <Text style={styles.removePhotoText}>Премахни снимка</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.field}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Име</Text>
          <View style={[styles.inputWrapper, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface }]}>
            <TextInput
              style={[styles.input, { color: theme.colors.text }]}
              value={name}
              onChangeText={setName}
              placeholder="Вашето име"
              placeholderTextColor={theme.colors.textSecondary}
              autoCapitalize="words"
            />
          </View>
        </View>

        <Button
          title={loading ? 'Запазване...' : 'Запази'}
          onPress={handleSubmit}
          disabled={loading || !name.trim()}
          style={[styles.primaryButton, { shadowColor: theme.colors.primary }]}
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
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  card: { width: '100%', maxWidth: 420, padding: 24, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 24 },
  field: { marginBottom: 16 },
  label: { fontSize: 15, fontWeight: '600', marginBottom: 8 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, borderWidth: 1.5, paddingHorizontal: 16, paddingVertical: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  input: { flex: 1, paddingVertical: 0, fontSize: 16 },
  primaryButton: { marginTop: 24, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 5 },
  cancelButton: { marginTop: 12 },
  avatarSection: { alignItems: 'center', marginBottom: 24, padding: 20, borderRadius: 16, borderWidth: 1 },
  avatarContainer: { position: 'relative', marginBottom: 12 },
  avatarImage: { width: 120, height: 120, borderRadius: 60, borderWidth: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 4 },
  avatarPlaceholder: { width: 120, height: 120, borderRadius: 60, alignItems: 'center', justifyContent: 'center', borderWidth: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 4 },
  changePhotoButton: { position: 'absolute', bottom: 0, right: 0, width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', borderWidth: 4, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.5, shadowRadius: 6, elevation: 8 },
  removePhotoButton: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, borderWidth: 1.5 },
  removePhotoText: { color: '#ff4444', fontSize: 14, fontWeight: '600' },
});

