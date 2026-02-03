import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/auth';
import { logoutUser, deleteUserAccount } from '../services/authService';
import { deleteUserData } from '../services/userService';
import { getCompletedCourses, getCompletedAsanas } from '../services/progressService';
import { getCourseById } from '../services/courseService';
import { getAsanasByCourseId } from '../services/asanaService';
import Profile from '../componenets/Profile';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [completedCourses, setCompletedCourses] = useState([]);
  const [completedCoursesData, setCompletedCoursesData] = useState([]);
  const [startedCourses, setStartedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProgress = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Зареди завършените курсове
        const completed = await getCompletedCourses(user.uid);
        setCompletedCourses(completed);

        // Зареди пълните данни за завършените курсове
        const coursesData = await Promise.all(
          completed.map(async (completedCourse) => {
            const courseData = await getCourseById(completedCourse.courseId);
            return courseData;
          })
        );

        // Филтрирай null стойностите (ако курсът е изтрит)
        setCompletedCoursesData(coursesData.filter(course => course !== null));

        // Зареди завършените асани (за започнати курсове)
        const completedAsanas = await getCompletedAsanas(user.uid);
        const completedCourseIds = new Set(completed.map(c => c.courseId));

        // Уникални courseId, за които има поне една завършена асана,
        // но курсът все още не е в списъка със завършени
        const courseIdsWithCompletedAsanas = Array.from(
          new Set(completedAsanas.map(a => a.courseId).filter(Boolean))
        ).filter(courseId => !completedCourseIds.has(courseId));

        const started = [];

        for (const courseId of courseIdsWithCompletedAsanas) {
          const [courseData, allAsanas] = await Promise.all([
            getCourseById(courseId),
            getAsanasByCourseId(courseId),
          ]);

          if (!courseData || !allAsanas || allAsanas.length === 0) continue;

          const completedForCourse = completedAsanas.filter(a => a.courseId === courseId);

          // Ако има поне една, но не всички асани са завършени -> започнат курс
          if (completedForCourse.length > 0 && completedForCourse.length < allAsanas.length) {
            started.push({
              id: courseId,
              title: courseData.title,
              completedCount: completedForCourse.length,
              totalCount: allAsanas.length,
            });
          }
        }

        setStartedCourses(started);
      } catch (error) {
        console.error('Error loading progress:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, [user]);

  const handleEdit = () => {
    if (user) {
      navigation.navigate('EditProfile');
    } else {
      navigation.navigate('AuthTab');
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Изход',
      'Сигурни ли сте, че искате да излезете?',
      [
        {
          text: 'Отказ',
          style: 'cancel',
        },
        {
          text: 'Излез',
          style: 'destructive',
          onPress: async () => {
            const result = await logoutUser();
            if (result.error) {
              Alert.alert('Грешка', result.error);
            } else {
              navigation.navigate('HomeTab');
            }
          },
        },
      ]
    );
  };

  const handleDelete = async () => {
    Alert.alert(
      'Изтриване на профил',
      'Сигурни ли сте, че искате да изтриете профила си? Това действие е необратимо и всички ваши данни ще бъдат загубени.',
      [
        {
          text: 'Отказ',
          style: 'cancel',
        },
        {
          text: 'Изтрий',
          style: 'destructive',
          onPress: async () => {
            if (!user) return;

            try {
              // Изтрий данните от Firestore
              const deleteDataResult = await deleteUserData(user.uid);
              if (deleteDataResult.error) {
                Alert.alert('Грешка', `Грешка при изтриване на данни: ${deleteDataResult.error}`);
                return;
              }

              // Изтрий акаунта от Firebase Auth
              const deleteAccountResult = await deleteUserAccount();
              if (deleteAccountResult.error) {
                Alert.alert('Грешка', deleteAccountResult.error);
                return;
              }

              // Успешно изтриване
              Alert.alert(
                'Профилът е изтрит',
                'Вашият профил е изтрит успешно.',
                [
                  {
                    text: 'OK',
                    onPress: () => navigation.navigate('HomeTab'),
                  },
                ]
              );
            } catch (error) {
              Alert.alert('Грешка', error.message || 'Възникна грешка при изтриването на профила.');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['top', 'bottom']}>
      <Profile 
        user={user} 
        onEdit={handleEdit} 
        onLogout={handleLogout}
        onDelete={handleDelete}
        completedCourses={completedCourses}
        completedCoursesData={completedCoursesData}
        startedCourses={startedCourses}
      />
    </SafeAreaView>
  );
}


