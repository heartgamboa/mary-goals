import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  getDocs,
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

export const votingService = {
  // Vote on a performance
  votePerformance: async (performanceId, userId, voteType, rating, comment) => {
    try {
      // Check if user already voted
      const existingVoteQuery = query(
        collection(db, 'votes'),
        where('performanceId', '==', performanceId),
        where('userId', '==', userId)
      );
      const existingVotes = await getDocs(existingVoteQuery);
      
      if (!existingVotes.empty) {
        // Update existing vote
        const voteDoc = existingVotes.docs[0];
        await updateDoc(doc(db, 'votes', voteDoc.id), {
          voteType,
          rating,
          comment,
          updatedAt: new Date(),
        });
        return voteDoc.id;
      } else {
        // Create new vote
        const voteData = {
          performanceId,
          userId,
          voteType, // 'like', 'dislike', 'love', 'amazing'
          rating, // 1-5 stars
          comment,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        const docRef = await addDoc(collection(db, 'votes'), voteData);
        return docRef.id;
      }
    } catch (error) {
      console.error('Error voting on performance:', error);
      throw error;
    }
  },

  // Get votes for a performance
  getPerformanceVotes: (performanceId, callback) => {
    const q = query(
      collection(db, 'votes'),
      where('performanceId', '==', performanceId)
    );
    
    return onSnapshot(q, (snapshot) => {
      const votes = [];
      snapshot.forEach((doc) => {
        votes.push({ id: doc.id, ...doc.data() });
      });
      callback(votes);
    });
  },

  // Get user's votes
  getUserVotes: (userId, callback) => {
    const q = query(
      collection(db, 'votes'),
      where('userId', '==', userId)
    );
    
    return onSnapshot(q, (snapshot) => {
      const votes = [];
      snapshot.forEach((doc) => {
        votes.push({ id: doc.id, ...doc.data() });
      });
      callback(votes);
    });
  },

  // Remove vote
  removeVote: async (voteId) => {
    try {
      await deleteDoc(doc(db, 'votes', voteId));
    } catch (error) {
      console.error('Error removing vote:', error);
      throw error;
    }
  },

  // Get performance statistics
  getPerformanceStats: async (performanceId) => {
    try {
      const votesQuery = query(
        collection(db, 'votes'),
        where('performanceId', '==', performanceId)
      );
      const votesSnapshot = await getDocs(votesQuery);
      
      const stats = {
        totalVotes: 0,
        likes: 0,
        dislikes: 0,
        loves: 0,
        amazings: 0,
        averageRating: 0,
        comments: [],
      };
      
      let totalRating = 0;
      let ratingCount = 0;
      
      votesSnapshot.forEach((doc) => {
        const vote = doc.data();
        stats.totalVotes++;
        
        if (vote.voteType === 'like') stats.likes++;
        else if (vote.voteType === 'dislike') stats.dislikes++;
        else if (vote.voteType === 'love') stats.loves++;
        else if (vote.voteType === 'amazing') stats.amazings++;
        
        if (vote.rating) {
          totalRating += vote.rating;
          ratingCount++;
        }
        
        if (vote.comment) {
          stats.comments.push({
            id: doc.id,
            comment: vote.comment,
            userId: vote.userId,
            createdAt: vote.createdAt,
          });
        }
      });
      
      if (ratingCount > 0) {
        stats.averageRating = totalRating / ratingCount;
      }
      
      return stats;
    } catch (error) {
      console.error('Error getting performance stats:', error);
      throw error;
    }
  },
};
