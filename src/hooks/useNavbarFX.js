import { useEffect } from 'react'

export default function useNavbarFX() {
  useEffect(() => {
    const onScroll = () => {
      const nav = document.querySelector('.navbar')
      if (nav) nav.classList.toggle('navbar-scrolled', window.scrollY > 24)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
}