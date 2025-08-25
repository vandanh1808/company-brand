import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AdminProvider } from "@/contexts/AdminContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Enterprise Platform",
  description: "Discover companies, brands, and products in our ecosystem",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col overflow-y-scroll`}
        suppressHydrationWarning={true}
      >
        <AdminProvider>
          <Header />
          <main className="flex-grow">{children}</main>
          {/* <Footer /> */}
          <Toaster />
        </AdminProvider>
      </body>
    </html>
  );
}
