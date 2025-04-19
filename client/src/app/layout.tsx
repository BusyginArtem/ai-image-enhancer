import "./globals.css";

import { Metadata } from "next";
import { Roboto } from "next/font/google";
import { ReactNode } from "react";

import Providers from "@/components/providers";
import { cn } from "@/lib/utils";

const roboto = Roboto({
  weight: ["500", "700", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--roboto",
  preload: true,
});

export const metadata: Metadata = {
  title: "AI Image Enhancer",
  description: "Enhance your image with AI-powered tools",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={cn(
          "bg-background scrollbar-overlay min-h-screen overscroll-none",
          roboto.variable,
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
