import { StyleSheet, Text, View, Pressable } from 'react-native';

export default function CourseListItem({ course, asanaCount, onPress }) {
  return (
    <Pressable 
      style={styles.courseContainer}
      onPress={onPress}
  
    >
      <Text style={styles.courseTitle}>{course.title}</Text>
      <Text style={styles.courseSubtitle}>
        <Text style={styles.subValue}>{course.style}</Text> •{' '}
        <Text style={styles.subValue}>{course.focus}</Text> •{' '}
        <Text style={styles.subValue}>{course.duration} мин</Text>
      </Text>
      <Text style={styles.courseDescription}>{course.description}</Text>
      <Text style={styles.asanaCount}>{asanaCount} асани</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  courseContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    marginHorizontal: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  courseDescription: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
    lineHeight: 20,
  },
  asanaCount: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
  },
  subValue: {
    textTransform: 'capitalize',
  },
});

