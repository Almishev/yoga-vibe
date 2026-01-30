import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import exercises from '../../assets/data/exercises.json';
import CourseListItem from '../componenets/CourseListItem';
import EmptyState from '../componenets/EmptyState';

export default function CoursesScreen() {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  const handleCoursePress = (course) => {
    navigation.navigate('CourseDetails', { course });
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
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
            {exercises.courses.length} курса с Веселина Маркова
          </Text>
        </View>

        <View style={styles.section}>
          {exercises.courses.length > 0 ? (
            exercises.courses.map((course) => (
              <CourseListItem
                key={course.id}
                course={course}
                asanaCount={course.asanas.length}
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
});
