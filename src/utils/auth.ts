import {
  type AuthCredential,
  type AuthError,
  GoogleAuthProvider,
  isSignInWithEmailLink,
  linkWithCredential,
  sendSignInLinkToEmail,
  signOut,
  signInWithPopup,
  signInWithEmailLink,
  type User,
} from "firebase/auth";
import { auth } from "../firebase/config";
import {
  ADMIN_EMAILS,
  EMAIL_LINK_STORAGE_KEY,
  EXPLICIT_APPROVED_EMAILS,
  PENDING_GOOGLE_LINK_STORAGE_KEY,
} from "./constants";

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

export const startGoogleSignIn = async (): Promise<void> => {
  await signInWithPopup(auth, googleProvider);
};

interface PendingGoogleLink {
  email: string;
  idToken?: string | null;
  accessToken?: string | null;
}

export const savePendingGoogleCredential = (error: AuthError): string => {
  const credential = GoogleAuthProvider.credentialFromError(error);
  const email = (error.customData?.email ?? "").trim().toLowerCase();

  if (!credential || !email) {
    return "";
  }

  const payload: PendingGoogleLink = {
    email,
    idToken: credential.idToken ?? null,
    accessToken: credential.accessToken ?? null,
  };

  window.localStorage.setItem(PENDING_GOOGLE_LINK_STORAGE_KEY, JSON.stringify(payload));
  return email;
};

export const getPendingGoogleLinkEmail = (): string => {
  const rawValue = window.localStorage.getItem(PENDING_GOOGLE_LINK_STORAGE_KEY);

  if (!rawValue) {
    return "";
  }

  try {
    const parsedValue = JSON.parse(rawValue) as PendingGoogleLink;
    return parsedValue.email ?? "";
  } catch {
    return "";
  }
};

export const clearPendingGoogleCredential = (): void => {
  window.localStorage.removeItem(PENDING_GOOGLE_LINK_STORAGE_KEY);
};

const readPendingGoogleCredential = (): AuthCredential | null => {
  const rawValue = window.localStorage.getItem(PENDING_GOOGLE_LINK_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    const parsedValue = JSON.parse(rawValue) as PendingGoogleLink;

    if (!parsedValue.idToken && !parsedValue.accessToken) {
      return null;
    }

    return GoogleAuthProvider.credential(parsedValue.idToken ?? null, parsedValue.accessToken ?? null);
  } catch {
    return null;
  }
};

export const linkPendingGoogleCredentialIfNeeded = async (user: User): Promise<boolean> => {
  const pendingEmail = getPendingGoogleLinkEmail();
  const userEmail = (user.email ?? "").trim().toLowerCase();

  if (!pendingEmail || !userEmail || pendingEmail !== userEmail) {
    return false;
  }

  const credential = readPendingGoogleCredential();

  if (!credential) {
    clearPendingGoogleCredential();
    return false;
  }

  await linkWithCredential(user, credential);
  clearPendingGoogleCredential();
  return true;
};

export const signOutUser = async (): Promise<void> => {
  await signOut(auth);
};
