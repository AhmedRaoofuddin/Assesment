'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { toast } from 'react-hot-toast';
import { formatBytes } from '@/lib/utils';
import QRCode from 'qrcode';

interface UploadResult {
  downloadUrl: string;
  key: string;
  filename: string;
}

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;

    // Validate file type
    if (file.type !== 'image/png') {
      toast.error('Please select a PNG image file');
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setSelectedFile(file);
    setUploadResult(null);
    setQrCodeDataUrl(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upload failed');
      }

      const result = await response.json();
      setUploadResult({
        downloadUrl: result.downloadUrl,
        key: result.key,
        filename: selectedFile.name,
      });

      // Generate QR code
      const qrDataUrl = await QRCode.toDataURL(result.downloadUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: '#DC2626', // red-600
          light: '#FFFFFF'
        }
      });
      setQrCodeDataUrl(qrDataUrl);

      toast.success('Upload successful!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleCopyLink = () => {
    if (uploadResult?.downloadUrl) {
      navigator.clipboard.writeText(uploadResult.downloadUrl);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleTestDownload = () => {
    if (uploadResult?.downloadUrl) {
      window.open(uploadResult.downloadUrl, '_blank');
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setUploadResult(null);
    setQrCodeDataUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 sm:text-6xl leading-tight">
            Share Your <span className="text-red-600">Pizza Creations</span>
          </h1>
          <p className="mt-8 text-xl text-gray-800 max-w-3xl mx-auto leading-relaxed font-medium">
            Upload your pizza photos and get instant QR codes for easy sharing with friends and social media
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-10 border border-gray-100">
          {!uploadResult ? (
            <div className="space-y-6">
              {/* File Selection */}
              <div className="border-3 border-dashed border-gray-400 rounded-xl p-12 text-center hover:border-red-500 hover:bg-red-50 transition-all duration-300 cursor-pointer">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                
                {!selectedFile ? (
                  <div>
                    <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-full bg-red-100 mb-6">
                      <svg className="h-10 w-10 text-red-600" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div>
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <span className="text-red-600 font-semibold hover:text-red-700 text-lg">
                          Click to upload your pizza photo
                        </span>
                        <span className="text-gray-700 block mt-2"> or drag and drop here</span>
                      </label>
                      <p className="text-base text-gray-600 mt-4 font-medium">PNG files up to 5MB</p>
                      <p className="text-sm text-gray-500 mt-2">Get instant QR codes for easy sharing</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-full bg-green-100 mb-6">
                      <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xl font-semibold text-gray-900 mb-2">{selectedFile.name}</p>
                      <p className="text-base text-gray-600 font-medium">{formatBytes(selectedFile.size)}</p>
                      <p className="text-sm text-green-600 mt-2">✓ Ready to upload</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleUpload}
                  disabled={!selectedFile || uploading}
                  className="flex-1"
                  size="lg"
                >
                  {uploading ? 'Uploading...' : 'Upload PNG'}
                </Button>
                
                {selectedFile && (
                  <Button
                    onClick={resetUpload}
                    variant="outline"
                    size="lg"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center space-y-6">
              {/* Success Message */}
              <div className="mb-12">
                <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-full bg-green-100 mb-6">
                  <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Upload Successful!</h2>
                <p className="text-gray-700 mt-3 text-lg">Your photo is ready to share with the world</p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
                  <p className="text-sm text-green-800 font-medium">📷 File: {uploadResult.filename}</p>
                  <p className="text-xs text-green-700 mt-1">Uploaded successfully • QR code generated</p>
                </div>
              </div>

              {/* QR Code */}
              {qrCodeDataUrl && (
                <div className="mb-10">
                  <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={qrCodeDataUrl} 
                      alt="QR Code for download link" 
                      className="mx-auto border-2 border-white rounded-xl shadow-lg"
                    />
                    <div className="mt-6 text-center">
                      <p className="text-base font-semibold text-gray-900 mb-2">
                        📱 Scan with your phone
                      </p>
                      <p className="text-sm text-gray-600">
                        Instant download: {uploadResult.filename}
                      </p>
                      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Secure • Expires in 1 hour
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button
                    onClick={handleCopyLink}
                    variant="outline"
                    size="lg"
                    className="shadow-md"
                  >
                    <span className="flex items-center gap-2">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy Link
                    </span>
                  </Button>
                  
                  <Button
                    onClick={handleTestDownload}
                    size="lg"
                    className="shadow-md"
                  >
                    <span className="flex items-center gap-2">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Test Download
                    </span>
                  </Button>
                </div>

                <Button
                  onClick={resetUpload}
                  variant="outline"
                  className="w-full shadow-md"
                  size="lg"
                >
                  <span className="flex items-center gap-2">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Upload Another Photo
                  </span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
