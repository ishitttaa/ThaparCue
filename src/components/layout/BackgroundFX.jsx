import { useRef } from 'react'
import useSmoothScroll from '../../hooks/useSmoothScroll'
import useInteractions from '../../hooks/useInteractions'
import useNavbarFX from '../../hooks/useNavbarFX'
import usePageTransition from '../../hooks/usePageTransition'

export default function BackgroundFX() {
  const glowRef = useRef(null)

  useSmoothScroll()
  useInteractions(glowRef)
  useNavbarFX()
  usePageTransition()

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