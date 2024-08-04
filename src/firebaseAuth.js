// firebaseAuth.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAg9_4k5jP24nbM3NqbByHtpNzMk94Gc2M',
  authDomain: 'pantrytracker-a8d69.firebaseapp.com',
  projectId: 'pantrytracker-a8d69',
  storageBucket: 'pantrytracker-a8d69.appspot.com',
  messagingSenderId: '1089364295419',
  appId: '1:1089364295419:web:a678fa74d24433bad0fa5e',
  measurementId: 'G-HR46JS61YK',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db,storage };
