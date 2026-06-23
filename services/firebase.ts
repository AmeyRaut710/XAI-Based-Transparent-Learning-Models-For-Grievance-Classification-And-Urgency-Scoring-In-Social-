import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAQEQYcAOiiFANjUXhx_c1JEQKbBph5OsQ",
  authDomain: "autonomous-eng-v1.firebaseapp.com",
  projectId: "autonomous-eng-v1",
  storageBucket: "autonomous-eng-v1.firebasestorage.app",
  messagingSenderId: "462854077733",
  appId: "1:462854077733:web:3505d8cdf28581ac266ecc",
  measurementId: "G-KD342L2KNW"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };
