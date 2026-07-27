// =============================================================================
// PETUTION REAL AUTHENTICATION SERVICE: Firebase Authentication
// Production Google & Firebase Authentication Engine
// =============================================================================

import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 1. Default Firebase Configuration
export const firebaseConfig = {
  apiKey: import.meta.env?.VITE_FIREBASE_API_KEY || "AIzaSyPetutionDefaultKeyForDemo99812",
  authDomain: import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN || "petution-app.firebaseapp.com",
  projectId: import.meta.env?.VITE_FIREBASE_PROJECT_ID || "petution-app",
  storageBucket: import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET || "petution-app.appspot.com",
  messagingSenderId: import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID || "99812034912",
  appId: import.meta.env?.VITE_FIREBASE_APP_ID || "1:99812034912:web:a1b2c3d4e5f6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// 2. Real Authentication Wrapper Functions

/**
 * Sign in using Google OAuth 2.0 via Firebase
 */
export const realGoogleSignInWithPopup = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    return {
      success: true,
      user: {
        id: user.uid,
        name: user.displayName || 'Dr. Khaled ElGendy',
        email: user.email,
        photoURL: user.photoURL,
        role: 'Owner', // Default role for now
        provider: 'google',
        isAuthenticated: true
      }
    };
  } catch (error) {
    console.error('[Google Auth] Firebase sign-in failed:', error);
    throw error;
  }
};

/**
 * Sign in using Email and Password
 */
export const realEmailSignIn = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;
    return {
      success: true,
      user: {
        id: user.uid,
        name: user.displayName || email.split('@')[0].replace(/[\._]/g, ' '),
        email: user.email,
        role: 'Owner',
        provider: 'email',
        isAuthenticated: true
      }
    };
  } catch (error) {
    console.error('[Email Auth] Firebase sign-in failed:', error);
    throw error;
  }
};

/**
 * Sign up using Email and Password
 */
export const realEmailSignUp = async (email, password, displayName) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
    return {
      success: true,
      user: {
        id: user.uid,
        name: displayName || email.split('@')[0],
        email: user.email,
        role: 'Owner',
        provider: 'email',
        isAuthenticated: true
      }
    };
  } catch (error) {
    console.error('[Email Auth] Firebase sign-up failed:', error);
    throw error;
  }
};

/**
 * Send Password Reset Email
 */
export const realSendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    console.error('[Email Auth] Password reset failed:', error);
    throw error;
  }
};

/**
 * Sign out
 */
export const realSignOut = async () => {
  try {
    await firebaseSignOut(auth);
    return { success: true };
  } catch (error) {
    console.error('[Auth] Sign out failed:', error);
    throw error;
  }
};
