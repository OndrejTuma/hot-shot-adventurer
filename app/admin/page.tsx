'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GameState } from '@/lib/game';

export default function AdminPage() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchGameState();
    const interval = setInterval(fetchGameState, 2000);
    return () => clearInterval(interval);
  }, []);

  const fetchGameState = async () => {
    try {
      const response = await fetch('/api/game');
      const data = await response.json();
      setGameState(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching game state:', error);
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset the game? This will clear all progress.')) {
      return;
    }

    setResetting(true);
    try {
      const response = await fetch('/api/admin/reset', {
        method: 'POST',
      });
      
      if (response.ok) {
        await fetchGameState();
        alert('Game reset successfully!');
      } else {
        alert('Failed to reset game');
      }
    } catch (error) {
      console.error('Error resetting game:', error);
      alert('Failed to reset game');
    } finally {
      setResetting(false);
    }
  };

  if (loading || !gameState) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div style={{ fontSize: '24px' }}>Loading admin panel...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '42px', fontWeight: 'bold', marginBottom: '10px' }}>
            🎮 Admin Panel
          </h1>
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
        </header>

        <div style={{
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '15px',
          padding: '30px',
          marginBottom: '30px',
          backdropFilter: 'blur(10px)',
          border: '2px solid rgba(255, 215, 0, 0.3)',
        }}>
          <h2 style={{ fontSize: '28px', marginBottom: '20px', color: '#FFD700' }}>
            Game Statistics
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '14px', opacity: 0.8, marginBottom: '5px' }}>Total Points</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#FFD700' }}>
                {gameState.totalPoints} / 5,000
              </div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '14px', opacity: 0.8, marginBottom: '5px' }}>Routes Visited</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#FFD700' }}>
                {gameState.visitedRoutes} / {gameState.totalRoutes}
              </div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '14px', opacity: 0.8, marginBottom: '5px' }}>Completion</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#FFD700' }}>
                {Math.round((gameState.visitedRoutes / gameState.totalRoutes) * 100)}%
              </div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '14px', opacity: 0.8, marginBottom: '5px' }}>Status</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: gameState.completed ? '#4CAF50' : '#FFA500' }}>
                {gameState.completed ? '✅ Complete' : '⏳ In Progress'}
              </div>
            </div>
          </div>
        </div>

        <div style={{
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '15px',
          padding: '30px',
          marginBottom: '30px',
          backdropFilter: 'blur(10px)',
          border: '2px solid rgba(255, 215, 0, 0.3)',
        }}>
          <h2 style={{ fontSize: '28px', marginBottom: '20px', color: '#FFD700' }}>
            Route Details
          </h2>
          
          <div style={{ display: 'grid', gap: '15px' }}>
            {gameState.routes.map((route) => (
              <div
                key={route.routeId}
                style={{
                  background: route.visited ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 152, 0, 0.2)',
                  borderRadius: '10px',
                  padding: '20px',
                  border: `2px solid ${route.visited ? 'rgba(76, 175, 80, 0.5)' : 'rgba(255, 152, 0, 0.5)'}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>
                    {route.routeId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </div>
                  <div style={{ fontSize: '14px', opacity: 0.8 }}>
                    {route.visited ? `Visited on ${new Date(route.visitedAt!).toLocaleString()}` : 'Not visited'}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#FFD700' }}>
                    {route.points} pts
                  </div>
                  <div style={{ fontSize: '24px', marginTop: '5px' }}>
                    {route.visited ? '✅' : '⏳'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          background: 'rgba(244, 67, 54, 0.2)',
          borderRadius: '15px',
          padding: '30px',
          backdropFilter: 'blur(10px)',
          border: '2px solid rgba(244, 67, 54, 0.5)',
        }}>
          <h2 style={{ fontSize: '28px', marginBottom: '20px', color: '#f44336' }}>
            ⚠️ Danger Zone
          </h2>
          <p style={{ marginBottom: '20px', opacity: 0.9 }}>
            Resetting the game will clear all progress and allow players to start fresh.
          </p>
          <button
            onClick={handleReset}
            disabled={resetting}
            style={{
              background: resetting ? 'rgba(244, 67, 54, 0.5)' : '#f44336',
              border: 'none',
              borderRadius: '10px',
              padding: '15px 30px',
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#fff',
              cursor: resetting ? 'not-allowed' : 'pointer',
              opacity: resetting ? 0.6 : 1,
            }}
          >
            {resetting ? 'Resetting...' : 'Reset Game'}
          </button>
        </div>
      </div>
    </div>
  );
}

