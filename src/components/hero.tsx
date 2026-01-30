"use client"

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion"
import { Github, Linkedin, Mail } from "lucide-react"
import { MouseEvent } from "react"

export function Hero() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x)
  const mouseYSpring = useSpring(y)

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"])

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
      className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden perspective-1000"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="container px-6 md:px-12 lg:px-24 flex flex-col items-center text-center">
        <motion.div
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          className="relative flex flex-col items-center"
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
               <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-secondary/50 flex items-center justify-center text-4xl font-bold font-space text-primary">
                 AG
               </div>
            </div>
          </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{ translateZ: "30px" }}
            >
              <h2 className="text-primary font-space tracking-[0.3em] uppercase text-xs md:text-sm mb-4 opacity-80 flex items-center justify-center gap-3">
                <span className="w-8 h-[1px] bg-primary/30" />
                Data Scientist & AI Engineer
                <span className="w-8 h-[1px] bg-primary/30" />
              </h2>
              <h1 
                className="text-6xl md:text-8xl lg:text-9xl font-bold font-space tracking-tighter mb-6 glitch-hover cursor-default"
                data-text="ANKAN GHOSH"
              >
                ANKAN <span className="text-glow text-primary">GHOSH</span>
              </h1>
              <p className="max-w-2xl text-muted-foreground text-lg md:text-xl mb-10 leading-relaxed font-light">
                <span className="text-primary/50 font-mono mr-2">&gt;</span>
                Transforming complex datasets into actionable insights. Expert in Machine Learning, 
                Algorithmic Problem Solving, and end-to-end AI solutions.
              </p>
            </motion.div>


          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4"
            style={{ translateZ: "20px" }}
          >
            <a
              href="mailto:ghoshankan005@gmail.com"
              className="glass px-8 py-3 rounded-full flex items-center gap-2 text-primary hover:bg-primary/10 transition-colors tech-border"
            >
              <Mail className="w-5 h-5" />
              Connect
            </a>
            <a
              href="https://linkedin.com/in/ghoshankan"
              target="_blank"
              rel="noopener noreferrer"
              className="glass px-8 py-3 rounded-full flex items-center gap-2 hover:bg-white/10 transition-colors"
            >
              <Linkedin className="w-5 h-5" />
              LinkedIn
            </a>
            <a
              href="https://github.com/ghoshankan"
              target="_blank"
              rel="noopener noreferrer"
              className="glass px-8 py-3 rounded-full flex items-center gap-2 hover:bg-white/10 transition-colors"
            >
              <Github className="w-5 h-5" />
              GitHub
            </a>
          </motion.div>
        </motion.div>
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
