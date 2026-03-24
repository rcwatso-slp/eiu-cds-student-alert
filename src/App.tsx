import { Navigate, Route, Routes } from "react-router-dom";
import { AdminRoute } from "./components/auth/AdminRoute";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AppHeader } from "./components/layout/AppHeader";
import { LoadingSpinner } from "./components/ui/LoadingSpinner";
import { useAuth } from "./hooks/useAuth";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { AlertDetailPage } from "./pages/AlertDetailPage";
import { LoginPage } from "./pages/LoginPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { SubmitAlertPage } from "./pages/SubmitAlertPage";

const HomeRedirect = () => {
  const { loading, isAuthenticated, isApprovedUser, isAdmin } = useAuth();

  if (loading) {
    return <LoadingSpinner label="Loading application..." />;
  }

  if (!isAuthenticated || !isApprovedUser) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={isAdmin ? "/admin" : "/submit"} replace />;
};

const App = () => {
  const { isAuthenticated, isApprovedUser } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100">
      {isAuthenticated && isApprovedUser ? <AppHeader /> : null}
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/submit"
          element={
            <ProtectedRoute>
              <SubmitAlertPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          }
        />
        <Route
          path="/alert/:id"
          element={
            <AdminRoute>
              <AlertDetailPage />
            </AdminRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
};

export default App;
