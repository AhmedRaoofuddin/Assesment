import React from 'react';
import Link from 'next/link';

export default function ApiDocsPage() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Pizza Hut API Documentation
          </h1>
          <p className="mt-6 text-xl text-gray-700 max-w-3xl mx-auto">
            Complete reference for the Pizza Hut platform API endpoints
          </p>
        </div>

        {/* Overview */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Overview</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-4">
              The Pizza Hut API provides endpoints for user registration, file uploads, and data reporting. 
              All endpoints use standard HTTP methods and return JSON responses.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">Base URL</h3>
              <code className="text-blue-800 bg-blue-100 px-2 py-1 rounded">
                https://your-domain.com/api
              </code>
            </div>
          </div>
        </div>

        {/* Endpoints */}
        <div className="space-y-8">
          {/* Registration Endpoint */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">POST</span>
              <h3 className="text-2xl font-bold text-gray-900">/api/register</h3>
            </div>
            
            <p className="text-gray-700 mb-6">Register a new user in the system.</p>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Request Body</h4>
                <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                  <code>{`{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890"
}`}</code>
                </pre>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Success Response (201)</h4>
                <pre className="bg-green-50 p-4 rounded-lg overflow-x-auto">
                  <code>{`{
  "message": "Registration successful",
  "id": "user_id_here"
}`}</code>
                </pre>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Error Response (400)</h4>
                <pre className="bg-red-50 p-4 rounded-lg overflow-x-auto">
                  <code>{`{
  "message": "Invalid email address"
}`}</code>
                </pre>
              </div>
            </div>
          </div>

          {/* Upload Direct Endpoint */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">POST</span>
              <h3 className="text-2xl font-bold text-gray-900">/api/upload-direct</h3>
            </div>
            
            <p className="text-gray-700 mb-6">Upload a PNG image and receive a direct download link.</p>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Headers</h4>
                <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                  <code>Content-Type: multipart/form-data</code>
                </pre>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Request Body</h4>
                <p className="text-gray-700 mb-2">Form-data with the following field:</p>
                <ul className="list-disc list-inside text-gray-700 ml-4">
                  <li><strong>file</strong>: PNG image file (max 5MB)</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Success Response (200)</h4>
                <pre className="bg-green-50 p-4 rounded-lg overflow-x-auto">
                  <code>{`{
  "success": true,
  "message": "Upload successful",
  "downloadUrl": "https://presigned-s3-url...",
  "key": "uploads/uuid.png",
  "filename": "original-name.png",
  "size": 1234567,
  "expiresIn": 3600
}`}</code>
                </pre>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Error Response (400)</h4>
                <pre className="bg-red-50 p-4 rounded-lg overflow-x-auto">
                  <code>{`{
  "success": false,
  "message": "Only PNG files are allowed"
}`}</code>
                </pre>
              </div>
            </div>
          </div>

          {/* CSV Report Endpoint */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">GET</span>
              <h3 className="text-2xl font-bold text-gray-900">/report.csv</h3>
            </div>
            
            <p className="text-gray-700 mb-6">Download a CSV report of all user registrations (requires authentication token).</p>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Query Parameters</h4>
                <ul className="list-disc list-inside text-gray-700 ml-4">
                  <li><strong>token</strong>: Required authentication token</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Example Request</h4>
                <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                  <code>GET /report.csv?token=your_secret_token</code>
                </pre>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Success Response</h4>
                <p className="text-gray-700 mb-2">Returns CSV file with headers:</p>
                <pre className="bg-green-50 p-4 rounded-lg overflow-x-auto">
                  <code>Content-Type: text/csv
Content-Disposition: attachment; filename=&quot;registrations.csv&quot;

id,name,email,phone,createdAt
user1,John Doe,john@example.com,+1234567890,2025-01-01T00:00:00.000Z</code>
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Postman Instructions */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Postman Instructions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Testing File Upload</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                <li>Open Postman and create a new request</li>
                <li>Set method to <strong>POST</strong></li>
                <li>Enter URL: <code className="bg-gray-100 px-2 py-1 rounded">https://your-domain.com/api/upload-direct</code></li>
                <li>Go to the <strong>Body</strong> tab</li>
                <li>Select <strong>form-data</strong></li>
                <li>Add key: <code className="bg-gray-100 px-2 py-1 rounded">file</code></li>
                <li>Change type to <strong>File</strong> and select a PNG image</li>
                <li>Click <strong>Send</strong></li>
              </ol>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Testing User Registration</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                <li>Create a new POST request</li>
                <li>URL: <code className="bg-gray-100 px-2 py-1 rounded">https://your-domain.com/api/register</code></li>
                <li>Set Content-Type header to <code className="bg-gray-100 px-2 py-1 rounded">application/json</code></li>
                <li>In Body (raw JSON), add user data</li>
                <li>Click <strong>Send</strong></li>
              </ol>
            </div>
          </div>
        </div>

        {/* Rate Limits & Security */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Rate Limits & Security</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Rate Limits</h3>
              <ul className="space-y-2 text-gray-700">
                <li><strong>Upload endpoints:</strong> 10 requests per minute per IP</li>
                <li><strong>Registration:</strong> 5 requests per minute per IP</li>
                <li><strong>File size limit:</strong> 5MB maximum</li>
                <li><strong>Supported formats:</strong> PNG only</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Security</h3>
              <ul className="space-y-2 text-gray-700">
                <li><strong>HTTPS only:</strong> All API calls must use HTTPS</li>
                <li><strong>CORS enabled:</strong> Cross-origin requests supported</li>
                <li><strong>Link expiry:</strong> Download URLs expire after 1 hour</li>
                <li><strong>Input validation:</strong> All inputs are validated server-side</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Need help? Check our <Link href="/" className="text-red-600 hover:text-red-700 font-medium">main platform</Link> or 
            try the <Link href="/upload" className="text-red-600 hover:text-red-700 font-medium">upload interface</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
