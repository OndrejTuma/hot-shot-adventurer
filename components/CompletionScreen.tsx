'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Confetti from 'react-confetti'
import { GameState } from '@/lib/game'
import CoinAnimation from './CoinAnimation'

interface CompletionScreenProps {
  gameState: GameState
}

export default function CompletionScreen({ gameState }: CompletionScreenProps) {
  const [showClaimButton, setShowClaimButton] = useState(true)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [showPrizeMessage, setShowPrizeMessage] = useState(false)
  const [showConfetti, setShowConfetti] = useState(true)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
  const router = useRouter()

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

  const handleClaimPrize = () => {
    setShowClaimButton(false)
    setShowConfetti(false) // Turn off confetti during countdown
    setCountdown(3 * 60) // 3 minutes in seconds
  }

  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === null || prev <= 1) {
            setShowPrizeMessage(true)
            setShowConfetti(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [countdown])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      {showConfetti && countdown === null && windowSize.width > 0 && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={true}
          numberOfPieces={200}
        />
      )}

      <div
        style={{
          maxWidth: '800px',
          textAlign: 'center',
          background: 'rgba(0, 0, 0, 0.5)',
          borderRadius: '20px',
          padding: '60px 40px',
          backdropFilter: 'blur(10px)',
          border: '3px solid rgba(255, 215, 0, 0.5)',
          boxShadow: '0 0 50px rgba(255, 215, 0, 0.3)',
        }}
      >
        {showPrizeMessage ? (
          <>
            <div style={{ fontSize: '80px', marginBottom: '20px' }}>🎁</div>
            <h1
              style={{
                fontSize: '48px',
                marginBottom: '20px',
                color: '#FFD700',
              }}
            >
              A je to doma
            </h1>
            <p
              style={{
                fontSize: '24px',
                marginBottom: '30px',
                lineHeight: '1.6',
              }}
            >
              Sečteno a podtrženo jsi borec tati. Doufám, že sis svůj vánoční dárek užil a že to nezpůsobilo žádné nepříjemné situace při hledání - nedošlo mi, že možná budeš muset semtam něco přehrábnout. Tak snad z toho mamce nezešedivěly vlasy 😁
            </p>
          </>
        ) : countdown !== null ? (
          <>
            <div style={{ fontSize: '80px', marginBottom: '20px' }}>⏳</div>
            <h1
              style={{
                fontSize: '48px',
                marginBottom: '20px',
                color: '#FFD700',
              }}
            >
              Těch mincí je tolik...
            </h1>
            <div
              style={{
                fontSize: '72px',
                fontWeight: 'bold',
                color: '#FFD700',
                marginBottom: '20px',
                fontFamily: 'monospace',
                textShadow: '0 0 20px rgba(255, 215, 0, 0.8)',
              }}
            >
              {formatTime(countdown)}
            </div>
            <CoinAnimation countdownSeconds={countdown} />
            <p style={{ fontSize: '20px', opacity: 0.9, marginTop: '20px' }}>
              Budeš si muset chvíli počkat
            </p>
          </>
        ) : (
          <>
            <div style={{ fontSize: '80px', marginBottom: '20px' }}>🏆</div>
            <h1
              style={{
                fontSize: '48px',
                marginBottom: '20px',
                color: '#FFD700',
              }}
            >
              Dokázal jsi to!
            </h1>
            <p
              style={{
                fontSize: '24px',
                marginBottom: '30px',
                lineHeight: '1.6',
              }}
            >
              Překonal jsi nástrahy výšek, hloubek, šířek i úžek a našel jsi
              všech {gameState.totalRoutes}&nbsp;pokladů a neuvěřitelných{' '}
              {gameState.totalPoints.toLocaleString('cs-CZ')}&nbsp;mincí!
              <br /> Indiana Jones bledne závistí a prosí o konzultace.
            </p>
            <div
              style={{
                background: 'rgba(255, 215, 0, 0.2)',
                borderRadius: '15px',
                padding: '30px',
                marginBottom: '40px',
              }}
            >
              <div
                style={{
                  fontSize: '36px',
                  fontWeight: 'bold',
                  color: '#FFD700',
                }}
              >
                🪙 {gameState.totalPoints.toLocaleString('cs-CZ')} mincí
              </div>
            </div>
            <button
              onClick={handleClaimPrize}
              style={{
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                border: 'none',
                borderRadius: '15px',
                padding: '20px 50px',
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#000',
                cursor: 'pointer',
                boxShadow: '0 5px 20px rgba(255, 215, 0, 0.4)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)'
                e.currentTarget.style.boxShadow =
                  '0 8px 30px rgba(255, 215, 0, 0.6)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.boxShadow =
                  '0 5px 20px rgba(255, 215, 0, 0.4)'
              }}
            >
              Posbírat mince
            </button>
          </>
        )}
      </div>
    </div>
  )
}
