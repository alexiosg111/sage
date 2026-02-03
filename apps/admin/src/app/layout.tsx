import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SAGE Club | Admin Dashboard",
  description: "Manage products, events and orders",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
