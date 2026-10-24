#!/usr/bin/env node
/**
 * scripts/create-github-issues.mjs
 * 
 * Creates GitHub Milestones and Issues for the Cyber-Tactile CRT Workstation redesign.
 */

import { execSync } from 'node:child_process';

const REPO = 'el-j/el-j.github.io';
const TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;

async function fetchGithub(endpoint, options = {}) {
  const url = `https://api.github.com/repos/${REPO}${endpoint}`;
  while (true) {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `token ${TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'el-j-setup-script',
        ...(options.headers || {})
      }
    });

    if (res.status === 403) {
      const errorBody = await res.text();
      if (errorBody.includes('API rate limit exceeded')) {
        const resetHeader = res.headers.get('x-ratelimit-reset');
        const resetMs = resetHeader ? parseInt(resetHeader, 10) * 1000 : 1791719257000;
        const waitMs = Math.max(2000, resetMs - Date.now() + 3000);
        const waitSec = Math.ceil(waitMs / 1000);
        console.log(`⏳ GitHub user rate limit hit. Waiting ${waitSec}s until reset at ${new Date(resetMs).toLocaleTimeString()}...`);
        await new Promise(r => setTimeout(r, waitMs));
        continue;
      }
      throw new Error(`GitHub 403 Forbidden: ${errorBody}`);
    }

    if (!res.ok) {
      const errorBody = await res.text();
      throw new Error(`GitHub API Error ${res.status} on ${endpoint}: ${errorBody}`);
    }
    return res.json();
  }
}

const MILESTONES_DATA = [
  {
    title: 'Milestone 1: Foundation & Astro 5 Architecture',
    description: 'Scaffolding Astro 5 static architecture, TypeScript, design tokens, and the tactile CRT monitor frame.',
    due_on: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    title: 'Milestone 2: Content Collections & Workstation Views',
    description: 'Type-safe Astro Content Collections for Projects, CLI Tools, Dotfiles, and view transitions routing.',
    due_on: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    title: 'Milestone 3: Interactive Nerdy Islands',
    description: 'Embedded interactive terminal REPL, Web Audio Teenage Engineering synth island, and AST/token visualizer.',
    due_on: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    title: 'Milestone 4: Polish, Sound FX, A11y & CI/CD Deployment',
    description: 'Tactile sound design, CRT scanline intensity controls, mobile responsiveness, and GitHub Pages deployment.',
    due_on: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const ISSUES_DATA = [
  // Milestone 1
  {
    milestoneIndex: 0,
    title: '[ARCH] Scaffold Astro 5 Static Architecture & Deprecate Legacy Vue Setup',
    labels: ['architecture', 'astro', 'enhancement'],
    body: `### Summary
Initialize a clean, high-performance Astro 5 project targeting GitHub Pages static publishing (\`output: 'static'\`). Deprecate the legacy Vue 3 + PrimeVue setup.

### Scope & Tasks
- [ ] Initialize Astro 5 in the workspace root with static site generation.
- [ ] Configure strict TypeScript (\`tsconfig.json\`), path aliases (\`@/*\`), and clean Vite config.
- [ ] Clean up unused Vue 3, PrimeVue, and Pinia dependencies.
- [ ] Establish testing baseline (Vitest + Playwright).
- [ ] Ensure build runs with zero warnings and outputs to \`dist/\`.

### Acceptance Criteria
- \`npm run build\` successfully produces static HTML/CSS/JS in \`dist/\`.
- Zero runtime JavaScript required for initial page render (pure static baseline).`
  },
  {
    milestoneIndex: 0,
    title: '[DESIGN SYSTEM] CRT Monitor & Tactile Hardware UI Shell',
    labels: ['design-system', 'ui/ux', 'nerdy'],
    body: `### Summary
Implement the tactile vintage CRT monitor frame, bezel curvature, phosphor glow, and developer workbench surroundings inspired by the design moodboard.

### Scope & Tasks
- [ ] Create the outer workbench layout with physical desk elements (ribbon cables, screws, sticky notes).
- [ ] Build the CRT monitor casing with curved bezel, anti-glare reflection, and optional scanlines.
- [ ] Configure typography system with precision monospaced fonts (\`JetBrains Mono\`, \`Commit Mono\`, \`Geist Mono\`).
- [ ] Implement Phosphor theme palette:
  - Amber CRT (\`P3\` phosphor: warm orange/amber #FF9900).
  - Matrix Green (\`P1\` phosphor: electric lime #00FF66).
  - Cyber Ice Blue (\`P4\` phosphor: cool cyan #00D8FF).
  - High-Contrast Paper (daytime reading mode).
- [ ] Add the interactive bezel sticky notes with code snippets and easter eggs.

### Acceptance Criteria
- CRT monitor feels physical, tactile, and distinct—avoiding generic AI template aesthetics.
- Supports light/dark/amber/green themes cleanly via CSS custom properties.`
  },

  // Milestone 2
  {
    milestoneIndex: 1,
    title: '[CONTENT] Implement Astro Content Collections & Case Study Schemas',
    labels: ['content', 'astro', 'typescript'],
    body: `### Summary
Replace the indiscriminate GitHub repository dumping with curated, high-impact case studies and structured collections for projects, CLI tools, and dotfiles.

### Scope & Tasks
- [ ] Define type-safe Astro Content Collections with Zod schemas:
  - \`src/content/projects/\`: Flagship projects with deep dives (The Problem, UX/UI Exploration, AST/Architecture, Stack, Live Demo).
  - \`src/content/cli_tools/\`: Open source CLI utilities, terminal snippets, installation commands.
  - \`src/content/dotfiles/\`: Configurations, workflow setups, Neovim/Zsh/Linux configs.
  - \`src/content/bio/\`: Architectural principles, timeline, tooling.
- [ ] Migrate and curate existing project data (personal portfolio, packages) into rich Markdown/MDX case studies.
- [ ] Build GitHub live commit/stars fetcher at build-time to show subtle live stats without client-side API bloat.

### Acceptance Criteria
- Every project has an authentic engineering story and UX design rationale.
- Type errors in content frontmatter are caught at build time.`
  },
  {
    milestoneIndex: 1,
    title: '[ROUTING] Workstation Header Navigation & Astro View Transitions',
    labels: ['frontend', 'navigation', 'astro'],
    body: `### Summary
Implement the 4 core navigation tabs (\`[01_ABOUT]\`, \`[02_PROJECTS]\`, \`[03_CLI_TOOLS]\`, \`[04_DOTFILES]\`) with smooth phosphor flicker view transitions.

### Scope & Tasks
- [ ] Build the top header bar:
  - Title: \`FABIAN ALTHAUS (el-j) // FULLSTACK_UX_DEV // LINUX_NERD\`
  - Live deployment log status: \`SERVER STATUS: OK\`
  - Current timestamp: \`OCT. 11 2026\`
- [ ] Implement tab routing using Astro \`ClientRouter\` with seamless view transitions.
- [ ] Add keyboard navigation: pressing keys \`1\`, \`2\`, \`3\`, \`4\` switches views immediately.
- [ ] Add active indicator animations and tactile tab hover states.

### Acceptance Criteria
- Navigating between views feels instantaneous and transitions with subtle CRT raster flicker.`
  },

  // Milestone 3
  {
    milestoneIndex: 2,
    title: '[CLI] Interactive Embedded Terminal Island (`CLI / DEBUG_ENV [LIVE]`)',
    labels: ['interactive', 'cli', 'nerdy', 'island'],
    body: `### Summary
Create the live interactive terminal island situated in the lower-left CRT panel with full REPL capability, command history, and custom commands.

### Scope & Tasks
- [ ] Implement lightweight terminal client (Vanilla TS / Web Component island).
- [ ] Support custom shell commands:
  - \`help\`: displays available commands.
  - \`uname -a\`: displays custom Linux kernel / system specs.
  - \`cat about.md\`: prints bio and engineering philosophy.
  - \`ls projects\`: lists flagship projects with interactive clickable links.
  - \`theme <amber|green|ice|paper>\`: dynamically switches the CRT phosphor theme.
  - \`git log --graph\`: renders ascii git branch visualization.
  - \`clear\`: clears the terminal window.
  - Secret Easter eggs: \`sudo\`, \`matrix\`, \`cowsay\`.
- [ ] Support command history navigation (Up/Down arrow keys) and Tab autocomplete.
- [ ] Stream simulated real-time deployment logs when idle.

### Acceptance Criteria
- Terminal responds smoothly with zero latency, looks authentically vintage, and works seamlessly on keyboard.`
  },
  {
    milestoneIndex: 2,
    title: '[AUDIO] Interactive Pocket Synthesizer Island (`+ SYNTH_T1 +`)',
    labels: ['audio', 'web-audio', 'interactive', 'island'],
    body: `### Summary
Build an interactive vector pocket synthesizer inspired by Teenage Engineering hardware and the moodboard visual, utilizing the browser Web Audio API.

### Scope & Tasks
- [ ] Design SVG vector interface representing the groovebox/synth module with pads, knobs, and dials.
- [ ] Implement Web Audio API audio synthesis engine:
  - Polyphonic tone generator with waveform selection (sine, square, saw, triangle).
  - Low-pass filter knob with resonance.
  - Triggerable drum/synth pads playable via mouse/touch and keyboard keys (\`A\`, \`S\`, \`D\`, \`F\`).
- [ ] Build real-time Canvas / SVG oscilloscope screen that visualizes sound wave output.
- [ ] Keep audio muted by default with an unmistakable physical hardware power switch.

### Acceptance Criteria
- Visitors can play real notes with delightful, retro sound design.
- Audio context is initialized cleanly upon user interaction with no console warnings.`
  },
  {
    milestoneIndex: 2,
    title: '[UX/DEV] Interactive `token specs -> AST` Visualizer & Dual-Lens',
    labels: ['ux/ui', 'compiler', 'ast', 'nerdy'],
    body: `### Summary
Create the lower-right interactive diagram showcasing the bridge between UX Design Tokens (Figma/CSS) and Fullstack Code (AST/Compilers).

### Scope & Tasks
- [ ] Build interactive vector diagram connecting Design Tokens -> Explosion/Impact -> AST Node Graph.
- [ ] Allow clicking nodes in the AST to see real TypeScript/Babel AST node properties.
- [ ] Allow hovering tokens to preview live CSS custom property computed values.
- [ ] Display stack indicators with live status: \`:: react\`, \`:: vue\`, \`:: figma\`, \`:: linux\`.

### Acceptance Criteria
- Visually and interactively proves the user's duality as both a UX/UI Designer and Fullstack Engineer.`
  },

  // Milestone 4
  {
    milestoneIndex: 3,
    title: '[UX] Tactile Sound FX, Scanline Controls & Physical Easter Eggs',
    labels: ['sound-design', 'micro-interactions', 'delight'],
    body: `### Summary
Implement tactile mechanical sound effects, CRT scanline intensity adjustments, and draggable workbench sticky notes.

### Scope & Tasks
- [ ] Synthesize subtle mechanical relay/switch clicks using Web Audio API on button interactions (with global mute toggle).
- [ ] Add hardware sliders/toggles on the monitor bezel:
  - CRT curvature on/off.
  - Scanline opacity (0% to 100%).
  - Sound effects volume.
- [ ] Make sticky notes draggable and collapsible around the monitor bezel.
- [ ] Add hidden Easter egg interactions across the workbench.

### Acceptance Criteria
- Tactile sensations feel responsive, satisfying, and never annoying.`
  },
  {
    milestoneIndex: 3,
    title: '[A11Y & MOBILE] Responsive Cyberdeck Adaptation & Motion Accessibility',
    labels: ['accessibility', 'mobile', 'responsive'],
    body: `### Summary
Ensure the portfolio is fully accessible, responsive across devices, and honors user motion preferences.

### Scope & Tasks
- [ ] Mobile responsive layout: gracefully transforms the dual-panel CRT into a compact, scrollable cyberdeck terminal on narrow viewports.
- [ ] Full screen-reader support with semantic ARIA landmarks and accessible alternatives for all visual widgets.
- [ ] Respect \`prefers-reduced-motion\`: automatically disable scanlines, screen jitter, and phosphor flicker when requested.
- [ ] Complete keyboard-only navigable interface with visible focus rings.

### Acceptance Criteria
- Perfect Lighthouse accessibility score (100/100).
- Flawless mobile viewport UX.`
  },
  {
    milestoneIndex: 3,
    title: '[CI/CD] Update GitHub Actions Deployment Pipeline for Astro',
    labels: ['ci/cd', 'github-actions', 'devops'],
    body: `### Summary
Update \`.github/workflows/deploy.yml\` to build and deploy the Astro static site automatically to GitHub Pages.

### Scope & Tasks
- [ ] Update \`.github/workflows/deploy.yml\` to run Astro build (\`npm run build\`).
- [ ] Configure GitHub Pages artifact upload from \`dist/\`.
- [ ] Setup automated PR preview workflow and typechecking.
- [ ] Verify caching for lightning-fast build times (<60 seconds).

### Acceptance Criteria
- Commits pushed to \`main\` automatically deploy to GitHub Pages without manual intervention.`
  }
];

async function main() {
  console.log('🚀 Checking GitHub API connection for', REPO);

  // Check rate limit first
  const rateLimitRes = await fetch('https://api.github.com/rate_limit', {
    headers: {
      'Authorization': `token ${TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'el-j-setup-script'
    }
  });
  const rateData = await rateLimitRes.json();
  const remaining = rateData.resources?.core?.remaining ?? 0;
  const resetTime = new Date((rateData.resources?.core?.reset ?? 0) * 1000);
  console.log(`Core Rate Limit: ${remaining}/${rateData.resources?.core?.limit ?? 5000} (Resets at ${resetTime.toLocaleTimeString()})`);

  if (remaining < 15) {
    const waitSeconds = Math.max(1, Math.ceil((resetTime.getTime() - Date.now()) / 1000));
    console.log(`⏳ Rate limit remaining is low. Waiting ${waitSeconds}s until reset at ${resetTime.toLocaleTimeString()}...`);
    await new Promise(r => setTimeout(r, waitSeconds * 1000 + 2000));
  }

  // 1. Create or fetch Milestones
  console.log('\n📌 Fetching existing milestones...');
  const existingMilestones = await fetchGithub('/milestones?state=all');
  const milestoneMap = new Map();

  for (const m of existingMilestones) {
    milestoneMap.set(m.title, m.number);
  }

  for (const [index, mData] of MILESTONES_DATA.entries()) {
    if (milestoneMap.has(mData.title)) {
      console.log(`✓ Milestone already exists: ${mData.title} (#${milestoneMap.get(mData.title)})`);
    } else {
      console.log(`Creating milestone: ${mData.title}...`);
      const created = await fetchGithub('/milestones', {
        method: 'POST',
        body: JSON.stringify(mData)
      });
      milestoneMap.set(mData.title, created.number);
      console.log(`✨ Created milestone: ${mData.title} (#${created.number})`);
    }
  }

  // 2. Create Issues
  console.log('\n📝 Fetching existing issues...');
  const existingIssues = await fetchGithub('/issues?state=all&per_page=100');
  const existingTitles = new Set(existingIssues.map(i => i.title));

  const createdIssues = [];

  for (const issueData of ISSUES_DATA) {
    if (existingTitles.has(issueData.title)) {
      console.log(`✓ Issue already exists: ${issueData.title}`);
      continue;
    }

    const milestoneObj = MILESTONES_DATA[issueData.milestoneIndex];
    const milestoneNumber = milestoneMap.get(milestoneObj.title);

    console.log(`Creating issue: ${issueData.title}...`);
    try {
      const created = await fetchGithub('/issues', {
        method: 'POST',
        body: JSON.stringify({
          title: issueData.title,
          body: issueData.body,
          milestone: milestoneNumber,
          labels: issueData.labels
        })
      });
      console.log(`✨ Created Issue #${created.number}: ${created.html_url}`);
      createdIssues.push(created);
      // Small pause to be gentle with secondary rate limits
      await new Promise(r => setTimeout(r, 600));
    } catch (err) {
      console.error(`Failed to create issue "${issueData.title}":`, err.message);
    }
  }

  console.log(`\n🎉 Done! Created ${createdIssues.length} issues successfully.`);
}

main().catch(err => {
  console.error('Script failed:', err);
  process.exit(1);
});
