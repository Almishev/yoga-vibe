import { useEffect, useRef } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';
import { showNotification } from '../services/notificationService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LAST_COURSE_TIMESTAMP_KEY = '@yoga_vibe:last_course_timestamp';

export const useCourseNotifications = () => {
  const isInitialMount = useRef(true);
  const lastTimestampRef = useRef(null);

  useEffect(() => {
    const loadLastTimestamp = async () => {
      try {
        const stored = await AsyncStorage.getItem(LAST_COURSE_TIMESTAMP_KEY);
        if (stored) {
          lastTimestampRef.current = parseInt(stored, 10);
        }
      } catch (error) {
        console.error('Error loading last timestamp:', error);
      }
    };

    loadLastTimestamp();

    const coursesRef = collection(db, 'courses');
    const q = query(coursesRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (isInitialMount.current) {
          isInitialMount.current = false;
          if (snapshot.docs.length > 0) {
            const latestCourse = snapshot.docs[0];
            const latestTimestamp = latestCourse.data().createdAt;
            const timestampMillis = latestTimestamp?.toMillis?.() || latestTimestamp;
            lastTimestampRef.current = timestampMillis;
            AsyncStorage.setItem(LAST_COURSE_TIMESTAMP_KEY, timestampMillis.toString());
          }
          return;
        }

        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const courseData = change.doc.data();
            const courseTitle = courseData.title || 'Нов курс';
            const courseId = change.doc.id;
            const createdAt = courseData.createdAt;
            const timestampMillis = createdAt?.toMillis?.() || createdAt;

            if (lastTimestampRef.current === null || timestampMillis > lastTimestampRef.current) {
              console.log('New course detected:', courseTitle);
              showNotification(
                'Нов курс! 🧘‍♀️',
                `${courseTitle} е добавен. Започнете да практикувате!`,
                { courseId, type: 'new_course' }
              ).catch((error) => {
                console.error('Failed to show notification:', error);
              });

              lastTimestampRef.current = timestampMillis;
              AsyncStorage.setItem(LAST_COURSE_TIMESTAMP_KEY, timestampMillis.toString());
            }
          }
        });
      },
      (error) => {
        console.error('Error listening to courses:', error);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);
};

