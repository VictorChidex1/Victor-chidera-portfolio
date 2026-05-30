// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// Loaded dynamically via Vite env vars, with safe fallbacks
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCcWHQmMP396g0JTwSCMnkkruWMQT1OA18",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "portfolio-website-b9e66.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "portfolio-website-b9e66",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "portfolio-website-b9e66.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "549643236378",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:549643236378:web:6cb042e53abda7b7cbcda3",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-G8TXH7653F",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export services
export const db = getFirestore(app);
export const auth = getAuth(app);
