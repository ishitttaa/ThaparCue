import { useEffect } from 'react'

// Mouse ki position CSS variables mein daalta hai, taaki .spot cards pe glow follow kare
export default function useSpotlight() {
  useEffect(() => {
    const onMove = (e) => {
      const card = e.target.closest?.('.spot')
      if (!card) return
      const r = card.getBoundingClientRect()
      card.style.setProperty('--mx', `${e.clientX - r.left}px`)
      card.style.setProperty('--my', `${e.clientY - r.top}px`)
    }
    document.addEventListener('mousemove', onMove)
    return () => document.removeEventListener('mousemove', onMove)
  }, [])
}