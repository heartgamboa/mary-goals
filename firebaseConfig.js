// firebaseConfig.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB377ERU4n9_6HRhaOKrrcFnn0AM7A_hMU",
  authDomain: "pvg-goal-38779.firebaseapp.com",
  projectId: "pvg-goal-38779",
  messagingSenderId: "340943208976",
  appId: "1:340943208976:web:57ad373b4ce24bf64d8095",
};

// Initialize app only once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Firebase services (removed storage)
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
