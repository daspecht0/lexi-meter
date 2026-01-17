import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

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
      <body className={`${inter.className} wild-bg dots-pattern min-h-screen`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
