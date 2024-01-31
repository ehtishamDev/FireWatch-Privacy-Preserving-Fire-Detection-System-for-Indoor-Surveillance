import { initializeApp } from "firebase/app";
import "firebase/auth";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {getStorage} from "firebase/storage"

 // Use getStorage to get the storage reference
 
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
export {ref,listAll,getDownloadURL,getMetadata} from "firebase/storage"
 

const googleProvider = new GoogleAuthProvider();
const auth = getAuth();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Replace 'your-google-email@example.com' with your actual Google account email
    if (user.email === "hammadnazir106@gmail.com") {
      return result;
    } else {
      // If the user's email does not match your Google account email, sign them out
      await auth.signOut();
      throw new Error("Your account is not authorized");
    }
  } catch (error) {
    throw error;
  }
};

export const signInWithEmail = async (email, password) => {
  try {
    if (!email && !password) {
      throw new Error("Email and Password are missing");
    } else if (!email) {
      throw new Error("Email is missing");
    } else if (!password) {
      throw new Error("Password is missing");
    }

    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    if (
      error.code === "auth/invalid-email" ||
      error.code === "auth/wrong-password"
    ) {
      throw new Error("Wrong email or password");
    } else {
      throw new Error(error.message);
    }
  }
};
