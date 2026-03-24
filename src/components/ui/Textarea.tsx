import type { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const Textarea = ({
  label,
  error,
  className = "",
  id,
  rows = 4,
  ...props
}: TextareaProps) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="block text-sm font-medium text-slate-700">
      {label}
    </label>
    <textarea
      id={id}
      rows={rows}
      className={`w-full rounded-lg border px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-100 ${
        error ? "border-red-400 bg-red-50" : "border-slate-300 bg-white"
      } ${className}`}
      {...props}
    />
    {error ? <p className="text-sm text-red-600">{error}</p> : null}
  </div>
);
