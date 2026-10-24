---
title: "Zsh + Starship Cyber-Prompt"
category: "Shell"
description: "Minimalist, asynchronous terminal prompt showing Git topology, Node version, and AST compilation health."
path: "~/.zshrc"
keyHighlights:
  - "Asynchronous prompt rendering (zero typing lag)"
  - "Custom git dirty/ahead/behind visual glyphs"
  - "Integrated VI-mode status with visual cursor shape change"
snippet: |
  # Vi Mode Cursor shape integration
  function zle-keymap-select {
    if [[ $KEYMAP == vicmd ]]; then
      echo -ne "\e[2 q" # block cursor
    else
      echo -ne "\e[5 q" # beam cursor
    fi
  }
  zle -N zle-keymap-select
---

### Philosophy
The shell prompt is the command center of daily engineering work. Laggy prompts drain developer focus; this config uses pure POSIX-compatible shell scripting and compiled binaries to maintain 60fps responsiveness.
