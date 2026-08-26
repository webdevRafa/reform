import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { scrollToPageTop } from '../lib/scroll'

export function ScrollToTop() {
  const location = useLocation()

  useLayoutEffect(() => {
    scrollToPageTop()
  }, [location.key])

  return null
}
