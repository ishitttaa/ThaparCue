import { useEffect } from 'react'

// Esc dabane par sabse upar wala modal band ho jaye
export default function useModalEsc() {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      const overlays = document.querySelectorAll('.modal-overlay')
      const top = overlays[overlays.length - 1]
      if (top) top.click()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
}