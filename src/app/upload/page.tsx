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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Upload Your <span className="text-red-600">Pizza Photos</span>
          </h1>
          <p className="mt-6 text-xl text-gray-600">
            Share your pizza creations and get a QR code for easy sharing
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {!uploadResult ? (
            <div className="space-y-6">
              {/* File Selection */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-red-400 transition-colors">
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
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="mt-4">
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <span className="text-red-600 font-medium hover:text-red-500">
                          Click to upload
                        </span>
                        <span className="text-gray-600"> or drag and drop</span>
                      </label>
                      <p className="text-sm text-gray-500 mt-2">PNG files up to 5MB</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="mt-4">
                      <p className="text-lg font-medium text-gray-900">{selectedFile.name}</p>
                      <p className="text-sm text-gray-500">{formatBytes(selectedFile.size)}</p>
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
              <div className="mb-8">
                <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-green-100 mb-4">
                  <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Upload Successful!</h2>
                <p className="text-gray-600 mt-2">Your photo is ready to share</p>
              </div>

              {/* QR Code */}
              {qrCodeDataUrl && (
                <div className="mb-8">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={qrCodeDataUrl} 
                    alt="QR Code for download link" 
                    className="mx-auto border-2 border-gray-200 rounded-lg"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Scan to download: {uploadResult.filename}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleCopyLink}
                  variant="outline"
                  size="lg"
                  className="flex-1"
                >
                  Copy Link
                </Button>
                
                <Button
                  onClick={handleTestDownload}
                  size="lg"
                  className="flex-1"
                >
                  Test Download
                </Button>
              </div>

              <Button
                onClick={resetUpload}
                variant="outline"
                className="w-full"
              >
                Upload Another Photo
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
