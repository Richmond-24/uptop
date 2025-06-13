// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth,GoogleAuthProvider } from "firebase/auth";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDuZoTdhhmafEe54jCRekY1JMnCOdsF6ic",
  authDomain: "auth-3805f.firebaseapp.com",
  projectId: "auth-3805f",
  storageBucket: "auth-3805f.firebasestorage.app",
  messagingSenderId: "994502226203",
  appId: "1:994502226203:web:1d26340e8b8b80f413a3be",
  measurementId: "G-CZQYZX35DB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth =getAuth(app);
const googleProvider = new GoogleAuthProvider();


export { app, auth, googleProvider };