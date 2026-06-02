import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { FlowProvider } from "@/components/FlowProvider";
import { AppShell } from "@/components/AppShell";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TasteMatch — Where should we eat tonight?",
  description: "Skip the scroll. 3 restaurant picks. Under 30 seconds.",
};

export const viewport: Viewport = {
  themeColor: "#FAFAF6",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        <FlowProvider>
          <AppShell>{children}</AppShell>
        </FlowProvider>
      </body>
    </html>
  );
}
