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
        <div className="text-center mb-12">
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-green-100 mb-6">
            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Thank You for Joining!
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
            Welcome to PizzaHub! As a thank you for registering, enjoy this exclusive video content.
          </p>
        </div>

        {/* Video Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="aspect-video bg-gray-900 flex items-center justify-center">
            <video 
              controls 
              className="w-full h-full"
              poster="/api/video-thumbnail"
            >
              <source src="/api/video-stream" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Exclusive Pizza Making Masterclass
            </h2>
            <p className="text-gray-600 mb-6">
              Learn the secrets of authentic Italian pizza making from master chefs.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleDownload}
                disabled={isDownloading}
                size="lg"
                className="bg-green-600 hover:bg-green-700"
              >
                {isDownloading ? 'Preparing Download...' : 'Download Video'}
              </Button>
              
              <Link href="/">
                <Button
                  variant="outline"
                  size="lg"
                >
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-red-50 rounded-xl p-8 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            What&apos;s Next?
          </h3>
          <p className="text-gray-700 mb-6">
            Ready to share your own pizza creations? Upload your photos and get shareable QR codes!
          </p>
          <Link href="/upload">
            <Button size="lg">
              Upload Your Photos
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
