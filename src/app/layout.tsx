import "./globals.css";

import type { Metadata } from "next";
import Link from "next/link";

import { UserSearchForm } from "@/app/users/user-search-form";
import { Sidebar, SidebarHeader, SidebarProvider } from "@/components/ui/sidebar";

export const metadata: Metadata = {
  title: "GitGuard",
  description: "GitGuard is a tool for analyzing GitLab users and their access to resources.",
};

export default function RootLayout({
  children,
  tabs,
}: Readonly<{
  children: React.ReactNode;
  tabs: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SidebarProvider>
          <Sidebar>
            <SidebarHeader>
              <div className="flex items-center justify-center h-28">
                <Link href="/">
                  <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">GitGuard</h1>
                </Link>
              </div>
              <UserSearchForm />
            </SidebarHeader>
            {children}
          </Sidebar>
          {tabs}
        </SidebarProvider>
      </body>
    </html>
  );
}
