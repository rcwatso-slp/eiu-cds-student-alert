import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { LoadingSpinner } from "../ui/LoadingSpinner";

interface AdminRouteProps {
  children: ReactNode;
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
  const { loading, isAuthenticated, isApprovedUser, isAdmin } = useAuth();

  if (loading) {
    return <LoadingSpinner label="Checking admin access..." />;
  }

  if (!isAuthenticated || !isApprovedUser) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/submit" replace />;
  }

  return <>{children}</>;
};
