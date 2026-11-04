import type { Guide } from "../caseStudyTypes";

/*
 * DRAFT. Not published. Facts from Home-Controller cyd/README.md,
 * cyd/esp-idf/README.md and CLAUDE.md, checked on 4 November 2026.
 * The CYD ESP-IDF build needs a new hardware check, so this guide is not verified.
 */
export const homeControllerCydGuide: Guide = {
  id: "home-controller-original",
  projectId: "musiccontroller",
  title: "Home Controller: original prototype",
  hardwareVersion: "Original prototype: Cheap Yellow Display (ESP32-2432S028R) with an MCP23017 input board",
  verified: false,
  published: false,
  draftNotes: [
    "The CYD ESP-IDF firmware needs a new hardware check after recent changes.",
    "Confirm the knob count: the CAD shows two encoder knobs, and the firmware and wiring use one.",
    "The CAD shows a PowerBoost 1000C and a LiPo battery. Battery wiring and safety steps are not documented yet.",
    "Add supplier links, cost, build time and photos of each assembly step.",
    "Add enclosure files, if this version had an enclosure.",
  ],
  sections: [
    {
      id: "intro",
      title: "Introduction",
      status: "ready",
      blocks: [
        {
          kind: "text",
          text: "This is the first version of Home Controller. It controls Spotify with a 2.8-inch touchscreen, four buttons and a rotary encoder. It needs a Spotify account and a Wi-Fi network.",
        },
        {
          kind: "list",
          heading: "You will need",
          items: [
            "Basic soldering, or jumper wires for a breadboard build.",
            "A computer with ESP-IDF 6.0 installed.",
            "A USB cable for the CYD.",
            "A Spotify account and Spotify developer credentials.",
          ],
        },
      ],
    },
    {
      id: "bom",
      title: "Bill of materials",
      status: "missing",
      blocks: [
        {
          kind: "bom",
          csvName: "home-controller-original-parts.csv",
          items: [
            { part: "Cheap Yellow Display", partNumber: "ESP32-2432S028R", qty: 1, purpose: "Processor, 2.8-inch touchscreen and Wi-Fi" },
            { part: "MCP23017 input expander board", partNumber: "CJMCU-2317", qty: 1, purpose: "Reads the buttons and the encoder over I²C" },
            { part: "Push button", qty: 4, purpose: "Previous, select, next and view" },
            { part: "Rotary encoder with push switch", qty: 1, purpose: "Scroll, volume and mute" },
            { part: "4.7 kΩ resistor", qty: 2, purpose: "I²C pull-ups on SDA and SCL" },
          ],
        },
      ],
    },
    {
      id: "mechanical",
      title: "Mechanical design",
      status: "missing",
      blocks: [],
    },
    {
      id: "electronics",
      title: "Electronics",
      status: "ready",
      blocks: [
        {
          kind: "gallery",
          images: [
            {
              src: "/assets/diagrams/CYD-Controller-Wiring-Diagram.svg",
              alt: "Wiring diagram for the original CYD prototype",
              caption: "Full wiring for the original prototype.",
              diagram: true,
            },
          ],
        },
        {
          kind: "table",
          heading: "MCP23017 connection",
          head: ["Signal", "CYD pin"],
          rows: [
            ["SDA", "GPIO 27"],
            ["SCL", "GPIO 22"],
            ["Interrupt (INTA)", "GPIO 35"],
            ["I²C address", "0x20"],
          ],
        },
        {
          kind: "table",
          heading: "Inputs on the MCP23017",
          head: ["Input", "MCP23017 pin"],
          rows: [
            ["Button 1", "GPA0"],
            ["Button 2", "GPA1"],
            ["Button 3", "GPA2"],
            ["Button 4", "GPA3"],
            ["Encoder CLK", "GPA4"],
            ["Encoder DT", "GPA5"],
            ["Encoder switch", "GPA6"],
          ],
        },
        {
          kind: "list",
          items: ["Fit a 4.7 kΩ pull-up resistor from SDA to 3.3 V and another from SCL to 3.3 V."],
        },
      ],
    },
    {
      id: "software",
      title: "Software",
      status: "ready",
      blocks: [
        {
          kind: "list",
          heading: "Requirements",
          items: ["ESP-IDF 6.0 and its Python environment.", "The firmware in cyd/esp-idf/ in the Home-Controller repository."],
        },
        {
          kind: "steps",
          heading: "Build and flash",
          items: [
            { text: "Open an ESP-IDF 6.0 terminal and go to the cyd/esp-idf folder." },
            { text: "Copy include/secrets.h.example to include/secrets.h and add your own Wi-Fi and Spotify details. Never share or commit this file." },
            { text: "Set the target once: idf.py set-target esp32" },
            { text: "Build: idf.py build" },
            { text: "Connect the CYD and find its serial port." },
            { text: "Flash and open the monitor: idf.py -p <port> flash monitor. Press Ctrl+] to close the monitor." },
          ],
        },
      ],
    },
    {
      id: "assembly",
      title: "Assembly",
      status: "missing",
      blocks: [],
    },
    {
      id: "testing",
      title: "Setup and testing",
      status: "missing",
      blocks: [],
    },
    {
      id: "downloads",
      title: "Downloads and references",
      status: "ready",
      blocks: [
        {
          kind: "downloads",
          files: [
            { label: "Home-Controller source code", href: "https://github.com/lewisf94/Home-Controller", note: "Firmware in cyd/esp-idf/" },
          ],
        },
        { kind: "text", text: "The source code is licensed under the Apache License 2.0." },
      ],
    },
  ],
};
