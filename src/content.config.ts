import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['Fullstack', 'UX/UI', 'Developer Tools', 'Open Source', 'Architecture']),
    featured: z.boolean().default(false),
    role: z.string(),
    year: z.string(),
    stack: z.array(z.string()),
    uxHighlight: z.string().optional(),
    architectureHighlight: z.string().optional(),
    astTokensHighlight: z.string().optional(),
    demoUrl: z.string().url().optional(),
    githubUrl: z.string().url().optional(),
    metrics: z.record(z.string()).optional(),
  })
});

const cli_tools = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cli_tools' }),
  schema: z.object({
    name: z.string(),
    command: z.string(),
    summary: z.string(),
    installCmd: z.string(),
    language: z.string(),
    tags: z.array(z.string()),
    githubUrl: z.string().url().optional(),
    npmUrl: z.string().url().optional(),
  })
});

const dotfiles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/dotfiles' }),
  schema: z.object({
    title: z.string(),
    category: z.enum(['Shell', 'Neovim', 'Window Manager', 'Git', 'Hardware']),
    description: z.string(),
    path: z.string(),
    keyHighlights: z.array(z.string()),
    snippet: z.string().optional(),
  })
});

export const collections = {
  projects,
  cli_tools,
  dotfiles,
};
