"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { Points, PointMaterial } from "@react-three/drei"
import * as random from "maath/random"
import { useState, useRef, Suspense } from "react"

function StarField(props: any) {
  const ref = useRef<any>()
  const [sphere] = useState(() => {
    const data = new Float32Array(5000 * 3)
    for (let i = 0; i < 5000 * 3; i++) {
      data[i] = (Math.random() - 0.5) * 3
    }
    return data
  })

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10
    ref.current.rotation.y -= delta / 15
  })

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color="#5eead4"
          size={0.002}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  )
}

export function CyberBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-background overflow-hidden">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <Suspense fallback={null}>
          <StarField />
        </Suspense>
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none" />
    </div>
  )
}
