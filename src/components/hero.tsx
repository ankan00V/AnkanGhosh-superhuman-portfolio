"use client"

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion"
import { Github, Linkedin, Mail } from "lucide-react"
import { MouseEvent } from "react"
import Image from "next/image"
import { SplineScene } from "./spline-scene"

export function Hero() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x)
  const mouseYSpring = useSpring(y)

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"])

  function handleMouseMove(e: MouseEvent) {
    const rect = e.currentTarget.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  function handleMouseLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center pt-24 pb-12 overflow-hidden perspective-1000"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="container px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
            }}
            className="relative flex flex-col items-start text-left order-2 lg:order-1"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative mb-8"
              style={{ translateZ: "50px" }}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-full blur opacity-25 animate-pulse" />
                <div className="relative glass-card !rounded-full p-1 overflow-hidden">
                   <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-secondary/50 flex items-center justify-center overflow-hidden relative">
                     <Image 
                       src="https://media.licdn.com/dms/image/v2/D5603AQEgsBwL21VRlw/profile-displayphoto-scale_400_400/B56ZgJOw0_HYAk-/0/1752501523203?e=1771459200&v=beta&t=zKhgbgyRKj5BRlooLiLGR6wJLlHD-En_w3tq1z86EdY"
                       alt="Ankan Ghosh"
                       fill
                       className="object-cover transition-transform duration-500 hover:scale-110"
                     />
                   </div>
                </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{ translateZ: "30px" }}
            >
              <h2 className="text-primary font-space tracking-[0.3em] uppercase text-xs md:text-sm mb-4 opacity-80 flex items-center gap-3">
                <span className="w-8 h-[1px] bg-primary/30" />
                Data Scientist & AI Engineer
              </h2>
              <h1 
                className="text-5xl md:text-7xl lg:text-8xl font-bold font-space tracking-tighter mb-6 glitch-hover cursor-default leading-none"
                data-text="ANKAN GHOSH"
              >
                ANKAN <br /><span className="text-glow text-primary">GHOSH</span>
              </h1>
              <p className="max-w-xl text-muted-foreground text-base md:text-lg mb-8 leading-relaxed font-light">
                <span className="text-primary/50 font-mono mr-2">&gt;</span>
                Transforming complex datasets into actionable insights. Expert in Machine Learning, 
                Algorithmic Problem Solving, and end-to-end AI solutions.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center gap-4"
              style={{ translateZ: "20px" }}
            >
              <a
                href="mailto:ghoshankan005@gmail.com"
                className="glass px-6 py-3 rounded-full flex items-center gap-2 text-primary hover:bg-primary/10 transition-colors tech-border text-sm md:text-base"
              >
                <Mail className="w-4 h-4 md:w-5 md:h-5" />
                Connect
              </a>
              <div className="flex gap-4">
                <a
                  href="https://linkedin.com/in/ghoshankan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass p-3 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="https://github.com/ghoshankan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass p-3 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="relative w-full order-1 lg:order-2"
          >
            <div className="absolute -inset-4 bg-primary/5 rounded-full blur-3xl" />
            <SplineScene />
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 cursor-pointer z-20"
        onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <span className="text-[10px] font-mono tracking-[0.3em] text-primary uppercase opacity-50">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent opacity-50" />
      </motion.div>
    </section>
  )
}
