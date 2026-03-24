import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { auth } from "../firebase/config";
import { ADMIN_EMAILS, EXPLICIT_APPROVED_EMAILS } from "./constants";

const googleProvider = new GoogleAuthProvider();

export const isApprovedEmail = (email: string | null | undefined): boolean => {
  if (!email) {
    return false;
  }

  const normalizedEmail = email.trim().toLowerCase();

  return (
    normalizedEmail.endsWith("@eiu.edu") ||
    EXPLICIT_APPROVED_EMAILS.includes(normalizedEmail)
  );
};

export const isAdminEmail = (email: string | null | undefined): boolean => {
  if (!email) {
    return false;
  }

  return ADMIN_EMAILS.includes(email.trim().toLowerCase());
};

export const mapFirebaseUser = (user: User) => ({
  uid: user.uid,
  email: user.email ?? "",
  displayName: user.displayName ?? user.email ?? "Faculty User",
});

export const startGoogleSignIn = async (): Promise<void> => {
  await signInWithPopup(auth, googleProvider);
};

export const signOutUser = async (): Promise<void> => {
  await signOut(auth);
};
