import "./globals.css";

import { Metadata } from "next";
import { ReactNode } from "react";
import { Roboto } from "next/font/google";

import { cn } from "@/lib/utils";
import Providers from "@/components/providers";

const roboto = Roboto({
  weight: ["500", "700", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--roboto",
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
