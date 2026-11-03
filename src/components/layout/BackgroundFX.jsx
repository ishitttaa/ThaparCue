import { useRef } from 'react'
import useSmoothScroll from '../../hooks/useSmoothScroll'
import useInteractions from '../../hooks/useInteractions'

export default function BackgroundFX() {
  const glowRef = useRef(null)

  useSmoothScroll()
  useInteractions(glowRef)

  return (
    <>
      <div className="blob-bg">
        <span />
        <span />
        <span />
      </div>
      <div className="cursor-glow" ref={glowRef} />
    </>
  )
}