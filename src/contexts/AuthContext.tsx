import {
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { createContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { auth } from "../firebase/config";
import type { AppUser, AuthContextValue } from "../types/auth";
import {
  clearStoredEmailLinkAddress,
  finishEmailLinkSignIn,
  getStoredEmailLinkAddress,
  isAdminEmail,
  isApprovedEmail,
  isCurrentUrlEmailSignInLink,
  mapFirebaseUser,
  signOutUser,
  startEmailLinkSignIn,
  startGoogleSignIn,
} from "../utils/auth";

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const [authNotice, setAuthNotice] = useState("");
  const [linkEmailSentTo, setLinkEmailSentTo] = useState("");

  useEffect(() => {
    if (!isCurrentUrlEmailSignInLink(window.location.href)) {
      return;
    }

    const storedEmail = getStoredEmailLinkAddress();
    if (!storedEmail) {
      setAuthNotice("Finish signing in by entering the same email address that received your sign-in link.");
    }
  }, []);

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
        clearStoredEmailLinkAddress();
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

  const sendSignInLink = async (email: string) => {
    setAuthError("");
    setAuthNotice("");

    try {
      await startEmailLinkSignIn(email.trim().toLowerCase());
      setLinkEmailSentTo(email.trim().toLowerCase());
      setAuthNotice("Your secure sign-in link has been sent. Check your email to continue.");
    } catch {
      setAuthError("We could not send a sign-in link right now. Please try again.");
    }
  };

  const completeSignInWithEmailLink = async (email: string, link = window.location.href) => {
    setAuthError("");
    setAuthNotice("");

    try {
      setLoading(true);
      await finishEmailLinkSignIn(email.trim().toLowerCase(), link);
      setLinkEmailSentTo("");
    } catch {
      setAuthError("We could not complete sign-in from this email link. Please request a new link and try again.");
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setAuthError("");
    setAuthNotice("");

    try {
      setLoading(true);
      await startGoogleSignIn();
    } catch {
      setAuthError("Google sign-in was not completed. Please try again.");
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
      sendSignInLink,
      completeSignInWithEmailLink,
      signInWithGoogle,
      logout,
      clearAuthError,
      isEmailLinkSignIn: isCurrentUrlEmailSignInLink(window.location.href),
      linkEmailSentTo,
      authNotice,
    };
  }, [authError, authNotice, firebaseUser, linkEmailSentTo, loading, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
