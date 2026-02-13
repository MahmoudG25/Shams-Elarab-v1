import { db } from '../firebase/config';
import {
  collection,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
  addDoc
} from 'firebase/firestore';

const COLLECTION_NAME = 'roadmaps';

export const roadmapService = {
  getAllRoadmaps: async () => {
    try {
      const snapshot = await getDocs(collection(db, COLLECTION_NAME));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error fetching roadmaps:", error);
      throw error;
    }
  },

  getRoadmapById: async (id) => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
    } catch (error) {
      console.error("Error fetching roadmap:", error);
      throw error;
    }
  },

  createRoadmap: async (data, customId = null) => {
    try {
      if (customId) {
        await setDoc(doc(db, COLLECTION_NAME, customId), data);
        return customId;
      } else {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), data);
        return docRef.id;
      }
    } catch (error) {
      console.error("Error creating roadmap:", error);
      throw error;
    }
  },

  updateRoadmap: async (id, data) => {
    try {
      await updateDoc(doc(db, COLLECTION_NAME, id), data);
    } catch (error) {
      console.error("Error updating roadmap:", error);
      throw error;
    }
  },

  deleteRoadmap: async (id) => {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
      console.error("Error deleting roadmap:", error);
      throw error;
    }
  }
};
