import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, RefreshControl, ActivityIndicator, Pressable } from 'react-native';
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
  const [selectedCategory, setSelectedCategory] = useState('yoga');

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

  const filteredCourses = courses.filter(course => {
    const courseCategory = course.category || 'yoga';
    return courseCategory === selectedCategory;
  });

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
            {filteredCourses.length} {selectedCategory === 'yoga' ? 'йога' : 'космоенергетика'} курса
          </Text>
        </View>

        <View style={styles.tabsContainer}>
          <Pressable
            style={[styles.tab, selectedCategory === 'yoga' && styles.tabActive]}
            onPress={() => setSelectedCategory('yoga')}
          >
            <Text style={[styles.tabText, selectedCategory === 'yoga' && styles.tabTextActive]}>
              🧘‍♀️ Йога
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, selectedCategory === 'cosmoenergetics' && styles.tabActive]}
            onPress={() => setSelectedCategory('cosmoenergetics')}
          >
            <Text style={[styles.tabText, selectedCategory === 'cosmoenergetics' && styles.tabTextActive]}>
              🌌 Космоенергетика
            </Text>
          </Pressable>
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
          ) : filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
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
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  tabActive: {
    backgroundColor: '#9B59B6',
    borderColor: '#9B59B6',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  tabTextActive: {
    color: '#fff',
  },
});
