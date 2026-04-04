"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight, Github, Linkedin, Mail, Phone } from "lucide-react"

const highlights = [
  { value: "209", label: "REST APIs Built" },
  { value: "180+", label: "Automated Tests" },
  { value: "20%", label: "Reporting Efficiency Gain" },
]

export function Hero() {
  return (
    <section className="relative min-h-screen pt-32 pb-16 md:pb-24 flex items-center">
      <div className="container px-6 md:px-12 lg:px-24">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="space-y-7"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-[#0b1124]/70 px-4 py-2 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <p className="text-[11px] uppercase tracking-[0.26em] text-primary/90 font-space">Open to Data/AI Roles</p>
            </div>

            <div>
              <p className="text-primary/85 font-space text-xs md:text-sm uppercase tracking-[0.28em] mb-4">Ankan Ghosh</p>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold font-space leading-[0.95] tracking-tight">
                Building
                <span className="text-primary"> Reliable AI</span>
                <br />
                Systems for Real-World Impact
              </h1>
            </div>

            <p className="max-w-2xl text-base md:text-lg text-slate-200/85 leading-relaxed">
              Data Scientist and AI Engineer focused on end-to-end products: from data pipelines and model training to secure APIs,
              analytics dashboards, and deployable cloud-ready platforms.
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href="mailto:ghoshankan005@gmail.com"
                className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold bg-primary text-primary-foreground hover:brightness-110 transition"
              >
                Hire Me
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="http://www.linkedin.com/in/ghoshankan/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold border border-primary/40 bg-[#0b1124]/75 hover:bg-primary/10 transition"
              >
                <Linkedin className="w-4 h-4 text-primary" />
                LinkedIn
              </a>
              <a
                href="https://github.com/ankan00V"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold border border-white/20 bg-[#0b1124]/60 hover:bg-white/10 transition"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
            </div>

            <div className="grid sm:grid-cols-3 gap-3 pt-2">
              {highlights.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/12 bg-[#090f1f]/70 p-4 backdrop-blur-md">
                  <p className="text-2xl md:text-3xl font-space font-bold text-primary">{item.value}</p>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-300/70 mt-1">{item.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.15 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-br from-primary/25 to-accent/20 blur-3xl" />
            <div className="relative rounded-[2rem] border border-primary/25 bg-[#091023]/70 backdrop-blur-xl p-6 md:p-7">
              <div className="flex items-center gap-4 pb-5 border-b border-white/10">
                <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border border-primary/30">
                  <Image
                    src="https://media.licdn.com/dms/image/v2/D5603AQEgsBwL21VRlw/profile-displayphoto-scale_400_400/B56ZgJOw0_HYAk-/0/1752501523203?e=1771459200&v=beta&t=zKhgbgyRKj5BRlooLiLGR6wJLlHD-En_w3tq1z86EdY"
                    alt="Ankan Ghosh"
                    fill
                    priority
                    unoptimized
                    sizes="(max-width: 768px) 96px, 112px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-space text-xl font-bold">Ankan Ghosh</p>
                  <p className="text-sm text-primary">Data Scientist | AI Engineer</p>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-300/60 mt-1">India</p>
                </div>
              </div>

              <div className="pt-5 space-y-4 text-sm">
                <div className="flex items-center gap-3 text-slate-200/90">
                  <Mail className="w-4 h-4 text-primary" />
                  ghoshankan005@gmail.com
                </div>
                <div className="flex items-center gap-3 text-slate-200/90">
                  <Phone className="w-4 h-4 text-primary" />
                  +91 90463 59825
                </div>
                <p className="text-slate-300/80 leading-relaxed">
                  Certified by Oracle and Databricks, with proven delivery in production-grade campus platforms,
                  GenAI copilots, enterprise analytics, and secure scalable backend systems.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
