import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import Button from './Button';

export default function EditProfile({ onSubmit, onCancel, loading = false, initialName = '' }) {
  const [name, setName] = useState(initialName);

  const handleSubmit = () => {
    if (name.trim() && onSubmit && !loading) {
      onSubmit({ name: name.trim() });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Редактирай профил</Text>

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
});

