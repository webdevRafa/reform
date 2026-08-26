export type ProgramStatus = 'draft' | 'published'
export type ProgramKind = 'movement' | 'postpartum' | 'nutrition'

export interface Lesson {
  id: string
  title: string
  duration: string
  level: string
  description: string
  thumbnail: string
  videoUrl?: string
}

export interface Program {
  id: string
  slug: string
  name: string
  eyebrow: string
  shortDescription: string
  description: string
  audience: string
  kind: ProgramKind
  status: ProgramStatus
  featured: boolean
  price: number
  weeks: number
  sessionsPerWeek: number
  image: string
  accent: string
  features: string[]
  lessons: Lesson[]
  createdAt?: unknown
  updatedAt?: unknown
  seededAt?: unknown
}
