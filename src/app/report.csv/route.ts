import { NextRequest, NextResponse } from 'next/server';
import { getAllRegistrations } from '@/lib/aws';

export async function GET(request: NextRequest) {
  try {
    // Check for report token
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const expectedToken = process.env.REPORT_TOKEN;

    if (!token || !expectedToken || token !== expectedToken) {
      return NextResponse.json(
        { message: 'Unauthorized - Valid token required' },
        { status: 403 }
      );
    }

    // Get all registrations from DynamoDB
    const registrations = await getAllRegistrations();

    // Create CSV content with proper escaping
    const csvHeaders = 'id,name,email,phone,createdAt\n';
    const csvRows = registrations
      .map(reg => {
        const escapeCsv = (str: string) => `"${str.replace(/"/g, '""')}"`;
        return `${escapeCsv(reg.id)},${escapeCsv(reg.name)},${escapeCsv(reg.email)},${escapeCsv(reg.phone)},${escapeCsv(reg.createdAt)}`;
      })
      .join('\n');
    
    const csvContent = csvHeaders + csvRows;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="pizza-hut-registrations.csv"',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'X-Content-Type-Options': 'nosniff',
      },
    });

  } catch (error) {
    console.error('CSV report error:', error);
    return NextResponse.json(
      { message: 'Failed to generate report' },
      { status: 500 }
    );
  }
}
