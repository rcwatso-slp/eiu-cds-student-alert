import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { LoadingSpinner } from "../ui/LoadingSpinner";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { loading, isAuthenticated, isApprovedUser } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner label="Checking your access..." />;
  }

  if (!isAuthenticated || !isApprovedUser) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};
