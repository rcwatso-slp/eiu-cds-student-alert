import type { User } from "firebase/auth";

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
}

export interface AuthState {
  firebaseUser: User | null;
  user: AppUser | null;
  isAuthenticated: boolean;
  isApprovedUser: boolean;
  isAdmin: boolean;
  isFaculty: boolean;
  loading: boolean;
  authError: string;
}

export interface AuthContextValue extends AuthState {
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  clearAuthError: () => void;
}
