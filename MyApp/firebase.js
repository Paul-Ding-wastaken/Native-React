// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB58ezGDW0tmFX-sm1WKmJhvYOE5_fH2Xg",
  authDomain: "mec-proj-2025.firebaseapp.com",
  projectId: "mec-proj-2025",
  storageBucket: "mec-proj-2025.firebasestorage.app",
  messagingSenderId: "520767023983",
  appId: "1:520767023983:web:c17228bb863c132277569a",
  measurementId: "G-EYLJV6KESW"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, googleProvider, db };

// Initialize Firebase
