import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from './config';

// ============================================================
// REGISTER WITH EMAIL
// ============================================================
export const registerWithEmail = async (email, password, displayName) => {
  try {
    console.log('📝 Starting registration...', { email, displayName });
    
    // Create user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('✅ User created:', user.uid);
    
    // Save user to Firestore
    await saveUserToFirestore(user, { displayName });
    
    return { user, error: null };
    
  } catch (error) {
    console.error('❌ Registration Error:', error.code, error.message);
    
    // User-friendly error messages
    const errorMessages = {
      'auth/email-already-in-use': 'This email is already registered.',
      'auth/invalid-email': 'Invalid email address.',
      'auth/weak-password': 'Password must be at least 6 characters.',
      'auth/operation-not-allowed': 'Email/password accounts are not enabled in Firebase Console.',
      'auth/network-request-failed': 'Network error. Please check your connection.'
    };
    
    return { 
      user: null, 
      error: errorMessages[error.code] || error.message 
    };
  }
};

// ============================================================
// SIGN IN WITH EMAIL
// ============================================================
export const signInWithEmail = async (email, password) => {
  try {
    console.log('🔑 Signing in...', { email });
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('✅ User signed in:', user.uid);
    
    await saveUserToFirestore(user);
    
    return { user, error: null };
    
  } catch (error) {
    console.error('❌ Sign In Error:', error.code, error.message);
    
    const errorMessages = {
      'auth/user-not-found': 'No account found with this email.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
      'auth/invalid-email': 'Invalid email address.',
      'auth/user-disabled': 'This account has been disabled.'
    };
    
    return { user: null, error: errorMessages[error.code] || error.message };
  }
};

// ============================================================
// SIGN IN WITH GOOGLE
// ============================================================
export const signInWithGoogle = async () => {
  try {
    console.log('🔑 Signing in with Google...');
    
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    console.log('✅ Google Sign In successful:', user.uid);
    
    await saveUserToFirestore(user);
    
    return { user, error: null };
    
  } catch (error) {
    console.error('❌ Google Sign In Error:', error.code, error.message);
    
    const errorMessages = {
      'auth/api-key-not-valid': 'Invalid API key. Please check Firebase configuration.',
      'auth/network-request-failed': 'Network error. Please check your internet connection.',
      'auth/popup-closed-by-user': 'Sign in popup was closed. Please try again.',
      'auth/popup-blocked': 'Sign in popup was blocked by your browser.',
      'auth/unauthorized-domain': 'This domain is not authorized for Firebase.'
    };
    
    return { user: null, error: errorMessages[error.code] || error.message };
  }
};

// ============================================================
// SAVE USER TO FIRESTORE
// ============================================================
const saveUserToFirestore = async (user, extraData = {}) => {
  try {
    const userRef = doc(db, 'users', user.uid);
    
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || extraData.displayName || 'User',
      photoURL: user.photoURL || null,
      lastLogin: serverTimestamp(),
      createdAt: serverTimestamp(),
      preferences: {
        theme: 'dark',
        autoFix: true,
        defaultLanguage: 'python'
      },
      stats: {
        totalAnalyses: 0,
        issuesFixed: 0,
        languagesUsed: []
      }
    };
    
    await setDoc(userRef, userData, { merge: true });
    console.log('✅ User saved to Firestore');
    
  } catch (error) {
    console.error('❌ Firestore save error:', error);
  }
};

// ============================================================
// SIGN OUT
// ============================================================
export const logoutUser = async () => {
  try {
    await signOut(auth);
    console.log('✅ Logout successful');
    return { error: null };
  } catch (error) {
    console.error('❌ Logout Error:', error);
    return { error: error.message };
  }
};

// ============================================================
// GET CURRENT USER
// ============================================================
export const getCurrentUser = () => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};