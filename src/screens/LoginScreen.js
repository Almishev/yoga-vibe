import { useState } from 'react';
import { Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { loginUser } from '../services/authService';
import Login from '../componenets/Login';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    if (loading) return;
    
    setLoading(true);
    const { email, password } = values;
    
    try {
      const result = await loginUser(email, password);
      
      if (result.error) {
        Alert.alert('Грешка', result.error);
        setLoading(false);
      } else {
        navigation.navigate('ProfileTab');
      }
    } catch (error) {
      Alert.alert('Грешка', error.message || 'Възникна грешка при влизането.');
      setLoading(false);
    }
  };

  const handleGoToRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['bottom']}>
      <Login 
        onSubmit={handleSubmit} 
        onGoToRegister={handleGoToRegister}
        loading={loading}
      />
    </SafeAreaView>
  );
}
