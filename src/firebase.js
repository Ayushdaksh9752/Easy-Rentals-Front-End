// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-77ab9.firebaseapp.com",
  projectId: "mern-estate-77ab9",
  storageBucket: "mern-estate-77ab9.appspot.com",
  messagingSenderId: "290175128988",
  appId: "1:290175128988:web:bc5f6068dab6becb816459",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
