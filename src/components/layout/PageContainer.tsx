import type { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export const PageContainer = ({ children, className = "" }: PageContainerProps) => (
  <main className={`mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 ${className}`}>
    {children}
  </main>
);
