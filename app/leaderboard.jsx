import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import BottomTabNavigator from '../components/BottomTabNavigator';

export default function LeaderboardScreen() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState('all');
  const { currentUser, userProfile } = useAuth();

  const categories = [
    { key: 'all', label: 'All Categories' },
    { key: 'dance', label: 'Dance' },
    { key: 'fitness', label: 'Fitness' },
    { key: 'gymnastics', label: 'Gymnastics' },
    { key: 'martial-arts', label: 'Martial Arts' },
  ];

  const timeframes = [
    { key: 'all', label: 'All Time' },
    { key: 'week', label: 'This Week' },
    { key: 'month', label: 'This Month' },
  ];

  useEffect(() => {
    const loadLeaderboard = () => {
      let q = query(
        collection(db, 'users'),
        orderBy('points', 'desc'),
        limit(50)
      );

      const unsubscribe = onSnapshot(q, {
        next: (snapshot) => {
          const users = [];
          snapshot.forEach((doc) => {
            const userData = doc.data();
            if (userData.role === 'student') {
              users.push({
                id: doc.id,
                ...userData,
                rank: users.length + 1,
              });
            }
          });
          setLeaderboard(users);
        },
        error: (error) => {
          console.error('Leaderboard snapshot error:', error);
        }
      });

      return unsubscribe;
    };

    const unsubscribe = loadLeaderboard();
    return () => unsubscribe();
  }, [selectedCategory, selectedTimeframe]);

  const getRankIcon = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getBadges = (user) => {
    const badges = [];
    if (user.totalPerformances >= 10) badges.push('🎭');
    if (user.totalPerformances >= 25) badges.push('⭐');
    if (user.totalPerformances >= 50) badges.push('🏆');
    if (user.points >= 100) badges.push('💎');
    if (user.points >= 500) badges.push('👑');
    return badges;
  };

  const renderLeaderboardItem = ({ item, index }) => {
    const badges = getBadges(item);
    const isCurrentUser = currentUser?.uid === item.id;

    return (
      <View style={[
        styles.leaderboardItem,
        isCurrentUser && styles.currentUserItem
      ]}>
        <View style={styles.rankContainer}>
          <Text style={styles.rankIcon}>{getRankIcon(item.rank)}</Text>
        </View>

        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {item.firstName?.charAt(0) || item.email?.charAt(0)}
            </Text>
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>
              {item.firstName} {item.lastName}
            </Text>
            <Text style={styles.userEmail}>{item.email}</Text>
            <Text style={styles.userSchool}>{item.school}</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{item.points || 0}</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{item.totalPerformances || 0}</Text>
            <Text style={styles.statLabel}>Videos</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{item.totalVotes || 0}</Text>
            <Text style={styles.statLabel}>Votes</Text>
          </View>
        </View>

        <View style={styles.badgesContainer}>
          {badges.map((badge, index) => (
            <Text key={index} style={styles.badge}>{badge}</Text>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Leaderboard</Text>
        <Text style={styles.headerSubtitle}>Top Performers</Text>
      </View>

      {/* Category Filter */}
      <View style={styles.filterContainer}>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedCategory === item.key && styles.activeFilterButton
              ]}
              onPress={() => setSelectedCategory(item.key)}
            >
              <Text style={[
                styles.filterButtonText,
                selectedCategory === item.key && styles.activeFilterButtonText
              ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Timeframe Filter */}
      <View style={styles.filterContainer}>
        <FlatList
          data={timeframes}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedTimeframe === item.key && styles.activeFilterButton
              ]}
              onPress={() => setSelectedTimeframe(item.key)}
            >
              <Text style={[
                styles.filterButtonText,
                selectedTimeframe === item.key && styles.activeFilterButtonText
              ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        data={leaderboard}
        keyExtractor={(item) => item.id}
        renderItem={renderLeaderboardItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No performers yet</Text>
            <Text style={styles.emptySubtext}>Be the first to share your talent!</Text>
          </View>
        }
      />

      <BottomTabNavigator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#888',
  },
  filterContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1a1a1a',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  activeFilterButton: {
    backgroundColor: '#ff6b6b',
    borderColor: '#ff6b6b',
  },
  filterButtonText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '500',
  },
  activeFilterButtonText: {
    color: '#fff',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  currentUserItem: {
    borderColor: '#ff6b6b',
    backgroundColor: '#1a0a0a',
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
  },
  rankIcon: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ff6b6b',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  userEmail: {
    color: '#888',
    fontSize: 12,
    marginBottom: 2,
  },
  userSchool: {
    color: '#666',
    fontSize: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  statItem: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  statValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#888',
    fontSize: 10,
    marginTop: 2,
  },
  badgesContainer: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  badge: {
    fontSize: 16,
    marginLeft: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#888',
  },
});
