'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Confetti from 'react-confetti';
import { GameState } from '@/lib/game';

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

  useEffect(() => {
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
      if (route) {
        if (route.visited) {
          setVisited(true);
        } else {
          // Visit the route
          await visitRoute();
        }
      } else {
        // Invalid route
        router.push('/');
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
        
        // Hide confetti after 5 seconds
        setTimeout(() => setShowConfetti(false), 5000);
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Error visiting route:', error);
      router.push('/');
    }
  };

  const routeNames: { [key: string]: string } = {
    'ancient-temple-ruins': 'Ancient Temple Ruins',
    'forbidden-crystal-cave': 'Forbidden Crystal Cave',
    'lost-city-of-gold': 'Lost City of Gold',
    'mysterious-jungle-path': 'Mysterious Jungle Path',
    'hidden-treasure-vault': 'Hidden Treasure Vault',
    'sacred-mountain-peak': 'Sacred Mountain Peak',
    'desert-oasis-secret': 'Desert Oasis Secret',
    'underwater-archaeological-site': 'Underwater Archaeological Site',
  };

  const routeDescriptions: { [key: string]: string } = {
    'ancient-temple-ruins': 'You\'ve discovered the ancient temple ruins! The walls whisper secrets of forgotten civilizations.',
    'forbidden-crystal-cave': 'The forbidden crystal cave reveals its treasures! The crystals shimmer with otherworldly light.',
    'lost-city-of-gold': 'The lost city of gold stands before you! Legends speak of untold riches hidden within.',
    'mysterious-jungle-path': 'You\'ve found the mysterious jungle path! Ancient markers guide your way through the dense foliage.',
    'hidden-treasure-vault': 'The hidden treasure vault opens! Centuries of accumulated wealth glimmer in the torchlight.',
    'sacred-mountain-peak': 'You\'ve reached the sacred mountain peak! The view is breathtaking, and the air is filled with ancient energy.',
    'desert-oasis-secret': 'The desert oasis secret is revealed! A hidden spring flows with crystal-clear water.',
    'underwater-archaeological-site': 'You\'ve discovered the underwater archaeological site! Sunken treasures await discovery.',
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div style={{ fontSize: '24px' }}>Exploring the location...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
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
      }}>
        {visited && (
          <>
            <div style={{ fontSize: '80px', marginBottom: '20px' }}>🎉</div>
            <h1 style={{ fontSize: '42px', marginBottom: '20px', color: '#FFD700' }}>
              {routeNames[routeId] || 'Location Discovered!'}
            </h1>
            <p style={{ fontSize: '20px', marginBottom: '30px', lineHeight: '1.6', opacity: 0.9 }}>
              {routeDescriptions[routeId] || 'You\'ve made an incredible discovery!'}
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
    </div>
  );
}

