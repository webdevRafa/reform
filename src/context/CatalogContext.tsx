import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { starterPrograms } from '../data/programs'
import { CatalogContext } from './catalog'
import type { Program } from '../types'

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [programs, setPrograms] = useState<Program[]>(starterPrograms)
  const [live, setLive] = useState(false)

  useEffect(() => {
    let unsubscribe: (() => void) | undefined
    let active = true
    void import('../lib/catalog').then(({ subscribeToPrograms }) => {
      if (!active) return
      unsubscribe = subscribeToPrograms((items) => {
        setPrograms(items)
        setLive(items.some((item) => item.updatedAt || item.seededAt))
      }, () => {
        setPrograms(starterPrograms)
        setLive(false)
      })
    })
    return () => { active = false; unsubscribe?.() }
  }, [])

  const value = useMemo(() => ({ programs, live }), [programs, live])
  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
}
