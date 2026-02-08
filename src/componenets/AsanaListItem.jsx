import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function AsanaListItem({ asana, course }) {
  const navigation = useNavigation();
  const courseCategory = course?.category || 'yoga';
  const isCosmoenergetics = courseCategory === 'cosmoenergetics';

  const handlePress = () => {
    navigation.navigate('AsanaDetails', { asana, course });
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {asana.image ? (
        <Image 
          source={{ uri: asana.image }} 
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Ionicons 
            name={isCosmoenergetics ? "sparkles" : "fitness"} 
            size={40} 
            color="#9B59B6" 
          />
        </View>
      )}
      <View style={styles.content}>
        <Text style={styles.title}>{asana.name}</Text>
        {asana.description && (
          <Text style={styles.subtitle} numberOfLines={2}>
            {asana.description}
          </Text>
        )}
        <View style={styles.footer}>
          <Text style={styles.time}>
            {isCosmoenergetics 
              ? `${Math.round(asana.executionTime / 60)} минути` 
              : `${asana.executionTime} секунди`}
          </Text>
          <Text style={styles.arrow}>›</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 12,
    minHeight: 100,
    alignItems: 'stretch',
  },
  image: {
    width: 100,
    alignSelf: 'stretch',
    backgroundColor: '#f0f0f0',
  },
  imagePlaceholder: {
    width: 100,
    alignSelf: 'stretch',
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  time: {
    fontSize: 13,
    color: '#9B59B6',
    fontWeight: '600',
  },
  arrow: {
    fontSize: 20,
    color: '#9B59B6',
    marginLeft: 8,
  },
});
