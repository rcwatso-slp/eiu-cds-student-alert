interface LoadingSpinnerProps {
  label?: string;
}

export const LoadingSpinner = ({ label = "Loading..." }: LoadingSpinnerProps) => (
  <div className="flex flex-col items-center justify-center gap-3 py-10 text-slate-600">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-brand-600" />
    <p className="text-sm font-medium">{label}</p>
  </div>
);
