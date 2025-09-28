// components/ImageCard.jsx
import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ImageCard({ image, onDelete }) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: image.url }} style={styles.image} />
      <Text style={styles.title}>{image.title}</Text>
      <TouchableOpacity onPress={() => onDelete(image.id)} style={styles.deleteButton}>
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    backgroundColor: '#222',
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    padding: 8,
  },
  deleteButton: {
    backgroundColor: '#ff6b6b',
    padding: 8,
    alignItems: 'center',
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
