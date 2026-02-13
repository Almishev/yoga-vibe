import { useState, useEffect, useMemo, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, Animated } from 'react-native';
import { PinchGestureHandler, State } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/auth';
import { useTheme } from '../contexts/theme';
import { isAsanaCompleted, markAsanaAsCompleted } from '../services/progressService';
import { getCourseById } from '../services/courseService';
import AsanaTimer from './AsanaTimer';

const MIN_SCALE = 1;
const MAX_SCALE = 4;

export default function AsanaDetails({ asana, course: courseProp }) {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [isCompleted, setIsCompleted] = useState(false);
  const [course, setCourse] = useState(courseProp);

  const baseScaleRef = useRef(1);
  const baseScale = useRef(new Animated.Value(1)).current;
  const pinchScale = useRef(new Animated.Value(1)).current;

  const onPinchGestureEvent = Animated.event(
    [{ nativeEvent: { scale: pinchScale } }],
    { useNativeDriver: true }
  );

  const onPinchHandlerStateChange = (e) => {
    if (e.nativeEvent.oldState === State.ACTIVE) {
      const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, baseScaleRef.current * e.nativeEvent.scale));
      baseScaleRef.current = newScale;
      baseScale.setValue(newScale);
      pinchScale.setValue(1);
    }
  };

  const stylesThemed = useMemo(() => ({
    container: { flex: 1, backgroundColor: theme.colors.surface },
    imageBg: { backgroundColor: theme.colors.surfaceVariant },
    description: { fontSize: 15, color: theme.colors.textSecondary, lineHeight: 22, marginBottom: 8 },
    divider: { height: 1, backgroundColor: theme.colors.border, marginVertical: 16 },
    sectionLabel: { fontSize: 16, fontWeight: '600', color: theme.colors.text, marginBottom: 8 },
    sectionTitle: { fontSize: 18, fontWeight: '600', color: theme.colors.text, marginBottom: 12 },
    bullet: { fontSize: 16, color: theme.colors.primary, marginRight: 10, marginTop: 2 },
    benefitText: { fontSize: 15, color: theme.colors.textSecondary, flex: 1, lineHeight: 22 },
    completedBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surfaceVariant, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, alignSelf: 'flex-start', marginBottom: 12 },
    completedText: { fontSize: 14, fontWeight: '600', color: '#4CAF50', marginLeft: 6 },
    timeInfo: { fontSize: 14, color: theme.colors.textSecondary, marginBottom: 8 },
  }), [theme]);

  useEffect(() => {
    const loadCourse = async () => {
      if (courseProp) {
        setCourse(courseProp);
        return;
      }
      if (asana?.courseId) {
        try {
          const courseData = await getCourseById(asana.courseId);
          setCourse(courseData);
        } catch (error) {
          console.error('Error loading course:', error);
        }
      }
    };
    loadCourse();
  }, [asana?.courseId, courseProp]);

  const courseCategory = course?.category || 'yoga';
  const isCosmoenergetics = courseCategory === 'cosmoenergetics';
  const timeLabel = isCosmoenergetics ? 'минути' : 'секунди';
  const displayTime = isCosmoenergetics 
    ? Math.round((asana.executionTime || 0) / 60) 
    : (asana.executionTime || 0);

  useEffect(() => {
    const checkCompletion = async () => {
      if (!user || !asana?.id) return;

      try {
        const completed = await isAsanaCompleted(user.uid, asana.id);
        setIsCompleted(completed);
      } catch (error) {
        console.error('Error checking completion:', error);
      }
    };

    checkCompletion();
  }, [user, asana?.id]);

  const handleAutoComplete = async () => {
    
    if (!user || !asana?.id || !asana?.courseId || isCompleted) return;

    try {
      const result = await markAsanaAsCompleted(
        user.uid,
        asana.id,
        asana.courseId,
        asana.executionTime || 0
      );
      if (result.error) {
        console.error('Error marking as completed:', result.error);
      } else {
        setIsCompleted(true);
      }
    } catch (error) {
      console.error('Error in auto completion:', error);
    }
  };

  return (
    <SafeAreaView style={stylesThemed.container} edges={['bottom']}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <PinchGestureHandler
          onGestureEvent={onPinchGestureEvent}
          onHandlerStateChange={onPinchHandlerStateChange}
        >
          <Animated.View
            style={[
              styles.imageWrap,
              {
                transform: [
                  { scale: Animated.multiply(baseScale, pinchScale) },
                ],
              },
            ]}
          >
            <Image 
              source={{ uri: asana.image }} 
              style={[styles.image, stylesThemed.imageBg]}
              resizeMode="cover"
            />
          </Animated.View>
        </PinchGestureHandler>
        
        <View style={styles.content}>
          {isCompleted && user && (
            <View style={stylesThemed.completedBadge}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={stylesThemed.completedText}>Завършена</Text>
            </View>
          )}

          {asana.description && (
            <Text style={stylesThemed.description}>{asana.description}</Text>
          )}
          
          {!isCosmoenergetics && (
            <>
              <View style={stylesThemed.divider} />
              <View style={styles.timerSection}>
                <Text style={stylesThemed.sectionLabel}>Време за практика</Text>
                <Text style={stylesThemed.timeInfo}>
                  {displayTime} {timeLabel}
                </Text>
                <AsanaTimer 
                  initialSeconds={asana.executionTime} 
                  onComplete={handleAutoComplete}
                  isCosmoenergetics={false}
                />
              </View>
            </>
          )}

          <View style={stylesThemed.divider} />

          <View style={styles.benefitsSection}>
            <Text style={stylesThemed.sectionTitle}>Ползи</Text>
            {asana.benefits.map((benefit, index) => (
              <View key={index} style={styles.benefitItem}>
                <Text style={stylesThemed.bullet}>•</Text>
                <Text style={stylesThemed.benefitText}>{benefit}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: { flex: 1 },
  imageWrap: { width: '100%' },
  image: { width: '100%', aspectRatio: 3 / 4 },
  content: { padding: 20 },
  timerSection: { marginBottom: 8 },
  benefitsSection: { marginBottom: 8 },
  benefitItem: { flexDirection: 'row', marginBottom: 8, alignItems: 'flex-start' },
});
