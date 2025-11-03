import Header from "./header";
import type { ReactNode } from "react";
import SessionProvider from "@/components/SessionProvider";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <div>
        <Header />
        <main className="pt-28">{children}</main>
      </div>
    </SessionProvider>
  );
}
