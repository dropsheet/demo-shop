import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { CartProvider } from "@/app/components/Cart";
import "./globals.css";

const display = Fraunces({ subsets: ["latin"], variable: "--font-display", axes: ["opsz", "SOFT"] });
const body = Inter({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "Fernwood Supply · Goods for slow evenings",
  description: "Linen, oak, brass and stoneware from independent makers.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
