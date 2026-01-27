import { StyleSheet, Text, View, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import AsanaListItem from '../componenets/AsanaListItem';

export default function CourseDetailsScreen() {
  const route = useRoute();
  const { course } = route.params;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.courseHeader}>
        <Text style={styles.courseTitle}>{course.title}</Text>
        <Text style={styles.courseSubtitle}>
          {course.style} • {course.focus} • {course.duration} мин
        </Text>
        <Text style={styles.asanaCount}>{course.asanas.length} асани</Text>
      </View>

      <FlatList
        data={course.asanas}
        renderItem={({ item }) => <AsanaListItem asana={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  courseHeader: {
    backgroundColor: '#fff',
    padding: 15,
    marginTop: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  courseTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  courseSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  asanaCount: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
  },
  listContainer: {
    padding: 10,
    paddingBottom: 30,
  },
});