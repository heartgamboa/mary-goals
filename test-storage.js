// Test Firebase Storage
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB377ERU4n9_6HRhaOKrrcFnn0AM7A_hMU",
  authDomain: "pvg-goal-38779.firebaseapp.com",
  projectId: "pvg-goal-38779",
  storageBucket: "pvg-goal-38779.firebasestorage.app",
  messagingSenderId: "340943208976",
  appId: "1:340943208976:web:57ad373b4ce24bf64d8095",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export const testStorage = async () => {
  try {
    console.log("Testing Firebase Storage...");
    
    // Create a test blob
    const testData = "Hello Firebase Storage!";
    const blob = new Blob([testData], { type: 'text/plain' });
    
    // Upload test file
    const testRef = ref(storage, 'test/test.txt');
    const snapshot = await uploadBytes(testRef, blob);
    console.log('Upload successful:', snapshot);
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('Download URL:', downloadURL);
    
    return downloadURL;
  } catch (error) {
    console.error('Storage test failed:', error);
    throw error;
  }
};
