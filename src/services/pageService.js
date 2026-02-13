import { db } from '../firebase/config';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';

const COLLECTION_NAME = 'pages';

export const pageService = {
  // Get page data by document ID (e.g., 'home')
  getPageData: async (pageId) => {
    try {
      const docRef = doc(db, COLLECTION_NAME, pageId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() : null;
    } catch (error) {
      console.error(`Error fetching page ${pageId}:`, error);
      throw error;
    }
  },

  // Update page data
  updatePageData: async (pageId, data) => {
    try {
      const docRef = doc(db, COLLECTION_NAME, pageId);
      // setDoc with merge:true is safer if document doesn't exist yet
      await setDoc(docRef, data, { merge: true });
    } catch (error) {
      console.error(`Error updating page ${pageId}:`, error);
      throw error;
    }
  }
};
