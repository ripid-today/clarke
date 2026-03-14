import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/ui/Nav";

export const metadata: Metadata = {
  title: "Tracker | ripid.vn",
  description: "Personal & shared VND budget tracker",
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="bg-cloud-dancer min-h-screen font-sans antialiased">
        <Nav />
        {children}
      </body>
    </html>
  );
}
