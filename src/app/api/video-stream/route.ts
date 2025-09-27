import { NextResponse } from 'next/server';
import { getPresignedDownloadUrl } from '@/lib/aws';

export async function GET() {
  try {
    const adS3Key = process.env.AD_S3_KEY || 'ads/ad.mp4';
    
    // Get a presigned URL for streaming (without download headers)
    const streamUrl = await getPresignedDownloadUrl(adS3Key);
    
    // Redirect to the presigned URL for streaming
    return NextResponse.redirect(streamUrl);
  } catch (error) {
    console.error('Error streaming video:', error);
    return NextResponse.json(
      { message: 'Video not found' },
      { status: 404 }
    );
  }
}
