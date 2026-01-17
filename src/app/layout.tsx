import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import CursorTrail from "@/components/CursorTrail";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lexi Meter - How Mad Is She?",
  description: "Track Lexi's mood with a wild, Goodles-inspired meter",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen`}>
        <Providers>
          <CursorTrail />
          {children}
        </Providers>
      </body>
    </html>
  );
}
