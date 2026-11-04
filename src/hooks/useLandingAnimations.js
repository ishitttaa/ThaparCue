import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function useLandingAnimations() {
  const root = useRef(null)

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      // ---------- HERO ----------
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from('.landing-hero-content > *', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
      }).from(
        '.landing-hero-visual',
        { x: 60, opacity: 0, duration: 1, ease: 'back.out(1.4)' },
        '-=0.6'
      )

      // ---------- SCROLL REVEAL (batch) ----------
      const reveal = (selector, y = 60) => {
        const items = gsap.utils.toArray(selector)
        if (!items.length) return
        gsap.set(items, { opacity: 0, y, transition: 'none' })
        ScrollTrigger.batch(items, {
          start: 'top 88%',
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.15,
              ease: 'back.out(1.3)',
              clearProps: 'all',
            }),
        })
      }

      reveal('.landing-section-header', 30)
      reveal('.landing-feature-card')
      reveal('.landing-step')

      // ---------- STATS COUNT-UP ----------
      gsap.utils.toArray('.landing-stat-val').forEach((el) => {
        const raw = el.dataset.raw || el.textContent
        el.dataset.raw = raw
        const target = parseInt(raw, 10)
        const suffix = raw.replace(/[0-9]/g, '')
        if (Number.isNaN(target)) return

        el.textContent = '0' + suffix
        const counter = { n: 0 }
        ScrollTrigger.create({
          trigger: el,
          start: 'top 92%',
          once: true,
          onEnter: () =>
            gsap.to(counter, {
              n: target,
              duration: 1.6,
              ease: 'power2.out',
              onUpdate: () => {
                el.textContent = Math.round(counter.n) + suffix
              },
            }),
        })
      })

      window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true })
    },
    { scope: root }
  )

  return root
}