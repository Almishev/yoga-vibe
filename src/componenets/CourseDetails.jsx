import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useMemo } from 'react';
import { useTheme } from '../contexts/theme';
import { getAsanasByCourseId } from '../services/asanaService';
import AsanaListItem from './AsanaListItem';
import EmptyState from './EmptyState';

export default function CourseDetails({ course }) {
  const { theme } = useTheme();
  const [asanas, setAsanas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const stylesThemed = useMemo(() => ({
    container: { flex: 1, backgroundColor: theme.colors.background },
    courseHeader: { backgroundColor: theme.colors.surface, padding: 20, marginBottom: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
    courseTitle: { fontSize: 24, fontWeight: '700', color: theme.colors.text, marginBottom: 12 },
    metaText: { fontSize: 14, color: theme.colors.textSecondary, textTransform: 'capitalize' },
    description: { fontSize: 15, color: theme.colors.textSecondary, lineHeight: 22, marginBottom: 12 },
    asanaCount: { fontSize: 14, color: theme.colors.primary, fontWeight: '600' },
    sectionTitle: { fontSize: 20, fontWeight: '700', color: theme.colors.text, marginBottom: 12 },
    loadingText: { marginTop: 12, fontSize: 14, color: theme.colors.textSecondary },
  }), [theme]);

  const courseCategory = course?.category || 'yoga';
  const itemLabel = courseCategory === 'cosmoenergetics' ? 'сеанса' : 'асани';
  const sectionTitle = courseCategory === 'cosmoenergetics' ? 'Сеанси в курса' : 'Асани в курса';
  const loadingText = courseCategory === 'cosmoenergetics' ? 'Зареждане на сеанси...' : 'Зареждане на асани...';
  const emptyTitle = courseCategory === 'cosmoenergetics' ? 'Няма сеанси' : 'Няма асани';
  const emptySubtitle = courseCategory === 'cosmoenergetics' 
    ? 'В този курс все още няма добавени сеанси' 
    : 'В този курс все още няма добавени асани';

  useEffect(() => {
    const loadAsanas = async () => {
      if (!course?.id) {
        setLoading(false);
        return;
      }

      try {
        setError(null);
        const asanasData = await getAsanasByCourseId(course.id);
        setAsanas(asanasData);
      } catch (err) {
        console.error('Error loading asanas:', err);
        const errorMessage = courseCategory === 'cosmoenergetics' 
          ? 'Грешка при зареждане на сеансите' 
          : 'Грешка при зареждане на асаните';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadAsanas();
  }, [course?.id]);

  return (
    <SafeAreaView style={stylesThemed.container} edges={['bottom']}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={stylesThemed.courseHeader}>
          <Text style={stylesThemed.courseTitle}>{course.title}</Text>
          <View style={styles.metaRow}>
            <Text style={stylesThemed.metaText}>
              {(() => {
                // Парсваме duration - може да е число или текст
                const getDuration = () => {
                  if (typeof course.duration === 'number') {
                    return course.duration;
                  }
                  if (typeof course.duration === 'string') {
                    // Опитваме се да извлечем число от текста (напр. "30 минути" -> 30)
                    const match = course.duration.match(/\d+/);
                    return match ? parseInt(match[0]) : 0;
                  }
                  return 0;
                };
                const duration = getDuration();
                
                // За космоенергетика показваме само продължителността
                if (courseCategory === 'cosmoenergetics') {
                  return `${duration} минути`;
                }
                
                // За йога показваме стил, фокус и продължителност
                const style = course.style || 'Йога';
                const focus = course.focus || 'Практика';
                return `${style} • ${focus} • ${duration} мин`;
              })()}
            </Text>
          </View>
          {course.description && (
            <Text style={stylesThemed.description}>{course.description}</Text>
          )}
          <Text style={stylesThemed.asanaCount}>{asanas.length} {itemLabel}</Text>
        </View>

        <View style={styles.section}>
          <Text style={stylesThemed.sectionTitle}>{sectionTitle}</Text>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={stylesThemed.loadingText}>{loadingText}</Text>
            </View>
          ) : error ? (
            <EmptyState
              icon="⚠️"
              title="Грешка"
              subtitle={error}
            />
          ) : asanas.length > 0 ? (
            asanas.map((asana) => (
              <AsanaListItem key={asana.id} asana={asana} course={course} />
            ))
          ) : (
            <EmptyState
              icon={courseCategory === 'cosmoenergetics' ? '🌌' : '🧘‍♀️'}
              title={emptyTitle}
              subtitle={emptySubtitle}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: { flex: 1 },
  metaRow: { marginBottom: 12 },
  section: { padding: 16, paddingBottom: 8 },
  loadingContainer: { padding: 40, alignItems: 'center', justifyContent: 'center' },
});
