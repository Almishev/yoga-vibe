import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/theme';
import Button from './Button';

export default function Register({ onSubmit, onGoToLogin, loading = false }) {
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    if (onSubmit && !loading) {
      onSubmit({ name, email, password });
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Image
          source={require('../../assets/logo-yoga-app.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={[styles.title, { color: theme.colors.text }]}>Регистрация</Text>

        <View style={styles.field}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Име</Text>
          <View style={[styles.inputWrapper, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface }]}>
            <TextInput
              style={[styles.input, { color: theme.colors.text }]}
              value={name}
              onChangeText={setName}
              placeholder="Вашето име"
              placeholderTextColor={theme.colors.textSecondary}
            />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Имейл</Text>
          <View style={[styles.inputWrapper, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface }]}>
            <TextInput
              style={[styles.input, { color: theme.colors.text }]}
              value={email}
              onChangeText={setEmail}
              placeholder="you@email.com"
              placeholderTextColor={theme.colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Парола</Text>
          <View style={[styles.inputWrapper, styles.passwordRow, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface }]}>
            <TextInput
              style={[styles.input, { color: theme.colors.text }]}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor={theme.colors.textSecondary}
              secureTextEntry={!showPassword}
            />
            <Pressable
              style={styles.eyeButton}
              onPress={() => setShowPassword((prev) => !prev)}
              hitSlop={8}
            >
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={theme.colors.textSecondary}
              />
            </Pressable>
          </View>
        </View>

        <Button
          title={loading ? 'Регистриране...' : 'Създай акаунт'}
          onPress={handleSubmit}
          disabled={loading}
          style={[styles.primaryButton, { shadowColor: theme.colors.primary }]}
        />

        <View style={styles.footerRow}>
          <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>Вече имаш акаунт?</Text>
          <Pressable onPress={onGoToLogin}>
            <Text style={[styles.footerLink, { color: theme.colors.primary }]}>Вход</Text>
          </Pressable>
        </View>
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
  },
  card: {
    width: '100%',
    maxWidth: 420,
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logo: {
    width: 72,
    height: 72,
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 24 },
  field: { marginBottom: 16 },
  label: { fontSize: 15, fontWeight: '600', marginBottom: 8 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  passwordRow: {},
  input: { flex: 1, paddingVertical: 0, fontSize: 16 },
  eyeButton: { marginLeft: 8, padding: 4 },
  primaryButton: { marginTop: 24, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 5 },
  footerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 16 },
  footerText: { marginRight: 6 },
  footerLink: { fontWeight: '600' },
});


