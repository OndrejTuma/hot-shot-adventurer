'use client';

import { Route } from '@/lib/game';
import { getRouteById } from '@/lib/routes';

interface AdventureMapProps {
  routes: Route[];
  onRouteClick?: (routeId: string) => void;
}

export default function AdventureMap({ routes, onRouteClick }: AdventureMapProps) {

  return (
    <div style={{
      background: 'rgba(0, 0, 0, 0.3)',
      borderRadius: '15px',
      padding: '40px',
      backdropFilter: 'blur(10px)',
      border: '2px solid rgba(255, 215, 0, 0.3)',
      position: 'relative',
    }}>
      <h2 style={{ 
        textAlign: 'center', 
        marginBottom: '30px', 
        fontSize: '28px',
        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
      }}>
        🗺️ Mapa pokladů
      </h2>
      
      <div style={{
        position: 'relative',
        width: '100%',
        paddingBottom: '130%', // 3:4-ish aspect ratio 
        borderRadius: '10px',
        border: '3px solid #8B4513',
        boxShadow: 'inset 0 0 50px rgba(0, 0, 0, 0.3)',
        background: '#F5E6D3',
      }}>
        {/* Map background image */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url(/floor-plan.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }} />
        
        {/* Container for route points - ensures proper positioning */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}>

        {/* Route points */}
        {routes.map((route) => {
          const routeConfig = getRouteById(route.routeId);
          if (!routeConfig) return null;
          
          const position = routeConfig.position;
          const isVisited = route.visited;
          
          return (
            <div
              key={route.routeId}
              onClick={() => onRouteClick && onRouteClick(route.routeId)}
              style={{
                position: 'absolute',
                left: `${position.x}%`,
                top: `${position.y}%`,
                transform: 'translate(-50%, -50%)',
                cursor: isVisited && onRouteClick ? 'pointer' : 'default',
                zIndex: 10,
              }}
            >
              {/* Pulsing animation for unvisited routes */}
              {!isVisited && (
                <div
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'rgba(255, 215, 0, 0.3)',
                    animation: 'pulse 2s infinite',
                  }}
                />
              )}
              
              <div
                style={{
                  position: 'relative',
                  width: '35px',
                  height: '35px',
                  borderRadius: '50%',
                  background: isVisited 
                    ? 'radial-gradient(circle, #4CAF50 0%, #2E7D32 100%)' 
                    : 'radial-gradient(circle, #FFD700 0%, #FFA500 100%)',
                  border: `3px solid ${isVisited ? '#2E7D32' : '#FFD700'}`,
                  boxShadow: isVisited 
                    ? '0 0 15px rgba(76, 175, 80, 0.6)'
                    : '0 0 20px rgba(255, 215, 0, 0.8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  transition: 'all 0.3s ease',
                  animation: isVisited ? 'celebrate 0.6s ease' : 'none',
                }}
              >
                {isVisited ? '✓' : '📍'}
              </div>
              
              {!isVisited && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    marginTop: '5px',
                    fontSize: '10px',
                    color: '#FFD700',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                    whiteSpace: 'nowrap',
                    fontWeight: 'bold',
                  }}
                >
                  {routeConfig.points}
                </div>
              )}
            </div>
          );
        })}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.7;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0.3;
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.7;
          }
        }
        @keyframes celebrate {
          0% {
            transform: scale(1);
          }
          25% {
            transform: scale(1.3) rotate(5deg);
          }
          50% {
            transform: scale(1.2) rotate(-5deg);
          }
          75% {
            transform: scale(1.3) rotate(5deg);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}

