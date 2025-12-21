'use client'

import { useEffect, useRef } from 'react'

interface Coin {
  x: number
  y: number
  vx: number
  vy: number
  rotation: number
  rotationSpeed: number
  size: number
  color: string
  collected: boolean
  settled: boolean // Whether coin has stopped moving
}

export default function CoinPurseAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>()
  const coinsRef = useRef<Coin[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = 400
      canvas.height = 500
    }
    resizeCanvas()

    const canvasBottom = canvas.height
    const canvasWidth = canvas.width

    // Create initial coins
    const createCoin = (): Coin => {
      // Spawn coins from random positions across the top
      const spawnX = Math.random() * canvasWidth
      
      return {
        x: spawnX,
        y: -30,
        vx: (Math.random() - 0.5) * 2, // Random horizontal velocity
        vy: Math.random() * 1.5 + 1,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        size: 15 + Math.random() * 10,
        color: Math.random() > 0.5 ? '#FFD700' : '#FFA500',
        collected: false,
        settled: false,
      }
    }

    // Check if coin collides with another coin (for stacking)
    const checkCoinCollision = (coin: Coin, otherCoins: Coin[]): Coin | null => {
      for (const other of otherCoins) {
        if (other === coin || other.collected) continue
        
        const dx = coin.x - other.x
        const dy = coin.y - other.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const minDistance = coin.size + other.size
        
        // Check if coins are overlapping
        if (distance < minDistance) {
          // Check if this coin is above the other coin
          if (coin.y < other.y) {
            return other
          }
        }
      }
      return null
    }

    // Draw a coin
    const drawCoin = (coin: Coin) => {
      ctx.save()
      ctx.translate(coin.x, coin.y)
      ctx.rotate(coin.rotation)

      // Coin gradient
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, coin.size)
      gradient.addColorStop(0, coin.color)
      gradient.addColorStop(0.7, coin.color)
      gradient.addColorStop(1, '#B8860B')

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(0, 0, coin.size, 0, Math.PI * 2)
      ctx.fill()

      // Coin edge
      ctx.strokeStyle = '#B8860B'
      ctx.lineWidth = 2
      ctx.stroke()

      // Coin shine
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
      ctx.beginPath()
      ctx.arc(-coin.size * 0.3, -coin.size * 0.3, coin.size * 0.3, 0, Math.PI * 2)
      ctx.fill()

      // Coin symbol (simple $ or coin design)
      ctx.fillStyle = '#654321'
      ctx.font = `bold ${coin.size * 0.6}px Arial`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('₿', 0, 0)

      ctx.restore()
    }


    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Spawn new coins occasionally
      if (Math.random() < 0.03 && coinsRef.current.length < 50) {
        coinsRef.current.push(createCoin())
      }

      // Separate coins into falling and stacked
      const fallingCoins: Coin[] = []
      const stackedCoins: Coin[] = []

      // First pass: identify which coins are stacked (stopped)
      coinsRef.current.forEach((coin) => {
        if (coin.collected || coin.settled) {
          stackedCoins.push(coin)
          return
        }

        // Check if coin has hit the bottom
        const bottomY = canvasBottom - coin.size
        if (coin.y >= bottomY) {
          coin.y = bottomY
          coin.vy = 0
          coin.vx = 0
          coin.rotationSpeed = 0
          coin.rotation = 0 // Make coin flat
          coin.settled = true
          stackedCoins.push(coin)
          return
        }

        // Check if coin is colliding with a settled coin
        const collidingCoin = checkCoinCollision(coin, coinsRef.current)
        if (collidingCoin && collidingCoin.settled) {
          // Position coin on top of the stacked coin
          const stackY = collidingCoin.y - collidingCoin.size - coin.size
          if (coin.y >= stackY - 5) {
            coin.y = stackY
            coin.vy = 0
            coin.vx = 0
            coin.rotationSpeed = 0
            coin.rotation = 0 // Make coin flat
            coin.settled = true
            stackedCoins.push(coin)
            return
          }
        }

        fallingCoins.push(coin)
      })

      // Update falling coins
      fallingCoins.forEach((coin) => {
        if (coin.settled) return // Skip if already settled

        // Apply gravity
        coin.vy += 0.15

        // Apply slight air resistance to horizontal movement
        coin.vx *= 0.99

        // Update position
        coin.x += coin.vx
        coin.y += coin.vy
        coin.rotation += coin.rotationSpeed

        // Keep coins within canvas bounds horizontally
        if (coin.x < coin.size) {
          coin.x = coin.size
          coin.vx *= -0.5 // Bounce off left wall
        } else if (coin.x > canvasWidth - coin.size) {
          coin.x = canvasWidth - coin.size
          coin.vx *= -0.5 // Bounce off right wall
        }

        // Check if coin should now be settled (hit bottom or another coin)
        const bottomY = canvasBottom - coin.size
        if (coin.y >= bottomY) {
          coin.y = bottomY
          coin.vy = 0
          coin.vx = 0
          coin.rotationSpeed = 0
          coin.rotation = 0 // Make coin flat
          coin.settled = true
          return
        }

        // Check collision with any settled coin
        const collidingCoin = checkCoinCollision(coin, coinsRef.current)
        if (collidingCoin && collidingCoin.settled) {
          // Position coin on top of the colliding coin
          const stackY = collidingCoin.y - collidingCoin.size - coin.size
          if (coin.y >= stackY - 5) {
            coin.y = stackY
            coin.vy = 0
            coin.vx = 0
            coin.rotationSpeed = 0
            coin.rotation = 0 // Make coin flat
            coin.settled = true
          }
        }
      })

      // Draw all coins
      coinsRef.current.forEach((coin) => {
        if (!coin.collected) {
          drawCoin(coin)
        }
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    // Start animation
    animate()

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '20px',
        marginBottom: '20px',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          border: '2px solid rgba(255, 215, 0, 0.3)',
          borderRadius: '10px',
          background: 'rgba(0, 0, 0, 0.2)',
        }}
      />
    </div>
  )
}

