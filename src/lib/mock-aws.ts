// Mock AWS functions for local development when AWS credentials are not available

export const mockRegistrations = [
  {
    id: 'test-1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'test-2', 
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+0987654321',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

export async function mockSaveRegistration(registration: {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}) {
  console.log('Mock: Saving registration', registration);
  mockRegistrations.push(registration);
  return registration;
}

export async function mockGetAllRegistrations() {
  console.log('Mock: Getting all registrations');
  return mockRegistrations;
}

export async function mockUploadToS3(key: string, body: Buffer, contentType: string) {
  console.log('Mock: Uploading to S3', { key, size: body.length, contentType });
  return key;
}

export async function mockGetPresignedDownloadUrl(key: string, filename?: string) {
  console.log('Mock: Getting presigned URL', { key, filename });
  // Return a mock URL that would work for testing
  return `https://mock-s3-bucket.com/${key}?presigned=true&filename=${filename || 'download'}`;
}
