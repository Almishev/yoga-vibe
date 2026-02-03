import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/auth';
import { isAsanaCompleted, markAsanaAsCompleted } from '../services/progressService';
import AsanaTimer from './AsanaTimer';

export default function AsanaDetails({ asana }) {
  const { user } = useAuth();
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const checkCompletion = async () => {
      if (!user || !asana?.id) return;

      try {
        const completed = await isAsanaCompleted(user.uid, asana.id);
        setIsCompleted(completed);
      } catch (error) {
        console.error('Error checking completion:', error);
      }
    };

    checkCompletion();
  }, [user, asana?.id]);

  const handleAutoComplete = async () => {
    // Автоматично маркиране на асаната като завършена, когато таймерът свърши
    if (!user || !asana?.id || !asana?.courseId || isCompleted) return;

    try {
      const result = await markAsanaAsCompleted(
        user.uid,
        asana.id,
        asana.courseId,
        asana.executionTime || 0
      );
      if (result.error) {
        console.error('Error marking as completed:', result.error);
      } else {
        setIsCompleted(true);
      }
    } catch (error) {
      console.error('Error in auto completion:', error);
    }
  };

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
          {isCompleted && user && (
            <View style={styles.completedBadge}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.completedText}>Завършена</Text>
            </View>
          )}

          {asana.description && (
            <Text style={styles.description}>{asana.description}</Text>
          )}
          
          <View style={styles.divider} />

          <View style={styles.timerSection}>
            <Text style={styles.sectionLabel}>Време за практика</Text>
            <AsanaTimer 
              initialSeconds={asana.executionTime} 
              onComplete={handleAutoComplete}
            />
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
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  completedText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
    marginLeft: 6,
  },
});
