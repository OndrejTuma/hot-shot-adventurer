'use client';

import { ROUTES } from '@/lib/routes';
import { useRouter } from 'next/navigation';

export default function QRCodesPage() {
  const router = useRouter();

  return (
    <div style={{ 
      minHeight: '100vh', 
      padding: '40px 20px',
      backgroundImage: 'url(/page-background.svg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '42px', fontWeight: 'bold', marginBottom: '10px', color: '#FFD700' }}>
            📱 Route QR Codes
          </h1>
          <p style={{ fontSize: '18px', opacity: 0.9, marginBottom: '20px' }}>
            Scan these QR codes to access each route directly
          </p>
          <button
            onClick={() => router.push('/')}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '10px',
              padding: '10px 20px',
              fontSize: '16px',
              color: '#fff',
              cursor: 'pointer',
              marginRight: '10px',
            }}
          >
            ← Back to Game
          </button>
          <button
            onClick={() => router.push('/admin')}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '10px',
              padding: '10px 20px',
              fontSize: '16px',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            Admin Panel
          </button>
        </header>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '30px',
        }}>
          {/* Homepage QR Code */}
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.5)',
              borderRadius: '15px',
              padding: '30px',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255, 215, 0, 0.3)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <h3 style={{ 
              fontSize: '20px', 
              fontWeight: 'bold', 
              marginBottom: '15px',
              color: '#FFD700',
            }}>
              🏠 Homepage
            </h3>
            
            <div style={{
              background: '#fff',
              padding: '15px',
              borderRadius: '10px',
              marginBottom: '15px',
              display: 'inline-block',
            }}>
              <img
                src="/api/qrcode/home"
                alt="QR code for homepage"
                style={{
                  width: '200px',
                  height: '200px',
                  display: 'block',
                }}
              />
            </div>
            
            <div style={{
              fontSize: '14px',
              opacity: 0.8,
              marginBottom: '10px',
              wordBreak: 'break-all',
            }}>
              http://46.101.197.134:99
            </div>
            
            <a
              href="/api/qrcode/home"
              download="qr-home.png"
              style={{
                marginTop: '15px',
                padding: '8px 16px',
                background: 'rgba(255, 215, 0, 0.2)',
                border: '1px solid rgba(255, 215, 0, 0.5)',
                borderRadius: '8px',
                color: '#FFD700',
                textDecoration: 'none',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              Download QR Code
            </a>
          </div>

          {ROUTES.map((route) => {
            const url = `http://46.101.197.134:99/route/${route.routeId}`;
            return (
              <div
                key={route.routeId}
                style={{
                  background: 'rgba(0, 0, 0, 0.5)',
                  borderRadius: '15px',
                  padding: '30px',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255, 215, 0, 0.3)',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <h3 style={{ 
                  fontSize: '20px', 
                  fontWeight: 'bold', 
                  marginBottom: '15px',
                  color: '#FFD700',
                }}>
                  {route.name}
                </h3>
                
                <div style={{
                  background: '#fff',
                  padding: '15px',
                  borderRadius: '10px',
                  marginBottom: '15px',
                  display: 'inline-block',
                }}>
                  <img
                    src={`/api/qrcode/${route.routeId}`}
                    alt={`QR code for ${route.name}`}
                    style={{
                      width: '200px',
                      height: '200px',
                      display: 'block',
                    }}
                  />
                </div>
                
                <div style={{
                  fontSize: '14px',
                  opacity: 0.8,
                  marginBottom: '10px',
                  wordBreak: 'break-all',
                }}>
                  {url}
                </div>
                
                <div style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#FFD700',
                }}>
                  🪙 {route.points} points
                </div>
                
                <a
                  href={`/api/qrcode/${route.routeId}`}
                  download={`qr-${route.routeId}.png`}
                  style={{
                    marginTop: '15px',
                    padding: '8px 16px',
                    background: 'rgba(255, 215, 0, 0.2)',
                    border: '1px solid rgba(255, 215, 0, 0.5)',
                    borderRadius: '8px',
                    color: '#FFD700',
                    textDecoration: 'none',
                    fontSize: '14px',
                    cursor: 'pointer',
                  }}
                >
                  Download QR Code
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
