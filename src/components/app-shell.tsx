import { MobileNav } from "@/components/mobile-nav";
import { Sidebar } from "@/components/sidebar";
import { StorageWarning } from "@/components/storage-warning";

export function AppShell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen"><Sidebar/><main className="pb-28 lg:ml-[248px] lg:pb-10"><StorageWarning/>{children}</main><MobileNav/></div>;
}
