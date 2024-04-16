import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css";
import NavBar from "../components/shared/Navbar";
import Footer from "@/components/shared/Footer";



const inter = Inter({ subsets: ["latin"] });

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
    <html lang="en">
      <head>
        {/* Google Verification */}
        <meta name="google-site-verification" content="fgFblIdD-kvYb-XjhGf0B57bu3JMY-gwpIHFH0xY2K4" />
      </head>
      <body className={inter.className}>
        <NavBar/>
        <div className="pt-4 pb-[50px] sm:py-[7.5rem] min-h-screen">
          {children}
        </div>
        <Footer/>
        <SpeedInsights />
        <Toaster />
      </body>
    </html>
  </ClerkProvider>
    
  );
}
