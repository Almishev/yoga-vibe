import { Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/auth';
import { logoutUser } from '../services/authService';
import Profile from '../componenets/Profile';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();

  const handleEdit = () => {
  };

  const handleLogout = async () => {
    Alert.alert(
      'Изход',
      'Сигурни ли сте, че искате да излезете?',
      [
        {
          text: 'Отказ',
          style: 'cancel',
        },
        {
          text: 'Излез',
          style: 'destructive',
          onPress: async () => {
            const result = await logoutUser();
            if (result.error) {
              Alert.alert('Грешка', result.error);
            } else {
              navigation.navigate('HomeTab');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['top', 'bottom']}>
      <Profile 
        user={user} 
        onEdit={handleEdit} 
        onLogout={handleLogout}
      />
    </SafeAreaView>
  );
}


