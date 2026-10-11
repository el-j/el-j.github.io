import type { Project } from '@/types/project'
import type { ProjectGroup, ProjectGroupDef } from '@/types/projectGroup'

/**
 * Groups a flat list of projects according to explicit group definitions.
 *
 * Rules:
 * - A group only forms when its `repos` list matches **2 or more** projects
 *   that exist in the `projects` array (by project `name`).
 * - Projects not covered by any group are returned as-is in `singletons`.
 * - If no `screenshot` is given in the group def, the first repo's screenshot
 *   is used as the group screenshot.
 * - `updatedAt` is the most recent `updatedAt` across all constituent repos.
 *
 * @param projects  Flat array of all resolved projects.
 * @param groupDefs Map of slug → group definition from project-overrides.json.
 * @returns         `{ groups, singletons }` where `singletons` are ungrouped projects.
 */
export function groupProjects(
  projects: Project[],
  groupDefs: Record<string, ProjectGroupDef>,
): { groups: ProjectGroup[]; singletons: Project[] } {
  // Build a lookup by project name for fast access
  const byName = new Map<string, Project>(projects.map((p) => [p.name, p]))

  // Also index by the original repo key (the key in project-overrides or repo name)
  // Some projects may have overrideName, so we need both lookups.
  // We'll build a secondary map keyed by id (as string) too.
  const byId = new Map<string | number, Project>(projects.map((p) => [p.id, p]))

  const groupedProjectNames = new Set<string>()
  const groups: ProjectGroup[] = []

  for (const [slug, def] of Object.entries(groupDefs)) {
    // Resolve repos by name match (supporting both original name and overrideName)
    const resolvedRepos = def.repos
      .map((repoName) => byName.get(repoName) ?? byId.get(repoName) ?? null)
      .filter((p): p is Project => p !== null)

    // A group needs at least 2 matching repos to form
    if (resolvedRepos.length < 2) continue

    // Mark all resolved repo names as grouped
    resolvedRepos.forEach((p) => groupedProjectNames.add(p.name))

    // Compute group metadata
    const screenshot =
      def.screenshot ??
      resolvedRepos.find((p) => p.screenshot)?.screenshot ??
      resolvedRepos.find((p) => p.customImage)?.customImage ??
      null

    const updatedAt =
      resolvedRepos
        .map((p) => p.updatedAt)
        .filter((d): d is string => d !== null)
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0] ?? null

    const title = def.title ?? slug

    groups.push({
      slug,
      title,
      description: def.description ?? null,
      repos: resolvedRepos,
      screenshot,
      featured: def.featured ?? false,
      category: def.category ?? resolvedRepos.find((p) => p.category)?.category ?? null,
      updatedAt,
    })
  }

  const singletons = projects.filter((p) => !groupedProjectNames.has(p.name))

  return { groups, singletons }
}
