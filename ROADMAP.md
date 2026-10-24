# Cyber-Tactile CRT Workstation: Full Redesign & Implementation Roadmap

> **Target Concept**: Cyber-Tactile CRT Workstation (Fullstack Engineer × UX/UI Designer × Linux Nerd)  
> **Tech Stack**: Astro 5 (Static Output), Tailwind CSS v4 / Custom CSS Tokens, TypeScript, Web Audio API, Canvas / CSS Scanlines.  
> **Target Audience**: Technical recruiters, engineering leads, open-source peers, design engineers.  
> **Repository**: [el-j/el-j.github.io](https://github.com/el-j/el-j.github.io)

---

## 1. Vision & Design Philosophy

The redesign shifts away from generic AI-generated templates (centered purple blur blobs, cookie-cutter bento boxes, uncurated repo dumps) toward a **bespoke, tactile, and nerdy digital workstation**.

Inspired directly by the concept visual:
- **Atmosphere**: A retro-futuristic CRT workstation set on a physical engineer's bench (bezel curvature, phosphor glow, subtle scanlines, sticky note annotations, tactile controls).
- **Dual-Minded Identity**: Uniting the rigor of fullstack systems engineering (`Linux`, `AST`, `CLI`, `Zero-runtime perf`) with high-craft UX/UI design (`Design tokens`, `Figma specs`, `Micro-interactions`, `Sound design`).
- **Curated Value**: Replacing raw GitHub repo dumping with high-impact case studies, developer tooling, dotfiles/configs, and interactive web toys.

---

## 2. Information Architecture

```
[ MONITOR FRAME & BEZEL ]
├── [HEADER BAR]
│   ├── Title: FABIAN ALTHAUS // FULLSTACK_UX_DEV // LINUX_NERD
│   ├── Navigation Tabs: [01_ABOUT] [02_PROJECTS] [03_CLI_TOOLS] [04_DOTFILES]
│   └── System Status: [SERVER STATUS: OK] [OCT. 11 2026] [CRT: AMBER / GREEN]
│
├── [UPPER WORKSPACE]
│   ├── Left: Latest Deployment stream & git log graph
│   └── Right: + SYNTH_T1 + (Playable Pocket Synthesizer Island with Web Audio API)
│
├── [LOWER WORKSPACE]
│   ├── Left: CLI / DEBUG_ENV [LIVE] (Interactive Terminal REPL with custom commands)
│   └── Right: token specs -> AST (Interactive Canvas / Duality of UX tokens & compiler AST)
│
└── [WORKBENCH BEZEL & PERIPHERALS]
    ├── Interactive Sticky Notes (easter eggs, engineering aphorisms, quick links)
    ├── Tactile Audio / Theme / CRT intensity switches
    └── Mobile Fallback: Seamless responsive fluid layout retaining the CRT aesthetics
```

---

## 3. Milestones & GitHub Issues Plan

### Milestone 1: Foundation & Astro 5 Architecture (Target: Sprint 1) — [Milestone #1](https://github.com/el-j/el-j.github.io/milestone/1)
- **Issue [#10](https://github.com/el-j/el-j.github.io/issues/10): [ARCH] Scaffold Astro 5 Static Architecture & Deprecate Legacy Vue Setup**
  - Initialize clean Astro 5 setup with static generation (`output: 'static'`).
  - Configure TypeScript strict mode, path aliases (`@/*`), and Vite optimizations.
  - Setup ESLint, Prettier, and Vitest for Astro components.
  - Deprecate Vue 3 + PrimeVue legacy setup safely.

- **Issue [#11](https://github.com/el-j/el-j.github.io/issues/11): [DESIGN SYSTEM] CRT Monitor & Tactile Hardware UI Shell**
  - Implement CRT screen container with optional scanline overlay and barrel curvature distortion (pure CSS, GPU-accelerated).
  - Create phosphor color palette system (Amber `P3`, Phosphor Green `P1`, Ice Blue `P4`, Crisp High-Contrast).
  - Setup monospace typographic hierarchy (`JetBrains Mono`, `Commit Mono`, `Geist Mono`).
  - Add bezel sticky notes and tactile bezel switches.

---

### Milestone 2: Content Collections & Page Routing (Target: Sprint 2) — [Milestone #2](https://github.com/el-j/el-j.github.io/milestone/2)
- **Issue [#12](https://github.com/el-j/el-j.github.io/issues/12): [CONTENT] Implement Astro Content Collections & Case Study Schemas**
  - Define Zod schemas for:
    - `projects`: Title, slug, role, impact, UX problem, AST/architecture diagram, stack, github, demoUrl.
    - `cli_tools`: NPM/Crates/CLI tools, install cmd, purpose, terminal demo snippet.
    - `dotfiles`: Window manager, Neovim/Zsh configs, keybindings, setup scripts.
    - `bio`: Philosophy, experience timeline, hardware/software stack.
  - Migrate and curate existing project data into rich Markdown/MDX case studies.

- **Issue [#13](https://github.com/el-j/el-j.github.io/issues/13): [ROUTING] Workstation Header Navigation & Astro View Transitions**
  - Implement the 4 primary views: `[01_ABOUT]`, `[02_PROJECTS]`, `[03_CLI_TOOLS]`, `[04_DOTFILES]`.
  - Wire up Astro `ClientRouter` for instantaneous client-side navigation with subtle phosphor flicker transitions.
  - Add active state indicators and tab keyboard navigation (`1`, `2`, `3`, `4`).

---

### Milestone 3: Interactive Nerdy Islands (Target: Sprint 3) — [Milestone #3](https://github.com/el-j/el-j.github.io/milestone/3)
- **Issue [#14](https://github.com/el-j/el-j.github.io/issues/14): [CLI] Interactive Embedded Terminal Island (`CLI / DEBUG_ENV [LIVE]`)**
  - Build lightweight terminal island (Vanilla TS / Web Component).
  - Support commands: `help`, `cat about`, `ls projects`, `uname -a`, `status`, `theme <amber|green|ice>`, `clear`, `contact`.
  - Add command history (Up/Down arrows), autocompletion (Tab), and live git log stream simulation.

- **Issue [#15](https://github.com/el-j/el-j.github.io/issues/15): [AUDIO] Interactive Pocket Synthesizer Island (`+ SYNTH_T1 +`)**
  - Teenage Engineering / OP-1 inspired vector SVG interface.
  - Synthesizer audio engine using Web Audio API (polyphonic oscillators, filter knob, decay, pitch controls).
  - Visualizer: animated oscilloscope display reacting to audio frequencies.
  - Default: Muted with clear tactile un-mute toggle.

- **Issue [#16](https://github.com/el-j/el-j.github.io/issues/16): [UX/DEV] Interactive `token specs -> AST` Visualizer & Dual-Lens**
  - Canvas or SVG interactive diagram illustrating the duality of design tokens and Abstract Syntax Trees.
  - Interactive nodes: click or hover to inspect token values (`--space-4: 16px`, `--font-mono`) and corresponding AST nodes.
  - Tech badge pill indicators (`:: react`, `:: vue`, `:: figma`, `:: linux`).

---

### Milestone 4: Polish, Accessibility & CI/CD Deployment (Target: Sprint 4) — [Milestone #4](https://github.com/el-j/el-j.github.io/milestone/4)
- **Issue [#17](https://github.com/el-j/el-j.github.io/issues/17): [UX] Tactile Sound FX, Scanline Controls & Physical Easter Eggs**
  - Add mechanical click sound effects on button toggles and keypresses (Web Audio clicks).
  - Bezel control panel: toggle sound, toggle scanline intensity, toggle CRT curve.
  - Easter eggs in sticky notes (draggable sticky notes, terminal secret commands).

- **Issue [#18](https://github.com/el-j/el-j.github.io/issues/18): [A11Y & RESPONSIVE] Responsive Cyberdeck Adaptation & Motion Accessibility**
  - Graceful fallback for mobile: fluid responsive layout that transforms the monitor into a pocket cyberdeck.
  - Strict compliance with `prefers-reduced-motion` (disabling scanlines and flicker on demand).
  - ARIA landmarks, screen reader navigation, and full keyboard accessibility.

- **Issue [#19](https://github.com/el-j/el-j.github.io/issues/19): [CI/CD] Update GitHub Actions Deployment Pipeline for Astro**
  - Update `.github/workflows/deploy.yml` for Astro static build.
  - Ensure zero build errors, automated typechecking, and deployment to GitHub Pages.
  - Lighthouse performance audit: enforce 100/100 performance, accessibility, best practices, and SEO.
