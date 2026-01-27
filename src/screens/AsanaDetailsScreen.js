import { useRoute } from '@react-navigation/native';
import AsanaDetails from '../componenets/AsanaDetails';

export default function AsanaDetailsScreen() {
  const route = useRoute();
  const { asana } = route.params;

  return <AsanaDetails asana={asana} />;
}

