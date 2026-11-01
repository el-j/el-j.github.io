---
name: "direct-connector"
command: "direct-connector-cli tunnel --port 443"
summary: "Zero-cloud-dependency cross-platform P2P tunneling utility with headless CLI binary and Wails desktop GUI for port sharing via SSH & WebRTC."
installCmd: "go install github.com/el-j/direct-connector@latest"
language: "Go / Wails"
tags: ["Go", "Networking", "Tunneling", "SSH", "P2P"]
githubUrl: "https://github.com/el-j/direct-connector"
releaseVersion: "v0.4.0"
releasesCount: 8
---

### Why it exists
Enables direct peer-to-peer port sharing between two workstations or servers with zero third-party relay servers, telemetry, or recurring subscriptions. Ships both as a lightweight headless CLI binary (`direct-connector-cli`) for servers/Docker containers, and as a Wails desktop GUI for macOS and Windows.
