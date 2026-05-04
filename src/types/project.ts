export interface Project {
  id: string | number
  name: string
  url: string
  homepage: string | null
  description: string | null
  topics: string[]
  language: string | null
  updatedAt: string | null
  i18nKey: string | null
  featured: boolean
  isExternal: boolean
  customImage: string | null
  screenshot: string | null
  stars: number | null
  forks: number | null
  openIssues: number | null
  license: string | null
  defaultBranch: string | null
  archived: boolean
}
