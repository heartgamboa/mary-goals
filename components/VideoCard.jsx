import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  TextInput,
  Modal,
  Image,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { videoService } from '../services/videoService';
import { votingService } from '../services/votingService';
import { collection, query, where, getDocs } from 'firebase/firestore';

const { width } = Dimensions.get('window');

export default function VideoCard({ video, onEdit, onDelete }) {
  const [showVotingModal, setShowVotingModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTitle, setEditTitle] = useState(video.title || '');
  const [editDescription, setEditDescription] = useState(video.description || '');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [voteStats, setVoteStats] = useState({
    totalVotes: 0,
    likes: 0,
    averageRating: 0,
  });
  const [userVote, setUserVote] = useState(null);
  const { currentUser, userProfile } = useAuth();

  const isOwner = currentUser?.uid === video.userId;

  useEffect(() => {
    // Load vote statistics
    const loadVoteStats = async () => {
      try {
        const stats = await votingService.getPerformanceStats(video.id);
        setVoteStats(stats);
      } catch (error) {
        console.error('Error loading vote stats:', error);
      }
    };

    // Load user's vote
    const loadUserVote = async () => {
      if (currentUser) {
        try {
          const votesQuery = query(
            collection(db, 'votes'),
            where('performanceId', '==', video.id),
            where('userId', '==', currentUser.uid)
          );
          const votesSnapshot = await getDocs(votesQuery);
          if (!votesSnapshot.empty) {
            const vote = votesSnapshot.docs[0].data();
            setUserVote(vote);
            setRating(vote.rating || 0);
            setComment(vote.comment || '');
          }
        } catch (error) {
          console.error('Error loading user vote:', error);
        }
      }
    };

    loadVoteStats();
    loadUserVote();
  }, [0, currentUser]);

  // Removed video-related functions since we're using images now

  const handleVote = async (voteType) => {
    if (!currentUser) {
      Alert.alert('Error', 'Please sign in to vote');
      return;
    }

    try {
      await votingService.votePerformance(
        
        currentUser.uid,
        voteType,
        rating,
        comment
      );
      setShowVotingModal(false);
      Alert.alert('Success', 'Your vote has been recorded!');
    } catch (error) {
      Alert.alert('Error', 'Failed to submit vote');
    }
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleEdit = () => {
    setEditTitle(video.title || '');
    setEditDescription(video.description || '');
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }

    try {
      await videoService.updateImagePost(video.id, {
        title: editTitle.trim(),
        description: editDescription.trim(),
      });
      setShowEditModal(false);
      Alert.alert('Success', 'Photo updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update photo');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Photo',
      'Are you sure you want to delete this photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await videoService.deleteImagePost(video.id);
              onDelete?.(video.id);
              Alert.alert('Success', 'Photo deleted successfully!');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete photo');
            }
          }
        },
      ]
    );
  };

  const formatDate = (timestamp) => {
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: video.imageURL || video.videoURL }}
          style={styles.image}
          resizeMode="cover"
        />
        
        <View style={styles.imageOverlay}>
          <Text style={styles.imageTypeText}>
            {video.type === 'image' ? '📸 Photo' : '🎭 Performance'}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Text style={styles.userEmail}>{video.userEmail}</Text>
            <Text style={styles.date}>{formatDate(video.createdAt)}</Text>
          </View>
          
          {isOwner && (
            <View style={styles.actions}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={handleEdit}
              >
                <Text style={styles.actionText}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={handleDelete}
              >
                <Text style={styles.actionText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <Text style={styles.title}>{video.title}</Text>
        {video.description && (
          <Text style={styles.description}>{video.description}</Text>
        )}

        {/* Performance Info */}
        <View style={styles.performanceInfo}>
          <Text style={styles.category}>Category: {video.category || 'Dance'}</Text>
          <Text style={styles.skillLevel}>Level: {video.skillLevel || 'Beginner'}</Text>
        </View>

        {/* Voting Stats */}
        <View style={styles.votingStats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{voteStats.totalVotes}</Text>
            <Text style={styles.statLabel}>Votes</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{voteStats.likes}</Text>
            <Text style={styles.statLabel}>Likes</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{voteStats.averageRating.toFixed(1)}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        {/* Voting Actions */}
        {!isOwner && currentUser && (
          <View style={styles.votingActions}>
            <TouchableOpacity
              style={styles.voteButton}
              onPress={() => setShowVotingModal(true)}
            >
              <Text style={styles.voteButtonText}>
                {userVote ? 'Update Vote' : 'Vote & Rate'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Voting Modal */}
      <Modal
        visible={showVotingModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowVotingModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Rate This Performance</Text>
            
            {/* Star Rating */}
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingLabel}>Rating:</Text>
              <View style={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => handleRatingChange(star)}
                    style={styles.star}
                  >
                    <Text style={[
                      styles.starText,
                      star <= rating && styles.starFilled
                    ]}>
                      ⭐
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Comment */}
            <View style={styles.commentContainer}>
              <Text style={styles.commentLabel}>Comment (optional):</Text>
              <TextInput
                style={styles.commentInput}
                value={comment}
                onChangeText={setComment}
                placeholder="Share your thoughts..."
                multiline
                numberOfLines={3}
                placeholderTextColor="#666"
              />
            </View>

            {/* Vote Buttons */}
            <View style={styles.voteButtons}>
              <TouchableOpacity
                style={[styles.voteTypeButton, styles.likeButton]}
                onPress={() => handleVote('like')}
              >
                <Text style={styles.voteTypeText}>👍 Like</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.voteTypeButton, styles.loveButton]}
                onPress={() => handleVote('love')}
              >
                <Text style={styles.voteTypeText}>❤️ Love</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.voteTypeButton, styles.amazingButton]}
                onPress={() => handleVote('amazing')}
              >
                <Text style={styles.voteTypeText}>🔥 Amazing</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowVotingModal(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Edit Modal */}
      <Modal
        visible={showEditModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Photo</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Title *</Text>
              <TextInput
                style={styles.modalInput}
                value={editTitle}
                onChangeText={setEditTitle}
                placeholder="Enter photo title"
                placeholderTextColor="#666"
                maxLength={100}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.modalInput, styles.textArea]}
                value={editDescription}
                onChangeText={setEditDescription}
                placeholder="Describe your photo..."
                placeholderTextColor="#666"
                multiline
                numberOfLines={3}
                maxLength={500}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveEdit}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a1a',
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: width * 0.6,
    backgroundColor: '#000',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  imageTypeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flex: 1,
  },
  userEmail: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  date: {
    color: '#888',
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    color: '#ccc',
    fontSize: 16,
    lineHeight: 22,
  },
  performanceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 8,
  },
  category: {
    color: '#ff6b6b',
    fontSize: 14,
    fontWeight: '600',
  },
  skillLevel: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
  },
  votingStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#333',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
  votingActions: {
    marginTop: 12,
  },
  voteButton: {
    backgroundColor: '#ff6b6b',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  voteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  ratingContainer: {
    marginBottom: 20,
  },
  ratingLabel: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
  },
  stars: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  star: {
    padding: 4,
  },
  starText: {
    fontSize: 24,
    color: '#666',
  },
  starFilled: {
    color: '#ffd700',
  },
  commentContainer: {
    marginBottom: 20,
  },
  commentLabel: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
  },
  commentInput: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 16,
    textAlignVertical: 'top',
  },
  voteButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  voteTypeButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  likeButton: {
    backgroundColor: '#4CAF50',
  },
  loveButton: {
    backgroundColor: '#E91E63',
  },
  amazingButton: {
    backgroundColor: '#FF9800',
  },
  voteTypeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  closeButton: {
    backgroundColor: '#333',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Edit Modal Styles
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '600',
  },
  modalInput: {
    backgroundColor: '#2a2a2a',
    color: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#666',
  },
  saveButton: {
    backgroundColor: '#ff6b6b',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
