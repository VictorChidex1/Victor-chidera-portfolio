// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCcWHQmMP396g0JTwSCMnkkruWMQT1OA18",
  authDomain: "portfolio-website-b9e66.firebaseapp.com",
  projectId: "portfolio-website-b9e66",
  storageBucket: "portfolio-website-b9e66.firebasestorage.app",
  messagingSenderId: "549643236378",
  appId: "1:549643236378:web:6cb042e53abda7b7cbcda3",
  measurementId: "G-G8TXH7653F",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// 4. Initialize the Database and EXPORT it
export const db = getFirestore(app);
