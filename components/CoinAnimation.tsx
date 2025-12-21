'use client'

import { useEffect, useRef } from 'react'

interface Coin {
  x: number
  y: number
  vx: number
  vy: number
  rotation: number
  rotationSpeed: number
  tilt3D: number
  tiltSpeed: number
  size: number
  color: string
  collected: boolean
  settled: boolean
  columnIndex: number
}

interface CoinAnimationProps {
  countdownSeconds: number
}

export default function CoinAnimation({ countdownSeconds }: CoinAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>()
  const coinsRef = useRef<Coin[]>([])
  const startTimeRef = useRef<number | null>(null)
  const lastSpawnTimeRef = useRef<number>(0)
  const spawnAccumulatorRef = useRef<number>(0)
  const totalCoinsSpawnedRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = 400
    canvas.height = 500

    const numColumns = 8
    const columnSpacing = canvas.width / (numColumns + 1)
    const columnPositions = Array.from(
      { length: numColumns },
      (_, i) => columnSpacing * (i + 1)
    )

    /* ============================
       STACKING CONSTANTS
       ============================ */

    const COIN_SIZE = 20
    const SETTLED_COIN_HEIGHT = COIN_SIZE * 0.4
    const COIN_SPACING = SETTLED_COIN_HEIGHT * 0.85

    const BOTTOM_Y = canvas.height - SETTLED_COIN_HEIGHT / 2
    const TOP_Y = SETTLED_COIN_HEIGHT / 2

    const coinsPerColumn =
      Math.floor((BOTTOM_Y - TOP_Y) / COIN_SPACING) + 1

    const totalCoinsNeeded = coinsPerColumn * numColumns
    const coinsPerSecond = totalCoinsNeeded / countdownSeconds

    /* ============================
       RANDOMNESS CONTROLS
       ============================ */

    const CANDIDATE_COLUMNS = 3
    const HORIZONTAL_JITTER = columnSpacing * 0.35
    const DRIFT_STRENGTH = 0.02

    /* ============================
       HELPERS
       ============================ */

    const getColumnTopY = (columnIndex: number): number => {
      const settled = coinsRef.current.filter(
        c => c.settled && c.columnIndex === columnIndex
      )
      if (settled.length === 0) return BOTTOM_Y
      return Math.min(...settled.map(c => c.y))
    }

    /* ============================
       COIN CREATION
       ============================ */

    const createCoin = (): Coin | null => {
      const columns = Array.from({ length: numColumns }, (_, i) => ({
        index: i,
        topY: getColumnTopY(i),
      }))

      const available = columns
        .filter(c => c.topY - COIN_SPACING >= TOP_Y)
        .sort((a, b) => b.topY - a.topY)

      if (available.length === 0) return null

      const candidates = available.slice(
        0,
        Math.min(CANDIDATE_COLUMNS, available.length)
      )

      const chosen =
        candidates[Math.floor(Math.random() * candidates.length)]

      return {
        columnIndex: chosen.index,
        x:
          columnPositions[chosen.index] +
          (Math.random() - 0.5) * HORIZONTAL_JITTER,
        y: -30,
        vx: (Math.random() - 0.5) * 0.8,
        vy: Math.random() * 0.6 + 1.4,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        tilt3D: Math.random() * Math.PI * 2,
        tiltSpeed: (Math.random() * 0.08 + 0.05),
        size: COIN_SIZE,
        color: Math.random() > 0.5 ? '#FFD700' : '#FFA500',
        collected: false,
        settled: false,
      }
    }

    /* ============================
       DRAWING (3D FALLING COINS)
       ============================ */

    const drawCoin = (coin: Coin) => {
      ctx.save()
      ctx.translate(coin.x, coin.y)
      ctx.rotate(coin.rotation)

      if (coin.settled) {
        // settled = 3D stacked coin with thickness and shine
        const r = coin.size
        const thickness = 4
        
        // Bottom face (darker/shadowed)
        ctx.fillStyle = '#B8860B'
        ctx.beginPath()
        ctx.ellipse(0, thickness / 2, r, SETTLED_COIN_HEIGHT / 2, 0, 0, Math.PI * 2)
        ctx.fill()
        
        // Side rim for thickness
        ctx.strokeStyle = '#7A5A12'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.ellipse(0, thickness / 4, r, SETTLED_COIN_HEIGHT / 2, 0, 0, Math.PI * 2)
        ctx.stroke()
        
        // Top face with gradient and reflection
        const gradient = ctx.createRadialGradient(
          -r * 0.3,
          -SETTLED_COIN_HEIGHT * 0.3,
          r * 0.15,
          -r * 0.3,
          -SETTLED_COIN_HEIGHT * 0.3,
          r * 0.8
        )
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.6)') // Bright reflection
        gradient.addColorStop(0.3, 'rgba(255, 244, 194, 0.4)') // Light highlight
        gradient.addColorStop(0.6, coin.color) // Base color
        gradient.addColorStop(1, '#DAA520') // Darker edge
        
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.ellipse(0, -thickness / 2, r, SETTLED_COIN_HEIGHT / 2, 0, 0, Math.PI * 2)
        ctx.fill()
        
        // Visible border
        ctx.strokeStyle = '#000000'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.ellipse(0, -thickness / 2, r, SETTLED_COIN_HEIGHT / 2, 0, 0, Math.PI * 2)
        ctx.stroke()
      } else {
        // FALLING 3D COIN
        const tilt = Math.abs(Math.sin(coin.tilt3D))
        const radiusX = coin.size * (1 - tilt * 0.4)
        const radiusY = coin.size * (0.3 + tilt * 0.9)
        const thickness = 6 * tilt + 2

        // bottom face (shadowed)
        ctx.fillStyle = '#B8860B'
        ctx.beginPath()
        ctx.ellipse(0, thickness / 2, radiusX, radiusY, 0, 0, Math.PI * 2)
        ctx.fill()

        // side rim
        ctx.strokeStyle = '#7A5A12'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.ellipse(0, thickness / 4, radiusX, radiusY, 0, 0, Math.PI * 2)
        ctx.stroke()

        // top face (highlighted)
        const gradient = ctx.createRadialGradient(
          0,
          -radiusY / 2,
          radiusX * 0.2,
          0,
          0,
          radiusX
        )
        gradient.addColorStop(0, '#FFF4C2')
        gradient.addColorStop(0.6, coin.color)
        gradient.addColorStop(1, '#DAA520')

        ctx.fillStyle = gradient
        ctx.strokeStyle = '#8B6914'
        ctx.lineWidth = 1

        ctx.beginPath()
        ctx.ellipse(0, -thickness / 2, radiusX, radiusY, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
      }

      ctx.restore()
    }

    /* ============================
       ANIMATION LOOP
       ============================ */

    const animate = (time: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = time
        lastSpawnTimeRef.current = time
      }

      const elapsed = (time - startTimeRef.current) / 1000
      const remaining = countdownSeconds - elapsed

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (remaining > 0 && totalCoinsSpawnedRef.current < totalCoinsNeeded) {
        const dt = (time - lastSpawnTimeRef.current) / 1000
        spawnAccumulatorRef.current += coinsPerSecond * dt

        while (spawnAccumulatorRef.current >= 1) {
          const coin = createCoin()
          if (!coin) break
          coinsRef.current.push(coin)
          spawnAccumulatorRef.current--
          totalCoinsSpawnedRef.current++
        }

        lastSpawnTimeRef.current = time
      }

      coinsRef.current
        .filter(c => !c.settled)
        .forEach(coin => {
          coin.vy += 0.15
          coin.y += coin.vy
          coin.x += coin.vx

          const targetX = columnPositions[coin.columnIndex]
          coin.vx += (targetX - coin.x) * DRIFT_STRENGTH

          coin.rotation += coin.rotationSpeed
          coin.tilt3D += coin.tiltSpeed

          const targetY =
            getColumnTopY(coin.columnIndex) - COIN_SPACING

          if (coin.y >= targetY) {
            coin.y = targetY
            coin.x = targetX
            coin.vx = 0
            coin.vy = 0
            coin.rotation = 0
            coin.tilt3D = Math.PI / 2
            coin.settled = true
          }
        })

      coinsRef.current.forEach(drawCoin)
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [countdownSeconds])

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <canvas
        ref={canvasRef}
        style={{
          border: '2px solid rgba(255,215,0,0.3)',
          borderRadius: 10,
          background: 'rgba(0,0,0,0.2)',
        }}
      />
    </div>
  )
}