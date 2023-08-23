// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage}  from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FB_API_KEY,
  authDomain: "emporium-2c159.firebaseapp.com",
  projectId: "emporium-2c159",
  storageBucket: "emporium-2c159.appspot.com",
  messagingSenderId: "1055958936942",
  appId: "1:1055958936942:web:d1572aa84cc163b1da657f"
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); 