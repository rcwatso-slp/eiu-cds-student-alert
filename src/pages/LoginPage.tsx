import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { APP_NAME } from "../utils/constants";
import { getStoredEmailLinkAddress, isApprovedEmail } from "../utils/auth";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { PageContainer } from "../components/layout/PageContainer";

export const LoginPage = () => {
  const {
    loading,
    isAuthenticated,
    isApprovedUser,
    isAdmin,
    authError,
    authNotice,
    clearAuthError,
    sendSignInLink,
    completeSignInWithEmailLink,
    signInWithGoogle,
    isEmailLinkSignIn,
    linkEmailSentTo,
  } = useAuth();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const storedEmail = getStoredEmailLinkAddress();
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  if (loading) {
    return <LoadingSpinner label="Loading sign-in..." />;
  }

  if (isAuthenticated && isApprovedUser) {
    return <Navigate to={isAdmin ? "/admin" : "/submit"} replace />;
  }

  const validateEmail = () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setEmailError("Please enter your email address.");
      return "";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setEmailError("Please enter a valid email address.");
      return "";
    }

    if (!isApprovedEmail(normalizedEmail)) {
      setEmailError("Please use an approved EIU or designated admin email address.");
      return "";
    }

    setEmailError("");
    return normalizedEmail;
  };

  const handleSendLink = async () => {
    const normalizedEmail = validateEmail();
    if (!normalizedEmail) {
      return;
    }

    setSubmitting(true);
    await sendSignInLink(normalizedEmail);
    setSubmitting(false);
  };

  const handleCompleteSignIn = async () => {
    const normalizedEmail = validateEmail();
    if (!normalizedEmail) {
      return;
    }

    setSubmitting(true);
    await completeSignInWithEmailLink(normalizedEmail);
    setSubmitting(false);
  };

  return (
    <PageContainer className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-lg">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-600">
          Eastern Illinois University
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-slate-900">{APP_NAME}</h1>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          Faculty can submit student alerts for review. Admin users can review all submitted alerts.
          Sign in can use a secure Firebase email link or Google for approved accounts.
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

        {authNotice ? (
          <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {authNotice}
          </div>
        ) : null}

        <div className="mt-8 space-y-4">
          <Input
            id="email"
            type="email"
            label="Email Address"
            placeholder="name@eiu.edu"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (emailError) {
                setEmailError("");
              }
            }}
            error={emailError}
          />

          {isEmailLinkSignIn ? (
            <Button fullWidth onClick={() => void handleCompleteSignIn()} disabled={submitting}>
              {submitting ? "Completing Sign-In..." : "Complete Sign-In"}
            </Button>
          ) : (
            <Button fullWidth onClick={() => void handleSendLink()} disabled={submitting}>
              {submitting ? "Sending Link..." : "Email Me a Sign-In Link"}
            </Button>
          )}

          {linkEmailSentTo ? (
            <p className="text-sm text-slate-500">
              Last sign-in link sent to <strong>{linkEmailSentTo}</strong>.
            </p>
          ) : null}

          {!isEmailLinkSignIn ? (
            <>
              <div className="flex items-center gap-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-400">
                <span className="h-px flex-1 bg-slate-200" />
                <span>Or</span>
                <span className="h-px flex-1 bg-slate-200" />
              </div>
              <Button fullWidth variant="secondary" onClick={() => void signInWithGoogle()} disabled={submitting}>
                Sign In with Google
              </Button>
            </>
          ) : null}

          <p className="text-sm text-slate-500">
            Approved access includes EIU email accounts ending in <strong>@eiu.edu</strong> and
            designated admin accounts. In Firebase Authentication, enable <strong>Email/Password</strong>, <strong>Email link (passwordless sign-in)</strong>, and <strong>Google</strong> if you want both methods available.
          </p>
        </div>
      </Card>
    </PageContainer>
  );
};
