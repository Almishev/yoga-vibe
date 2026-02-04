import { 
  collection, 
  getDocs, 
  getDoc,
  doc,
  query,
  where
} from 'firebase/firestore';
import { db } from './firebase';


export const getAllAsanas = async () => {
  try {
    const asanasRef = collection(db, 'asanas');
    const snapshot = await getDocs(asanasRef);
    

    if (snapshot.empty) {
      return [];
    }
    
    const asanas = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
  
    return asanas.sort((a, b) => {
      const aTime = a.createdAt?.toMillis?.() || a.createdAt || 0;
      const bTime = b.createdAt?.toMillis?.() || b.createdAt || 0;
      return bTime - aTime; 
    });
  } catch (error) {
    console.error('Error fetching asanas:', error);
   
    return [];
  }
};


export const getAsanasByCourseId = async (courseId) => {
  try {
    const asanasRef = collection(db, 'asanas');
    const q = query(asanasRef, where('courseId', '==', courseId));
    const snapshot = await getDocs(q);
    
    const asanas = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
   
    return asanas.sort((a, b) => {
      const aTime = a.createdAt?.toMillis?.() || a.createdAt || 0;
      const bTime = b.createdAt?.toMillis?.() || b.createdAt || 0;
      return aTime - bTime; 
    });
  } catch (error) {
    console.error('Error fetching asanas by course:', error);
    
    return [];
  }
};


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

