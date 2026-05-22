import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agumba Age Grade - Amaisii Portal",
  description: "Official portal for Agumba Age Grade (Amaisii Community) to manage and track social events, levies, and social rights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
