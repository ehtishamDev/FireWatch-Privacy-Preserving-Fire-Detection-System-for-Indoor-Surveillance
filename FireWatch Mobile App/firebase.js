import { initializeApp } from "firebase/app";
import "firebase/auth";
import {
  getAuth,
  GoogleAuthProvider,
} from "firebase/auth";
import { getStorage } from "firebase/storage";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAtpeKeS838ckJEn6Qi-Bh7bGVcKvY8xgY",
  authDomain: "firewatch-dashboard-a18fe.firebaseapp.com",
  projectId: "firewatch-dashboard-a18fe",
  storageBucket: "firewatch-dashboard-a18fe.appspot.com",
  messagingSenderId: "906793646171",
  appId: "1:906793646171:web:4a873a4ddd29124f68e77e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
export { ref, listAll, getDownloadURL, getMetadata } from "firebase/storage";

// Initialize Firebase Auth with AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
