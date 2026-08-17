import { MobileNav } from "@/components/mobile-nav";
import { Sidebar } from "@/components/sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen"><Sidebar/><main className="pb-28 lg:ml-[248px] lg:pb-10">{children}</main><MobileNav/></div>;
}
