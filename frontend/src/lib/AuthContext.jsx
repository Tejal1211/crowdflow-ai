// src/lib/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { logEvent } from 'firebase/analytics';
import { auth, db, analytics } from './firebase';

const AuthContext = createContext(null);

// Demo user for testing without Firebase
const DEMO_USER = {
  uid: 'demo-user-001',
  email: 'demo@crowdflow.ai',
  displayName: 'Demo User',
  isDemo: true
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for demo user in session
    const demoActive = sessionStorage.getItem('crowdflow_demo');
    if (demoActive) {
      setUser(DEMO_USER);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch additional user data from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({ ...firebaseUser, ...userData });
          } else {
            setUser(firebaseUser);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser(firebaseUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    if (analytics) logEvent(analytics, 'login_success');
    return result;
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    if (analytics) logEvent(analytics, 'google_login_success');
    return result;
  };

  const signup = async (name, email, password) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });

    // Store user data in Firestore
    await setDoc(doc(db, 'users', cred.user.uid), {
      email: cred.user.email,
      displayName: name,
      createdAt: new Date(),
      lastLogin: new Date()
    });

    if (analytics) logEvent(analytics, 'signup_success');
    return cred;
  };

  const loginDemo = () => {
    sessionStorage.setItem('crowdflow_demo', 'true');
    setUser(DEMO_USER);
    if (analytics) logEvent(analytics, 'demo_login');
  };

  const logout = async () => {
    sessionStorage.removeItem('crowdflow_demo');
    if (!user?.isDemo) await signOut(auth);
    setUser(null);
    if (analytics) logEvent(analytics, 'logout');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginDemo, signup, logout, loginWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
