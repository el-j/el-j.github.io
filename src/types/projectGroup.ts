import type { Project } from './project'

export interface ProjectGroupDef {
  title?: string
  description?: string | null
  repos: string[]
  homepage?: string | null
  screenshot?: string | null
  featured?: boolean
  category?: string | null
}

export interface ProjectGroup {
  /** URL-safe identifier, e.g. "flowy" */
  slug: string
  title: string
  description: string | null
  repos: Project[]
  screenshot: string | null
  featured: boolean
  category: string | null
  /** ISO 8601 date of the most recently pushed constituent repo */
  updatedAt: string | null
}
