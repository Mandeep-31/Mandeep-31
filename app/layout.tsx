import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import Preloader from "@/components/portfolio/Preloader";
import "./globals.css";

const geist = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mandeep Acharya — Aspiring Software Developer",
  description:
    "Mandeep Acharya is a BCA student at NCIT in Kathmandu, Nepal, learning to build software for the web.",
};

export const viewport: Viewport = {
  themeColor: "#060606",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={geist.variable}>
      <body>
        <Preloader />
        {children}
      </body>
    </html>
  );
}
