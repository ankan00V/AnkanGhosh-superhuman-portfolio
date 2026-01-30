"use client"

import { motion } from "framer-motion"
import { Github, Linkedin, Mail, FileText } from "lucide-react"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      <div className="container px-6 md:px-12 lg:px-24 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-full blur opacity-25 animate-pulse" />
          <div className="relative glass-card !rounded-full p-1 mb-8 overflow-hidden">
             <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-secondary/50 flex items-center justify-center text-4xl font-bold font-space text-primary">
               AG
             </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-primary font-space tracking-[0.2em] uppercase text-sm md:text-base mb-4">
            Data Scientist & AI Engineer
          </h2>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-space tracking-tighter mb-6">
            ANKAN <span className="text-glow text-primary">GHOSH</span>
          </h1>
          <p className="max-w-2xl text-muted-foreground text-lg md:text-xl mb-10 leading-relaxed">
            Transforming complex datasets into actionable insights. Expert in Machine Learning, 
            Algorithmic Problem Solving, and end-to-end AI solutions.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-4"
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
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="glass px-8 py-3 rounded-full flex items-center gap-2 hover:bg-white/10 transition-colors"
          >
            <Github className="w-5 h-5" />
            GitHub
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer"
        onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center p-1">
          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-scroll" />
        </div>
      </motion.div>
    </section>
  )
}
