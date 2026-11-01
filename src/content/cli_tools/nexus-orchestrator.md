---
name: "nexus-orchestrator"
command: "nexus-cli connect --write"
summary: "Global AI task orchestrator and Model Context Protocol (MCP) server routing coding tasks to local LLMs and cloud APIs with project memory."
installCmd: "go install github.com/el-j/nexus-orchestrator/cmd/nexus@latest"
language: "Go / TypeScript"
tags: ["Go", "MCP", "AI-Orchestration", "CLI", "Automation"]
githubUrl: "https://github.com/el-j/nexus-orchestrator"
releaseVersion: "v0.11.0-beta.16"
releasesCount: 30
---

### Why it exists
Nexus runs coding workflows across local open-source models (Ollama, LM Studio, vLLM) and editor subscriptions (Claude Code, GitHub Copilot) without wasted API spend. Provides a standard MCP server interface, deterministic rule gates, automated test verification, and a persistent project brain tracking architectural conventions.
