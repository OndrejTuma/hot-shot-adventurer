import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

/* =====================
   Constants
===================== */

const COLUMN_COUNT = 8
const CANVAS_WIDTH = 16
const CANVAS_HEIGHT = 10

const COLUMN_GAP = 0.3

const COIN_RADIUS = 0.45
const COIN_THICKNESS = 0.18

const FALL_SPEED = 6
const ROTATION_SPEED = 6

/* =====================
   Coin Colors
===================== */

const COINS = [
  { face: '#d4af37', edge: '#b8962e' }, // gold
  { face: '#c0c0c0', edge: '#9e9e9e' }, // silver
  { face: '#cd7f32', edge: '#a76429' }, // bronze
]

/* =====================
   Coins System
===================== */

function Coins({ countdownSeconds }: { countdownSeconds: number }) {
  const group = useRef<THREE.Group>(null!)
  const columns = useRef<number[]>(Array(COLUMN_COUNT).fill(0))
  const elapsed = useRef(0)

  const usableWidth = CANVAS_WIDTH - COLUMN_GAP * (COLUMN_COUNT - 1)
  const columnWidth = usableWidth / COLUMN_COUNT

  const maxCoinsPerColumn = Math.floor(CANVAS_HEIGHT / COIN_THICKNESS)

  useFrame((_, delta) => {
    elapsed.current += delta

    const totalCoins = COLUMN_COUNT * maxCoinsPerColumn

    const progress = Math.min(elapsed.current / countdownSeconds, 1)

    const shouldExist = Math.floor(progress * totalCoins)

    /* Spawn coins */
    while (group.current.children.length < shouldExist) {
      const col = Math.floor(Math.random() * COLUMN_COUNT)
      if (columns.current[col] >= maxCoinsPerColumn) break

      const x =
        -CANVAS_WIDTH / 2 + col * (columnWidth + COLUMN_GAP) + columnWidth / 2

      const targetY =
        -CANVAS_HEIGHT / 2 +
        columns.current[col] * COIN_THICKNESS +
        COIN_THICKNESS / 2

      columns.current[col]++

      const { face, edge } = COINS[Math.floor(Math.random() * COINS.length)]

      const coin = new THREE.Group()

      /* Face */
      coin.add(
        new THREE.Mesh(
          new THREE.CylinderGeometry(
            COIN_RADIUS,
            COIN_RADIUS,
            COIN_THICKNESS,
            32
          ),
          new THREE.MeshStandardMaterial({
            color: face,
            metalness: 0.6,
            roughness: 0.25,
            emissive: new THREE.Color(face),
            emissiveIntensity: 0.15,
          })
        )
      )

      /* Edge */
      coin.add(
        new THREE.Mesh(
          new THREE.CylinderGeometry(
            COIN_RADIUS * 1.01,
            COIN_RADIUS * 1.01,
            COIN_THICKNESS * 0.95,
            32,
            1,
            true
          ),
          new THREE.MeshStandardMaterial({
            color: edge,
            metalness: 0.5,
            roughness: 0.3,
          })
        )
      )

      coin.position.set(x, CANVAS_HEIGHT / 2 + 2, 0)
      coin.userData = {
        targetY,
        landed: false,

        // fixed angular velocity (radians per second)
        angularVelocity: new THREE.Vector3(
          (Math.random() - 0.5) * ROTATION_SPEED,
          (Math.random() - 0.5) * ROTATION_SPEED,
          (Math.random() - 0.5) * ROTATION_SPEED
        ),
      }

      group.current.add(coin)
    }

    /* Animate falling & rotation */
    group.current.children.forEach((coin) => {
      const { targetY, landed, rotationSpeed } = coin.userData as {
        targetY: number
        landed: boolean
        rotationSpeed: number
      }

      if (!landed) {
        coin.position.y -= FALL_SPEED * delta

        const { angularVelocity } = coin.userData as {
          angularVelocity: THREE.Vector3
        }

        // constant angular momentum
        coin.rotation.x += angularVelocity.x * delta
        coin.rotation.y += angularVelocity.y * delta
        coin.rotation.z += angularVelocity.z * delta

        if (coin.position.y <= targetY) {
          coin.position.y = targetY
          coin.userData.landed = true

          coin.rotation.set(0, 0, 0)
          angularVelocity.set(0, 0, 0)
        }
      }
    })
  })

  return <group ref={group} />
}

/* =====================
   Public Component
===================== */

export function CoinRain({ countdownSeconds }: { countdownSeconds: number }) {
  return (
    <Canvas
      orthographic
      camera={{ zoom: 25, position: [0, 0, 10] }}
      gl={{ alpha: true }}
    >
      <ambientLight intensity={0.8} />
      <ambientLight intensity={0.6} />
      <hemisphereLight color='#ffffff' groundColor='#444444' intensity={0.8} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} />
      <directionalLight position={[-5, 3, 5]} intensity={0.6} />
      <Coins countdownSeconds={countdownSeconds} />
    </Canvas>
  )
}
