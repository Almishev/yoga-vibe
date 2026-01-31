import { 
  collection, 
  getDocs, 
  getDoc,
  doc,
  query,
  where
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Get all asanas
 */
export const getAllAsanas = async () => {
  try {
    const asanasRef = collection(db, 'asanas');
    const snapshot = await getDocs(asanasRef);
    
    // Ако няма документи, върни празен масив веднага
    if (snapshot.empty) {
      return [];
    }
    
    const asanas = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Сортирай локално по createdAt, ако съществува
    return asanas.sort((a, b) => {
      const aTime = a.createdAt?.toMillis?.() || a.createdAt || 0;
      const bTime = b.createdAt?.toMillis?.() || b.createdAt || 0;
      return bTime - aTime; // desc
    });
  } catch (error) {
    console.error('Error fetching asanas:', error);
    // Ако има грешка, върни празен масив вместо да хвърляш грешка
    return [];
  }
};

/**
 * Get asanas by course ID
 */
export const getAsanasByCourseId = async (courseId) => {
  try {
    const asanasRef = collection(db, 'asanas');
    const q = query(asanasRef, where('courseId', '==', courseId));
    const snapshot = await getDocs(q);
    
    const asanas = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Сортирай локално по createdAt, ако съществува
    return asanas.sort((a, b) => {
      const aTime = a.createdAt?.toMillis?.() || a.createdAt || 0;
      const bTime = b.createdAt?.toMillis?.() || b.createdAt || 0;
      return aTime - bTime; // asc
    });
  } catch (error) {
    console.error('Error fetching asanas by course:', error);
    // Ако има грешка, върни празен масив вместо да хвърляш грешка
    return [];
  }
};

/**
 * Get asana by ID
 */
export const getAsanaById = async (asanaId) => {
  try {
    const asanaRef = doc(db, 'asanas', asanaId);
    const asanaSnap = await getDoc(asanaRef);
    
    if (!asanaSnap.exists()) {
      return null;
    }
    
    return {
      id: asanaSnap.id,
      ...asanaSnap.data()
    };
  } catch (error) {
    console.error('Error fetching asana:', error);
    return null;
  }
};

