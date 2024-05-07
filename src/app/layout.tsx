import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react"
import { Roboto } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Toaster } from "@/components/ui/toaster"
import NavBar from "../components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import "./globals.css";



const roboto = Roboto({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
})

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
      <body className={roboto.className}>
        <NavBar/>
        <div className="pt-4 pb-[50px] sm:py-[7.5rem] min-h-screen">
          {children}
        </div>
        <Footer/>
        <SpeedInsights />
        <Toaster />
        <Analytics />
      </body>
    </html>
  </ClerkProvider>
    
  );
}
