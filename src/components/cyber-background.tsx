"use client"

import dynamic from "next/dynamic"
import { useEffect, useRef, useState } from "react"

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
})

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

type CyberBackgroundProps = {
  freezeMotion?: boolean
}

  export function CyberBackground({ freezeMotion = false }: CyberBackgroundProps) {
  const splineLayerRef = useRef<HTMLDivElement | null>(null)
  const glowLayerRef = useRef<HTMLDivElement | null>(null)
  const frozenProgressRef = useRef(0)
  const targetProgressRef = useRef(0)
  const renderedProgressRef = useRef(0)
  const scrollRangeRef = useRef(1)
  const [isMotionReduced, setIsMotionReduced] = useState(false)
  const [isCompactPerformanceMode, setIsCompactPerformanceMode] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")

    const updatePerformanceFlags = () => {
      const isSmallViewport = window.innerWidth <= 900
      const lowCpu = typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency <= 4
      const maybeLowMemory =
        "deviceMemory" in navigator && typeof (navigator as Navigator & { deviceMemory?: number }).deviceMemory === "number"
          ? ((navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8) <= 4
          : false

      setIsMotionReduced(reducedMotionQuery.matches)
      setIsCompactPerformanceMode(isSmallViewport && (lowCpu || maybeLowMemory))
    }

    updatePerformanceFlags()

    if (typeof reducedMotionQuery.addEventListener === "function") {
      reducedMotionQuery.addEventListener("change", updatePerformanceFlags)
    } else {
      reducedMotionQuery.addListener(updatePerformanceFlags)
    }

    window.addEventListener("resize", updatePerformanceFlags, { passive: true })

    return () => {
      if (typeof reducedMotionQuery.removeEventListener === "function") {
        reducedMotionQuery.removeEventListener("change", updatePerformanceFlags)
      } else {
        reducedMotionQuery.removeListener(updatePerformanceFlags)
      }

      window.removeEventListener("resize", updatePerformanceFlags)
    }
  }, [])

  const shouldRenderSpline = !isCompactPerformanceMode

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    let raf = 0
    let resizeObserver: ResizeObserver | null = null

    const recalculateScrollRange = () => {
      const body = document.body
      const doc = document.documentElement
      const totalHeight = Math.max(body.scrollHeight, doc.scrollHeight, body.offsetHeight, doc.offsetHeight)
      const viewportHeight = window.visualViewport?.height ?? window.innerHeight
      scrollRangeRef.current = Math.max(totalHeight - viewportHeight, 1)
    }

    const readNormalizedScrollProgress = () => {
      const scrollTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0
      return clamp(scrollTop / scrollRangeRef.current, 0, 1)
    }

    const renderFrame = () => {
      const targetProgress = freezeMotion || isMotionReduced ? frozenProgressRef.current : targetProgressRef.current
      const progressDelta = Math.abs(targetProgress - renderedProgressRef.current)
      const lerpFactor = isCompactPerformanceMode ? 0.08 : 0.12
      const nextProgress =
        freezeMotion || isMotionReduced
          ? targetProgress
          : renderedProgressRef.current + (targetProgress - renderedProgressRef.current) * lerpFactor

      renderedProgressRef.current = clamp(progressDelta < 0.001 ? targetProgress : nextProgress, 0, 1)

      const smoothProgress = 1 - Math.pow(1 - renderedProgressRef.current, 3)

      if (splineLayerRef.current) {
        const translateFactor = isCompactPerformanceMode ? -6 : -10
        const scaleFactor = isCompactPerformanceMode ? 0.045 : 0.08
        const translateY = smoothProgress * translateFactor
        const scale = 1 + smoothProgress * scaleFactor

        splineLayerRef.current.style.transform = `translate3d(0, ${translateY}dvh, 0) scale(${scale})`
      }

      if (glowLayerRef.current) {
        const baseOpacity = isCompactPerformanceMode ? 0.68 : 0.78
        const opacityRange = isCompactPerformanceMode ? 0.11 : 0.16
        const opacity = baseOpacity + smoothProgress * opacityRange
        glowLayerRef.current.style.opacity = `${opacity}`
      }

      const remainingDelta = Math.abs(targetProgressRef.current - renderedProgressRef.current)
      if (remainingDelta > 0.001 && !freezeMotion && !isMotionReduced) {
        raf = window.requestAnimationFrame(renderFrame)
      } else {
        raf = 0
      }
    }

    const syncTargetProgress = () => {
      recalculateScrollRange()
      targetProgressRef.current = readNormalizedScrollProgress()

      if (!freezeMotion && !isMotionReduced) {
        frozenProgressRef.current = targetProgressRef.current
      }

      if (raf === 0) {
        raf = window.requestAnimationFrame(renderFrame)
      }
    }

    recalculateScrollRange()
    targetProgressRef.current = readNormalizedScrollProgress()
    renderedProgressRef.current = targetProgressRef.current
    frozenProgressRef.current = targetProgressRef.current

    if (splineLayerRef.current) {
      splineLayerRef.current.style.transform = "translate3d(0, 0dvh, 0) scale(1)"
    }

    syncTargetProgress()

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(syncTargetProgress)
      resizeObserver.observe(document.body)
      resizeObserver.observe(document.documentElement)
    }

    window.addEventListener("scroll", syncTargetProgress, { passive: true })
    window.addEventListener("resize", syncTargetProgress, { passive: true })
    window.addEventListener("orientationchange", syncTargetProgress, { passive: true })
    window.visualViewport?.addEventListener("resize", syncTargetProgress, { passive: true })

    return () => {
      if (raf !== 0) {
        window.cancelAnimationFrame(raf)
      }

      resizeObserver?.disconnect()
      window.visualViewport?.removeEventListener("resize", syncTargetProgress)
      window.removeEventListener("scroll", syncTargetProgress)
      window.removeEventListener("resize", syncTargetProgress)
      window.removeEventListener("orientationchange", syncTargetProgress)
    }
  }, [freezeMotion, isCompactPerformanceMode, isMotionReduced])

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#02050f]">
        <div ref={splineLayerRef} className="cyber-spline-layer absolute inset-0 pointer-events-none will-change-transform">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(34,211,238,0.2)_0%,transparent_36%),radial-gradient(circle_at_82%_24%,rgba(139,92,246,0.2)_0%,transparent_40%),radial-gradient(circle_at_52%_66%,rgba(34,211,238,0.12)_0%,transparent_54%)]" />
            {shouldRenderSpline ? (
              <Spline
                scene="https://prod.spline.design/GrNuJPZYhOlAXoL3/scene.splinecode"
                className="h-full w-full opacity-95"
                style={{
                  maskImage: "radial-gradient(circle at center, black 24%, transparent 100%)",
                  WebkitMaskImage: "radial-gradient(circle at center, black 24%, transparent 100%)",
                }}
              />
            ) : null}
        </div>


      <div
        ref={glowLayerRef}
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_20%,rgba(34,211,238,0.2)_0%,transparent_42%),radial-gradient(circle_at_82%_18%,rgba(139,92,246,0.2)_0%,transparent_44%),radial-gradient(circle_at_50%_62%,rgba(56,189,248,0.08)_0%,transparent_52%)] transition-opacity duration-150"
      />
      <div className="pointer-events-none absolute -left-24 top-12 h-72 w-72 animate-pulse rounded-full bg-cyan-300/12 blur-3xl motion-reduce:animate-none" />
      <div className="pointer-events-none absolute -right-20 bottom-12 h-80 w-80 animate-pulse rounded-full bg-violet-400/12 blur-3xl [animation-delay:900ms] motion-reduce:animate-none" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(34,211,238,0.06)_0%,transparent_30%,transparent_70%,rgba(139,92,246,0.08)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,transparent_36%,rgba(2,5,15,0.15)_74%,rgba(2,5,15,0.28)_100%)]" />
      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_6%_8%,rgba(2,5,15,0.24)_0%,rgba(2,5,15,0.14)_24%,transparent_46%),radial-gradient(circle_at_94%_8%,rgba(2,5,15,0.24)_0%,rgba(2,5,15,0.14)_24%,transparent_46%),radial-gradient(circle_at_6%_94%,rgba(2,5,15,0.3)_0%,rgba(2,5,15,0.18)_26%,transparent_48%),radial-gradient(circle_at_94%_94%,rgba(2,5,15,0.6)_0%,rgba(2,5,15,0.5)_16%,rgba(2,5,15,0.34)_28%,rgba(2,5,15,0.16)_42%,transparent_60%),linear-gradient(180deg,rgba(2,5,15,0.14)_0%,transparent_16%,transparent_82%,rgba(2,5,15,0.28)_100%),linear-gradient(90deg,rgba(2,5,15,0.14)_0%,transparent_12%,transparent_86%,rgba(2,5,15,0.24)_100%)]" />
      <div className="pointer-events-none absolute bottom-0 right-0 z-20 h-24 w-44 bg-[radial-gradient(130%_130%_at_100%_100%,rgba(2,5,15,0.98)_42%,rgba(2,5,15,0.92)_62%,rgba(2,5,15,0.32)_100%)] sm:h-28 sm:w-52" />
    </div>
  )
}
