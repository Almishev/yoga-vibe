import { StyleSheet, Text, View, ScrollView, RefreshControl, ActivityIndicator, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useState, useEffect, useMemo } from 'react';
import { useTheme } from '../contexts/theme';
import { getAllCourses } from '../services/courseService';
import { getAsanasByCourseId } from '../services/asanaService';
import CourseListItem from '../componenets/CourseListItem';
import EmptyState from '../componenets/EmptyState';

export default function CoursesScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();
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

  const stylesThemed = useMemo(() => ({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: {
      backgroundColor: theme.colors.primary,
      padding: 24,
      paddingTop: 16,
      paddingBottom: 28,
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
    },
    headerTitle: { fontSize: 28, fontWeight: 'bold', color: theme.colors.onPrimary, marginBottom: 8 },
    headerSubtitle: { fontSize: 14, color: theme.colors.onPrimary, opacity: 0.9 },
    tab: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      backgroundColor: theme.colors.surface,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: theme.colors.border,
    },
    tabActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
    tabText: { fontSize: 14, fontWeight: '600', color: theme.colors.textSecondary },
    tabTextActive: { color: theme.colors.onPrimary },
  }), [theme]);

  return (
    <SafeAreaView style={stylesThemed.container} edges={['bottom']}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={stylesThemed.header}>
          <Text style={stylesThemed.headerTitle}>Yoga Vibe</Text>
          <Text style={stylesThemed.headerSubtitle}>
            {filteredCourses.length} {selectedCategory === 'yoga' ? 'йога' : 'космоенергетика'} курса
          </Text>
        </View>

        <View style={styles.tabsContainer}>
          <Pressable
            style={[stylesThemed.tab, selectedCategory === 'yoga' && stylesThemed.tabActive]}
            onPress={() => setSelectedCategory('yoga')}
          >
            <Text style={[stylesThemed.tabText, selectedCategory === 'yoga' && stylesThemed.tabTextActive]}>
              🧘‍♀️ Йога
            </Text>
          </Pressable>
          <Pressable
            style={[stylesThemed.tab, selectedCategory === 'cosmoenergetics' && stylesThemed.tabActive]}
            onPress={() => setSelectedCategory('cosmoenergetics')}
          >
            <Text style={[stylesThemed.tabText, selectedCategory === 'cosmoenergetics' && stylesThemed.tabTextActive]}>
              🌌 Космоенергетика
            </Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>Зареждане на курсове...</Text>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
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
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 12,
  },
});
