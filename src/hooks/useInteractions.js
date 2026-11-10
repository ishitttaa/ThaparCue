import { useEffect } from 'react'
import gsap from 'gsap'

const TILT_SEL =
  '.landing-feature-card, .landing-step, .senior-card, .course-card, .skill-card, .quick-action-card'
const MAGNET_SEL = '.btn-lg, .navbar .btn'

export default function useInteractions(glowRef) {
  useEffect(() => {
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!canHover || reduce) return

    // ---------- Cursor glow ----------
    const glow = glowRef.current
    let moveX, moveY
    if (glow) {
      gsap.set(glow, { xPercent: -50, yPercent: -50, opacity: 0 })
      moveX = gsap.quickTo(glow, 'x', { duration: 0.6, ease: 'power3.out' })
      moveY = gsap.quickTo(glow, 'y', { duration: 0.6, ease: 'power3.out' })
    }

    let tiltEl = null
    let magEl = null

    const resetTilt = (el) => {
      gsap.to(el, {
        rotationX: 0,
        rotationY: 0,
        scale: 1,
        duration: 0.6,
        ease: 'elastic.out(1, 0.5)',
        onComplete: () => gsap.set(el, { clearProps: 'transform' }),
      })
    }

    const resetMagnet = (el) => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.4)',
        onComplete: () => gsap.set(el, { clearProps: 'transform' }),
      })
    }

    const onMove = (e) => {
      if (glow) {
        gsap.to(glow, { opacity: 1, duration: 0.4, overwrite: 'auto' })
        moveX(e.clientX)
        moveY(e.clientY)
      }

      const target = e.target instanceof Element ? e.target : null

      // ---------- 3D tilt ----------
      const t = target ? target.closest(TILT_SEL) : null
      if (tiltEl && tiltEl !== t) resetTilt(tiltEl)
      tiltEl = t
      if (t) {
        const r = t.getBoundingClientRect()
        const px = (e.clientX - r.left) / r.width - 0.5
        const py = (e.clientY - r.top) / r.height - 0.5
        gsap.to(t, {
          rotationY: px * 6,
          rotationX: -py * 6,
          scale: 1.01,
          transformPerspective: 800,
          transformOrigin: 'center',
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto',
        })
      }

      // ---------- Magnetic buttons ----------
      const m = target ? target.closest(MAGNET_SEL) : null
      if (magEl && magEl !== m) resetMagnet(magEl)
      magEl = m
      if (m) {
        const r = m.getBoundingClientRect()
        const dx = e.clientX - (r.left + r.width / 2)
        const dy = e.clientY - (r.top + r.height / 2)
        gsap.to(m, {
          x: dx * 0.15,
          y: dy * 0.15,
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto',
        })
      }
    }

    const onLeaveWindow = () => {
      if (glow) gsap.to(glow, { opacity: 0, duration: 0.4 })
      if (tiltEl) resetTilt(tiltEl)
      if (magEl) resetMagnet(magEl)
      tiltEl = null
      magEl = null
    }

    document.addEventListener('pointermove', onMove)
    document.documentElement.addEventListener('pointerleave', onLeaveWindow)

    return () => {
      document.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeaveWindow)
    }
  }, [glowRef])
}