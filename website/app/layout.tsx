import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Clarke's Library",
  description: "Knowledge wiki for organized learning and reference",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans bg-cloud-dancer">
        {children}
      </body>
    </html>
  );
}
