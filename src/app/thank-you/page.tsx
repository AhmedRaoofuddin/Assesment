'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { toast } from 'react-hot-toast';

export default function ThankYouPage() {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    
    try {
      const response = await fetch('/api/download-video');
      
      if (!response.ok) {
        throw new Error('Failed to get download link');
      }

      const { downloadUrl } = await response.json();
      
      // Create a temporary link to trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'pizza-ad.mp4';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Download started!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download video');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Success Message */}
        <div className="text-center mb-16">
          <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-full bg-green-100 mb-8">
            <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 sm:text-6xl leading-tight">
            Welcome to Pizza Hut!
          </h1>
          <p className="mt-8 text-xl text-gray-800 max-w-2xl mx-auto leading-relaxed font-medium">
            Thank you for joining our community! As a welcome gift, enjoy this exclusive video content showcasing our premium pizza-making process.
          </p>
        </div>

        {/* Video Section */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-12 border border-gray-100">
          <div className="aspect-video bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center relative">
            <div className="text-center p-8">
              <div className="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-red-100 mb-6">
                <svg className="h-12 w-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Premium Pizza Content</h3>
              <p className="text-gray-700 mb-6 max-w-md mx-auto">Your exclusive video content is ready for download. This premium content showcases our signature pizza-making techniques.</p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-yellow-800">🎥 Video: &quot;Pizza Hut Masterclass - Premium Techniques&quot;</p>
                <p className="text-xs text-yellow-700 mt-1">Duration: ~5 minutes | Format: MP4 | Size: ~15MB</p>
              </div>
            </div>
          </div>
          
          <div className="p-10 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Exclusive Pizza Making Masterclass
            </h2>
            <p className="text-gray-700 mb-8 text-lg leading-relaxed max-w-2xl mx-auto">
              Learn the secrets of authentic pizza making from our master chefs. This exclusive content is available only to our registered community members.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                onClick={handleDownload}
                disabled={isDownloading}
                size="lg"
                className="bg-green-600 hover:bg-green-700 shadow-lg"
              >
                {isDownloading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Preparing Download...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download Video
                  </span>
                )}
              </Button>
              
              <Link href="/">
                <Button
                  variant="outline"
                  size="lg"
                  className="shadow-md"
                >
                  <span className="flex items-center gap-2">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Back to Home
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-10 text-center border border-red-100">
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-red-100 mb-6">
            <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Ready for the Next Step?
          </h3>
          <p className="text-gray-700 mb-8 text-lg leading-relaxed max-w-2xl mx-auto">
            Share your own pizza creations with our community! Upload your photos and get shareable QR codes for easy distribution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/upload">
              <Button size="lg" className="shadow-lg">
                <span className="flex items-center gap-2">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  Upload Your Photos
                </span>
              </Button>
            </Link>
            <Link href="/api-docs">
              <Button variant="outline" size="lg" className="shadow-md">
                <span className="flex items-center gap-2">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  API Documentation
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
