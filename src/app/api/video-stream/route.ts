import { NextResponse } from 'next/server';
import { getObjectStream } from '@/lib/aws';

export async function GET() {
  try {
    const adS3Key = process.env.AD_S3_KEY || 'ads/ad.mp4';
    
    // Get the video stream from S3
    const result = await getObjectStream(adS3Key);
    
    if (!result.Body) {
      return NextResponse.json(
        { message: 'Video not found' },
        { status: 404 }
      );
    }

    // For development, return a placeholder video response
    if (process.env.NODE_ENV !== 'production') {
      // Create a mock video response for development
      const mockVideoBuffer = Buffer.from('Mock video content - replace with actual video in production');
      
      return new NextResponse(mockVideoBuffer, {
        headers: {
          'Content-Type': 'video/mp4',
          'Content-Length': mockVideoBuffer.length.toString(),
          'Cache-Control': 'public, max-age=3600',
          'Accept-Ranges': 'bytes',
        },
      });
    }

    // Convert stream to buffer for production
    const chunks: Buffer[] = [];
    const stream = result.Body as any;
    
    return new Response(stream, {
      headers: {
        'Content-Type': 'video/mp4',
        'Cache-Control': 'public, max-age=3600',
        'Accept-Ranges': 'bytes',
      },
    });

  } catch (error) {
    console.error('Error streaming video:', error);
    return NextResponse.json(
      { message: 'Failed to stream video' },
      { status: 500 }
    );
  }
}