---
title: "DomeDrum: Open Source Hardware MIDI Controller"
description: "Custom physical electronic musical instrument and MIDI drum controller with pressure-sensitive capacitive sensor domes."
category: "Hardware"
featured: false
role: "Hardware Designer & Firmware Developer"
period: "2020 - 2023"
year: "2022"
clientOrContext: "Physical Computing & Audio"
stack: ["Physical Computing", "Embedded C", "MIDI Protocol", "CAD/3D Printing", "Capacitive Sensors", "Teensy/Arduino"]
uxHighlight: "Tactile hemispherical silicon domes offering expressive velocity and aftertouch response unavailable on traditional flat drum pads."
architectureHighlight: "Sub-2ms interrupt-driven sensor scanning matrix preventing crosstalk and transmitting low-jitter MIDI over USB."
schematic: "[Capacitive Dome Sensors] -> [ADC Matrix Interrupts] -> [Microcontroller Firmware] -> [USB MIDI / DAW]"
demoUrl: "https://fabianalthaus.de/en/domedrum/"
metrics:
  "Scan Latency": "< 1.8ms"
  "Form Factor": "Ergonomic Dome Cluster"
---

### Physical Computing & Expressive Control
Standard grid-based MIDI controllers force musicians into rigid flat geometries. DomeDrum explores spherical, organic human-machine touch ergonomics, uniting custom embedded firmware with hand-crafted mechanical enclosures.
