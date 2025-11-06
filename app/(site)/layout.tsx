import Header from "./header";
import type { ReactNode } from "react";
import SessionProvider from "@/components/SessionProvider";
import PageTransition from "@/components/PageTransition";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <div>
        <Header />
        <main className="pt-28">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </SessionProvider>
  );
}
