import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Bricolage_Grotesque, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "@/components/ui/toaster";
import NavBar from "../components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import "./globals.css";

// Display — characterful grotesque for titles, headings, big stat numbers.
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"],
});

// Body / UI — clean, friendly grotesque (the new default).
const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
});

// Numeric accent — tabular figures for stats, scores, years, marks.
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "My Academic Weapon",
  description: "Build Your Academic Arsenal & Empower Your Study Sessions!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      {/* scroll-pt offsets in-page/route scroll targets so they clear the fixed navbar
        (top on sm+, where it has ~7.5rem clearance; bottom on mobile, so just pt-4).
        data-scroll-behavior lets Next 16 disable the CSS smooth scrolling during route
        transitions; `relative` gives framer-motion's useScroll a positioned page
        container to measure offsets against. */}
      <html
        lang="en"
        className="relative scroll-pt-4 sm:scroll-pt-[7.5rem]"
        data-scroll-behavior="smooth"
      >
        <head>
          {/* Google Verification */}
          <meta
            name="google-site-verification"
            content="fgFblIdD-kvYb-XjhGf0B57bu3JMY-gwpIHFH0xY2K4"
          />
        </head>
        <body
          className={`${bricolage.variable} ${hanken.variable} ${jetbrains.variable} font-sans antialiased`}
        >
          <NavBar />
          <div className="pt-4 pb-[50px] sm:py-[7.5rem] min-h-screen">
            {children}
          </div>
          <Footer />
          <SpeedInsights />
          <Toaster />
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
