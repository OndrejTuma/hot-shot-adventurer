'use client'

import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

interface Coin {
  id: number
  columnIndex: number
  stackIndex: number
  position: THREE.Vector3
  rotation: THREE.Euler
  rotationSpeed: THREE.Vector3
  velocity: THREE.Vector3
  settled: boolean
  targetY: number
}

interface CoinAnimation3DProps {
  countdownSeconds: number
}

const COIN_RADIUS = 0.15
const COIN_HEIGHT = 0.05
const NUM_COLUMNS = 8
const COLUMN_SPACING = 0.4
const COIN_STACK_SPACING = COIN_HEIGHT * 1.1

// Individual coin mesh component
function CoinMesh({ coin }: { coin: Coin }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (meshRef.current && !coin.settled) {
      meshRef.current.rotation.x += coin.rotationSpeed.x
      meshRef.current.rotation.y += coin.rotationSpeed.y
      meshRef.current.rotation.z += coin.rotationSpeed.z
    }
  })

  return (
    <mesh
      ref={meshRef}
      position={coin.position}
      rotation={coin.rotation}
    >
      <cylinderGeometry args={[COIN_RADIUS, COIN_RADIUS, COIN_HEIGHT, 32]} />
      <meshStandardMaterial
        color={coin.id % 2 === 0 ? '#FFD700' : '#FFA500'}
        metalness={0.8}
        roughness={0.2}
        emissive={coin.id % 2 === 0 ? '#FFD700' : '#FFA500'}
        emissiveIntensity={0.1}
      />
    </mesh>
  )
}

// Scene component that manages all coins
function CoinScene({ countdownSeconds }: CoinAnimation3DProps) {
  const [coins, setCoins] = useState<Coin[]>([])
  const startTimeRef = useRef<number | null>(null)
  const lastSpawnTimeRef = useRef<number>(0)
  const spawnAccumulatorRef = useRef<number>(0)
  const coinIdCounterRef = useRef<number>(0)
  const lastFillTimeRef = useRef<number>(0)
  const fillUpCompletedRef = useRef<boolean>(false)

  // Reset animation when countdownSeconds changes
  useEffect(() => {
    setCoins([])
    startTimeRef.current = null
    lastSpawnTimeRef.current = 0
    spawnAccumulatorRef.current = 0
    coinIdCounterRef.current = 0
    lastFillTimeRef.current = 0
    fillUpCompletedRef.current = false
  }, [countdownSeconds])

  // Calculate column positions
  const columnPositions = Array.from(
    { length: NUM_COLUMNS },
    (_, i) => (i - (NUM_COLUMNS - 1) / 2) * COLUMN_SPACING
  )

  // Calculate how many coins we need per column to fill the canvas
  const canvasHeight = 5 // Approximate height in 3D units
  const coinsPerColumn = Math.floor(canvasHeight / COIN_STACK_SPACING)
  // Calculate spawn rate to fill all columns by the end of countdown
  const coinsPerSecond = (coinsPerColumn * NUM_COLUMNS) / countdownSeconds

  // Get the top Y position of a column's stack
  const getColumnTopY = (columnIndex: number, currentCoins: Coin[]): number => {
    const columnCoins = currentCoins.filter(
      c => c.settled && c.columnIndex === columnIndex
    )
    if (columnCoins.length === 0) {
      return -canvasHeight / 2 // Bottom of canvas
    }
    const topCoin = columnCoins.reduce((top, coin) =>
      coin.position.y > top.position.y ? coin : top
    )
    return topCoin.position.y + COIN_STACK_SPACING
  }

  // Create a new falling coin
  const createCoin = (currentCoins: Coin[], duringCountdown: boolean): Coin | null => {
    const columns = Array.from({ length: NUM_COLUMNS }, (_, i) => ({
      index: i,
      topY: getColumnTopY(i, currentCoins),
    }))

    // During countdown, allow coins to stack higher than canvas height
    // After countdown, only allow stacking up to canvas height
    const maxHeight = duringCountdown ? canvasHeight : canvasHeight / 2
    
    const available = columns
      .filter(c => c.topY + COIN_STACK_SPACING <= maxHeight)
      .sort((a, b) => a.topY - b.topY) // Prefer shorter stacks

    // If no columns available during countdown, still pick the shortest column
    // to allow continuous spawning
    if (available.length === 0) {
      if (duringCountdown) {
        // Pick the shortest column to continue stacking
        const shortest = columns.reduce((min, col) => 
          col.topY < min.topY ? col : min
        )
        const chosen = shortest
        
        const columnX = columnPositions[chosen.index]
        const startX = columnX + (Math.random() - 0.5) * 0.2
        const coinId = coinIdCounterRef.current++
        const targetY = chosen.topY

        return {
          id: coinId,
          columnIndex: chosen.index,
          stackIndex: 0,
          position: new THREE.Vector3(startX, canvasHeight / 2 + 1, 0),
          rotation: new THREE.Euler(
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2
          ),
          rotationSpeed: new THREE.Vector3(
            (Math.random() - 0.5) * 0.1,
            (Math.random() - 0.5) * 0.1,
            (Math.random() - 0.5) * 0.1
          ),
          velocity: new THREE.Vector3(
            (Math.random() - 0.5) * 0.3,
            -Math.random() * 0.5 - 0.5,
            0
          ),
          settled: false,
          targetY,
        }
      }
      return null
    }

    // Randomly choose from available columns, with slight preference for shorter stacks
    const candidates = available.slice(0, Math.min(3, available.length))
    const chosen = candidates[Math.floor(Math.random() * candidates.length)]

    const columnX = columnPositions[chosen.index]
    const startX = columnX + (Math.random() - 0.5) * 0.2 // Slight horizontal jitter

    const coinId = coinIdCounterRef.current++
    const targetY = chosen.topY

    return {
      id: coinId,
      columnIndex: chosen.index,
      stackIndex: 0,
      position: new THREE.Vector3(startX, canvasHeight / 2 + 1, 0),
      rotation: new THREE.Euler(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      ),
      rotationSpeed: new THREE.Vector3(
        (Math.random() - 0.5) * 0.1,
        (Math.random() - 0.5) * 0.1,
        (Math.random() - 0.5) * 0.1
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.3,
        -Math.random() * 0.5 - 0.5,
        0
      ),
      settled: false,
      targetY,
    }
  }

  // Animation loop
  useFrame((state, delta) => {
    const currentTime = state.clock.elapsedTime

    if (startTimeRef.current === null) {
      startTimeRef.current = currentTime
      lastSpawnTimeRef.current = currentTime
      lastFillTimeRef.current = currentTime
      fillUpCompletedRef.current = false
    }

    const elapsed = currentTime - startTimeRef.current
    const remaining = countdownSeconds - elapsed

    setCoins((currentCoins) => {
      let newCoins = [...currentCoins]

      // Spawn new coins during countdown - continue until countdown reaches zero
      if (remaining > 0) {
        const dt = currentTime - lastSpawnTimeRef.current
        spawnAccumulatorRef.current += coinsPerSecond * dt

        while (spawnAccumulatorRef.current >= 1) {
          const coin = createCoin(newCoins, true) // true = during countdown
          if (coin) {
            newCoins.push(coin)
            spawnAccumulatorRef.current--
          } else {
            // Should not happen during countdown, but break to avoid infinite loop
            break
          }
        }

        lastSpawnTimeRef.current = currentTime
      }

      // Fill all columns when countdown reaches zero
      // Only fill if countdown has reached zero and fill-up hasn't completed
      if (remaining <= 0 && !fillUpCompletedRef.current) {
        // Check if there are any falling coins - wait for them to settle first
        const fallingCoins = newCoins.filter(c => !c.settled)
        
        // Only start filling if all coins have settled
        if (fallingCoins.length === 0) {
          const fillRate = 10 // coins per second per column
          const timeSinceFill = currentTime - lastFillTimeRef.current
          
          if (timeSinceFill >= 1 / fillRate) {
            let allColumnsFull = true
            
            // Fill one coin per column per frame (up to fill rate)
            for (let col = 0; col < NUM_COLUMNS; col++) {
              const topY = getColumnTopY(col, newCoins)
              const targetTopY = canvasHeight / 2

              if (topY + COIN_STACK_SPACING <= targetTopY) {
                allColumnsFull = false
                const newY = topY
                const coinId = coinIdCounterRef.current++
                
                newCoins.push({
                  id: coinId,
                  columnIndex: col,
                  stackIndex: newCoins.filter(c => c.settled && c.columnIndex === col).length,
                  position: new THREE.Vector3(columnPositions[col], newY, 0),
                  rotation: new THREE.Euler(0, 0, 0),
                  rotationSpeed: new THREE.Vector3(0, 0, 0),
                  velocity: new THREE.Vector3(0, 0, 0),
                  settled: true,
                  targetY: newY,
                })
              }
            }
            
            // Mark fill-up as completed when all columns are full
            if (allColumnsFull) {
              fillUpCompletedRef.current = true
            }
            
            lastFillTimeRef.current = currentTime
          }
        }
      }

      // Update falling coins
      newCoins = newCoins.map((coin) => {
        if (coin.settled) return coin

        // Recalculate targetY based on current settled coins in this column
        // This prevents coins from falling through newly settled coins
        const currentTargetY = getColumnTopY(coin.columnIndex, newCoins)
        
        // Create new objects to avoid mutations
        const newVelocity = coin.velocity.clone()
        const newPosition = coin.position.clone()
        const newRotation = coin.rotation.clone()
        const newRotationSpeed = coin.rotationSpeed.clone()

        // Apply gravity
        newVelocity.y -= 9.8 * delta * 0.5
        newPosition.add(newVelocity.clone().multiplyScalar(delta))

        // Drift toward target column
        const targetX = columnPositions[coin.columnIndex]
        const dx = targetX - newPosition.x
        newVelocity.x += dx * 2 * delta

        // Damping
        newVelocity.x *= 0.95

        // Check if coin should settle - use a small buffer to prevent falling through
        const settleBuffer = COIN_HEIGHT * 0.1
        if (newPosition.y <= currentTargetY + settleBuffer) {
          newPosition.y = currentTargetY
          newPosition.x = targetX
          newVelocity.set(0, 0, 0)
          newRotation.set(0, 0, 0)
          newRotationSpeed.set(0, 0, 0)
          
          return {
            ...coin,
            position: newPosition,
            velocity: newVelocity,
            rotation: newRotation,
            rotationSpeed: newRotationSpeed,
            settled: true,
            targetY: currentTargetY,
          }
        }

        return {
          ...coin,
          position: newPosition,
          velocity: newVelocity,
          rotation: newRotation,
          rotationSpeed: newRotationSpeed,
          targetY: currentTargetY, // Update targetY for next frame
        }
      })

      return newCoins
    })
  })

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5, 5, -5]} intensity={0.5} />
      
      {coins.map((coin) => (
        <CoinMesh key={coin.id} coin={coin} />
      ))}
    </>
  )
}

export default function CoinAnimation3D({ countdownSeconds }: CoinAnimation3DProps) {
  return (
    <div style={{ width: '100%', height: '500px', display: 'flex', justifyContent: 'center' }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        style={{ width: '400px', height: '500px', border: '2px solid rgba(255,215,0,0.3)', borderRadius: 10, background: 'rgba(0,0,0,0.2)' }}
      >
        <CoinScene countdownSeconds={countdownSeconds} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2.2}
        />
      </Canvas>
    </div>
  )
}
