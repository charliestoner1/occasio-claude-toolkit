---
name: 3d-scene
description: Build interactive 3D web experiences — Three.js, React Three Fiber, WebGL shaders, 3D floor maps, product showcases, immersive hero sections
disable-model-invocation: false
user-invocable: true
allowed-tools: Read, Write, Edit, Grep, Glob, Bash(npm install *)
argument-hint: "<what-to-build>"
---

# 3D Web Experiences

Build interactive 3D scenes for the web using Three.js and React Three Fiber.

**Target:** $ARGUMENTS

## When to Use 3D

### Good use cases for this project:
- **3D Floor Map** — interactive venue layout with camera orbit, clickable tables, ambient lighting
- **Bottle Showcase** — rotating 3D bottle models with lighting effects
- **Immersive Hero** — parallax 3D background for the homepage
- **VIP Experience Preview** — atmospheric 3D scene showing the venue ambiance
- **Data Visualization** — 3D bar charts, revenue landscapes

### Avoid 3D when:
- Simple 2D layout works fine (floor maps with pins are already functional)
- Mobile performance is critical (3D is GPU-heavy)
- The content is text-heavy (3D adds no value)
- Load time is more important than visual impact

## Setup

### Install Dependencies
```bash
npm install three @react-three/fiber @react-three/drei
npm install -D @types/three
```

### Core Stack
- **Three.js** — 3D rendering engine
- **@react-three/fiber** (R3F) — React renderer for Three.js
- **@react-three/drei** — Useful helpers (OrbitControls, Text, Environment, etc.)

### Dynamic Import (REQUIRED)
3D components are heavy — always dynamically import:

```typescript
import dynamic from 'next/dynamic'

const Scene3D = dynamic(() => import('@/components/3d/Scene3D'), {
  ssr: false,
  loading: () => <div className="h-[400px] bg-zinc-900 animate-pulse rounded-xl" />,
})
```

## React Three Fiber Patterns

### Basic Scene Setup
```typescript
'use client'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei'

export function Scene3D() {
  return (
    <div className="h-[400px] w-full rounded-xl overflow-hidden">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 5, 10]} fov={50} />
        <OrbitControls
          enablePan={false}
          maxPolarAngle={Math.PI / 2.2}
          minDistance={5}
          maxDistance={20}
        />

        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#10b981" />
        <spotLight position={[0, 10, 0]} intensity={0.8} angle={0.5} />

        {/* Environment for reflections */}
        <Environment preset="night" />

        {/* Your 3D content here */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#10b981" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial color="#18181b" metalness={0.5} roughness={0.8} />
        </mesh>
      </Canvas>
    </div>
  )
}
```

### 3D Floor Map
```typescript
'use client'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Text, RoundedBox } from '@react-three/drei'
import { useState } from 'react'
import * as THREE from 'three'

interface Table3D {
  id: string
  name: string
  x: number
  z: number
  type: 'booth' | 'table' | 'bar'
  status: 'available' | 'reserved' | 'occupied'
}

function TableMesh({ table, onClick, isSelected }: {
  table: Table3D
  onClick: () => void
  isSelected: boolean
}) {
  const color = {
    available: '#10b981',
    reserved: '#f59e0b',
    occupied: '#ef4444',
  }[table.status]

  const size = table.type === 'booth' ? [2, 0.8, 1.5] : [1, 0.8, 1]

  return (
    <group position={[table.x, 0, table.z]} onClick={onClick}>
      <RoundedBox args={size as [number, number, number]} radius={0.1}>
        <meshStandardMaterial
          color={isSelected ? '#ffffff' : color}
          emissive={isSelected ? color : '#000000'}
          emissiveIntensity={isSelected ? 0.5 : 0}
          metalness={0.3}
          roughness={0.4}
        />
      </RoundedBox>
      <Text
        position={[0, 0.8, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="bottom"
      >
        {table.name}
      </Text>
    </group>
  )
}
```

### Bottle Showcase (Rotating Product)
```typescript
'use client'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Stage, PresentationControls } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'

function BottleModel({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  const ref = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.3
  })

  return <primitive ref={ref} object={scene} scale={2} />
}

export function BottleShowcase({ modelUrl }: { modelUrl: string }) {
  return (
    <div className="h-[300px] w-full">
      <Canvas>
        <Stage environment="night" intensity={0.5}>
          <PresentationControls
            global
            snap
            rotation={[0, -Math.PI / 4, 0]}
            polar={[-Math.PI / 4, Math.PI / 4]}
            azimuth={[-Math.PI / 4, Math.PI / 4]}
          >
            <BottleModel url={modelUrl} />
          </PresentationControls>
        </Stage>
      </Canvas>
    </div>
  )
}
```

### Immersive Hero Background
```typescript
'use client'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Stars, Sparkles } from '@react-three/drei'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'

function ParticleField() {
  const points = useRef<THREE.Points>(null)

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.elapsedTime * 0.05
    }
  })

  const positions = useMemo(() => {
    const pos = new Float32Array(1000 * 3)
    for (let i = 0; i < 1000; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40
    }
    return pos
  }, [])

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={1000}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#10b981" transparent opacity={0.6} />
    </points>
  )
}

export function HeroScene() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        <color attach="background" args={['#09090b']} />
        <fog attach="fog" args={['#09090b', 10, 40]} />
        <ambientLight intensity={0.1} />
        <Stars radius={50} depth={50} count={2000} factor={4} fade speed={1} />
        <Sparkles count={100} scale={20} size={2} speed={0.3} color="#10b981" />
        <ParticleField />
      </Canvas>
    </div>
  )
}
```

### WebGL Shader (Custom Material)
```typescript
import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'

const GlowMaterial = shaderMaterial(
  { time: 0, color: new THREE.Color('#10b981') },
  // Vertex shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform float time;
    uniform vec3 color;
    varying vec2 vUv;
    void main() {
      float glow = sin(time * 2.0 + vUv.x * 3.14) * 0.5 + 0.5;
      gl_FragColor = vec4(color * glow, glow * 0.8);
    }
  `
)

extend({ GlowMaterial })
```

## Project-Specific Rules

### Theme Integration
- Use CSS variables for 3D scene colors where possible:
  ```typescript
  const primaryColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--color-primary-rgb').trim()
  ```
- Default to emerald (`#10b981`) which gets themed via the color system
- Night/dark environments match the nightclub aesthetic

### Performance
- **Always use `dynamic()` import with `ssr: false`** — Three.js can't run server-side
- **Provide loading fallback** — shimmer placeholder while 3D loads
- **Mobile detection** — reduce polygon count, particle count, disable shadows:
  ```typescript
  import { useIsMobile } from '@/lib/hooks/use-is-mobile'
  const isMobile = useIsMobile(768)
  // Reduce quality on mobile
  const particleCount = isMobile ? 200 : 1000
  ```
- **Lazy load 3D sections** — only render Canvas when scrolled into view
- **Dispose resources** — Three.js doesn't garbage collect; clean up on unmount

### Accessibility
- 3D scenes are decorative — add `aria-hidden="true"` to the container
- Provide a non-3D fallback for `prefers-reduced-motion`
- Don't put critical information only in 3D — keep 2D alternatives
- Interactive 3D elements need keyboard alternatives

### Model Assets
- Store .glb files in `public/models/`
- Keep models under 2MB for mobile performance
- Use Draco compression for large models:
  ```typescript
  import { useGLTF } from '@react-three/drei'
  useGLTF.preload('/models/bottle.glb')
  ```

## After Building

1. Add Three.js/R3F to dynamic imports list in MEMORY.md
2. Ensure `ssr: false` on all Canvas-containing components
3. Test on mobile — verify acceptable frame rate
4. Add loading fallback for slow connections
5. Verify the scene doesn't block interaction with overlaid UI elements
