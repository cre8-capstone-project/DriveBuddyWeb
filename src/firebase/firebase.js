// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  // eslint-disable-next-line no-undef
  apiKey: "AIzaSyAWDbuJnKnx3G8uPBzZX00k9IBYCbstd6s",
  authDomain: "capstone-project-8b697.firebaseapp.com",
  projectId: "capstone-project-8b697",
  storageBucket: "capstone-project-8b697.firebasestorage.app",
  messagingSenderId: "898155493570",
  appId: "1:898155493570:web:716f5a06bcbe4e9fd6e35b",
  measurementId: "G-Y5RBT8Z4P6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);

export { firestore, auth };
