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

    // Coin purse position and dimensions
    const purseX = canvas.width / 2
    const purseY = canvas.height - 80
    const purseWidth = 120
    const purseHeight = 60

    // Create initial coins
    const createCoin = (): Coin => {
      // Spawn coins from various positions across the top, but within range to reach purse
      const spawnRange = purseWidth * 2.5 // Wider spawn range for variety
      const spawnX = purseX + (Math.random() - 0.5) * spawnRange
      
      // Calculate initial velocity to help coin reach purse
      // Add some randomness for different directions
      const targetX = purseX + (Math.random() - 0.5) * (purseWidth * 0.6)
      const distanceToPurse = purseY - (-30)
      const horizontalDistance = targetX - spawnX
      
      // Initial horizontal velocity with variation
      const baseVx = (horizontalDistance / distanceToPurse) * 2
      const vxVariation = (Math.random() - 0.5) * 1.5 // Add randomness for different directions
      
      return {
        x: spawnX,
        y: -30,
        vx: baseVx + vxVariation,
        vy: Math.random() * 1.5 + 1,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        size: 15 + Math.random() * 10,
        color: Math.random() > 0.5 ? '#FFD700' : '#FFA500',
        collected: false,
      }
    }

    // Draw coin purse
    const drawPurse = () => {
      ctx.save()
      
      // Purse body (brown leather bag)
      const gradient = ctx.createLinearGradient(
        purseX - purseWidth / 2,
        purseY - purseHeight / 2,
        purseX + purseWidth / 2,
        purseY + purseHeight / 2
      )
      gradient.addColorStop(0, '#8B4513')
      gradient.addColorStop(0.5, '#654321')
      gradient.addColorStop(1, '#3D2817')
      
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.ellipse(
        purseX,
        purseY,
        purseWidth / 2,
        purseHeight / 2,
        0,
        0,
        Math.PI * 2
      )
      ctx.fill()
      
      // Purse opening (darker)
      ctx.fillStyle = '#2F1B14'
      ctx.beginPath()
      ctx.ellipse(
        purseX,
        purseY - 10,
        purseWidth / 2.5,
        purseHeight / 4,
        0,
        0,
        Math.PI * 2
      )
      ctx.fill()
      
      // Purse stitching
      ctx.strokeStyle = '#654321'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(purseX, purseY, purseWidth / 2 - 5, 0, Math.PI * 2)
      ctx.stroke()
      
      // Purse highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
      ctx.beginPath()
      ctx.ellipse(
        purseX - 20,
        purseY - 15,
        30,
        20,
        -0.3,
        0,
        Math.PI * 2
      )
      ctx.fill()
      
      ctx.restore()
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

    // Check if coin is collected (falls into purse)
    const isCoinCollected = (coin: Coin): boolean => {
      const dx = coin.x - purseX
      const dy = coin.y - purseY
      const distance = Math.sqrt(dx * dx + dy * dy)
      return distance < purseWidth / 2 && coin.y > purseY - purseHeight / 2
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw purse
      drawPurse()

      // Spawn new coins occasionally
      if (Math.random() < 0.03 && coinsRef.current.length < 15) {
        coinsRef.current.push(createCoin())
      }

      // Update and draw coins
      coinsRef.current = coinsRef.current.filter((coin) => {
        if (coin.collected) {
          // Coin is collected, make it disappear
          return false
        }

        // Apply attraction force toward purse (magnetic effect)
        const dx = purseX - coin.x
        const dy = purseY - coin.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        // Stronger attraction as coin gets closer to purse
        const attractionStrength = Math.max(0, 0.3 * (1 - distance / 300))
        if (distance > 0) {
          coin.vx += (dx / distance) * attractionStrength
          // Only apply vertical attraction if coin is above purse
          if (coin.y < purseY) {
            coin.vy += (dy / distance) * attractionStrength * 0.3
          }
        }

        // Update position
        coin.x += coin.vx
        coin.y += coin.vy
        coin.rotation += coin.rotationSpeed

        // Apply gravity
        coin.vy += 0.15

        // Apply slight air resistance to horizontal movement
        coin.vx *= 0.99

        // Check if collected
        if (isCoinCollected(coin)) {
          coin.collected = true
          return false
        }

        // Remove if off screen (but give coins more time to reach purse)
        if (coin.y > canvas.height + 100) {
          return false
        }

        // Draw coin
        drawCoin(coin)
        return true
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

