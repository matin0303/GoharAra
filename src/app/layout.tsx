import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import { Providers } from './providers';
import { Toaster } from 'react-hot-toast'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "گوهرآرا",
  description: "پخش پسته از دامغان به سراسر کشور",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html dir="rtl" lang="fa">
      <body>
        <Providers>
          <div className="relative bg-white max-w-[1580px] mx-auto">
            <Header />
            {children}
            <Toaster position="top-left" toastOptions={{ duration: 2000, style: { fontFamily: 'kalameh', padding: '0.5rem 2rem 0.5rem 2rem' } }} />
            <footer className="relative pb-20 text-white bg-black z-2000">
              <Footer />
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
