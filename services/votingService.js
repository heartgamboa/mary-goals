import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  onSnapshot,
  setDoc,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

export const votingService = {
  // Vote on a performance
  votePerformance: async (performanceId, userId, voteType, rating, comment) => {
    try {
      const safeVoteType = voteType ?? 0;
      const safeRating = rating ?? 0;
      const safeComment = typeof comment === 'string' ? comment : '';

      const q = query(
        collection(db, 'votes'),
        where('performanceId', '==', performanceId),
        where('userId', '==', userId)
      );

      const existingVotes = await getDocs(q);

      if (!existingVotes.empty) {
        const voteDoc = existingVotes.docs[0];
        await updateDoc(doc(db, 'votes', voteDoc.id), {
          voteType: safeVoteType,
          rating: safeRating,
          comment: safeComment,
          updatedAt: new Date(),
        });
        return voteDoc.id;
      } else {
     const voteData = {
  performanceId,
  userId,      // Must be equal to the authenticated user ID
  voteType: safeVoteType,
  rating: safeRating,
  comment: safeComment,
  createdAt: new Date(),
  updatedAt: new Date(),
};

        const docRef = await addDoc(collection(db, 'votes'), voteData);
        return docRef.id;
      }
    } catch (error) {
      console.error('❌ Error voting on performance:', error);
      throw error;
    }
  },

  // Get votes for a performance
  getPerformanceVotes: (performanceId, callback) => {
    const q = query(collection(db, 'votes'), where('performanceId', '==', performanceId));

    return onSnapshot(
      q,
      snapshot => {
        const votes = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            voteType: data.voteType ?? 0,
            rating: data.rating ?? 0,
            comment: data.comment ?? '',
            userId: data.userId,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          };
        });
        callback(votes);
      },
      error => {
        console.error('Performance votes snapshot error:', error);
      }
    );
  },

  // Get user's votes
  getUserVotes: (userId, callback) => {
    const q = query(collection(db, 'votes'), where('userId', '==', userId));

    return onSnapshot(
      q,
      snapshot => {
        const votes = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            voteType: data.voteType ?? 0,
            rating: data.rating ?? 0,
            comment: data.comment ?? '',
            performanceId: data.performanceId,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          };
        });
        callback(votes);
      },
      error => {
        console.error('User votes snapshot error:', error);
      }
    );
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

  // ✅ Get performance statistics and store in Firestore
  getPerformanceStats: async (performanceId) => {
    try {
      if (!performanceId || typeof performanceId !== 'string') {
        throw new Error('Invalid performanceId');
      }

      const q = query(collection(db, 'votes'), where('performanceId', '==', performanceId));
      const snapshot = await getDocs(q);

      const stats = {
        performanceId,
        totalVotes: 0,
        likes: 0,
        dislikes: 0,
        loves: 0,
        amazings: 0,
        averageRating: 0,
        comments: [],
        updatedAt: new Date(),
      };

      let totalRating = 0;
      let ratingCount = 0;

      snapshot.forEach(docSnap => {
        const vote = docSnap.data();
        stats.totalVotes++;

        // Handle voteType (make sure it's consistent across codebase)
        switch (vote.voteType) {
          case 'like': stats.likes++; break;
          case 'dislike': stats.dislikes++; break;
          case 'love': stats.loves++; break;
          case 'amazing': stats.amazings++; break;
        }

        if (typeof vote.rating === 'number') {
          totalRating += vote.rating;
          ratingCount++;
        }

        if (vote.comment && vote.comment.trim() !== '') {
          stats.comments.push({
            id: docSnap.id,
            comment: vote.comment,
            userId: vote.userId,
            createdAt: vote.createdAt,
          });
        }
      });

      if (ratingCount > 0) {
        stats.averageRating = totalRating / ratingCount;
      }

      // ✅ Save to Firestore
      await setDoc(doc(db, 'performanceStats', performanceId), stats);

      return stats;
    } catch (error) {
      console.error('Error getting performance stats:', error);
      throw error;
    }
  },
};
