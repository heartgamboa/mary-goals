import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  onSnapshot,
  where 
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

export const videoService = {
  // Simple image upload - no Firebase Storage needed
  uploadImage: async (uri, userId) => {
    try {
      console.log('📸 Starting image upload...');
      console.log('📱 Image URI:', uri);
      console.log('👤 User ID:', userId);
      
      // For images, we just return the local URI
      // In a real app, you might want to upload to a different service
      console.log('✅ Using local image URI:', uri);
      return uri;
    } catch (error) {
      console.error('❌ Error with image:', error);
      throw new Error(`Image processing failed: ${error.message}`);
    }
  },

  // Create image post in Firestore
  createImagePost: async (imageData) => {
    try {
      const docRef = await addDoc(collection(db, 'images'), {
        ...imageData,
        votes: 0,
        likes: 0,
        averageRating: 0,
        comments: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating image post:', error);
      throw error;
    }
  },

  // Get all images with real-time updates
  getImages: (callback) => {
    const q = query(collection(db, 'images'), orderBy('createdAt', 'desc'));
    
    return onSnapshot(q, (snapshot) => {
      const images = [];
      snapshot.forEach((doc) => {
        images.push({ id: doc.id, ...doc.data() });
      });
      callback(images);
    });
  },

  // Get user's images
  getUserImages: (userId, callback) => {
    const q = query(
      collection(db, 'images'), 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const images = [];
      snapshot.forEach((doc) => {
        images.push({ id: doc.id, ...doc.data() });
      });
      callback(images);
    });
  },

  // Update image post
  updateImagePost: async (imageId, updateData) => {
    try {
      const imageRef = doc(db, 'images', imageId);
      await updateDoc(imageRef, {
        ...updateData,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating image post:', error);
      throw error;
    }
  },

  // Delete image post
  deleteImagePost: async (imageId) => {
    try {
      await deleteDoc(doc(db, 'images', imageId));
    } catch (error) {
      console.error('Error deleting image post:', error);
      throw error;
    }
  },
};
