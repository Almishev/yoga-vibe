import { useState } from 'react';
import { Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { registerUser } from '../services/authService';
import Register from '../componenets/Register';

export default function RegisterScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    if (loading) return;
    
    setLoading(true);
    const { name, email, password } = values;
    
    try {
      const result = await registerUser(email, password, name);
      
      if (result.error) {
        Alert.alert('Грешка', result.error);
        setLoading(false);
      } else {
        navigation.navigate('HomeTab');
      }
    } catch (error) {
      Alert.alert('Грешка', error.message || 'Възникна грешка при регистрацията.');
      setLoading(false);
    }
  };

  const handleGoToLogin = () => {
    navigation.navigate('LoginMain');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['bottom']}>
      <Register 
        onSubmit={handleSubmit} 
        onGoToLogin={handleGoToLogin}
        loading={loading}
      />
    </SafeAreaView>
  );
}
