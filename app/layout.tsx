import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fernwood Supply",
  description: "Small-batch goods for the home.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
