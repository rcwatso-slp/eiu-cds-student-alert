import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-600",
  secondary: "border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 focus:ring-slate-400",
  ghost: "bg-transparent text-brand-700 hover:bg-brand-50 focus:ring-brand-600",
  danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-600",
};

export const Button = ({
  children,
  className = "",
  variant = "primary",
  fullWidth = false,
  type = "button",
  ...props
}: ButtonProps) => (
  <button
    type={type}
    className={`inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold shadow-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${variantClasses[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
    {...props}
  >
    {children}
  </button>
);
