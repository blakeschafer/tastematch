import { AppHeader } from "./AppHeader";
import { Sidebar } from "./Sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppHeader />
      <div className="grid lg:grid-cols-[220px_1fr] min-h-[calc(100dvh-90px)]">
        <Sidebar />
        <main className="px-5 sm:px-10 lg:px-16 py-7 sm:py-12 pb-[140px] lg:pb-24 max-w-[1200px]">
          {children}
        </main>
      </div>
    </>
  );
}
