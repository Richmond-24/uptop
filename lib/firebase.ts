
// lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyDjdmZYz0H4ZKrJvg2FhcSQ5bBSsawCnRA",
  authDomain: "uptop-auth-2cc3f.firebaseapp.com",
  projectId: "uptop-auth-2cc3f",
  storageBucket: "uptop-auth-2cc3f.firebasestorage.app",
  messagingSenderId: "304951144590",
  appId: "1:304951144590:web:f1c95ee883b76a707819df",
  measurementId: "G-KYEN4E7EC5"
}

// Initialize Firebase app (only once)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

// Initialize Firebase Auth and Google Auth Provider
const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider()

export { app, auth, googleProvider }
