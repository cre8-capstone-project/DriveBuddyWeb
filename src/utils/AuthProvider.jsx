import PropTypes from "prop-types";
import { useState, useEffect, createContext, useContext } from "react";
import { auth, firestore } from "../firebase/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";

// For sharing the user state across the app
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Retrieve the session information
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Fetch user document from Firestore
        const userDocRef = doc(firestore, "admins", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          setUser({ ...userDocSnap.data(), uid: currentUser.uid });
        } else {
          setUser({ email: currentUser.email, uid: currentUser.uid }); // Fallback if no Firestore data
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sign out the user
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("User failed to sign out", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, handleSignOut }}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
