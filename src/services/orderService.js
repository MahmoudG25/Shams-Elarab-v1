import { db } from '../firebase/config';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
  query,
  where,
  orderBy
} from 'firebase/firestore';

const COLLECTION_NAME = 'orders';

export const orderService = {
  // Create a new order
  createOrder: async (orderData) => {
    try {
      const data = {
        ...orderData,
        status: 'pending',
        createdAt: serverTimestamp()
      };
      const docRef = await addDoc(collection(db, COLLECTION_NAME), data);
      return docRef.id;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  },

  // Get all orders (custom filtering can be added)
  getOrders: async (filters = {}) => {
    try {
      let q = collection(db, COLLECTION_NAME);
      // Example: filter by status if provided
      // if (filters.status) { q = query(q, where("status", "==", filters.status)); }

      // Order by NEWEST first
      q = query(q, orderBy("createdAt", "desc"));

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  },

  // Update order status
  updateStatus: async (orderId, newStatus) => {
    try {
      const docRef = doc(db, COLLECTION_NAME, orderId);
      await updateDoc(docRef, { status: newStatus });
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  }
};
