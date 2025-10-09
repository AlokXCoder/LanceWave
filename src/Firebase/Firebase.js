// firebase.config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase config using Vite environment variables with safe fallbacks
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDnOeGovfqHiYqvGgaq_-TnJChhEFvzj18",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "lancewave.web.app",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "lancewave-mark1",
  // Bucket name must be the appspot.com form, not firebasestorage.app
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "lancewave-mark1.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "76003337546",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:76003337546:web:3d3e6d0802cc41b0e8cdb3",
  // measurementId is optional; only included if provided via env or fallback exists
  ...(import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-HCXQFW2RMF"
    ? { measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-HCXQFW2RMF" }
    : {}),
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
