"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { Points, PointMaterial } from "@react-three/drei"
import { useState, useRef, Suspense } from "react"
import * as THREE from "three"

function StarField() {
  const ref = useRef<THREE.Points>(null!)
  
  const [sphere] = useState(() => {
    const data = new Float32Array(6000 * 3)
    for (let i = 0; i < 6000 * 3; i++) {
      data[i] = (Math.random() - 0.5) * 4
    }
    return data
  })

  useFrame((state, delta) => {
    // Rotation
    ref.current.rotation.x -= delta / 15
    ref.current.rotation.y -= delta / 20

    // Parallax
    const { x, y } = state.mouse
    ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, x * 0.15, 0.05)
    ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, y * 0.15, 0.05)
  })

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled>
        <PointMaterial
          transparent
          color="#5eead4"
          size={0.004}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  )
}

function GlowingOrbs() {
  const ref = useRef<THREE.Group>(null!)

  useFrame((state) => {
    const { x, y } = state.mouse
    ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, x * 0.3, 0.02)
    ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, y * 0.3, 0.02)
  })

  return (
    <group ref={ref}>
      <mesh position={[-2, 1, -5]}>
        <sphereGeometry args={[3, 32, 32]} />
        <meshBasicMaterial color="#7c3aed" transparent opacity={0.03} />
      </mesh>
      <mesh position={[2, -1, -5]}>
        <sphereGeometry args={[4, 32, 32]} />
        <meshBasicMaterial color="#0d9488" transparent opacity={0.03} />
      </mesh>
    </group>
  )
}

export function CyberBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-[#020617] overflow-hidden">
      {/* Dynamic Gradients */}
      <div className="absolute inset-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-accent/10 rounded-full blur-[150px] animate-pulse [animation-delay:3s]" />
      </div>

      <Canvas camera={{ position: [0, 0, 1.2] }}>
        <Suspense fallback={null}>
          <StarField />
          <GlowingOrbs />
        </Suspense>
      </Canvas>

      {/* Futuristic Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_30%,transparent_100%)]" />
      
      {/* Darkness Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-[#020617]/50 pointer-events-none" />
    </div>
  )
}
