---
name: "git-graph-stream"
command: "git-graph-stream --watch"
summary: "Terminal-native Git branch topology visualizer rendering ASCII commit graphs in real-time."
installCmd: "cargo install git-graph-stream"
language: "Rust / Shell"
tags: ["CLI", "Git", "Terminal", "Developer Ergonomics"]
githubUrl: "https://github.com/el-j"
---

### Why it exists
Standard `git log --graph` commands are static and clunky. `git-graph-stream` hooks into local git refs and redraws the active branch topology continuously with color-coded author tracks and commit hashes.
