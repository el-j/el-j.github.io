---
title: "Neovim: The Dual-Brain Configuration"
category: "Neovim"
description: "Zero-bloat Lua configuration optimized for TypeScript fullstack development and design token navigation."
path: "~/.config/nvim/init.lua"
keyHighlights:
  - "Treesitter semantic AST syntax highlighting"
  - "Custom LSP hover formatting showing Figma token values"
  - "Telescope fuzzy find with live AST grep"
  - "Sub-20ms startup time via lazy.nvim byte-compilation"
snippet: |
  -- Token Inspection Keybinding
  vim.keymap.set('n', '<leader>ti', function()
    require('token_lens').inspect_token_at_cursor()
  end, { desc = "Inspect design token AST mapping" })
---

### Architecture & Ergonomics
A rock-solid Neovim workflow configured purely in modular Lua. Every plugin is vetted for sub-5ms latency impact, and all keybindings are mapped to an ergonomic homerow layout.
