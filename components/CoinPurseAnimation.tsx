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

interface CoinPurseAnimationProps {
  countdownSeconds: number
}

export default function CoinPurseAnimation({ countdownSeconds }: CoinPurseAnimationProps) {
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

    const canvasBottom = canvas.height
    const canvasWidth = canvas.width

    const numColumns = 8
    const columnSpacing = canvasWidth / (numColumns + 1)
    const columnPositions = Array.from(
      { length: numColumns },
      (_, i) => columnSpacing * (i + 1)
    )

    const COIN_SIZE = 20
    const SETTLED_COIN_HEIGHT = COIN_SIZE * 0.4
    const COIN_SPACING = SETTLED_COIN_HEIGHT * 0.85

    const availableHeight = canvasBottom - SETTLED_COIN_HEIGHT
    const coinsPerColumn = Math.floor(availableHeight / COIN_SPACING) + 1
    const totalCoinsNeeded = coinsPerColumn * numColumns

    const coinsPerSecond = totalCoinsNeeded / countdownSeconds

    const createCoin = (): Coin => {
      const columnIndex = Math.floor(Math.random() * numColumns)

      return {
        columnIndex,
        x: columnPositions[columnIndex],
        y: -30,
        vx: (Math.random() - 0.3) * 0.3,
        vy: Math.random() * 0.5 + 1.5,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.15,
        tilt3D: Math.random() * Math.PI * 2,
        tiltSpeed: (Math.random() * 0.08 + 0.05) * (Math.random() > 0.5 ? 1 : -1),
        size: COIN_SIZE,
        color: Math.random() > 0.5 ? '#FFD700' : '#FFA500',
        collected: false,
        settled: false,
      }
    }

    const drawCoin = (coin: Coin) => {
      ctx.save()
      ctx.translate(coin.x, coin.y)
      ctx.rotate(coin.rotation)

      if (coin.settled) {
        const w = coin.size * 2
        const h = SETTLED_COIN_HEIGHT

        ctx.fillStyle = coin.color
        ctx.beginPath()
        ctx.ellipse(0, 0, w / 2, h / 2, 0, 0, Math.PI * 2)
        ctx.fill()
      } else {
        const tilt = Math.abs(Math.sin(coin.tilt3D))
        const w = coin.size * 2 * (1 - tilt * 0.5)
        const h = coin.size * 2 * tilt + coin.size * 0.3

        ctx.fillStyle = coin.color
        ctx.beginPath()
        ctx.ellipse(0, 0, w / 2, h / 2, 0, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.restore()
    }

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
          coinsRef.current.push(createCoin())
          spawnAccumulatorRef.current--
          totalCoinsSpawnedRef.current++
        }

        lastSpawnTimeRef.current = time
      }

      const unsettled = coinsRef.current
        .filter(c => !c.collected && !c.settled)
        .sort((a, b) => b.y - a.y)

      unsettled.forEach(coin => {
        coin.vy += 0.15
        coin.x += coin.vx
        coin.y += coin.vy
        coin.rotation += coin.rotationSpeed
        coin.tilt3D += coin.tiltSpeed

        const columnCoins = coinsRef.current
          .filter(c => c.settled && c.columnIndex === coin.columnIndex)

        const topY =
          columnCoins.length > 0
            ? Math.min(...columnCoins.map(c => c.y)) - COIN_SPACING
            : canvasBottom - SETTLED_COIN_HEIGHT / 2

        if (coin.y >= topY) {
          coin.y = topY
          coin.x = columnPositions[coin.columnIndex]
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