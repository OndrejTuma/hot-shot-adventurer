'use client';

import { useState, useRef, useEffect } from 'react';
import { Route } from '@/lib/game';
import { getRouteById } from '@/lib/routes';

interface AdventureMapProps {
  routes: Route[];
  onRouteClick?: (routeId: string) => void;
}

// Helper function to get color scheme based on points
function getPointColorScheme(points: number) {
  if (points <= 400) {
    // Yellow tier: 0-400
    return {
      gradient: 'radial-gradient(circle, #FFD700 0%, #FFA500 100%)',
      border: '#FFD700',
      shadow: 'rgba(255, 215, 0, 0.8)',
      pulseBg: 'rgba(255, 215, 0, 0.3)',
      textColor: '#FFD700',
    };
  } else if (points <= 800) {
    // Blue tier: 401-800
    return {
      gradient: 'radial-gradient(circle, #7DB3F5 0%, #5A9FE5 100%)',
      border: '#7DB3F5',
      shadow: 'rgba(125, 179, 245, 0.8)',
      pulseBg: 'rgba(125, 179, 245, 0.3)',
      textColor: '#7DB3F5',
    };
  } else {
    // Red tier: >800
    return {
      gradient: 'radial-gradient(circle, #FF7F7F 0%, #FF5555 100%)',
      border: '#FF7F7F',
      shadow: 'rgba(255, 127, 127, 0.8)',
      pulseBg: 'rgba(255, 127, 127, 0.3)',
      textColor: '#FF7F7F',
    };
  }
}

export default function AdventureMap({ routes, onRouteClick }: AdventureMapProps) {
  const [clickCounts, setClickCounts] = useState<Record<string, number>>({});
  const [showDialog, setShowDialog] = useState<{ routeId: string; help: string; help2?: string } | null>(null);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastClickedRouteRef = useRef<string | null>(null);

  // Reset click count if user clicks a different route or waits too long
  const resetClickCount = (routeId: string) => {
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }
    
    lastClickedRouteRef.current = routeId;
    
    // Reset count after 2 seconds of inactivity
    clickTimeoutRef.current = setTimeout(() => {
      setClickCounts(prev => {
        const newCounts = { ...prev };
        delete newCounts[routeId];
        return newCounts;
      });
      lastClickedRouteRef.current = null;
    }, 2000);
  };

  const handleUnvisitedRouteClick = (routeId: string) => {
    const routeConfig = getRouteById(routeId);
    if (!routeConfig) return;
    
    // If clicking a different route, clear timeout
    const isDifferentRoute = lastClickedRouteRef.current && lastClickedRouteRef.current !== routeId;
    
    if (isDifferentRoute) {
      // Clear any pending timeout
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    }
    
    // Update the last clicked route and set up timeout
    resetClickCount(routeId);
    
    // Increment count for this route - reset all others if clicking different route
    setClickCounts(prev => {
      // If clicking a different route, start fresh (ignore prev state)
      const currentCount = isDifferentRoute ? 0 : (prev[routeId] || 0);
      const newCount = currentCount + 1;
      
      if (newCount >= 5) {
        // Show dialog with help text
        setShowDialog({
          routeId,
          help: routeConfig.help,
          help2: routeConfig.help2,
        });
        // Reset count after showing dialog
        lastClickedRouteRef.current = null;
        if (clickTimeoutRef.current) {
          clearTimeout(clickTimeoutRef.current);
        }
        return {};
      }
      
      // If clicking a different route, return only this route's count (reset others)
      if (isDifferentRoute) {
        return { [routeId]: newCount };
      }
      
      // Same route - keep other routes' counts
      return {
        ...prev,
        [routeId]: newCount,
      };
    });
  };

  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, []);

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
          const colorScheme = getPointColorScheme(routeConfig.points);
          
          return (
            <div
              key={route.routeId}
              onClick={() => {
                if (isVisited && onRouteClick) {
                  onRouteClick(route.routeId);
                } else if (!isVisited) {
                  handleUnvisitedRouteClick(route.routeId);
                }
              }}
              style={{
                position: 'absolute',
                left: `${position.x}%`,
                top: `${position.y}%`,
                transform: 'translate(-50%, -50%)',
                cursor: 'pointer',
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
                    background: colorScheme.pulseBg,
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
                    : colorScheme.gradient,
                  border: `3px solid ${isVisited ? '#2E7D32' : colorScheme.border}`,
                  boxShadow: isVisited 
                    ? '0 0 15px rgba(76, 175, 80, 0.6)'
                    : `0 0 20px ${colorScheme.shadow}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  transition: 'all 0.3s ease',
                  animation: isVisited ? 'celebrate 0.6s ease' : 'none',
                }}
              >
                {isVisited ? '✓' : ''}
              </div>
            </div>
          );
        })}
        </div>
      </div>
      
      {/* Help Dialog */}
      {showDialog && (
        <div
          onClick={() => setShowDialog(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            cursor: 'pointer',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
              borderRadius: '20px',
              padding: '30px 40px',
              maxWidth: '500px',
              width: '90%',
              border: '3px solid #FFD700',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
              cursor: 'default',
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
            }}>
              <h3 style={{
                margin: 0,
                fontSize: '24px',
                color: '#FFD700',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              }}>
                💡 Nápověda
              </h3>
              <button
                onClick={() => setShowDialog(null)}
                style={{
                  background: 'rgba(255, 215, 0, 0.2)',
                  border: '2px solid #FFD700',
                  borderRadius: '50%',
                  width: '35px',
                  height: '35px',
                  color: '#FFD700',
                  fontSize: '20px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 215, 0, 0.4)';
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 215, 0, 0.2)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                ×
              </button>
            </div>
            <div style={{
              color: '#fff',
              fontSize: '18px',
              lineHeight: '1.6',
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
            }}>
              <p style={{ margin: '0 0 15px 0' }}>{showDialog.help}</p>
            </div>
          </div>
        </div>
      )}
      
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

