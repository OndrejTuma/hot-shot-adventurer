'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import Confetti from 'react-confetti'
import { GameState } from '@/lib/game'
import { getRouteById } from '@/lib/routes'

export default function RoutePage() {
  const params = useParams()
  const router = useRouter()
  const routeId = params?.routeId as string
  const [visited, setVisited] = useState(false)
  const [points, setPoints] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showFireworks, setShowFireworks] = useState(false)
  const [isFirstVisit, setIsFirstVisit] = useState(false)
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [loading, setLoading] = useState(true)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
  const [routeConfig, setRouteConfig] = useState(getRouteById(routeId))
  const isProcessingRef = useRef(false)

  useEffect(() => {
    setRouteConfig(getRouteById(routeId))
    checkRoute()
  }, [routeId])

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

  const checkRoute = async () => {
    // Prevent double execution in React StrictMode
    if (isProcessingRef.current) {
      return
    }
    isProcessingRef.current = true

    try {
      const currentRouteConfig = getRouteById(routeId)
      if (!currentRouteConfig) {
        // Invalid route
        router.push('/')
        return
      }
      setRouteConfig(currentRouteConfig)

      const response = await fetch('/api/game')
      const data: GameState = await response.json()
      setGameState(data)

      const route = data.routes.find((r) => r.routeId === routeId)

      if (!route) {
        // Route not found in game state
        router.push('/')
        return
      }

      if (route.visited) {
        // Already visited - just show the info
        setVisited(true)
        setPoints(route.points)
        setIsFirstVisit(false)
        setLoading(false)
      } else {
        // First visit - visit the route and show celebration
        setIsFirstVisit(true)
        await visitRoute()
        setLoading(false)
      }
    } catch (error) {
      console.error('Error checking route:', error)
      setLoading(false)
    } finally {
      isProcessingRef.current = false
    }
  }

  const visitRoute = async () => {
    try {
      const response = await fetch('/api/game/visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ routeId }),
      })

      const result = await response.json()

      if (result.success) {
        setPoints(result.points)
        setVisited(true)
        setShowConfetti(true)
        setShowFireworks(true)
        setGameState(result.state)

        // Hide confetti after 5 seconds
        setTimeout(() => {
          setShowConfetti(false)
        }, 5000)

        // Hide fireworks after 3 seconds
        setTimeout(() => {
          setShowFireworks(false)
        }, 3000)
      } else {
        // If route is already visited (400 error), fetch current state and show info
        if (result.error && result.error.includes('already visited')) {
          const gameResponse = await fetch('/api/game')
          const gameData: GameState = await gameResponse.json()
          const route = gameData.routes.find((r) => r.routeId === routeId)
          if (route) {
            setPoints(route.points)
            setVisited(true)
            setIsFirstVisit(false)
            setGameState(gameData)
          } else {
            router.push('/')
          }
        } else {
          router.push('/')
        }
      }
    } catch (error) {
      console.error('Error visiting route:', error)
      // On error, try to fetch current state to see if route was visited
      try {
        const gameResponse = await fetch('/api/game')
        const gameData: GameState = await gameResponse.json()
        const route = gameData.routes.find((r) => r.routeId === routeId)
        if (route && route.visited) {
          setPoints(route.points)
          setVisited(true)
          setIsFirstVisit(false)
          setGameState(gameData)
        } else {
          router.push('/')
        }
      } catch {
        router.push('/')
      }
    }
  }

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <div style={{ fontSize: '24px' }}>Hledání pokladu...</div>
      </div>
    )
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backgroundImage: 'url(/page-background.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
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

      {/* Fireworks animation */}
      {showFireworks && windowSize.width > 0 && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 1000,
          }}
        >
          <FireworksAnimation />
        </div>
      )}

      <div
        style={{
          maxWidth: '700px',
          textAlign: 'center',
          background: 'rgba(0, 0, 0, 0.5)',
          borderRadius: '20px',
          padding: '20px 40px 60px',
          backdropFilter: 'blur(10px)',
          border: '3px solid rgba(255, 215, 0, 0.5)',
          boxShadow: '0 0 50px rgba(255, 215, 0, 0.3)',
          animation: visited ? 'celebrateEntry 0.8s ease' : 'none',
        }}
      >
        {visited && (
          <>
            {routeConfig?.image && (
              <Image
                src={routeConfig.image}
                alt={routeConfig.name}
                width={256}
                height={256}
              />
            )}
            <h1
              style={{
                fontSize: '42px',
                marginBottom: '20px',
                color: '#FFD700',
              }}
            >
              {routeConfig?.name || 'Location Discovered!'}
            </h1>
            <p
              style={{
                fontSize: '20px',
                marginBottom: '30px',
                lineHeight: '1.6',
                opacity: 0.9,
              }}
            >
              {routeConfig?.description ||
                "You've made an incredible discovery!"}
            </p>

            <div
              style={{
                background: 'rgba(255, 215, 0, 0.2)',
                borderRadius: '15px',
                padding: '30px',
                marginBottom: '30px',
              }}
            >
              <div style={{ fontSize: '14px', opacity: 0.8 }}>
                Nalezených mincí
              </div>
              <div
                style={{
                  fontSize: '48px',
                  fontWeight: 'bold',
                  color: '#FFD700',
                }}
              >
                🪙 {points.toLocaleString('cs-CZ')}
              </div>
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
              Hledat dál 🗺️
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
        @keyframes firework {
          0% {
            transform: translate(var(--x), var(--initialY));
            width: var(--initialSize);
            opacity: 1;
          }
          50% {
            width: 0.5vmin;
            opacity: 1;
          }
          100% {
            width: var(--finalSize);
            opacity: 0;
            transform: translate(var(--x), var(--y));
          }
        }
        @keyframes fireworkPseudo {
          0% {
            transform: translate(var(--x), var(--initialY));
            width: var(--initialSize);
            opacity: 1;
          }
          50% {
            width: 0.5vmin;
            opacity: 1;
          }
          100% {
            width: var(--finalSize);
            opacity: 0;
            transform: translate(var(--x), var(--y));
          }
        }
      `}</style>
    </div>
  )
}

// Fireworks Animation Component
function FireworksAnimation() {
  useEffect(() => {
    const container = document.getElementById('fireworks-container')
    if (!container) return

    const createFirework = (x: number, y: number) => {
      const colors = [
        '#FFD700',
        '#FF6B6B',
        '#4ECDC4',
        '#FFA500',
        '#FF1493',
        '#00FF00',
        '#FF00FF',
        '#00FFFF',
      ]
      const particleCount = 30

      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div')
        const angle = (Math.PI * 2 * i) / particleCount
        const velocity = Math.random() * 3 + 2
        const distance = Math.random() * 100 + 50
        const color = colors[Math.floor(Math.random() * colors.length)]
        const size = Math.random() * 4 + 2

        const endX = x + Math.cos(angle) * distance
        const endY = y + Math.sin(angle) * distance

        particle.style.position = 'absolute'
        particle.style.left = `${x}px`
        particle.style.top = `${y}px`
        particle.style.width = `${size}px`
        particle.style.height = `${size}px`
        particle.style.borderRadius = '50%'
        particle.style.background = color
        particle.style.boxShadow = `0 0 ${size * 2}px ${color}`
        particle.style.opacity = '1'
        particle.style.transition = `all 0.8s ease-out`

        container.appendChild(particle)

        // Trigger animation
        setTimeout(() => {
          particle.style.left = `${endX}px`
          particle.style.top = `${endY}px`
          particle.style.opacity = '0'
          particle.style.transform = `scale(0)`
        }, 10)

        // Remove particle
        setTimeout(() => {
          if (particle.parentNode) {
            particle.parentNode.removeChild(particle)
          }
        }, 1000)
      }
    }

    const launchFirework = () => {
      const x = Math.random() * window.innerWidth
      const y =
        Math.random() * window.innerHeight * 0.6 + window.innerHeight * 0.2
      createFirework(x, y)
    }

    // Launch multiple fireworks
    const interval = setInterval(launchFirework, 300)

    // Launch initial firework
    setTimeout(launchFirework, 100)

    const timeout = setTimeout(() => {
      clearInterval(interval)
    }, 3000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [])

  return (
    <div
      id='fireworks-container'
      style={{ width: '100%', height: '100%', position: 'relative' }}
    />
  )
}
