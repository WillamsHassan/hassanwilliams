// import type { Metadata } from "next";

import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" data-theme="light">
        <body
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
