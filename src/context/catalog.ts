import { createContext, useContext } from 'react'
import { starterPrograms } from '../data/programs'
import type { Program } from '../types'

export const CatalogContext = createContext<{ programs: Program[]; live: boolean }>({ programs: starterPrograms, live: false })

export function useCatalog() {
  return useContext(CatalogContext)
}
