---
name: "agency-agents-sdk"
command: "npx agency-agents list"
summary: "TypeScript SDK, CLI, and GitHub Action for loading Agency Agents personalities programmatically and building multi-agent swarm prompts."
installCmd: "npm install -g agency-agents-sdk"
language: "TypeScript"
tags: ["TypeScript", "Multi-Agent", "CLI", "SDK", "GitHub-Action"]
githubUrl: "https://github.com/el-j/agency-agents-sdk"
npmUrl: "https://www.npmjs.com/package/agency-agents-sdk"
releaseVersion: "v1.0.0"
releasesCount: 1
---

### Why it exists
A companion developer package to `msitarzewski/agency-agents` that provides programmatic access to agent markdown personas. It shallow-clones the upstream roster into an ephemeral local cache with zero external dependencies, ships an executable CLI (`agency-agents`), and provides a clean typed API for compiling multi-agent swarms into LLM system prompts.

