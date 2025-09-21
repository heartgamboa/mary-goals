import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import { videoService } from '../services/videoService';
// Removed test storage import
import BottomTabNavigator from '../components/BottomTabNavigator';
import { router } from 'expo-router';

export default function UploadScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUri, setVideoUri] = useState(null);
  const [category, setCategory] = useState('dance');
  const [skillLevel, setSkillLevel] = useState('beginner');
  const [uploading, setUploading] = useState(false);
  const { currentUser, userProfile } = useAuth();

  const categories = [
    { key: 'dance', label: 'Dance' },
    { key: 'fitness', label: 'Fitness' },
    { key: 'gymnastics', label: 'Gymnastics' },
    { key: 'martial-arts', label: 'Martial Arts' },
    { key: 'yoga', label: 'Yoga' },
    { key: 'other', label: 'Other' },
  ];

  const skillLevels = [
    { key: 'beginner', label: 'Beginner' },
    { key: 'intermediate', label: 'Intermediate' },
    { key: 'advanced', label: 'Advanced' },
    { key: 'expert', label: 'Expert' },
  ];

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
        aspect: [4, 3],
      });

      if (!result.canceled) {
        setVideoUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  // Removed test storage function

  const uploadImage = async () => {
    if (!videoUri || !title.trim()) {
      Alert.alert('Error', 'Please select an image and enter a title');
      return;
    }

    if (!currentUser) {
      Alert.alert('Error', 'Please sign in to upload images');
      return;
    }

    try {
      setUploading(true);
      console.log('Starting upload process...');
      console.log('Current user:', currentUser);
      console.log('User profile:', userProfile);
      console.log('Image URI:', videoUri);
      
      // Process image (just return local URI for now)
      const imageURL = await videoService.uploadImage(videoUri, currentUser.uid);
      console.log('Image processed:', imageURL);
      
      // Create image post in Firestore
      console.log('Creating Firestore document...');
      await videoService.createImagePost({
        title: title.trim(),
        description: description.trim(),
        imageURL: imageURL,
        type: 'image',
        userId: currentUser.uid,
        userEmail: currentUser.email,
        userFirstName: userProfile?.firstName || '',
        userLastName: userProfile?.lastName || '',
        category,
        skillLevel,
        school: userProfile?.school || '',
        grade: userProfile?.grade || '',
      });
      console.log('Firestore document created successfully');

      Alert.alert('Success', 'Image uploaded successfully!', [
        { text: 'OK', onPress: () => router.replace('/') }
      ]);
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', `Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Upload Image</Text>
          <Text style={styles.subtitle}>Share your dance photos with the world</Text>
        </View>

        <View style={styles.form}>
          <TouchableOpacity style={styles.videoPicker} onPress={pickImage}>
            {videoUri ? (
              <View style={styles.videoPreview}>
                <Text style={styles.videoText}>Image Selected ✓</Text>
                <Text style={styles.videoSubtext}>Tap to change</Text>
              </View>
            ) : (
              <View style={styles.videoPlaceholder}>
                <Text style={styles.placeholderText}>📸</Text>
                <Text style={styles.placeholderSubtext}>Tap to select image</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter video title"
              placeholderTextColor="#666"
              maxLength={100}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe your performance..."
              placeholderTextColor="#666"
              multiline
              numberOfLines={4}
              maxLength={500}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.label}>Category</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={category}
                  onValueChange={setCategory}
                  style={styles.picker}
                >
                  {categories.map((cat) => (
                    <Picker.Item key={cat.key} label={cat.label} value={cat.key} />
                  ))}
                </Picker>
              </View>
            </View>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.label}>Skill Level</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={skillLevel}
                  onValueChange={setSkillLevel}
                  style={styles.picker}
                >
                  {skillLevels.map((level) => (
                    <Picker.Item key={level.key} label={level.label} value={level.key} />
                  ))}
                </Picker>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.uploadButton, uploading && styles.uploadButtonDisabled]}
            onPress={uploadImage}
            disabled={uploading}
          >
            <Text style={styles.uploadButtonText}>
              {uploading ? 'Uploading...' : 'Upload Image'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
  },
  form: {
    padding: 20,
  },
  videoPicker: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#333',
    borderStyle: 'dashed',
  },
  videoPreview: {
    alignItems: 'center',
  },
  videoText: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  videoSubtext: {
    color: '#888',
    fontSize: 14,
  },
  videoPlaceholder: {
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 48,
    marginBottom: 12,
  },
  placeholderSubtext: {
    color: '#888',
    fontSize: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  uploadButton: {
    backgroundColor: '#ff6b6b',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  uploadButtonDisabled: {
    backgroundColor: '#666',
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  pickerContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  picker: {
    color: '#fff',
    height: 50,
  },
  // Removed test button styles
});
