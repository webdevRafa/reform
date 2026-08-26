import { useCallback, useEffect, useRef, useState } from 'react'

const TOP_REVEAL_POINT = 20
const HIDE_AFTER = 96
const DOWN_INTENT = 18
const UP_INTENT = 10

export function useSmartHeader(locked = false) {
  const [visible, setVisible] = useState(true)
  const lastScrollY = useRef(0)
  const direction = useRef<'up' | 'down' | null>(null)
  const distance = useRef(0)

  const show = useCallback(() => {
    setVisible(true)
    distance.current = 0
  }, [])

  useEffect(() => {
    lastScrollY.current = Math.max(0, window.scrollY)
    let frame = 0

    const update = () => {
      frame = 0
      const nextScrollY = Math.max(0, window.scrollY)
      const delta = nextScrollY - lastScrollY.current
      lastScrollY.current = nextScrollY

      if (locked || nextScrollY <= TOP_REVEAL_POINT) {
        direction.current = null
        distance.current = 0
        setVisible(true)
        return
      }

      if (Math.abs(delta) < 2) return

      const nextDirection = delta > 0 ? 'down' : 'up'
      if (direction.current !== nextDirection) {
        direction.current = nextDirection
        distance.current = 0
      }

      distance.current += Math.abs(delta)

      if (nextDirection === 'down' && nextScrollY > HIDE_AFTER && distance.current >= DOWN_INTENT) {
        setVisible(false)
        distance.current = 0
      }

      if (nextDirection === 'up' && distance.current >= UP_INTENT) {
        setVisible(true)
        distance.current = 0
      }
    }

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [locked, show])

  return { visible: locked || visible, show }
}
