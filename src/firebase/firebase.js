// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  sendSignInLinkToEmail, 
  isSignInWithEmailLink, 
  signInWithEmailLink as signInWithEmailLinkFirebase 
} from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAZUOyzSkzdjDKRAIMUDW_macE2k0R2lwo",
  authDomain: "astro-9147a.firebaseapp.com",
  projectId: "astro-9147a",
  storageBucket: "astro-9147a.firebasestorage.app",
  messagingSenderId: "478329130325",
  appId: "1:478329130325:web:46d13fa9c182facf5af3dc",
  measurementId: "G-5YVEPVH3YT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase services
const auth = getAuth(app);
const database = getDatabase(app);
const googleProvider = new GoogleAuthProvider();

// Function to sign in with Google
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    return { user, token };
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

// Function to send sign in link to email
const sendSignInLink = async (email, actionCodeSettings) => {
  try {
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    window.localStorage.setItem('emailForSignIn', email);
    return true;
  } catch (error) {
    console.error("Error sending sign in link:", error);
    throw error;
  }
};

// Function to handle email link sign in
const signInWithEmailLink = async (email, href) => {
  try {
    const result = await signInWithEmailLinkFirebase(auth, email, href);
    window.localStorage.removeItem('emailForSignIn');
    return result.user;
  } catch (error) {
    console.error("Error signing in with email link:", error);
    throw error;
  }
};

// Check if the current URL is a sign-in link
const isEmailLink = (href) => {
  return isSignInWithEmailLink(auth, href);
};

// Function to fetch translations from Firebase
const fetchTranslations = async (language = 'en') => {
  try {
    const snapshot = await get(ref(database, `translations/${language}`));
    if (snapshot.exists()) {
      return snapshot.val();
    }
    console.warn(`No translations found for language: ${language}`);
    return null;
  } catch (error) {
    console.error("Error fetching translations:", error);
    throw error;
  }
};

export { 
  auth, 
  database,
  googleProvider, 
  signInWithGoogle,
  fetchTranslations,
  sendSignInLink,
  signInWithEmailLink,
  isEmailLink
};