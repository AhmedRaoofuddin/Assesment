import { NextRequest, NextResponse } from 'next/server';
import { uploadToS3, getPresignedDownloadUrl } from '@/lib/aws';
import { v4 as uuidv4 } from 'uuid';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { message: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (file.type !== 'image/png') {
      return NextResponse.json(
        { message: 'Only PNG files are allowed' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { message: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop() || 'png';
    const uniqueFilename = `${uuidv4()}.${fileExtension}`;
    const s3Key = `uploads/${uniqueFilename}`;

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to S3
    await uploadToS3(s3Key, buffer, file.type);

    // Generate presigned download URL
    const downloadUrl = await getPresignedDownloadUrl(s3Key, file.name);

    return NextResponse.json({
      message: 'Upload successful',
      downloadUrl,
      key: s3Key,
      filename: file.name,
      size: file.size,
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { message: 'Upload failed' },
      { status: 500 }
    );
  }
}
