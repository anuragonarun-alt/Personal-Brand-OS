import React from "react";
import { Sidebar } from "./sidebar";
import { TopBar } from "./top-bar";

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground font-sans antialiased">
      {/* Persistent Left Sidebar */}
      <Sidebar />

      {/* Scrollable Right Area */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        {/* Minimal Header */}
        <TopBar />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppShell;
