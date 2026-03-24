import {
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { createContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { auth } from "../firebase/config";
import type { AppUser, AuthContextValue } from "../types/auth";
import {
  clearStoredEmailLinkAddress,
  clearPendingGoogleCredential,
  finishEmailLinkSignIn,
  getStoredEmailLinkAddress,
  getPendingGoogleLinkEmail,
  isAdminEmail,
  isApprovedEmail,
  isCurrentUrlEmailSignInLink,
  linkPendingGoogleCredentialIfNeeded,
  mapFirebaseUser,
  signOutUser,
  savePendingGoogleCredential,
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
  const [pendingLinkEmail, setPendingLinkEmail] = useState("");

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
    setPendingLinkEmail(getPendingGoogleLinkEmail());
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
        clearPendingGoogleCredential();
        setPendingLinkEmail("");
        setFirebaseUser(null);
        setUser(null);
        await signOutUser();
        setLoading(false);
        return;
      }

      try {
        const didLinkGoogle = await linkPendingGoogleCredentialIfNeeded(currentUser);

        if (didLinkGoogle) {
          setAuthNotice("Google sign-in has been linked to this account. You can now use either sign-in method.");
          setPendingLinkEmail("");
        }
      } catch {
        setAuthError("Your account signed in, but Google could not be linked automatically. You can continue using your existing sign-in method.");
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
    } catch (error) {
      const firebaseError = error as { code?: string };

      if (firebaseError.code === "auth/account-exists-with-different-credential") {
        const pendingEmailAddress = savePendingGoogleCredential(error as never);

        if (pendingEmailAddress) {
          setPendingLinkEmail(pendingEmailAddress);
          setAuthNotice(
            "This email already has an account with a different sign-in method. Finish signing in with an email link, and we will connect Google automatically.",
          );
        } else {
          setAuthError("Google sign-in found an existing account with a different sign-in method. Please use an email sign-in link first.");
        }

        setLoading(false);
        return;
      }

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
      pendingLinkEmail,
    };
  }, [authError, authNotice, firebaseUser, linkEmailSentTo, loading, pendingLinkEmail, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
