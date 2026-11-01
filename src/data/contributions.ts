export interface ContributedProject {
  repo: string;
  name: string;
  org: string;
  url: string;
  category: 'Graphics & Vector' | 'Compilers & Tooling' | 'Hardware EDA & Embedded' | 'Robotics & Autonomous' | 'Multi-Agent & AI' | 'Web Platform';
  summary: string;
  totalPrs: number;
  mergedPrs: number;
  openPrs: number;
  role: string;
  keyContributions: {
    title: string;
    url: string;
    state: 'MERGED' | 'OPEN';
    highlight: string;
  }[];
}

export const CONTRIBUTED_PROJECTS: ContributedProject[] = [
  {
    repo: 'storytold/vectorcraft',
    name: 'VectorCraft',
    org: 'storytold',
    url: 'https://github.com/storytold/vectorcraft',
    category: 'Graphics & Vector',
    summary: 'High-performance native vector graphics and illustration engine built in Rust with egui and custom GPU rendering pipelines.',
    totalPrs: 24,
    mergedPrs: 13,
    openPrs: 7,
    role: 'Core Engine & Canvas Contributor',
    keyContributions: [
      {
        title: 'perf(canvas): zero-copy texture upload and progressive worker frame acceptance',
        url: 'https://github.com/storytold/vectorcraft/pull/4961',
        state: 'OPEN',
        highlight: 'Eliminated ~20MB buffer reallocations per 4K frame using bytemuck in-place casting; progressive non-blocking frame acceptance.',
      },
      {
        title: 'perf(effects): reorder pure-translation Transform copies after round-join terminal Offset Path',
        url: 'https://github.com/storytold/vectorcraft/pull/4611',
        state: 'MERGED',
        highlight: 'Optimized pathops pipeline avoiding complex matrix multiplication on terminal stroke offset paths.',
      },
      {
        title: 'Fix #4436: SVG import: cap converted objects and nested images',
        url: 'https://github.com/storytold/vectorcraft/pull/4436',
        state: 'MERGED',
        highlight: 'Hardened SVG parser against unbounded recursion and memory consumption on large vector imports.',
      },
      {
        title: 'Fix #4433: DXF export: verify closed circular subpaths complete a full turn without reversing',
        url: 'https://github.com/storytold/vectorcraft/pull/4433',
        state: 'MERGED',
        highlight: 'Fixed CAD DXF geometry exporter ensuring CNC cutting paths maintain continuous clockwise curvature.',
      },
      {
        title: 'perf(engine): compact transform-delta records for Undo history',
        url: 'https://github.com/storytold/vectorcraft/pull/4574',
        state: 'OPEN',
        highlight: 'Reduced memory footprint of high-frequency canvas transform deltas in undo/redo history buffer.',
      },
    ],
  },
  {
    repo: 'microsoft/TypeScript',
    name: 'TypeScript',
    org: 'microsoft',
    url: 'https://github.com/microsoft/TypeScript',
    category: 'Compilers & Tooling',
    summary: 'Typed superset of JavaScript that compiles to clean JavaScript, powering modern web and server architecture worldwide.',
    totalPrs: 1,
    mergedPrs: 0,
    openPrs: 1,
    role: 'AST Printer Contributor',
    keyContributions: [
      {
        title: 'feat(printer): implement JSDoc node emission in AST printer',
        url: 'https://github.com/microsoft/TypeScript/pull/65058',
        state: 'OPEN',
        highlight: 'Added programmatic AST node emission for synthetic JSDoc comment blocks in the TypeScript compiler printer.',
      },
    ],
  },
  {
    repo: 'fritzing/fritzing-parts',
    name: 'Fritzing Parts & EDA',
    org: 'fritzing',
    url: 'https://github.com/fritzing/fritzing-parts',
    category: 'Hardware EDA & Embedded',
    summary: 'The standard electronic design automation (EDA) and PCB layout ecosystem for makers, engineers, and educators.',
    totalPrs: 16,
    mergedPrs: 15,
    openPrs: 1,
    role: 'Parts Architecture & Automation Contributor',
    keyContributions: [
      {
        title: 'New Parts update and nightly parts release pipeline',
        url: 'https://github.com/fritzing/fritzing-parts/pull/159',
        state: 'MERGED',
        highlight: 'Curated and integrated new electronic component models, schematic SVG layers, and pinout definitions.',
      },
      {
        title: 'WIN/UNIX cross-platform build automation & client-js API',
        url: 'https://github.com/fritzing/fritzing-parts-api-client-js/pull/9',
        state: 'MERGED',
        highlight: 'Authored cross-platform Makefiles and tooling for automated parts validation across Windows and Linux.',
      },
      {
        title: 'Build path fixes for desktop compiler targets',
        url: 'https://github.com/fritzing/fritzing-app/pull/3017',
        state: 'MERGED',
        highlight: 'Fixed C++ compiler include paths and asset resolution on the core Fritzing Qt desktop app.',
      },
    ],
  },
  {
    repo: 'paulvollmer/cyberrover',
    name: 'CyberRover',
    org: 'paulvollmer',
    url: 'https://github.com/paulvollmer/cyberrover',
    category: 'Robotics & Autonomous',
    summary: 'Autonomous space rover simulation and tactical command network with P2P multiplayer and progressive colonization systems.',
    totalPrs: 22,
    mergedPrs: 21,
    openPrs: 0,
    role: 'Co-Op Network & Engine Contributor',
    keyContributions: [
      {
        title: 'feat(v0.4): Serverless P2P Direct Connector, Multi-Operator Lobby & Co-Op Network',
        url: 'https://github.com/paulvollmer/cyberrover/pull/106',
        state: 'MERGED',
        highlight: 'Engineered WebRTC peer-to-peer telemetry sync allowing multiple operators to collaborate with zero centralized servers.',
      },
      {
        title: 'feat(v0.5): 41-level campaign, progressive command gating & DSN dish alignment',
        url: 'https://github.com/paulvollmer/cyberrover/pull/120',
        state: 'MERGED',
        highlight: 'Implemented campaign progression engine, SAR radar probing mechanics, and real-time Web UI performance monitor.',
      },
      {
        title: 'fix(test): deterministic E2E harvest solver',
        url: 'https://github.com/paulvollmer/cyberrover/pull/133',
        state: 'MERGED',
        highlight: 'Created a rock-solid automated solver for test suites verifying autonomous navigation algorithms.',
      },
    ],
  },
  {
    repo: 'solve-this/humanoid-roadmap',
    name: 'Humanoid Robotics Roadmap',
    org: 'solve-this',
    url: 'https://github.com/solve-this/humanoid-roadmap',
    category: 'Robotics & Autonomous',
    summary: 'Global tracker and intelligence dashboard monitoring commercial and open humanoid robotics development milestones.',
    totalPrs: 27,
    mergedPrs: 26,
    openPrs: 1,
    role: 'Frontend Architect & i18n Engineer',
    keyContributions: [
      {
        title: 'Add app-wide EN-first i18n system with optional German locale',
        url: 'https://github.com/solve-this/humanoid-roadmap/pull/8',
        state: 'MERGED',
        highlight: 'Built zero-runtime-cost multilingual dictionary routing and reactive language switching across technical specs.',
      },
      {
        title: 'Implement forecast-vs-actual tracking & AI-agent-vs-human-work layer',
        url: 'https://github.com/solve-this/humanoid-roadmap/pull/4',
        state: 'MERGED',
        highlight: 'Engineered interactive telemetry charts comparing predicted robotics rollout timelines against real delivery data.',
      },
    ],
  },
  {
    repo: 'fabien0102/openapi-codegen',
    name: 'OpenAPI-Codegen',
    org: 'fabien0102',
    url: 'https://github.com/fabien0102/openapi-codegen',
    category: 'Compilers & Tooling',
    summary: 'Tooling that generates clean, strongly typed TypeScript clients and mock servers directly from OpenAPI v3 specifications.',
    totalPrs: 7,
    mergedPrs: 5,
    openPrs: 1,
    role: 'Tooling & Type Safety Contributor',
    keyContributions: [
      {
        title: 'WIP: TypeScript 7 / 7.1 migration and tooling refresh',
        url: 'https://github.com/fabien0102/openapi-codegen/pull/355',
        state: 'OPEN',
        highlight: 'Modernized core AST generator to maintain compatibility with modern TypeScript compiler API evolutions.',
      },
      {
        title: 'chore: update tooling and patch upstream dependencies',
        url: 'https://github.com/fabien0102/openapi-codegen/pull/241',
        state: 'MERGED',
        highlight: 'Cleaned vulnerable dependency trees and updated CLI packaging to maintain zero-audit security baselines.',
      },
    ],
  },
  {
    repo: 'msitarzewski/agency-agents',
    name: 'Agency Agents & App',
    org: 'msitarzewski',
    url: 'https://github.com/msitarzewski/agency-agents',
    category: 'Multi-Agent & AI',
    summary: 'Curated library of autonomous AI personas and orchestrators with specialized domain skills and executable toolchains.',
    totalPrs: 3,
    mergedPrs: 1,
    openPrs: 2,
    role: 'SDK & Packaging Author',
    keyContributions: [
      {
        title: 'feat: add npm package + GitHub Action for programmatic agent access',
        url: 'https://github.com/msitarzewski/agency-agents/pull/847',
        state: 'OPEN',
        highlight: 'Proposed and authored the programmatic SDK packaging enabling CI/CD pipelines to consume agent definitions.',
      },
      {
        title: 'Add trust command for agency-agents installation',
        url: 'https://github.com/msitarzewski/agency-agents-app/pull/95',
        state: 'MERGED',
        highlight: 'Introduced verified trust verification handshake for automated local installation scripts.',
      },
    ],
  },
  {
    repo: 'beagleboard/pocketbeagle',
    name: 'BeagleBoard PocketBeagle',
    org: 'beagleboard',
    url: 'https://github.com/beagleboard/pocketbeagle',
    category: 'Hardware EDA & Embedded',
    summary: 'Open-source ultra-small, ultra-flexible single-board computer powered by the Octavo Systems OSD3358-SM system-in-package.',
    totalPrs: 1,
    mergedPrs: 1,
    openPrs: 0,
    role: 'Hardware Part Contributor',
    keyContributions: [
      {
        title: 'Fix for Fritzing Part pinout and footprint dimensions',
        url: 'https://github.com/beagleboard/pocketbeagle/pull/15',
        state: 'MERGED',
        highlight: 'Corrected PCB header pitch and schematic bus pin assignments in the official PocketBeagle hardware model.',
      },
    ],
  },
  {
    repo: 'video-react/video-react',
    name: 'Video-React',
    org: 'video-react',
    url: 'https://github.com/video-react/video-react',
    category: 'Web Platform',
    summary: 'Web video player built for HTML5 using the React library ecosystem with accessible controls.',
    totalPrs: 1,
    mergedPrs: 1,
    openPrs: 0,
    role: 'Framework Modernization Contributor',
    keyContributions: [
      {
        title: 'update react to 17.0.2 and modern component lifecycles',
        url: 'https://github.com/video-react/video-react/pull/419',
        state: 'MERGED',
        highlight: 'Resolved peer dependency conflicts and upgraded internal event listeners to support React 17+ applications.',
      },
    ],
  },
  {
    repo: 'paulvollmer/fzp',
    name: 'fzp (Fritzing Part Spec in Go)',
    org: 'paulvollmer',
    url: 'https://github.com/paulvollmer/fzp',
    category: 'Compilers & Tooling',
    summary: 'Go library, validation CLI, and specification parser for Fritzing XML Part definitions (.fzp).',
    totalPrs: 4,
    mergedPrs: 2,
    openPrs: 1,
    role: 'Specification & XML Parser Contributor',
    keyContributions: [
      {
        title: 'Correction of fzp-template and bus interconnect schema',
        url: 'https://github.com/paulvollmer/fzp/pull/2',
        state: 'MERGED',
        highlight: 'Fixed XML namespace tags and bus connector validation rules for embedded microcontrollers.',
      },
    ],
  },
];
