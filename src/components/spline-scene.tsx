"use client"

import React from 'react'

export function SplineScene() {
  return (
    <div className="relative w-full h-[400px] md:h-[600px] lg:h-[700px] pointer-events-auto overflow-hidden">
      <div className="w-full h-full bg-transparent">
        <iframe 
          src="https://my.spline.design/genkubgreetingrobot-HbDBtNrg0wVTGupJNol9GQgt/" 
          frameBorder="0" 
          width="100%" 
          height="100%"
          className="rounded-3xl mix-blend-multiply contrast-[1.2] brightness-[1.05]"
          style={{
            maskImage: 'radial-gradient(circle at center, black 10%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(circle at center, black 10%, transparent 80%)',
          }}
          title="Spline 3D Robot"
        />
      </div>
      <div className="absolute bottom-4 right-4 text-[10px] font-mono text-white/20 uppercase tracking-widest pointer-events-none">
        Interactive 3D Unit
      </div>
    </div>
  )
}
