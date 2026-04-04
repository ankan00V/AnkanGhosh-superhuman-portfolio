"use client"

import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion"

type ModuleIllustrationProps = {
  moduleId: string
}

type SceneKind = "neural" | "timeline" | "systems" | "matrix" | "academy" | "badge" | "beacon"

const achievementsIconUrl = "https://img.icons8.com/?size=100&id=vNXFqyQtOSbb&format=png"
const skillsIconUrl = "https://img.icons8.com/?size=100&id=IFyb9G1c6yAC&format=png"
const certificationsIconUrl = "https://img.icons8.com/?size=100&id=N1E3WPmZbEdJ&format=png"
const systemsIconUrl = "https://img.icons8.com/?size=100&id=mZMRHUuYZ7np&format=png"

const moduleMeta: Record<string, { label: string; tone: string; scene: SceneKind }> = {
  about: {
    label: "Neural Identity",
    tone: "from-cyan-300/40 via-sky-200/15 to-violet-300/35",
    scene: "neural",
  },
  experience: {
    label: "Ops Timeline",
    tone: "from-violet-300/40 via-fuchsia-200/15 to-cyan-300/30",
    scene: "timeline",
  },
  projects: {
    label: "System Mesh",
    tone: "from-cyan-300/45 via-violet-200/15 to-indigo-300/25",
    scene: "systems",
  },
  skills: {
    label: "Skill Matrix",
    tone: "from-teal-300/40 via-cyan-200/15 to-violet-300/30",
    scene: "matrix",
  },
  education: {
    label: "Knowledge Cube",
    tone: "from-indigo-300/35 via-cyan-200/15 to-violet-300/30",
    scene: "academy",
  },
  certifications: {
    label: "Credential Ring",
    tone: "from-cyan-300/40 via-violet-200/15 to-indigo-300/25",
    scene: "badge",
  },
  achievements: {
    label: "Milestone Beacon",
    tone: "from-amber-300/30 via-cyan-200/15 to-violet-300/30",
    scene: "beacon",
  },
}

function SceneVisual({ scene, cursorX, cursorY }: { scene: SceneKind; cursorX: MotionValue<number>; cursorY: MotionValue<number> }) {
  const nearX = useTransform(cursorX, (v) => v * 16)
  const nearY = useTransform(cursorY, (v) => v * 16)
  const midX = useTransform(cursorX, (v) => v * 10)
  const midY = useTransform(cursorY, (v) => v * 10)
  const farX = useTransform(cursorX, (v) => v * 6)
  const farY = useTransform(cursorY, (v) => v * 6)

  if (scene === "neural") {
    return (
      <>
        <motion.div style={{ x: farX, y: farY }} className="absolute inset-0">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={`neural-link-${i}`}
              animate={{ opacity: [0.25, 0.7, 0.25] }}
              transition={{ duration: 2.2 + i * 0.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              className="absolute h-px rounded-full bg-cyan-100/50"
              style={{
                width: `${30 + i * 10}px`,
                left: `${18 + i * 16}%`,
                top: `${28 + (i % 2) * 24}%`,
                transform: `rotate(${i % 2 === 0 ? 22 : -24}deg)`,
              }}
            />
          ))}
        </motion.div>
        <motion.div style={{ x: nearX, y: nearY }} className="absolute inset-0">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={`neural-node-${i}`}
              animate={{ scale: [1, 1.2, 1], opacity: [0.55, 1, 0.55] }}
              transition={{ duration: 2.1, repeat: Number.POSITIVE_INFINITY, delay: i * 0.2 }}
              className="absolute h-2.5 w-2.5 rounded-full border border-cyan-100/60 bg-cyan-200/30"
              style={{ left: `${20 + (i % 3) * 25}%`, top: `${22 + Math.floor(i / 2) * 22}%` }}
            />
          ))}
        </motion.div>
      </>
    )
  }

  if (scene === "timeline") {
    return (
      <>
        <motion.div style={{ x: farX, y: farY }} className="absolute left-1/2 top-1/2 h-[2px] w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-100/65" />
        <motion.div
          style={{ x: midX, y: midY }}
          animate={{ x: [-12, 12, -12] }}
          transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-100/70 bg-cyan-200/35 shadow-[0_0_14px_rgba(34,211,238,0.55)]"
        />
          {[0, 1, 2].map((i) => (
            <motion.div
              key={`timeline-stop-${i}`}
              style={{ left: `${30 + i * 20}%`, x: nearX, y: nearY }}
              animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY, delay: i * 0.3 }}
              className="absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border border-violet-100/70 bg-violet-300/35"
            />
          ))}
      </>
    )
  }

    if (scene === "systems") {
      return (
          <>
            <motion.div style={{ x: farX, y: farY }} className="absolute left-1/2 top-1/2 h-[70px] w-[70px] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-cyan-100/40" />
            <motion.div style={{ x: midX, y: midY }} className="absolute left-1/2 top-1/2 h-[48px] w-[48px] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-violet-100/55" />

          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={`sys-node-${i}`}
              style={{ x: nearX, y: nearY, left: `${32 + (i % 2) * 36}%`, top: `${32 + Math.floor(i / 2) * 36}%` }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.95, 0.5] }}
              transition={{ duration: 2.2, repeat: Number.POSITIVE_INFINITY, delay: i * 0.2 }}
              className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-100/60 bg-cyan-300/35"
            />
          ))}
            <motion.div
              style={{ x: midX, y: midY }}
              animate={{ scale: [1, 1.08, 1], opacity: [0.9, 1, 0.9] }}
              transition={{ duration: 2.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <div className="inline-flex h-[54px] w-[54px] items-center justify-center rounded-full border border-cyan-50/55 bg-gradient-to-br from-cyan-200/30 via-slate-900/70 to-violet-300/20 p-2.5 shadow-[0_0_24px_rgba(34,211,238,0.22)]">
                <div className="inline-flex h-full w-full items-center justify-center rounded-full border border-cyan-100/35 bg-slate-950/65">
                  <div
                    role="img"
                    aria-label="Featured systems icon"
                    className="h-8 w-8 bg-contain bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${systemsIconUrl})` }}
                  />
                </div>
              </div>
            </motion.div>
        </>
      )
    }


    if (scene === "matrix") {
      return (
        <>
          <motion.div style={{ x: farX, y: farY }} className="absolute inset-0">
              {[0, 1, 2, 3].map((row) => (
                <motion.div
                  key={`m-row-${row}`}
                  animate={{ opacity: [0.25, 0.95, 0.25] }}
                  transition={{ duration: 2.4, repeat: Number.POSITIVE_INFINITY, delay: row * 0.18 }}
                  className="absolute left-1/2 h-[2px] w-[72px] -translate-x-1/2 rounded-full bg-cyan-100/55"
                  style={{ top: `${26 + row * 15}%` }}
                />
              ))}
          </motion.div>
            <motion.div style={{ x: nearX, y: nearY }} className="absolute inset-0">
              {[0, 1, 2, 3].map((col) => (
                <motion.div
                  key={`m-col-${col}`}
                  animate={{ opacity: [0.2, 0.85, 0.2] }}
                  transition={{ duration: 2.2, repeat: Number.POSITIVE_INFINITY, delay: col * 0.22 }}
                  className="absolute top-1/2 h-[72px] w-[2px] -translate-y-1/2 rounded-full bg-violet-100/55"
                  style={{ left: `${26 + col * 15}%` }}
                />
              ))}
            </motion.div>
            <motion.div
              style={{ x: midX, y: midY }}
              animate={{ scale: [1, 1.08, 1], opacity: [0.9, 1, 0.9] }}
              transition={{ duration: 2.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <div className="inline-flex h-[52px] w-[52px] items-center justify-center rounded-full border border-cyan-50/55 bg-gradient-to-br from-cyan-200/30 via-slate-900/70 to-violet-300/20 p-2.5 shadow-[0_0_24px_rgba(34,211,238,0.22)]">
                <div className="inline-flex h-full w-full items-center justify-center rounded-full border border-cyan-100/35 bg-slate-950/65">
                    <div
                      role="img"
                      aria-label="Skills icon"
                      className="h-8 w-8 bg-contain bg-center bg-no-repeat"
                      style={{ backgroundImage: `url(${skillsIconUrl})` }}
                    />
                </div>
              </div>
            </motion.div>
        </>
      )
    }

  if (scene === "academy") {
    return (
      <>
        <motion.div
          style={{ x: midX, y: midY }}
          animate={{ rotateY: [0, 180, 360], rotateX: [52, 65, 52] }}
          transition={{ duration: 7.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 [transform-style:preserve-3d]"
        >
          <div className="absolute inset-0 rounded-md border border-cyan-100/55 bg-cyan-300/25 [transform:translateZ(10px)]" />
          <div className="absolute inset-0 rounded-md border border-violet-100/55 bg-violet-300/20 [transform:rotateY(90deg)_translateZ(10px)]" />
          <div className="absolute inset-0 rounded-md border border-indigo-100/50 bg-indigo-300/20 [transform:rotateX(90deg)_translateZ(10px)]" />
        </motion.div>
        <motion.div style={{ x: farX, y: farY }} className="absolute left-1/2 top-1/2 h-[60px] w-[60px] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-cyan-100/35" />
      </>
    )
  }

  if (scene === "badge") {
    return (
      <>
          <motion.div
            style={{ x: midX, y: midY }}
            animate={{ rotate: 360 }}
            transition={{ duration: 9, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="absolute left-1/2 top-1/2 h-[72px] w-[72px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-100/50"
          />
          <motion.div
            style={{ x: nearX, y: nearY }}
            animate={{ rotate: -360 }}
            transition={{ duration: 6.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="absolute left-1/2 top-1/2 h-[56px] w-[56px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-100/65"
          />
          <motion.div
            style={{ x: nearX, y: nearY }}
            animate={{ scale: [1, 1.1, 1], opacity: [0.9, 1, 0.9] }}
            transition={{ duration: 2.3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
                <div className="inline-flex h-[58px] w-[58px] items-center justify-center rounded-full border border-cyan-50/60 bg-gradient-to-br from-cyan-200/30 via-slate-900/70 to-violet-300/20 p-2.5 shadow-[0_0_24px_rgba(34,211,238,0.22)]">

                <div className="inline-flex h-full w-full items-center justify-center rounded-full border border-cyan-100/35 bg-slate-950/65">
                    <div
                      role="img"
                      aria-label="Certification icon"
                      className="h-8 w-8 bg-contain bg-center bg-no-repeat"
                      style={{ backgroundImage: `url(${certificationsIconUrl})` }}
                    />
                </div>
              </div>
          </motion.div>
      </>
    )
  }

      return (
        <>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={`beacon-ring-${i}`}
                style={{ x: farX, y: farY }}
                animate={{ scale: [0.72, 1.48], opacity: [0.68, 0] }}
                transition={{ duration: 2.7, repeat: Number.POSITIVE_INFINITY, delay: i * 0.72, ease: "easeOut" }}
                className="absolute left-1/2 top-1/2 h-[62px] w-[62px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-100/55"
              />
            ))}
            <motion.div
              style={{ x: midX, y: midY }}
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="absolute left-1/2 top-1/2 h-[58px] w-[58px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-100/50"
            />
          <motion.div
            style={{ x: nearX, y: nearY }}
            animate={{ scale: [1, 1.09, 1], opacity: [0.9, 1, 0.9] }}
            transition={{ duration: 2.1, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
              <div className="inline-flex h-[56px] w-[56px] items-center justify-center rounded-full border border-cyan-50/60 bg-gradient-to-br from-cyan-200/35 via-slate-900/70 to-violet-300/25 p-2.5 shadow-[0_0_30px_rgba(34,211,238,0.24)]">
                <div className="inline-flex h-full w-full items-center justify-center rounded-full border border-cyan-100/35 bg-slate-950/65">
                    <div
                      role="img"
                      aria-label="Achievement icon"
                      className="h-8 w-8 bg-contain bg-center bg-no-repeat"
                      style={{ backgroundImage: `url(${achievementsIconUrl})` }}
                    />
                </div>
              </div>
          </motion.div>
        </>
      )
}

export function ModuleIllustration({ moduleId }: ModuleIllustrationProps) {
  const meta = moduleMeta[moduleId] ?? {
    label: "Signal Node",
    tone: "from-cyan-300/45 via-cyan-200/20 to-violet-300/35",
    scene: "neural" as SceneKind,
  }

  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)

  const rotateX = useSpring(useTransform(cursorY, (v) => v * -14), { stiffness: 180, damping: 20, mass: 0.7 })
  const rotateY = useSpring(useTransform(cursorX, (v) => v * 14), { stiffness: 180, damping: 20, mass: 0.7 })
  const glowX = useSpring(useTransform(cursorX, (v) => 50 + v * 40), { stiffness: 120, damping: 18 })
  const glowY = useSpring(useTransform(cursorY, (v) => 50 + v * 40), { stiffness: 120, damping: 18 })

  const transform = useMotionTemplate`rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
  const glow = useMotionTemplate`radial-gradient(circle at ${glowX}% ${glowY}%, rgba(34, 211, 238, 0.28), transparent 58%)`

  return (
    <motion.div
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect()
        const px = (event.clientX - rect.left) / rect.width
        const py = (event.clientY - rect.top) / rect.height
        cursorX.set(px - 0.5)
        cursorY.set(py - 0.5)
      }}
      onMouseLeave={() => {
        cursorX.set(0)
        cursorY.set(0)
      }}
      whileHover={{ scale: 1.04 }}
      transition={{ type: "spring", stiffness: 220, damping: 20 }}
      className="tech-border group relative h-full w-full overflow-hidden rounded-2xl bg-slate-950/55 shadow-[0_10px_28px_rgba(2,6,23,0.5)] backdrop-blur-sm"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${meta.tone}`} />
      <motion.div style={{ backgroundImage: glow }} className="absolute inset-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_15%,rgba(255,255,255,0.18),transparent_40%)]" />

      <motion.div style={{ transform }} className="absolute inset-0 [transform-style:preserve-3d] [perspective:1000px]">
        <SceneVisual scene={meta.scene} cursorX={cursorX} cursorY={cursorY} />
      </motion.div>

    </motion.div>
  )
}
