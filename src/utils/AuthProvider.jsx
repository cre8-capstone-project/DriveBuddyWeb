import PropTypes from "prop-types";
import { useState, useEffect, createContext, useContext } from "react";

// For sharing the user state across the app
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  // Retrieve the session information
  useEffect(() => {
    const fetchSession = async () => {
      setLoading(true);
      try {
        //const { data, error } = await supabase.auth.getSession();
        const error = "Error";
        if (error) {
          throw error;
        }

        //const session = data?.session;
        const session = { user: { username: "test" } };
        if (session) {
          setUser(session.user);
        } else {
          setUser(null);
        }
        console.log(session);
      } catch (error) {
        console.log(error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    // Fetch the user from supabase
    fetchSession();
  }, []);

  // Sign out the user
  const handleSignOut = async () => {
    // Sign out from supabase autehtication
    try {
      setUser(null);
    } catch (error) {
      console.error("User failed to sign out", error);
      setUser(null);
      window.localStorage.clear();
      return;
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
