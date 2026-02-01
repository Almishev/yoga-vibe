import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function AsanaListItem({ asana }) {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('AsanaDetails', { asana });
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Image 
        source={{ uri: asana.image }} 
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.title}>{asana.name}</Text>
        {asana.description && (
          <Text style={styles.subtitle} numberOfLines={2}>
            {asana.description}
          </Text>
        )}
        <Text style={styles.time}>{asana.executionTime} секунди</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 12,
  },
  image: {
    width: '100%',
    aspectRatio: 3 / 4, // Вертикални снимки (3:4 съотношение)
    backgroundColor: '#f0f0f0',
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
    lineHeight: 18,
  },
  time: {
    fontSize: 13,
    color: '#9B59B6',
    fontWeight: '600',
  },
});
