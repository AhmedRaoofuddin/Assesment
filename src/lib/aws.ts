import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// AWS Configuration
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const S3_BUCKET = process.env.S3_BUCKET;
const DDB_TABLE = process.env.DDB_TABLE || 'rayqube-registrations';

// Check if we're in development mode without AWS credentials
const isDevelopment = process.env.NODE_ENV !== 'production';
const hasAWSCredentials = AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY && S3_BUCKET;

// Only throw error at runtime, not at build time
if (!hasAWSCredentials && !isDevelopment && typeof window !== 'undefined') {
  console.warn('Missing AWS credentials, using mock implementations');
}

// Initialize AWS clients (only if credentials are available)
let s3Client: S3Client | null = null;
let dynamoClient: DynamoDBClient | null = null;
let docClient: DynamoDBDocumentClient | null = null;

if (hasAWSCredentials) {
  s3Client = new S3Client({
    region: AWS_REGION,
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID!,
      secretAccessKey: AWS_SECRET_ACCESS_KEY!,
    },
  });

  dynamoClient = new DynamoDBClient({
    region: AWS_REGION,
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID!,
      secretAccessKey: AWS_SECRET_ACCESS_KEY!,
    },
  });

  docClient = DynamoDBDocumentClient.from(dynamoClient);
}

// S3 utilities
export async function uploadToS3(key: string, body: Buffer, contentType: string) {
  if (!s3Client || !S3_BUCKET) {
    // Mock implementation for development
    const { mockUploadToS3 } = await import('./mock-aws');
    return mockUploadToS3(key, body, contentType);
  }

  const command = new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: key,
    Body: body,
    ContentType: contentType,
  });

  await s3Client.send(command);
  return key;
}

export async function getPresignedDownloadUrl(key: string, filename?: string) {
  if (!s3Client || !S3_BUCKET) {
    // Mock implementation for development
    const { mockGetPresignedDownloadUrl } = await import('./mock-aws');
    return mockGetPresignedDownloadUrl(key, filename);
  }

  const command = new GetObjectCommand({
    Bucket: S3_BUCKET,
    Key: key,
    ResponseContentDisposition: filename ? `attachment; filename="${filename}"` : 'attachment',
  });

  return await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1 hour
}

// DynamoDB utilities
export async function saveRegistration(registration: {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}) {
  if (!docClient) {
    // Mock implementation for development
    const { mockSaveRegistration } = await import('./mock-aws');
    return mockSaveRegistration(registration);
  }

  const command = new PutCommand({
    TableName: DDB_TABLE,
    Item: registration,
  });

  await docClient.send(command);
}

export async function getAllRegistrations() {
  if (!docClient) {
    // Mock implementation for development
    const { mockGetAllRegistrations } = await import('./mock-aws');
    return mockGetAllRegistrations();
  }

  const command = new ScanCommand({
    TableName: DDB_TABLE,
  });

  const result = await docClient.send(command);
  return result.Items || [];
}

// Export clients for advanced usage
export { s3Client, docClient, S3_BUCKET, DDB_TABLE };
