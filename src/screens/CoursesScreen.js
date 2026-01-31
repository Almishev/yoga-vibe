import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import { getAllCourses } from '../services/courseService';
import { getAsanasByCourseId } from '../services/asanaService';
import CourseListItem from '../componenets/CourseListItem';
import EmptyState from '../componenets/EmptyState';

export default function CoursesScreen() {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCourses = async () => {
    try {
      setError(null);
      const coursesData = await getAllCourses();
      
      // За всеки курс, зареди броя асани
      const coursesWithCount = await Promise.all(
        coursesData.map(async (course) => {
          const asanas = await getAsanasByCourseId(course.id);
          return {
            ...course,
            asanaCount: asanas.length
          };
        })
      );
      
      setCourses(coursesWithCount);
    } catch (err) {
      console.error('Error loading courses:', err);
      setError('Грешка при зареждане на курсовете');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleCoursePress = (course) => {
    navigation.navigate('CourseDetails', { course });
  };

  const onRefresh = () => {
    setRefreshing(true);
    setLoading(true);
    loadCourses();
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Yoga Vibe</Text>
          <Text style={styles.headerSubtitle}>
            {courses.length} курса с Веселина Маркова
          </Text>
        </View>

        <View style={styles.section}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#9B59B6" />
              <Text style={styles.loadingText}>Зареждане на курсове...</Text>
            </View>
          ) : error ? (
            <EmptyState
              icon="⚠️"
              title="Грешка"
              subtitle={error}
            />
          ) : courses.length > 0 ? (
            courses.map((course) => (
              <CourseListItem
                key={course.id}
                course={course}
                asanaCount={course.asanaCount || 0}
                onPress={() => handleCoursePress(course)}
              />
            ))
          ) : (
            <EmptyState
              icon="🧘‍♀️"
              title="Няма налични курсове"
              subtitle="В момента няма добавени курсове. Проверете отново по-късно."
            />
          )}
        </View>
      </ScrollView>
      
      <StatusBar style="auto" />
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
  header: {
    backgroundColor: '#9B59B6',
    padding: 24,
    paddingTop: 16,
    paddingBottom: 28,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  section: {
    padding: 16,
    paddingBottom: 8,
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
