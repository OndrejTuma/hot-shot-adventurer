'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
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
  const [showInstructions, setShowInstructions] = useState(false)
  const [hasSeenInstructions, setHasSeenInstructions] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchGameState()
    // Check if user has seen instructions before
    if (typeof window !== 'undefined') {
      const seen = localStorage.getItem('hasSeenInstructions') === 'true'
      setHasSeenInstructions(seen)
    }
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
        <div style={{ fontSize: '24px' }}>Načítám dobyvatele...</div>
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
        backgroundImage: 'url(/drsnak2.webp), url(/banner.webp), url(/page-background.svg)',
        backgroundPosition: 'right top,left top, center center',
        backgroundRepeat: 'no-repeat, no-repeat, no-repeat',
        backgroundAttachment: 'scroll, scroll, fixed',
        backgroundSize: '50%, 50%, cover',
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
          <button
            onClick={() => {
              setShowInstructions(true)
              if (!hasSeenInstructions) {
                setHasSeenInstructions(true)
                localStorage.setItem('hasSeenInstructions', 'true')
              }
            }}
            className={hasSeenInstructions ? '' : 'basketball-bounce'}
            style={{
              marginTop: '30%',
              background: 'none',
              border: 'none',
              width: '40px',
              height: '40px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              color: '#fff',
              transition: 'background 0.3s ease',
            }}
            aria-label='Zobrazit instrukce'
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Circle - leather brown with gold accent */}
              <circle
                cx="10"
                cy="10"
                r="9"
                fill="#8B6F47"
                stroke="#D4A574"
                strokeWidth="1.5"
              />
              {/* Inner circle for depth */}
              <circle
                cx="10"
                cy="10"
                r="7.5"
                fill="none"
                stroke="#5A4A2F"
                strokeWidth="0.5"
                opacity="0.5"
              />
              {/* Info "i" dot */}
              <circle
                cx="10"
                cy="7"
                r="1.2"
                fill="#D4A574"
              />
              {/* Info "i" stem */}
              <rect
                x="9"
                y="9"
                width="2"
                height="4.5"
                rx="0.5"
                fill="#D4A574"
              />
            </svg>
          </button>
        </header>

        <ProgressTracker
          totalPoints={gameState.totalPoints}
          visitedRoutes={gameState.visitedRoutes}
          totalRoutes={gameState.totalRoutes}
        />

        <AdventureMap
          routes={gameState.routes}
          onRouteClick={(routeId) => router.push(`/route/${routeId}`)}
        />
      </div>

      {/* Instructions Modal */}
      {showInstructions && (
        <div
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
            padding: '20px',
          }}
          onClick={() => setShowInstructions(false)}
        >
          <div
            style={{
              backgroundColor: '#1e3c72',
              borderRadius: '12px',
              padding: '30px',
              maxWidth: '600px',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowInstructions(false)}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                cursor: 'pointer',
                color: '#fff',
                fontSize: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
              }}
              aria-label='Zavřít'
            >
              ×
            </button>
            <h2
              style={{
                fontSize: '28px',
                fontWeight: 'bold',
                marginBottom: '20px',
                textAlign: 'center',
              }}
            >
              📜 Kde to jsem?
            </h2>
            <div
              style={{
                fontSize: '16px',
                lineHeight: '1.6',
                color: '#fff',
              }}
            >
              <p style={{ marginBottom: '15px' }}>
                Vítám tě v tvém vánočním dárku. Letos jsem se rozhodl tě vyslat
                na honbu za poklady. Připrav si koženou bundu, bič, vakcínu
                proti covidu a běž odhalovat skrytá tajemství bájných míst
                opředených legandami.
              </p>
              <h3
                style={{
                  fontSize: '20px',
                  marginTop: '20px',
                  marginBottom: '10px',
                }}
              >
                🎯 Jak hrát:
              </h3>
              <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
                <li style={{ marginBottom: '8px' }}>
                  Na hlavní stránce máš mapu s lokacemi
                </li>
                <li style={{ marginBottom: '8px' }}>
                  V každé lokaci je ukrytý jiný počet mincí
                </li>
                <li style={{ marginBottom: '8px' }}>
                  Čím těžší lokace, tím větší odměna
                </li>
                <li style={{ marginBottom: '8px' }}>
                  V každé lokaci je ukrytý QR kód, ten musíš najít
                </li>
              </ul>
              <p
                style={{ marginTop: '20px', fontWeight: 'bold', textAlign: 'center', fontSize: '20px' }}
              >
                🏺 Hodně štěstí! 🏺
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
