import { 
  doc, 
  setDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  collection,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { getAsanasByCourseId } from './asanaService';

/**
 * Mark asana as completed
 */
export const markAsanaAsCompleted = async (userId, asanaId, courseId, executionTime) => {
  try {
    // Path: users/{userId}/completedAsanas/{asanaId}
    const asanaRef = doc(db, 'users', userId, 'completedAsanas', asanaId);
    await setDoc(asanaRef, {
      asanaId,
      courseId,
      executionTime,
      completedAt: Timestamp.now(),
    });

    // Check if course should be marked as completed
    await checkAndMarkCourseCompleted(userId, courseId);

    return { error: null };
  } catch (error) {
    console.error('Error marking asana as completed:', error);
    return { error: error.message };
  }
};

/**
 * Unmark asana as completed
 */
export const unmarkAsanaAsCompleted = async (userId, asanaId) => {
  try {
    const asanaRef = doc(db, 'users', userId, 'completedAsanas', asanaId);
    
    // Get the courseId before deleting
    const asanaSnap = await getDoc(asanaRef);
    const courseId = asanaSnap.exists() ? asanaSnap.data().courseId : null;

    await deleteDoc(asanaRef);

    // If course was completed, unmark it too
    if (courseId) {
      const courseRef = doc(db, 'users', userId, 'completedCourses', courseId);
      await deleteDoc(courseRef);
    }

    return { error: null };
  } catch (error) {
    console.error('Error unmarking asana as completed:', error);
    return { error: error.message };
  }
};

/**
 * Check if asana is completed
 */
export const isAsanaCompleted = async (userId, asanaId) => {
  try {
    const asanaRef = doc(db, 'users', userId, 'completedAsanas', asanaId);
    const asanaSnap = await getDoc(asanaRef);
    return asanaSnap.exists();
  } catch (error) {
    console.error('Error checking asana completion:', error);
    return false;
  }
};

/**
 * Get all completed asanas (optionally filtered by course)
 */
export const getCompletedAsanas = async (userId, courseId = null) => {
  try {
    const completedAsanasRef = collection(db, 'users', userId, 'completedAsanas');
    const snapshot = await getDocs(completedAsanasRef);
    
    const completedAsanas = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (courseId) {
      return completedAsanas.filter(asana => asana.courseId === courseId);
    }

    return completedAsanas;
  } catch (error) {
    console.error('Error fetching completed asanas:', error);
    return [];
  }
};

/**
 * Get all completed courses
 */
export const getCompletedCourses = async (userId) => {
  try {
    const completedCoursesRef = collection(db, 'users', userId, 'completedCourses');
    const snapshot = await getDocs(completedCoursesRef);
    
    const completedCourses = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return completedCourses;
  } catch (error) {
    console.error('Error fetching completed courses:', error);
    return [];
  }
};

/**
 * Check if all asanas in a course are completed and mark course as completed
 */
export const checkAndMarkCourseCompleted = async (userId, courseId) => {
  try {
    // Get all asanas in the course
    const allAsanas = await getAsanasByCourseId(courseId);
    
    if (allAsanas.length === 0) {
      return { error: null, completed: false };
    }

    // Get completed asanas for this course
    const completedAsanas = await getCompletedAsanas(userId, courseId);
    const completedAsanaIds = completedAsanas.map(asana => asana.asanaId);

    // Check if all asanas are completed
    const allCompleted = allAsanas.every(asana => completedAsanaIds.includes(asana.id));

    if (allCompleted) {
      // Mark course as completed
      const courseRef = doc(db, 'users', userId, 'completedCourses', courseId);
      await setDoc(courseRef, {
        courseId,
        completedAt: Timestamp.now(),
        asanaIds: completedAsanaIds,
      });
      return { error: null, completed: true };
    }

    return { error: null, completed: false };
  } catch (error) {
    console.error('Error checking course completion:', error);
    return { error: error.message, completed: false };
  }
};

