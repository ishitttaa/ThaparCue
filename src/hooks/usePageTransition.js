import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const PAGE_SEL =
  '.landing-page, .page-content, .explore-page, .inbox-page, .login-page'

export default function usePageTransition() {
  const { pathname } = useLocation()
  const first = useRef(true)

  useEffect(() => {
    // Pehli baar load pe skip (landing ki apni animation hai)
    if (first.current) {
      first.current = false
      return
    }

    window.scrollTo({ top: 0, behavior: 'instant' })

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const id = requestAnimationFrame(() => {
      const pages = gsap.utils.toArray(PAGE_SEL)
      if (pages.length && !reduce) {
        gsap.fromTo(
          pages,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.3,
            ease: 'power3.out',
            clearProps: 'transform,opacity',
          }
        )
      }
      ScrollTrigger.refresh()
    })

    return () => cancelAnimationFrame(id)
  }, [pathname])
}