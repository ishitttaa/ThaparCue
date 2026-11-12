import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Mouse kisi scroll hone wale box (modal, list, chat) ke upar ho toh true
function insideScrollableBox(node) {
  let el = node instanceof Element ? node : node?.parentElement
  while (el && el !== document.body && el !== document.documentElement) {
    const { overflowY } = getComputedStyle(el)
    if (/(auto|scroll)/.test(overflowY) && el.scrollHeight > el.clientHeight) {
      return true
    }
    el = el.parentElement
  }
  return false
}

export default function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      prevent: insideScrollableBox,
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