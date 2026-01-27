import { SafeAreaView } from 'react-native-safe-area-context';
import Profile from '../componenets/Profile';

export default function ProfileScreen() {
  // По-късно тук ще взимаме истински данни за потребителя (от Firebase или друг бекенд)
  const user = null;

  const handleEdit = () => {
    // По желание: навигация към екран за редакция на профил
    console.log('Edit profile press');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['top', 'bottom']}>
      <Profile user={user} onEdit={handleEdit} />
    </SafeAreaView>
  );
}


