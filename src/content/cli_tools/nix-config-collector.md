---
name: "nix-config-collector"
command: "nix-config-collector scan --generate"
summary: "Scans macOS workstations (Homebrew, App Store, dotfiles, system preferences) and generates declarative nix-darwin & home-manager setups."
installCmd: "curl -sSL https://raw.githubusercontent.com/el-j/nix-config-collector/main/install.sh | bash"
language: "Go / Nix"
tags: ["Go", "Nix", "NixOS", "macOS", "DevOps"]
githubUrl: "https://github.com/el-j/nix-config-collector"
releaseVersion: "v0.1.0"
releasesCount: 3
---

### Why it exists
Makes migrating existing macOS machines to reproducible Nix setups effortless. Scans active formulas, casks, and Mac App Store applications, automatically maps them to nixpkgs package equivalents across 60+ built-in mappings, and outputs ready-to-build `darwin-configuration.nix`, `home.nix`, and `flake.nix` configurations.
