'use client';

import { getTotalPoints } from '@/lib/routes'
import { useEffect, useState } from 'react';

interface ProgressTrackerProps {
  totalPoints: number;
  visitedRoutes: number;
  totalRoutes: number;
}

export default function ProgressTracker({ totalPoints, visitedRoutes, totalRoutes }: ProgressTrackerProps) {
  const [animatedPoints, setAnimatedPoints] = useState(totalPoints);

  useEffect(() => {
    if (totalPoints > animatedPoints) {
      const diff = totalPoints - animatedPoints;
      const steps = 30;
      const increment = diff / steps;
      let current = animatedPoints;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= totalPoints) {
          setAnimatedPoints(totalPoints);
          clearInterval(timer);
        } else {
          setAnimatedPoints(Math.floor(current));
        }
      }, 20);
      
      return () => clearInterval(timer);
    } else {
      setAnimatedPoints(totalPoints);
    }
  }, [totalPoints, animatedPoints]);

  return (
    <div style={{
      background: 'rgba(0, 0, 0, 0.3)',
      borderRadius: '15px',
      padding: '30px',
      marginBottom: '40px',
      backdropFilter: 'blur(10px)',
      border: '2px solid rgba(255, 215, 0, 0.3)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '14px', opacity: 0.8, marginBottom: '5px' }}>Nalezených mincí</div>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#FFD700' }}>
            🪙 {animatedPoints.toLocaleString('cs-CZ')}
          </div>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '14px', opacity: 0.8, marginBottom: '5px' }}>Objevených pokladů</div>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#FFD700' }}>
            🗺️ {visitedRoutes} / {totalRoutes}
          </div>
        </div>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <div style={{
          width: '100%',
          height: '20px',
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '10px',
          overflow: 'hidden',
          border: '1px solid rgba(255, 215, 0, 0.3)',
        }}>
          <div style={{
            width: `${(totalPoints / getTotalPoints()) * 100}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #FFD700 0%, #FFA500 100%)',
            transition: 'width 0.5s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingRight: '10px',
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#000',
          }}/>
        </div>
      </div>
    </div>
  );
}

