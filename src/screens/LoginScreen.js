import { SafeAreaView } from 'react-native-safe-area-context';
import Login from '../componenets/Login';

export default function LoginScreen({ navigation, setLoggedIn }) {
  const handleSubmit = (values) => {
    // Тук по-късно ще добавим реална логика за вход (Firebase и т.н.)
    console.log('Login submit', values);
    if (setLoggedIn) {
      setLoggedIn(true);
    }
  };

  const handleGoToRegister = () => {
    if (navigation) {
      navigation.navigate('Register');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['bottom']}>
      <Login onSubmit={handleSubmit} onGoToRegister={handleGoToRegister} />
    </SafeAreaView>
  );
}


