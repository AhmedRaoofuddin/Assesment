import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-red-100 mb-6">
            <svg className="h-12 w-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
          <p className="text-lg text-gray-700 mb-8">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or doesn&apos;t exist.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link href="/">
            <Button size="lg" className="w-full">
              <span className="flex items-center gap-2">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Back to Home
              </span>
            </Button>
          </Link>
          
          <div className="flex gap-4">
            <Link href="/upload" className="flex-1">
              <Button variant="outline" size="lg" className="w-full">
                Upload Photos
              </Button>
            </Link>
            <Link href="/api-docs" className="flex-1">
              <Button variant="outline" size="lg" className="w-full">
                API Docs
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Need help? Contact our support team or check our 
            <Link href="/api-docs" className="text-red-600 hover:text-red-700 font-medium ml-1">
              documentation
            </Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
