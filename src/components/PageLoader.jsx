import { useEffect, useState } from 'react'

export default function PageLoader() {
  const [show, setShow] = useState(() => {
    try {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
      return !sessionStorage.getItem('tc-intro')
    } catch {
      return true
    }
  })
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    if (!show) return undefined
    try {
      sessionStorage.setItem('tc-intro', '1')
    } catch {
      /* ignore */
    }
    const t1 = setTimeout(() => setLeaving(true), 1700)
    const t2 = setTimeout(() => setShow(false), 2300)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [show])

  if (!show) return null

  return (
    <div className={`page-loader ${leaving ? 'page-loader-out' : ''}`}>
      <div className="pl-mark">
        <svg className="pl-ring" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" />
        </svg>
        <img className="pl-logo" src="/logo.png" alt="ThaparCue" />
      </div>
      <div className="pl-name font-display">
        Thapar <span>Cue</span>
      </div>
      <div className="pl-bar"><span /></div>
    </div>
  )
}