function h(){const n=document.getElementById("terminal-output"),g=document.getElementById("terminal-form"),o=document.getElementById("terminal-input"),f=document.getElementById("term-btn-clear");if(!g||!o||!n)return;const a=[];let r=-1;const p={help:()=>`AVAILABLE WORKSTATION COMMANDS:
  help              - Display this list of commands
  uname -a          - Print system & kernel architecture
  cat about.md      - Display bio & engineering philosophy
  ls projects       - List Fabian Althaus real flagship projects
  cat run-zero      - Inspect RunZero dual-engine runner fleet
  cat gst           - Inspect @el-j/google-sheet-translations
  cat rex-at        - Inspect REX-AT industrial machine controls
  cat fritzing      - Inspect Fritzing open-source hardware EDA
  ls cli_tools      - List developer tools & CLI packages
  git log --graph   - Render ASCII branch topology
  contact           - Display communication channels
  synth             - Engage + SYNTH_T1 + pocket synthesizer
  reboot            - Trigger warm BIOS POST & Drive A: boot
  cowsay <text>     - The quintessential Unix wisdom
  clear             - Clear terminal buffer`,refresh:()=>(window.__refreshCrtScreen&&window.__refreshCrtScreen(),"[OK] CRT display refreshed & cathode ray degaussed."),reboot:()=>(sessionStorage.removeItem("crt-booted"),window.__triggerBiosBoot?window.__triggerBiosBoot():window.location.reload(),"[SYSTEM] Resetting CPU registers. Initiating warm hardware reboot..."),synth:()=>{const e=document.getElementById("btn-toggle-synth");return e&&e.click(),"[AUDIO] Pocket Synthesizer (+ SYNTH_T1 +) engaged. Use keys [A..K] or mouse to trigger notes."},"uname -a":()=>"Linux el-j-station 6.12.9-arch1-1 #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux",uname:()=>"Linux","cat about.md":()=>`FABIAN ALTHAUS (el-j)
=================================================================
Profile: Software engineer, designer and professional consultant
Focus:   Digital and analogue interfaces, apps and websites.
Motto:   Concept, design, implementation.
Website: https://fabianalthaus.de/en/
GitHub:  https://github.com/el-j`,"ls projects":()=>`REAL PORTFOLIO PROJECTS:
  [1] run-zero      - Dual-Engine Autoscaling GitHub Actions Runner Fleet
  [2] gst           - Google Sheet Translations (@el-j/google-sheet-translations)
  [3] rex-at        - Industrial Machine Web-UIs & Production Line Controls
  [4] fritzing      - Open-Source Electronics EDA Software & Parts Editor
  [5] enginsight    - Modular SIEM Cybersecurity Platform
  [6] domedrum      - Open Source Physical MIDI Controller
  [7] e-cube        - Gel Electrophoresis Laboratory Instrument
  [8] ktm-motohall  - Museum IoT Sensor Monitors & Telemetry
Type 'cat <project-name>' to inspect or 'open projects' to view all.`,"cat run-zero":()=>`RUNZERO // DUAL-ENGINE AUTOSCALING RUNNER FLEET
Toolset: Docker, OrbStack, GitHub Actions, Linux, systemd, Verdaccio, Athens, Astro
Summary: Autoscaling self-hosted GitHub Actions runner fleet with dual backends:
         Docker containers for lightweight tasks + OrbStack VMs for privileged systemd/DinD.
         Integrated caching proxies reduce CI execution times by up to 8x.`,"cat gst":()=>`GOOGLE SHEET TRANSLATIONS (@el-j/google-sheet-translations)
Toolset: TypeScript, Node.js, Google Sheets API, GitHub Actions, NPM
Summary: Open-source NPM package and GitHub Action syncing spreadsheet rows
         directly to type-safe JSON/TS locale dictionaries with validation.`,"cat rex-at":()=>`REX-AT // INDUSTRIAL MACHINERY CONTROLS & WEB-UIS
Toolset: Industrial Web-UI, TypeScript, SCADA, Vue, WebSockets, Embedded Linux
Summary: Rugged touchscreen control interfaces for machine operators and
         production telemetry in factory environments with zero data loss.`,"cat fritzing":()=>`FRITZING // HARDWARE MADE SIMPLE
Toolset: Interaction Design, EDA Software, Parts Editor, C++, Figma
Summary: Interaction redesign for the globally recognized open-source
         electronics prototyping tool and Fritzing 2.0 UX architecture.`,"ls cli_tools":()=>`DEVELOPER TOOLS & PACKAGES:
  [1] agency-agents-sdk       - Multi-agent swarm SDK & CLI (npm)
  [2] google-sheet-translations - Bidirectional Google Sheets i18n sync (npm)
  [3] run-zero                - Zero-cost local runner fleet (Go/Docker)
  [4] magic-agent-helix       - AI instruction generator (npm)
  [5] nexus-orchestrator      - Multi-model AI task orchestrator (Go/MCP)
  [6] ts2go                   - TypeScript-to-Go transpiler (Go)
  [7] nix-config-collector    - Declarative Nix config generator (Go)
  [8] direct-connector        - P2P tunnel & port forwarder (Go/Wails)
Type 'open cli' or 'open contrib' to inspect open-source releases & contributions.`,"git log --graph":()=>`* 65d36e5 (HEAD -> feat/cli-tui-fullscreen-crt) feat: 90s dos text console & bios draw
* 1de3c49 docs: add roadmap and live github issues
* 7a8f092 feat(run-zero): hybrid auto-routing between docker & orbstack
* e901b22 feat(gst): publish @el-j/google-sheet-translations`,contact:()=>`COMMUNICATION CHANNELS:
  Email:     info@fabianalthaus.de
  Portfolio: https://fabianalthaus.de/en/
  GitHub:    https://github.com/el-j`,clear:()=>"",sudo:()=>"[SECURITY ALERT] User 'el-j' is not in sudoers file. This incident has been logged.",matrix:()=>`1010010101010101010101010101010101010101010101010101
0101011010101010101010101010101010101010101010101010`};function s(e){if(!n)return;const t=document.createElement("div");t.innerHTML=e,n.appendChild(t),n.scrollTop=n.scrollHeight}function y(e){const t=e.trim();if(!t)return;a.push(t),r=a.length,s(`<div class="text-[#ffffff]"><span class="text-[#fbbf24]">A:\\&gt;</span> ${d(t)}</div>`);const[l,...c]=t.split(" "),u=l.toLowerCase();if(u==="clear"){n&&(n.innerHTML="");return}if(u==="open"){const i=c[0];i==="projects"?window.location.href="/projects":i==="cli"||i==="cli_tools"?window.location.href="/cli-tools":i==="about"?window.location.href="/":s(`<span class="text-red-400">Unknown destination: ${i}. Try 'open projects', 'open cli'.</span>`);return}if(u==="theme"){s('<span class="text-[#fbbf24]">Display locked to VGA Mode 3 text console (Award BIOS color profile).</span>');return}if(u==="cowsay"){const i=c.join(" ")||"Hardware & Software: Concept, Design, Implementation.",b=`  < ${d(i)} >
  ------------------------------------
         \\   ^__^
          \\  (oo)\\_______
             (__)\\       )\\/\\
                 ||----w |
                 ||     ||`;s(`<pre class="text-[var(--crt-phosphor)] my-1 leading-none">${b}</pre>`);return}const m=p[t]||p[u];s(m?`<pre class="text-[var(--crt-phosphor)] font-mono whitespace-pre-wrap">${d(m(c))}</pre>`:`<span class="text-red-400">command not found: ${d(t)}. Type 'help' for available commands.</span>`),window.__playClickSound&&window.__playClickSound()}function d(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}g.onsubmit=e=>{e.preventDefault();const t=o.value;o.value="",y(t)},o.onkeydown=e=>{if(e.key==="ArrowUp")e.preventDefault(),r>0&&(r--,o.value=a[r]||"");else if(e.key==="ArrowDown")e.preventDefault(),r<a.length-1?(r++,o.value=a[r]||""):(r=a.length,o.value="");else if(e.key==="Tab"){e.preventDefault();const t=o.value.trim().toLowerCase(),l=Object.keys(p).filter(c=>c.startsWith(t));l.length===1?o.value=l[0]:l.length>1&&s(`<span class="text-[var(--crt-phosphor-dim)]">${l.join("  ")}</span>`)}},f&&(f.onclick=()=>{n.innerHTML=""})}h();document.addEventListener("astro:page-load",h);
