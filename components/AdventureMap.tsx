'use client';

import { Route } from '@/lib/game';

interface AdventureMapProps {
  routes: Route[];
  onRouteClick: (routeId: string) => void;
}

export default function AdventureMap({ routes, onRouteClick }: AdventureMapProps) {
  // Generate stable random positions for the 8 points
  const getPosition = (index: number) => {
    const seed = index * 1234; // Stable seed based on index
    const x = 20 + ((seed * 17) % 60); // 20-80% of width
    const y = 15 + ((seed * 23) % 70); // 15-85% of height
    return { x, y };
  };

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
        🗺️ Adventure Map
      </h2>
      
      <div style={{
        position: 'relative',
        width: '100%',
        height: '500px',
        background: 'linear-gradient(135deg, #2c5530 0%, #3d6b42 50%, #4a7c4f 100%)',
        borderRadius: '10px',
        border: '3px solid #8B4513',
        boxShadow: 'inset 0 0 50px rgba(0, 0, 0, 0.3)',
        overflow: 'hidden',
      }}>
        {/* Decorative elements */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '80px',
          height: '80px',
          background: 'rgba(139, 69, 19, 0.3)',
          borderRadius: '50%',
          border: '2px dashed #8B4513',
        }} />
        
        <div style={{
          position: 'absolute',
          bottom: '15%',
          right: '15%',
          width: '60px',
          height: '60px',
          background: 'rgba(139, 69, 19, 0.3)',
          borderRadius: '50%',
          border: '2px dashed #8B4513',
        }} />

        {/* Route points */}
        {routes.map((route, index) => {
          const position = getPosition(index);
          const isVisited = route.visited;
          
          return (
            <div
              key={route.routeId}
              onClick={() => !isVisited && onRouteClick(route.routeId)}
              style={{
                position: 'absolute',
                left: `${position.x}%`,
                top: `${position.y}%`,
                transform: 'translate(-50%, -50%)',
                cursor: isVisited ? 'default' : 'pointer',
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
                  width: isVisited ? '30px' : '35px',
                  height: isVisited ? '30px' : '35px',
                  borderRadius: '50%',
                  background: isVisited 
                    ? 'rgba(100, 100, 100, 0.7)' 
                    : 'radial-gradient(circle, #FFD700 0%, #FFA500 100%)',
                  border: `3px solid ${isVisited ? '#666' : '#FFD700'}`,
                  boxShadow: isVisited 
                    ? '0 0 10px rgba(100, 100, 100, 0.5)'
                    : '0 0 20px rgba(255, 215, 0, 0.8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  transition: 'all 0.3s ease',
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
                  {route.points} pts
                </div>
              )}
            </div>
          );
        })}
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
      `}</style>
    </div>
  );
}

