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
  orderBy,
  deleteDoc
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
  updateStatus: async (orderId, newStatus, accessLink = null) => {
    try {
      const docRef = doc(db, COLLECTION_NAME, orderId);
      const updateData = { status: newStatus };
      if (accessLink) {
        updateData.accessLink = accessLink;
      }
      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  },

  // Find order by ID or Phone
  findOrder: async (searchQuery) => {
    try {
      // 1. Try to get by Document ID directly
      const docRef = doc(db, COLLECTION_NAME, searchQuery.trim());
      const docSnap = await getDocs(query(collection(db, COLLECTION_NAME), where('__name__', '==', searchQuery.trim())));

      if (!docSnap.empty) {
        const docData = docSnap.docs[0];
        return { id: docData.id, ...docData.data() };
      }

      // 2. Try to search by Phone
      const phoneQuery = query(collection(db, COLLECTION_NAME), where('customerPhone', '==', searchQuery.trim()));
      const phoneSnap = await getDocs(phoneQuery);

      if (!phoneSnap.empty) {
        // Return the most recent order if multiple match
        const orders = phoneSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        orders.sort((a, b) => b.createdAt - a.createdAt);
        return orders[0];
      }

      return null;
    } catch (error) {
      console.error("Error searching order:", error);
      throw error;
    }
  },

  // Delete order
  deleteOrder: async (orderId) => {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, orderId));
    } catch (error) {
      console.error("Error deleting order:", error);
      throw error;
    }
  }
};
