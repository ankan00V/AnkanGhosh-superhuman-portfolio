"use client"

import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"

interface SectionProps {
  id: string
  title: string
  icon?: LucideIcon
  children: React.ReactNode
  className?: string
}

export function Section({ id, title, icon: Icon, children, className }: SectionProps) {
  return (
    <section id={id} className={`py-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto ${className ?? ""}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.55 }}
        className="mb-12 flex items-center gap-4"
      >
        {Icon && <Icon className="w-8 h-8 text-primary" />}
        <h2 className="text-3xl md:text-4xl font-bold font-space tracking-tight">
          {title}
          <span className="text-primary">.</span>
        </h2>
        <div className="h-px bg-border flex-grow ml-4" />
      </motion.div>
      {children}
    </section>
  )
}
