'use client'

import { useEffect, useState } from 'react'
import Confetti from 'react-confetti'
import AdventureMap from '@/components/AdventureMap'
import ProgressTracker from '@/components/ProgressTracker'
import CompletionScreen from '@/components/CompletionScreen'
import { GameState } from '@/lib/game'

export default function Home() {
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [loading, setLoading] = useState(true)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    fetchGameState()
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
      const handleResize = () => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight })
      }
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  const fetchGameState = async () => {
    try {
      const response = await fetch('/api/game')
      const data = await response.json()
      setGameState(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching game state:', error)
      setLoading(false)
    }
  }

  if (loading || !gameState) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <div style={{ fontSize: '24px' }}>Loading your adventure...</div>
      </div>
    )
  }

  if (gameState.completed) {
    return <CompletionScreen gameState={gameState} />
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '20px',
        backgroundImage: 'url(/page-background.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        position: 'relative',
      }}
    >
      {showConfetti && windowSize.width > 0 && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          onConfettiComplete={() => setShowConfetti(false)}
        />
      )}

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              marginBottom: '10px',
              fontFamily: 'serif',
            }}
          >
            🏺 Hot Shot Adventurer 🏺
          </h1>
          <p style={{ fontSize: '20px', opacity: 0.9 }}>
            Embark on a legendary treasure hunt across ancient lands
          </p>
        </header>

        <ProgressTracker
          totalPoints={gameState.totalPoints}
          visitedRoutes={gameState.visitedRoutes}
          totalRoutes={gameState.totalRoutes}
        />

        <AdventureMap routes={gameState.routes} />
      </div>
    </div>
  )
}
