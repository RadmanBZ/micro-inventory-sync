import type { ReactNode } from "react";

import { BottomNav } from "@/components/layout/BottomNav";

interface AppShellProps {
  children: ReactNode;
  header?: ReactNode;
}

export function AppShell({ children, header }: AppShellProps) {
  return (
    <div className="min-h-screen bg-surface">
      {header}
      <main className="mx-auto min-h-screen max-w-lg pb-28 pt-4 md:max-w-2xl lg:max-w-4xl">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
