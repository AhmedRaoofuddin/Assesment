import { NextRequest, NextResponse } from 'next/server';
import { uploadToS3, getPresignedDownloadUrl } from '@/lib/aws';
import { v4 as uuidv4 } from 'uuid';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Enable CORS for this API endpoint
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { 
          success: false,
          message: 'No file provided' 
        },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // Validate file type
    if (file.type !== 'image/png') {
      return NextResponse.json(
        { 
          success: false,
          message: 'Only PNG files are allowed' 
        },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { 
          success: false,
          message: 'File size exceeds 5MB limit' 
        },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
        }
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
      success: true,
      message: 'Upload successful',
      downloadUrl,
      key: s3Key,
      filename: file.name,
      size: file.size,
      expiresIn: 3600, // 1 hour
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Upload failed' 
      },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}
