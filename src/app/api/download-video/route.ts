import { NextResponse } from 'next/server';
import { getPresignedDownloadUrl } from '@/lib/aws';

export async function GET() {
  try {
    const adS3Key = process.env.AD_S3_KEY || 'ads/ad.mp4';
    
    const downloadUrl = await getPresignedDownloadUrl(adS3Key, 'pizza-hut-masterclass.mp4');
    
    return NextResponse.json({ downloadUrl });
  } catch (error) {
    console.error('Error getting video download URL:', error);
    return NextResponse.json(
      { message: 'Failed to get download URL' },
      { status: 500 }
    );
  }
}