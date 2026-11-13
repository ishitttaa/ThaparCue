import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Andar ke scroll boxes (modal, lists, chat) me Lenis na chale
function shouldPrevent(node) {
  if (!(node instanceof Element)) return false
  if (
    node.closest(
      '.modal-box, .modal-overlay, [role="dialog"], .skills-detail-panel, .chat-messages, .group-chat-messages, .group-members-panel'
    )
  ) {
    return true
  }
  let el = node
  while (el && el !== document.body && el !== document.documentElement) {
    const oy = getComputedStyle(el).overflowY
    if ((oy === 'auto' || oy === 'scroll') && el.scrollHeight > el.clientHeight) return true
    el = el.parentElement
  }
  return false
}

export default function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      prevent: shouldPrevent,
    })

    lenis.on('scroll', ScrollTrigger.update)

    const tick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [])
}