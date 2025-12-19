'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Confetti from 'react-confetti';
import { GameState } from '@/lib/game';
import { getRouteById } from '@/lib/routes';

export default function RoutePage() {
  const params = useParams();
  const router = useRouter();
  const routeId = params?.routeId as string;
  const [visited, setVisited] = useState(false);
  const [points, setPoints] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(true);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [routeConfig, setRouteConfig] = useState(getRouteById(routeId));

  useEffect(() => {
    setRouteConfig(getRouteById(routeId));
    checkRoute();
  }, [routeId]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      const handleResize = () => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const checkRoute = async () => {
    try {
      const response = await fetch('/api/game');
      const data: GameState = await response.json();
      setGameState(data);
      
      const route = data.routes.find(r => r.routeId === routeId);
      if (!route || !routeConfig) {
        // Invalid route
        router.push('/');
        return;
      }
      
      if (route.visited) {
        setVisited(true);
      } else {
        // Visit the route
        await visitRoute();
      }
      setLoading(false);
    } catch (error) {
      console.error('Error checking route:', error);
      setLoading(false);
    }
  };

  const visitRoute = async () => {
    try {
      const response = await fetch('/api/game/visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ routeId }),
      });

      const result = await response.json();
      
      if (result.success) {
        setPoints(result.points);
        setVisited(true);
        setShowConfetti(true);
        setGameState(result.state);
        
        // Add celebration animation delay
        setTimeout(() => {
          // Hide confetti after 5 seconds
          setShowConfetti(false);
        }, 5000);
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Error visiting route:', error);
      router.push('/');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div style={{ fontSize: '24px' }}>Exploring the location...</div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '20px',
      backgroundImage: 'url(/page-background.svg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
    }}>
      {showConfetti && windowSize.width > 0 && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          onConfettiComplete={() => setShowConfetti(false)}
        />
      )}
      
      <div style={{
        maxWidth: '700px',
        textAlign: 'center',
        background: 'rgba(0, 0, 0, 0.5)',
        borderRadius: '20px',
        padding: '60px 40px',
        backdropFilter: 'blur(10px)',
        border: '3px solid rgba(255, 215, 0, 0.5)',
        boxShadow: '0 0 50px rgba(255, 215, 0, 0.3)',
        animation: visited ? 'celebrateEntry 0.8s ease' : 'none',
      }}>
        {visited && (
          <>
            <div style={{ fontSize: '80px', marginBottom: '20px' }}>🎉</div>
            <h1 style={{ fontSize: '42px', marginBottom: '20px', color: '#FFD700' }}>
              {routeConfig?.name || 'Location Discovered!'}
            </h1>
            <p style={{ fontSize: '20px', marginBottom: '30px', lineHeight: '1.6', opacity: 0.9 }}>
              {routeConfig?.description || 'You\'ve made an incredible discovery!'}
            </p>
            
            <div style={{
              background: 'rgba(255, 215, 0, 0.2)',
              borderRadius: '15px',
              padding: '30px',
              marginBottom: '30px',
            }}>
              <div style={{ fontSize: '14px', opacity: 0.8, marginBottom: '10px' }}>Coins Collected</div>
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#FFD700', marginBottom: '10px' }}>
                🪙 +{points.toLocaleString()}
              </div>
              {gameState && (
                <div style={{ fontSize: '18px', opacity: 0.9 }}>
                  Total: {gameState.totalPoints.toLocaleString()} / 5,000 coins
                </div>
              )}
            </div>

            <button
              onClick={() => router.push('/')}
              style={{
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                border: 'none',
                borderRadius: '15px',
                padding: '15px 40px',
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#000',
                cursor: 'pointer',
                boxShadow: '0 5px 20px rgba(255, 215, 0, 0.4)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(255, 215, 0, 0.6)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 5px 20px rgba(255, 215, 0, 0.4)';
              }}
            >
              Continue Adventure 🗺️
            </button>
          </>
        )}
      </div>
      <style jsx>{`
        @keyframes celebrateEntry {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

