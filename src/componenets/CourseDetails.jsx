import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { getAsanasByCourseId } from '../services/asanaService';
import AsanaListItem from './AsanaListItem';
import EmptyState from './EmptyState';

export default function CourseDetails({ course }) {
  const [asanas, setAsanas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAsanas = async () => {
      if (!course?.id) {
        setLoading(false);
        return;
      }

      try {
        setError(null);
        const asanasData = await getAsanasByCourseId(course.id);
        setAsanas(asanasData);
      } catch (err) {
        console.error('Error loading asanas:', err);
        setError('Грешка при зареждане на асаните');
      } finally {
        setLoading(false);
      }
    };

    loadAsanas();
  }, [course?.id]);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.courseHeader}>
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>
              {course.style} • {course.focus} • {course.duration} мин
            </Text>
          </View>
          {course.description && (
            <Text style={styles.description}>{course.description}</Text>
          )}
          <Text style={styles.asanaCount}>{asanas.length} асани</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Асани в курса</Text>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#9B59B6" />
              <Text style={styles.loadingText}>Зареждане на асани...</Text>
            </View>
          ) : error ? (
            <EmptyState
              icon="⚠️"
              title="Грешка"
              subtitle={error}
            />
          ) : asanas.length > 0 ? (
            asanas.map((asana) => (
              <AsanaListItem key={asana.id} asana={asana} />
            ))
          ) : (
            <EmptyState
              icon="🧘‍♀️"
              title="Няма асани"
              subtitle="В този курс все още няма добавени асани"
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollView: {
    flex: 1,
  },
  courseHeader: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metaRow: {
    marginBottom: 12,
  },
  metaText: {
    fontSize: 14,
    color: '#666',
    textTransform: 'capitalize',
  },
  description: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
    marginBottom: 12,
  },
  asanaCount: {
    fontSize: 14,
    color: '#9B59B6',
    fontWeight: '600',
  },
  section: {
    padding: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
});
