import { db } from '../firebase/config';
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  setDoc
} from 'firebase/firestore';

const COLLECTION_NAME = 'courses';

export const courseService = {
  // Get all courses
  getAllCourses: async (onlyPublished = true) => {
    try {
      const coursesRef = collection(db, COLLECTION_NAME);
      // In a real app, you might query by isPublished. 
      // For now, fetching all and filtering client-side or if simple:
      // const q = onlyPublished ? query(coursesRef, where("isPublished", "==", true)) : coursesRef;

      const snapshot = await getDocs(coursesRef);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error fetching courses:", error);
      throw error;
    }
  },

  // Get a single course by ID
  getCourseById: async (id) => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching course:", error);
      throw error;
    }
  },

  // Create a new course
  // We use setDoc if we want to specify the ID, or addDoc for auto-ID
  createCourse: async (courseData, customId = null) => {
    try {
      if (customId) {
        await setDoc(doc(db, COLLECTION_NAME, customId), courseData);
        return customId;
      } else {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), courseData);
        return docRef.id;
      }
    } catch (error) {
      console.error("Error creating course:", error);
      throw error;
    }
  },

  // Update a course
  updateCourse: async (id, courseData) => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, courseData);
    } catch (error) {
      console.error("Error updating course:", error);
      throw error;
    }
  },

  // Delete a course
  deleteCourse: async (id) => {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
      console.error("Error deleting course:", error);
      throw error;
    }
  }
};
