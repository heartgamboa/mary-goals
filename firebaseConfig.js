<<<<<<< HEAD
// firebaseConfig.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
=======
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
>>>>>>> 329236c89de1b765927f9e69d38a6430509a84cb

const firebaseConfig = {
  apiKey: "AIzaSyB377ERU4n9_6HRhaOKrrcFnn0AM7A_hMU",
  authDomain: "pvg-goal-38779.firebaseapp.com",
  projectId: "pvg-goal-38779",
<<<<<<< HEAD
  messagingSenderId: "340943208976",
  appId: "1:340943208976:web:57ad373b4ce24bf64d8095",
};

// Initialize app only once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Firebase services (removed storage)
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
=======
  storageBucket: "pvg-goal-38779.firebasestorage.app",
  messagingSenderId: "340943208976",
  appId: "1:340943208976:web:57ad373b4ce24bf64d8095"
};

const app = initializeApp(firebaseConfig);
export const db =getFirestore(app)
>>>>>>> 329236c89de1b765927f9e69d38a6430509a84cb
