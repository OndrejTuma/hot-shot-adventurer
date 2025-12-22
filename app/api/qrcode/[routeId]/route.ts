import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { getRouteById } from '@/lib/routes';

export async function GET(
  request: NextRequest,
  { params }: { params: { routeId: string } }
) {
  try {
    const { routeId } = params;
    
    // Get the current origin from the request
    const baseUrl = request.nextUrl.origin;
    
    let url: string;
    
    // Handle homepage QR code
    if (routeId === 'home') {
      url = baseUrl;
    } else {
      // Verify route exists
      const route = getRouteById(routeId);
      if (!route) {
        return new NextResponse('Route not found', { status: 404 });
      }
      
      // Generate QR code URL
      url = `${baseUrl}/route/${routeId}`;
    }
    
    // Generate QR code as buffer
    const qrCodeBuffer = await QRCode.toBuffer(url, {
      errorCorrectionLevel: 'M',
      type: 'png',
      width: 300,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    // Return as PNG image
    return new NextResponse(qrCodeBuffer as any, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `inline; filename="qr-${routeId}.png"`
      }
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    return new NextResponse('Failed to generate QR code', { status: 500 });
  }
}
