"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Cpu, User, Sparkles, Briefcase, FolderKanban, Award, GraduationCap, Mail } from "lucide-react"

const navLinks = [
  { name: "About", href: "#about", icon: User },
  { name: "Skills", href: "#skills", icon: Sparkles },
  { name: "Experience", href: "#experience", icon: Briefcase },
  { name: "Projects", href: "#projects", icon: FolderKanban },
  { name: "Certs", href: "#certifications", icon: Award },
  { name: "Education", href: "#education", icon: GraduationCap },
  { name: "Contact", href: "#contact", icon: Mail },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 py-4 md:py-5">
      <div className="container mx-auto px-6 md:px-12">
        <div
          className={`rounded-2xl border px-4 md:px-6 py-3 transition-all duration-300 ${
            isScrolled
              ? "bg-[#090b18]/80 border-primary/35 backdrop-blur-xl shadow-[0_0_25px_rgba(0,246,255,0.18)]"
              : "bg-[#090b18]/50 border-white/10 backdrop-blur-md"
          }`}
        >
          <div className="flex items-center justify-between gap-4">
            <a href="#" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/40 flex items-center justify-center">
                <Cpu className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-space font-bold text-sm md:text-base leading-none tracking-tight">ANKAN GHOSH</p>
                <p className="text-[10px] uppercase tracking-[0.24em] text-primary/80 mt-1">Data + AI Engineer</p>
              </div>
            </a>

            <ul className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>

            <button
              className="lg:hidden p-2"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="lg:hidden px-6 md:px-12 mt-3"
          >
            <div className="rounded-2xl border border-primary/25 bg-[#0b0f20]/90 backdrop-blur-xl p-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-primary/10 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <link.icon className="w-4 h-4 text-primary" />
                  <span className="font-space text-sm uppercase tracking-[0.14em]">{link.name}</span>
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
