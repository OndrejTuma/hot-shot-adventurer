import { headers } from 'next/headers';
import QRCodesPageContent from './QRCodesPageContent';

export default async function QRCodesPage() {
  // Get headers on the server side to construct baseUrl
  // This matches how the API route gets request.nextUrl.origin
  const headersList = headers();
  const host = headersList.get('host') || '';
  
  // Check for forwarded protocol (when behind proxy/load balancer)
  const forwardedProto = headersList.get('x-forwarded-proto');
  // Check for forwarded host (when behind proxy)
  const forwardedHost = headersList.get('x-forwarded-host');
  
  const finalHost = forwardedHost || host;
  const protocol = forwardedProto || (process.env.NODE_ENV === 'production' ? 'https' : 'http');
  
  // Construct baseUrl the same way the API route constructs request.nextUrl.origin
  const baseUrl = `${protocol}://${finalHost}`;

  return <QRCodesPageContent baseUrl={baseUrl} />;
}
