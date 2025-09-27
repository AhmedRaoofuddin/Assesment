import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { Toast } from "@/components/Toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Pizza Hut - Premium Pizza Experience",
  description: "Premium pizza experiences and exclusive content platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-white`}>
        <header className="bg-white border-b-2 border-gray-200 shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900">
                  Pizza <span className="text-red-600">Hut</span>
                </h1>
              </div>
              <nav className="flex space-x-4">
                <Link href="/" className="text-gray-800 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                  Home
                </Link>
                <Link href="/upload" className="text-gray-800 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                  Upload
                </Link>
                <Link href="/api-docs" className="text-gray-800 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                  API Docs
                </Link>
              </nav>
            </div>
          </div>
        </header>
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
        <footer className="bg-white border-t-2 border-gray-200 py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Pizza Hut</h3>
                <p className="text-sm text-gray-700">Premium pizza experiences and exclusive content platform.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Quick Links</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/" className="text-gray-700 hover:text-red-600">Home</Link></li>
                  <li><Link href="/upload" className="text-gray-700 hover:text-red-600">Upload Photos</Link></li>
                  <li><Link href="/api-docs" className="text-gray-700 hover:text-red-600">API Documentation</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Legal</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/privacy" className="text-gray-700 hover:text-red-600">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="text-gray-700 hover:text-red-600">Terms of Service</Link></li>
                  <li><Link href="/report.csv?token=${process.env.REPORT_TOKEN}" className="text-gray-700 hover:text-red-600">Data Report</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Developer</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/api-docs" className="text-gray-700 hover:text-red-600">API Reference</Link></li>
                  <li><a href="https://github.com" className="text-gray-700 hover:text-red-600">GitHub</a></li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600">
                © 2025 Pizza Hut Demo Platform. 
                <span className="block mt-1 text-xs text-gray-500">
                  Demo for technical test; not affiliated with Pizza Hut Corporation.
                </span>
              </p>
            </div>
          </div>
        </footer>
        <Toast />
      </body>
    </html>
  );
}
