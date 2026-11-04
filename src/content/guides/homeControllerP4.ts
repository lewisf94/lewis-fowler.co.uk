import type { Guide } from "../caseStudyTypes";

/*
 * DRAFT. Not published. The redesigned controller is still in development:
 * the knob, battery, PCB and enclosure are not finished or verified.
 * Facts from Home-Controller CLAUDE.md, docs/DESIGN_NOTES.md and docs/KNOB-PARTS.md,
 * checked on 4 November 2026.
 */
export const homeControllerP4Guide: Guide = {
  id: "home-controller",
  projectId: "musiccontroller",
  title: "Home Controller: redesigned controller",
  hardwareVersion: "Redesigned controller: Waveshare ESP32-P4-WIFI6-Touch-LCD-4.3 with an RP2040 haptic-knob daughterboard",
  verified: false,
  published: false,
  draftNotes: [
    "The haptic knob, custom PCB, battery design and enclosure are not finished.",
    "Publish only after the complete build is tested on one hardware revision.",
    "Needs a full parts list with part numbers, supplier links, cost and build time.",
    "Needs enclosure files (STEP, STL or 3MF), print settings and assembly photos.",
    "Needs versioned firmware release files.",
  ],
  sections: [
    {
      id: "intro",
      title: "Introduction",
      status: "missing",
      blocks: [
        {
          kind: "text",
          text: "A handheld controller for music and lights, with a 4.3-inch touchscreen, four hot-swap buttons and a motor-driven haptic knob. It connects to Home Assistant and Music Assistant.",
        },
      ],
    },
    {
      id: "safety",
      title: "Battery and electrical safety",
      status: "ready",
      blocks: [
        {
          kind: "warning",
          heading: "Lithium battery safety",
          items: [
            "Use a protected single-cell LiPo battery only.",
            "Check the connector polarity before you connect the battery. A reversed battery can destroy the board.",
            "Connect the battery to one charger only.",
            "Never short the battery leads. Disconnect the battery before you solder or change wiring.",
            "Do not use a battery that is swollen, damaged or hot.",
            "Do not leave the battery charging without supervision until the charging circuit is tested.",
          ],
        },
        {
          kind: "warning",
          heading: "Motor safety",
          items: [
            "The motor driver must start switched off. Use the fail-safe test firmware for the first motor test.",
            "Measure the power rails before you connect the motor.",
            "Stop the test if the motor driver becomes hot.",
          ],
        },
      ],
    },
    { id: "bom", title: "Bill of materials", status: "missing", blocks: [] },
    { id: "mechanical", title: "Mechanical design", status: "missing", blocks: [] },
    {
      id: "electronics",
      title: "Electronics",
      status: "missing",
      blocks: [
        {
          kind: "table",
          heading: "Link between the main board and the RP2040",
          head: ["Signal", "ESP32-P4", "RP2040"],
          rows: [
            ["UART TX", "GPIO 32", "GPIO 8"],
            ["UART RX", "GPIO 46", "GPIO 9"],
          ],
        },
        {
          kind: "table",
          heading: "RP2040 pins",
          head: ["Function", "Pins", "Note"],
          rows: [
            ["Motor PWM (six signals)", "GPIO 0 to 5", "Keep each pair on one PWM slice"],
            ["Motor enable", "GPIO 6", "Digital output"],
            ["HX711", "DOUT GPIO 10, CLK GPIO 11", ""],
            ["Four buttons", "GPIO 12 to 15", "Active LOW"],
            ["MT6701 angle sensor", "MISO GPIO 16, CS GPIO 17, SCK GPIO 18", "SPI0, mode 2"],
            ["Light ring", "GPIO 20", "SK6812"],
            ["Button LEDs", "GPIO 21", "SK6812"],
            ["I²C (VEML7700 0x10, MAX17048 0x36)", "SDA GPIO 26, SCL GPIO 27", ""],
          ],
        },
        {
          kind: "list",
          items: [
            "On the ESP32-P4, do not use GPIO 14 to 19. The Wi-Fi chip uses them.",
            "The serial link runs at 921600 baud.",
          ],
        },
      ],
    },
    {
      id: "software",
      title: "Software",
      status: "missing",
      blocks: [
        {
          kind: "list",
          heading: "Requirements",
          items: [
            "ESP-IDF 5.5.x. Do not use ESP-IDF 5.4 or 6.0: the board-support components need 5.5.",
            "A Home Assistant server with Music Assistant.",
            "Firmware in waveshare/esp-idf-ha/ and rp2040/ in the Home-Controller repository.",
          ],
        },
      ],
    },
    { id: "assembly", title: "Assembly", status: "missing", blocks: [] },
    { id: "testing", title: "Setup and testing", status: "missing", blocks: [] },
    {
      id: "downloads",
      title: "Downloads and references",
      status: "missing",
      blocks: [
        {
          kind: "downloads",
          files: [{ label: "Home-Controller source code", href: "https://github.com/lewisf94/Home-Controller" }],
        },
        { kind: "text", text: "The source code is licensed under the Apache License 2.0." },
      ],
    },
  ],
};
