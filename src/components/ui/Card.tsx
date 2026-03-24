import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className = "" }: CardProps) => (
  <div className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-panel ${className}`}>
    {children}
  </div>
);
