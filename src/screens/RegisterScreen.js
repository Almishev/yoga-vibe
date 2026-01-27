import { SafeAreaView } from 'react-native-safe-area-context';
import Register from '../componenets/Register';

export default function RegisterScreen({ navigation, setLoggedIn }) {
  const handleSubmit = (values) => {
    // Тук по-късно ще добавим реална логика за регистрация (Firebase и т.н.)
    console.log('Register submit', values);
    if (setLoggedIn) {
      setLoggedIn(true);
    }
  };

  const handleGoToLogin = () => {
    if (navigation) {
      navigation.navigate('LoginMain');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['bottom']}>
      <Register onSubmit={handleSubmit} onGoToLogin={handleGoToLogin} />
    </SafeAreaView>
  );
}


