import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { APP_NAME } from "../../utils/constants";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

export const AppHeader = () => {
  const { user, isAdmin, logout } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
            Eastern Illinois University
          </p>
          <h1 className="text-xl font-semibold text-slate-900">{APP_NAME}</h1>
        </div>

        <div className="flex flex-col gap-3 lg:items-end">
          <nav className="flex flex-wrap items-center gap-2">
            <NavLink
              to="/submit"
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium ${
                  isActive ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              Submit Alert
            </NavLink>
            {isAdmin ? (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium ${
                    isActive ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-100"
                  }`
                }
              >
                Admin Dashboard
              </NavLink>
            ) : null}
          </nav>

          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <div className="text-right">
              <p className="font-medium text-slate-900">{user.displayName}</p>
              <p>{user.email}</p>
            </div>
            <Badge tone={isAdmin ? "admin" : "faculty"}>{isAdmin ? "Admin" : "Faculty"}</Badge>
            <Button variant="secondary" onClick={() => void logout()}>
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
