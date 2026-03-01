"use client";

import { ReactNode } from "react";
import { Navbar } from "@/components/common/Navbar";
import { Sidebar } from "@/components/common/Sidebar";
import { BottomNav } from "@/components/common/BottomNav";
import { useAuth } from "@/hooks/useAuth";
import { usePathname } from "next/navigation";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  useAuth();
  const pathname = usePathname();

  if (pathname.startsWith("/login")) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <div className="flex pt-16">
        <Sidebar />
        <main className="flex-1 min-h-[calc(100vh-4rem)] pb-20 lg:pb-0">{children}</main>
      </div>
      <BottomNav />
    </>
  );
}
