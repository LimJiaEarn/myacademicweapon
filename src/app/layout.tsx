import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import "./globals.css";

import NavBar from "../components/shared/Navbar";
import Footer from "@/components/shared/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Academic Weapon",
  description: "Empowering your academic success",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
  <ClerkProvider>
    <html lang="en">
      <body className={inter.className}>
        <NavBar/>
        <div className="py-[7.5rem]">
          {children}
        </div>
        <Footer/>
      </body>
    </html>
  </ClerkProvider>
    
  );
}
