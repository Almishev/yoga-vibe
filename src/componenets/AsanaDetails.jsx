import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsanaTimer from './AsanaTimer';

export default function AsanaDetails({ asana }) {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <Image 
          source={{ uri: asana.image }} 
          style={styles.image}
          resizeMode="cover"
        />
        
        <View style={styles.content}>
          {asana.description && (
            <Text style={styles.description}>{asana.description}</Text>
          )}
          
          <View style={styles.divider} />

          <View style={styles.timerSection}>
            <Text style={styles.sectionLabel}>Време за практика</Text>
            <AsanaTimer initialSeconds={asana.executionTime} />
          </View>

          <View style={styles.divider} />

          <View style={styles.benefitsSection}>
            <Text style={styles.sectionTitle}>Ползи</Text>
            {asana.benefits.map((benefit, index) => (
              <View key={index} style={styles.benefitItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  image: {
    width: '100%',
    aspectRatio: 3 / 4, // Вертикални снимки (3:4 съотношение)
    backgroundColor: '#f0f0f0',
  },
  content: {
    padding: 20,
  },
  description: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 16,
  },
  timerSection: {
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  benefitsSection: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  bullet: {
    fontSize: 16,
    color: '#9B59B6',
    marginRight: 10,
    marginTop: 2,
  },
  benefitText: {
    fontSize: 15,
    color: '#666',
    flex: 1,
    lineHeight: 22,
  },
});
