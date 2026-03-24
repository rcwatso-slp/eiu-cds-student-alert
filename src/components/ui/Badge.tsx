import type { ReactNode } from "react";
import type { Severity } from "../../types/alert";

interface BadgeProps {
  children: ReactNode;
  tone?: "neutral" | "admin" | "faculty" | "success" | Severity;
}

const toneClasses: Record<NonNullable<BadgeProps["tone"]>, string> = {
  neutral: "bg-slate-100 text-slate-700",
  admin: "bg-brand-100 text-brand-700",
  faculty: "bg-emerald-100 text-emerald-700",
  success: "bg-emerald-100 text-emerald-700",
  Low: "bg-slate-100 text-slate-700",
  Moderate: "bg-amber-100 text-amber-800",
  High: "bg-orange-100 text-orange-800",
  Critical: "bg-red-100 text-red-700",
};

export const Badge = ({ children, tone = "neutral" }: BadgeProps) => (
  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${toneClasses[tone]}`}>
    {children}
  </span>
);
