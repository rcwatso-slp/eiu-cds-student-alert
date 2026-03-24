import {
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { createContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { auth } from "../firebase/config";
import type { AppUser, AuthContextValue } from "../types/auth";
import { isAdminEmail, isApprovedEmail, mapFirebaseUser, signOutUser, startGoogleSignIn } from "../utils/auth";

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setFirebaseUser(null);
        setUser(null);
        setLoading(false);
        return;
      }

      const email = currentUser.email ?? "";

      if (!isApprovedEmail(email)) {
        setAuthError("Access denied. You must sign in with an approved EIU account.");
        setFirebaseUser(null);
        setUser(null);
        await signOutUser();
        setLoading(false);
        return;
      }

      setFirebaseUser(currentUser);
      setUser(mapFirebaseUser(currentUser));
      setAuthError("");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setAuthError("");

    try {
      setLoading(true);
      await startGoogleSignIn();
    } catch {
      setAuthError("Sign-in was not completed. Please try again.");
      setLoading(false);
    }
  };

  const logout = async () => {
    await signOutUser();
    setFirebaseUser(null);
    setUser(null);
  };

  const clearAuthError = () => {
    setAuthError("");
  };

  const value = useMemo<AuthContextValue>(() => {
    const email = user?.email ?? firebaseUser?.email ?? "";
    const approved = isApprovedEmail(email);
    const admin = isAdminEmail(email);

    return {
      firebaseUser,
      user,
      isAuthenticated: Boolean(firebaseUser),
      isApprovedUser: approved,
      isAdmin: admin,
      isFaculty: approved && !admin,
      loading,
      authError,
      signInWithGoogle,
      logout,
      clearAuthError,
    };
  }, [authError, firebaseUser, loading, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
