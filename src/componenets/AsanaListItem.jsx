import { StyleSheet, Text, View, Pressable, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function AsanaListItem({ asana }) {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('AsanaDetails', { asana });
  };

  return (
    <Pressable 
      style={styles.asanaContainer}
      onPress={handlePress}
    >
      <Image 
        source={{ uri: asana.image }} 
        style={styles.asanaImage}
        resizeMode="cover"
      />
      <View style={styles.asanaContent}>
        <Text style={styles.asanaName}>{asana.name}</Text>
        <Text style={styles.asanaDescription}>{asana.description}</Text>
        <Text style={styles.asanaBenefits}>{asana.benefits.join(', ')}</Text>
        <Text style={styles.asanaSubtitle}>
          <Text style={styles.subValue}>Време: {asana.executionTime}с</Text>
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  asanaContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 2,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  asanaImage: {
    width: '100%',
    height: 250,
    backgroundColor: '#f0f0f0',
  },
  asanaContent: {
    padding: 10,
    gap: 5,
  },
  asanaName: {
    fontSize: 20,
    fontWeight: '500',
  },
  asanaDescription: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
    marginBottom: 5,
  },
  asanaBenefits: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    marginBottom: 5,
  },
  asanaSubtitle: {
    color: 'dimgray',
    fontSize: 16,
  },
  subValue: {
    textTransform: 'capitalize',
  },
});

