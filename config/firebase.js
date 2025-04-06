// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyChrqlolMuAE4A-jRF1FEbkLW2psdu0JWk",
  authDomain: "starjourney-4fc1d.firebaseapp.com",
  projectId: "starjourney-4fc1d",
  storageBucket: "starjourney-4fc1d.firebasestorage.app",
  messagingSenderId: "749372206258",
  appId: "1:749372206258:web:3cb01be0b6f190de3eedab",
  measurementId: "G-L4M0RBJF3H",
  databaseURL: "https://starjourney-4fc1d-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };