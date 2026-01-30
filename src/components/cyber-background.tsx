"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { Points, PointMaterial, Grid } from "@react-three/drei"
import { useState, useRef, Suspense, useEffect } from "react"
import * as THREE from "three"
import { motion, useSpring, useMotionValue } from "framer-motion"

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
    if (!ref.current) return
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
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  )
}

function CyberGrid() {
  const gridRef = useRef<THREE.Group>(null!)

  useFrame((state) => {
    if (!gridRef.current) return
    const { x, y } = state.mouse
    // Subtle tilt based on mouse
    gridRef.current.rotation.x = THREE.MathUtils.lerp(gridRef.current.rotation.x, -Math.PI / 3 + y * 0.1, 0.05)
    gridRef.current.rotation.y = THREE.MathUtils.lerp(gridRef.current.rotation.y, x * 0.1, 0.05)
  })

  return (
    <group ref={gridRef} position={[0, -1, -2]} rotation={[-Math.PI / 3, 0, 0]}>
      <Grid
        args={[20, 20]}
        sectionSize={1}
        sectionColor="#00f7ff"
        sectionThickness={1.5}
        cellSize={0.5}
        cellColor="#00f7ff"
        cellThickness={0.8}
        infiniteGrid
        fadeDistance={25}
        fadeStrength={5}
      />
    </group>
  )
}

function GlowingOrbs() {
  const ref = useRef<THREE.Group>(null!)

  useFrame((state) => {
    if (!ref.current) return
    const { x, y } = state.mouse
    ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, x * 0.5, 0.02)
    ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, y * 0.5, 0.02)
  })

  return (
    <group ref={ref}>
      <mesh position={[-3, 2, -6]}>
        <sphereGeometry args={[4, 32, 32]} />
        <meshBasicMaterial color="#7c3aed" transparent opacity={0.08} />
      </mesh>
      <mesh position={[3, -2, -6]}>
        <sphereGeometry args={[5, 32, 32]} />
        <meshBasicMaterial color="#00f7ff" transparent opacity={0.08} />
      </mesh>
    </group>
  )
}

export function CyberBackground() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const springConfig = { damping: 25, stiffness: 150 }
  const smoothX = useSpring(mouseX, springConfig)
  const smoothY = useSpring(mouseY, springConfig)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <div className="fixed inset-0 -z-10 bg-[#020617] overflow-hidden scanlines">
      {/* Dynamic Cursor Spotlight */}
      <motion.div 
        className="absolute pointer-events-none z-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]"
        style={{
          left: smoothX,
          top: smoothY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />

      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-accent/5 rounded-full blur-[150px] animate-pulse [animation-delay:3s]" />
      </div>

      <div className="absolute inset-0 opacity-40">
        <Canvas camera={{ position: [0, 0, 1.5], fov: 60 }}>
          <Suspense fallback={null}>
            <StarField />
            <CyberGrid />
            <GlowingOrbs />
          </Suspense>
        </Canvas>
      </div>

      {/* Static Cyber Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00f7ff05_1px,transparent_1px),linear-gradient(to_bottom,#00f7ff05_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none" />
      
      {/* Darkness Vignette */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#020617]/50 to-[#020617] pointer-events-none" />
    </div>
  )
}
