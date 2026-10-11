---
name: "ast-inspector"
command: "ast-inspect ./src/components --tokens"
summary: "Interactive terminal REPL for querying, traversing, and rewriting TypeScript & CSS AST nodes."
installCmd: "npm install -g @el-j/ast-inspector"
language: "TypeScript / Node"
tags: ["AST", "TypeScript", "Babel", "CLI"]
githubUrl: "https://github.com/el-j"
npmUrl: "https://npmjs.com/package/@el-j/ast-inspector"
---

### Why it exists
When maintaining large design systems, finding which components consume specific design tokens or CSS custom properties is tedious with regex. `ast-inspector` parses the source code into Babel/TS ASTs and lets you run CSS-selector style queries against code symbols.
