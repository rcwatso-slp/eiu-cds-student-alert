import {
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signOut,
  signInWithEmailLink,
  type User,
} from "firebase/auth";
import { auth } from "../firebase/config";
import { ADMIN_EMAILS, EMAIL_LINK_STORAGE_KEY, EXPLICIT_APPROVED_EMAILS } from "./constants";

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

export const getEmailLinkUrl = (): string => {
  const origin = window.location.origin;
  const basePath = import.meta.env.BASE_URL ?? "/";

  return new URL(basePath, origin).toString();
};

export const startEmailLinkSignIn = async (email: string): Promise<void> => {
  await sendSignInLinkToEmail(auth, email, {
    url: getEmailLinkUrl(),
    handleCodeInApp: true,
  });

  window.localStorage.setItem(EMAIL_LINK_STORAGE_KEY, email);
};

export const isCurrentUrlEmailSignInLink = (url: string): boolean =>
  isSignInWithEmailLink(auth, url);

export const getStoredEmailLinkAddress = (): string =>
  window.localStorage.getItem(EMAIL_LINK_STORAGE_KEY) ?? "";

export const clearStoredEmailLinkAddress = (): void => {
  window.localStorage.removeItem(EMAIL_LINK_STORAGE_KEY);
};

export const finishEmailLinkSignIn = async (email: string, url: string): Promise<void> => {
  await signInWithEmailLink(auth, email, url);
  clearStoredEmailLinkAddress();
};

export const signOutUser = async (): Promise<void> => {
  await signOut(auth);
};
