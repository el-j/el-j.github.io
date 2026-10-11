---
title: "RunZero: Dual-Engine Autoscaling Runner Fleet"
description: "Autoscaling self-hosted GitHub Actions runner fleet with intelligent hybrid auto-routing between Docker containers and OrbStack VMs."
category: "Software"
featured: true
role: "Architect & Core Developer"
period: "2024 - Present"
year: "2025"
clientOrContext: "Open Source / Infrastructure"
stack: ["Docker", "OrbStack", "GitHub Actions", "Linux", "systemd", "Verdaccio", "Athens", "Astro", "TypeScript"]
uxHighlight: "Unified real-time fleet control console with live telemetry graphs, job latency metrics, and instant manual override dials."
architectureHighlight: "Hybrid engine auto-routing directing containerized tasks to Docker and DIND/systemd-heavy jobs to isolated OrbStack micro-VMs."
schematic: "[GH Webhooks] -> [Intelligent Auto-Router] -> {Docker Engine | OrbStack VMs} -> [Verdaccio/Athens Proxy Cache]"
githubUrl: "https://github.com/el-j"
demoUrl: "https://fabianalthaus.de/en/run-zero/"
metrics:
  "CI Speedup": "Up to 8x faster"
  "Cache Hit": "94.2% Proxy Hit"
  "Orchestration": "systemd daemons"
---

### Motivation & Architecture
Public cloud CI runners often suffer from cold-start latency, strict bandwidth limits, and exorbitant billing at scale. RunZero solves this by orchestrating a dedicated self-hosted fleet with two complementary execution backends:

1. **Docker Engine**: Ultra-fast ephemeral containers for lightweight lint, test, and standard build jobs.
2. **OrbStack Micro-VMs**: High-isolation Linux virtual machines capable of running rootful Docker-in-Docker (DinD), systemd services, and privileged kernel workflows.

### Integrated Proxy Ecosystem
Integrated caching proxies for APT packages, NPM (`Verdaccio`), and Go (`Athens`) eliminate external bandwidth bottlenecks, pulling warm artifacts locally with sub-millisecond latency.
