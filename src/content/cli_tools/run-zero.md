---
name: "run-zero"
command: "runzero up --fleet"
summary: "Zero-cloud-cost autoscaling local GitHub Actions runner fleet with Dual-Engine execution across Docker containers and native Linux VMs."
installCmd: "go install github.com/el-j/run-zero@latest"
language: "Go / Docker / Shell"
tags: ["Go", "CI/CD", "GitHub Actions", "Docker", "OrbStack"]
githubUrl: "https://github.com/el-j/run-zero"
releaseVersion: "v0.0.7-beta.236"
releasesCount: 30
---

### Why it exists
Eliminates expensive GitHub Actions cloud runner bills and long queue times. RunZero dynamically spawns local runners using a Dual-Engine architecture (isolated Docker containers for micro-jobs, and full Linux VMs via OrbStack or Multipass for systemd and browser tests), complete with Verdaccio, Athens, and persistent caching proxies.
