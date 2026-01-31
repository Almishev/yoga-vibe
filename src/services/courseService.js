import { 
  collection, 
  getDocs, 
  getDoc,
  doc
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Get all courses
 */
export const getAllCourses = async () => {
  try {
    const coursesRef = collection(db, 'courses');
    const snapshot = await getDocs(coursesRef);
    
    // Ако няма документи, върни празен масив веднага
    if (snapshot.empty) {
      return [];
    }
    
    const courses = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Сортирай локално по createdAt, ако съществува
    return courses.sort((a, b) => {
      const aTime = a.createdAt?.toMillis?.() || a.createdAt || 0;
      const bTime = b.createdAt?.toMillis?.() || b.createdAt || 0;
      return bTime - aTime; // desc
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    // Ако има грешка, върни празен масив вместо да хвърляш грешка
    return [];
  }
};

/**
 * Get course by ID
 */
export const getCourseById = async (courseId) => {
  try {
    const courseRef = doc(db, 'courses', courseId);
    const courseSnap = await getDoc(courseRef);
    
    if (!courseSnap.exists()) {
      return null;
    }
    
    return {
      id: courseSnap.id,
      ...courseSnap.data()
    };
  } catch (error) {
    console.error('Error fetching course:', error);
    return null;
  }
};

