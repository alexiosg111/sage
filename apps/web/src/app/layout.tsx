import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SAGE Club Berlin",
  description: "SAGE Club Berlin - Events, Merch & Tickets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="scroll-smooth">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
