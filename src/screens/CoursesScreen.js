import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import exercises from '../../assets/data/exercises.json';
import CourseListItem from '../componenets/CourseListItem';

export default function CoursesScreen() {
  const navigation = useNavigation();

  const handleCoursePress = (course) => {
    navigation.navigate('CourseDetails', { course });
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Text style={styles.header}>Yoga Vibe с Веселина Маркова</Text>
      <Text style={styles.subheader}>
        {exercises.courses.length} курса
      </Text>
      
      <FlatList
        data={exercises.courses}
        renderItem={({ item }) => (
          <CourseListItem 
            course={item}
            asanaCount={item.asanas.length}
            onPress={() => handleCoursePress(item)}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
      
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    color: '#333',
  },
  subheader: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  listContainer: {
    padding: 10,
    paddingBottom: 30,
  },
});

