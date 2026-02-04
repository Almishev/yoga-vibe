import { 
  collection, 
  getDocs, 
  getDoc,
  doc
} from 'firebase/firestore';
import { db } from './firebase';


export const getAllCourses = async () => {
  try {
    const coursesRef = collection(db, 'courses');
    const snapshot = await getDocs(coursesRef);
    
    
    if (snapshot.empty) {
      return [];
    }
    
    const courses = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
  
    return courses.sort((a, b) => {
      const aTime = a.createdAt?.toMillis?.() || a.createdAt || 0;
      const bTime = b.createdAt?.toMillis?.() || b.createdAt || 0;
      return bTime - aTime; 
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
   
    return [];
  }
};


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

