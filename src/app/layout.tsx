import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toast } from "@/components/Toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Rayqube Test - Pizza Theme",
  description: "Complete production-ready app for Rayqube AI Web Developer Test",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-gray-50`}>
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900">
                  Pizza<span className="text-red-600">Hub</span>
                </h1>
              </div>
              <nav className="flex space-x-4">
                <a href="/" className="text-gray-600 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium">
                  Home
                </a>
                <a href="/upload" className="text-gray-600 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium">
                  Upload
                </a>
              </nav>
            </div>
          </div>
        </header>
        <main className="min-h-screen">
          {children}
        </main>
        <Toast />
      </body>
    </html>
  );
}
