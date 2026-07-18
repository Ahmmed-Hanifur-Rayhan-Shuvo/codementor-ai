import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  setPersistence, 
  browserLocalPersistence 
} from 'firebase/auth';
import { getAnalytics, logEvent, setUserId, setCurrentScreen } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';

// Your Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBESWGHNZ6Z1RNfbaBbkHvLvI5mj69H6Xw",
  authDomain: "codementor-ai-caefe.firebaseapp.com",
  projectId: "codementor-ai-caefe",
  storageBucket: "codementor-ai-caefe.firebasestorage.app",
  messagingSenderId: "266972998382",
  appId: "1:266972998382:web:77537255b0b277259aa1ff",
  measurementId: "G-4B6DDQ5VPL"
};

// Initialize Firebase (avoid duplicate initialization)
let app;
let auth;
let analytics;
let db;
let googleProvider;

try {
  // Check if Firebase app already exists
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
    console.log('✅ Firebase initialized successfully');
  } else {
    app = getApp();
    console.log('✅ Using existing Firebase app');
  }
  
  // Initialize Auth
  auth = getAuth(app);
  setPersistence(auth, browserLocalPersistence);
  console.log('✅ Firebase Auth initialized');
  
  // Initialize Firestore
  db = getFirestore(app);
  console.log('✅ Firestore initialized');
  
  // Initialize Google Provider
  googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({
    prompt: 'select_account'
  });
  console.log('✅ Google Provider initialized');
  
  // Initialize Analytics (only in production)
  if (import.meta.env.PROD) {
    analytics = getAnalytics(app);
    console.log('✅ Firebase Analytics initialized');
  } else {
    analytics = null;
    console.log('ℹ️ Analytics disabled in development mode');
  }
  
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
}

// Export all services
export { 
  app, 
  auth, 
  analytics, 
  db, 
  googleProvider,
  logEvent,
  setUserId,
  setCurrentScreen
};