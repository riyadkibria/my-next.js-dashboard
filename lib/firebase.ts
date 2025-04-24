// lib/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Import Firestore for later use

// Firebase configuration (replace with your own config from Firebase console)
const firebaseConfig = {
  apiKey: "AIzaSyBj6QysY8iakOIolvgxdVIQFISrkWKLSls",
  authDomain: "user-data-ff2ef.firebaseapp.com",
  projectId: "user-data-ff2ef",
  storageBucket: "user-data-ff2ef.firebasestorage.app",
  messagingSenderId: "256585563027",
  appId: "1:256585563027:web:002cbebe818faf9ebec666",
  measurementId: "G-V3BQPCTJGG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app); // Get Firestore instance

export { db };
