import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SectionList } from 'react-native';
import exercises from '../../assets/data/exercises.json';
import AsanaListItem from '../componenets/AsanaListItem';
import CourseListItem from '../componenets/CourseListItem';

export default function HomeScreen() {
  
  // Подготвяме данните за SectionList - всеки курс е секция с асаните като данни
  const sections = exercises.courses.map(course => ({
    title: course.title,
    data: course.asanas,
    courseInfo: {
      id: course.id,
      style: course.style,
      focus: course.focus,
      duration: course.duration,
      description: course.description
    }
  }));

  const totalAsanas = sections.reduce((sum, section) => sum + section.data.length, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Yoga Vibe с Веселина Маркова</Text>
      <Text style={styles.subheader}>
        {exercises.courses.length} курса • {totalAsanas} асани
      </Text>
      
      <SectionList
        sections={sections}
        renderItem={({ item }) => <AsanaListItem asana={item} />}
        renderSectionHeader={({ section }) => (
          <CourseListItem 
            course={{
              title: section.title,
              style: section.courseInfo.style,
              focus: section.courseInfo.focus,
              duration: section.courseInfo.duration,
              description: section.courseInfo.description
            }}
            asanaCount={section.data.length}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
      />
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
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
    paddingBottom: 20,
  },
});
