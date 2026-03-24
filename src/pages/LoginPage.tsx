import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { APP_NAME } from "../utils/constants";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { PageContainer } from "../components/layout/PageContainer";

export const LoginPage = () => {
  const { loading, isAuthenticated, isApprovedUser, isAdmin, authError, clearAuthError, signInWithGoogle } =
    useAuth();

  if (loading) {
    return <LoadingSpinner label="Loading sign-in..." />;
  }

  if (isAuthenticated && isApprovedUser) {
    return <Navigate to={isAdmin ? "/admin" : "/submit"} replace />;
  }

  return (
    <PageContainer className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-lg">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-600">
          Eastern Illinois University
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-slate-900">{APP_NAME}</h1>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          Faculty can submit student alerts for review. Admin users can review all submitted alerts.
          Access is limited to approved EIU accounts.
        </p>

        {authError ? (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <div className="flex items-start justify-between gap-3">
              <span>{authError}</span>
              <button
                type="button"
                onClick={clearAuthError}
                className="font-semibold text-red-700 underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        ) : null}

        <div className="mt-8 space-y-4">
          <Button fullWidth onClick={() => void signInWithGoogle()}>
            Sign In with Google
          </Button>
          <p className="text-sm text-slate-500">
            Approved access includes EIU email accounts ending in <strong>@eiu.edu</strong> and
            designated admin accounts.
          </p>
        </div>
      </Card>
    </PageContainer>
  );
};
