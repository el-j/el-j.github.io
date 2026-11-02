---
name: "ts2go"
command: "ts2go transpile ./src --out ./go"
summary: "TypeScript-to-Go transpiler that analyzes TypeScript AST definitions and compiles them into idiomatic, efficient Go code."
installCmd: "go install github.com/el-j/ts2go/go/cmd/ts2go@latest"
language: "Go / TypeScript"
tags: ["Go", "TypeScript", "Transpiler", "AST", "Compiler"]
githubUrl: "https://github.com/el-j/ts2go"
releaseVersion: "v0.0.0-alpha"
releasesCount: 26
---

### Why it exists
Bridges high-level TypeScript types, interfaces, and logic to performant Go backend microservices. Uses hexagonal architecture to parse TypeScript source tokens, map types cleanly to Go structs and interfaces, and output production-ready Go packages with idiomatic error propagation.

