import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function CourseListItem({ course, asanaCount, onPress, featured = false }) {
  return (
    <TouchableOpacity 
      style={[styles.container, featured && styles.featuredContainer]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <Text style={styles.title}>{course.title}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>
            {course.style} • {course.focus} • {course.duration} мин
          </Text>
        </View>
        {course.description && (
          <Text style={styles.description} numberOfLines={featured ? 2 : 3}>
            {course.description}
          </Text>
        )}
        <Text style={styles.asanaCount}>{asanaCount} асани</Text>
      </View>
      {!featured && <Text style={styles.arrow}>›</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 12,
  },
  featuredContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  metaRow: {
    marginBottom: 8,
  },
  metaText: {
    fontSize: 13,
    color: '#666',
    textTransform: 'capitalize',
  },
  description: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 8,
  },
  asanaCount: {
    fontSize: 13,
    color: '#9B59B6',
    fontWeight: '600',
  },
  arrow: {
    fontSize: 24,
    color: '#ccc',
    marginLeft: 8,
  },
});
