import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsanaTimer from './AsanaTimer';

export default function AsanaDetails({ asana }) {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Image 
          source={{ uri: asana.image }} 
          style={styles.asanaImage}
          resizeMode="cover"
        />
        
        <View style={styles.contentContainer}>
          <Text style={styles.asanaName}>{asana.name}</Text>
          
          <AsanaTimer initialSeconds={asana.executionTime} />
          
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Описание</Text>
            <Text style={styles.sectionText}>{asana.description}</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Ползи</Text>
            {asana.benefits.map((benefit, index) => (
              <View key={index} style={styles.benefitItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            ))}
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Време за изпълнение</Text>
            <Text style={styles.sectionText}>{asana.executionTime} секунди</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    paddingBottom: 10,
  },
  asanaImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#f0f0f0',
  },
  contentContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 10,
  },
  asanaName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  infoSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },
  benefitItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  bullet: {
    fontSize: 18,
    color: '#666',
    marginRight: 10,
    marginTop: 2,
  },
  benefitText: {
    fontSize: 16,
    color: '#555',
    flex: 1,
    lineHeight: 24,
  },
});

