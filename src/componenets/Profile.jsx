import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from './Button';

export default function Profile({ user, onEdit, onLogout, onDelete, completedCourses = [], completedCoursesData = [], startedCourses = [] }) {
  const displayUser = user || {
    name: 'Гост',
    email: 'guest@yogavibe.app'
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('bg-BG', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <View style={styles.avatar}>
            {displayUser.photoURL ? (
              <Image 
                source={{ uri: displayUser.photoURL }} 
                style={styles.avatarImage}
              />
            ) : (
              <Text style={styles.avatarText}>
                {displayUser.name?.charAt(0)?.toUpperCase() || 'Г'}
              </Text>
            )}
          </View>
          <View style={styles.headerText}>
            <Text style={styles.name}>{displayUser.name}</Text>
            <Text style={styles.email}>{displayUser.email}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Моята практика</Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{completedCourses.length}</Text>
              <Text style={styles.statLabel}>Завършени курса</Text>
            </View>
          </View>
        </View>

        {user && completedCourses.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Завършени курсове</Text>
            {completedCoursesData.map((course) => {
              const completedCourse = completedCourses.find(c => c.courseId === course.id);
              return (
                <View key={course.id} style={styles.completedCourseItem}>
                  <View style={styles.completedCourseIcon}>
                    <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                  </View>
                  <View style={styles.completedCourseInfo}>
                    <Text style={styles.completedCourseTitle}>{course.title}</Text>
                    {completedCourse?.completedAt && (
                      <Text style={styles.completedCourseDate}>
                        Завършен на {formatDate(completedCourse.completedAt)}
                      </Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {user && startedCourses.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Започнати курсове</Text>
            {startedCourses.map((course) => (
              <View key={course.id} style={styles.startedCourseItem}>
                <View style={styles.startedCourseIcon}>
                  <Ionicons name="play-circle-outline" size={24} color="#FF9800" />
                </View>
                <View style={styles.startedCourseInfo}>
                  <Text style={styles.startedCourseTitle}>{course.title}</Text>
                  <Text style={styles.startedCourseProgress}>
                    {course.completedCount} от {course.totalCount} {course.category === 'cosmoenergetics' ? 'сеанса' : 'асани'} завършени
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {user && completedCourses.length === 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Завършени курсове</Text>
            <View style={styles.emptyState}>
              <Ionicons name="trophy-outline" size={48} color="#ccc" />
              <Text style={styles.emptyStateText}>Все още няма завършени курсове</Text>
              <Text style={styles.emptyStateSubtext}>Започнете да практикувате, за да завършите курсове</Text>
            </View>
          </View>
        )}

        {user ? (
          <>
            <View style={styles.actionButtonsRow}>
              {onEdit && (
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={onEdit}
                  activeOpacity={0.7}
                >
                  <Ionicons name="create-outline" size={24} color="#9B59B6" />
                </TouchableOpacity>
              )}
              {onDelete && (
                <TouchableOpacity
                  style={[styles.iconButton, styles.deleteIconButton]}
                  onPress={onDelete}
                  activeOpacity={0.7}
                >
                  <Ionicons name="trash-outline" size={24} color="#ff4444" />
                </TouchableOpacity>
              )}
            </View>
            {onLogout && (
              <Button
                title="Излез"
                onPress={onLogout}
                style={styles.logoutButton}
              />
            )}
          </>
        ) : (
          <Button
            title="Влез в акаунт"
            onPress={onEdit}
            variant="outline"
            style={styles.editButton}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#9B59B6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: '#9B59B6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginBottom: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9B59B6',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    flex: 1,
    marginRight: 12,
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e8e0f0',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#9B59B6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#666',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#9B59B6',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6,
  },
  deleteIconButton: {
    borderColor: '#ff4444',
  },
  logoutButton: {
    marginTop: 0,
    backgroundColor: '#ff4444',
  },
  contentContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 24,
  },
  completedCourseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e8e0f0',
  },
  completedCourseIcon: {
    marginRight: 12,
  },
  completedCourseInfo: {
    flex: 1,
  },
  completedCourseTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  completedCourseDate: {
    fontSize: 12,
    color: '#666',
  },
  startedCourseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff8e1',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ffe0b2',
  },
  startedCourseIcon: {
    marginRight: 12,
  },
  startedCourseInfo: {
    flex: 1,
  },
  startedCourseTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  startedCourseProgress: {
    fontSize: 12,
    color: '#FF9800',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
    marginTop: 12,
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
  },
});
