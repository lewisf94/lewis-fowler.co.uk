import type { DeepDive } from "../caseStudyTypes";

/*
 * Home Controller engineering deep dive.
 *
 * Every fact here comes from the Home-Controller repository (CLAUDE.md,
 * docs/ROADMAP.md, docs/PENDING.md, docs/DESIGN_NOTES.md, docs/KNOB-PARTS.md,
 * cyd/esp-idf/README.md and the commit history), checked on 4 November 2026.
 *
 * Images: only add files that exist under public/. The build stops if a path
 * is wrong. Photos are Lewis's own (added 4 November 2026).
 */
export const homeControllerDeepDive: DeepDive = {
  projectId: "musiccontroller",
  intro:
    "How the controller got from a first idea to the current design, stage by stage. Each stage shows what is finished, what is in progress and what is still planned.",
  stages: [
    {
      id: "research",
      label: "Research",
      title: "Research and requirements",
      status: "done",
      blocks: [
        {
          kind: "text",
          text: "Before designing anything, I looked at products that already do part of this job. They showed that people want a dedicated music controller, and they showed where this project could be different.",
        },
        {
          kind: "table",
          heading: "Prior art",
          head: ["Product", "What it does", "What I took from it"],
          rows: [
            ["Knobby", "ESP32 and rotary encoder Spotify remote", "A small microcontroller is enough to control Spotify"],
            ["Spotify Car Thing", "Display, rotary control and preset buttons", "Screen, knob and presets work well together"],
            ["Car Thing community firmware", "Kept the device going after Spotify ended it", "Avoid depending on one company's service"],
            ["SmartKnob and SimpleFOC", "Open-source haptic knobs", "Motor-driven haptic feedback is practical on an RP2040"],
          ],
        },
        {
          kind: "list",
          heading: "Where this project is different",
          items: [
            "A larger touchscreen interface.",
            "Direct control of Sonos speakers.",
            "A theme system with several visual styles.",
            "A haptic knob that can feel different in each part of the interface.",
          ],
        },
      ],
    },

    {
      id: "prototype",
      label: "First prototype",
      title: "The original working prototype",
      status: "done",
      blocks: [
        {
          kind: "text",
          text: "The first version used a Cheap Yellow Display (CYD): an ESP32 board with a 2.8-inch 320 × 240 touchscreen. Physical buttons and a rotary encoder connect through an MCP23017 input expander, so they use only two data pins on the ESP32. The enclosure CAD has space for two encoder knobs, and the wiring and firmware so far use one. A PowerBoost 1000C board and a LiPo battery sit inside the case.\n\nThe firmware talks directly to the Spotify Web API. I brought it up one checkpoint at a time, so each new part was tested on its own before the next was added.",
        },
        {
          kind: "gallery",
          images: [
            {
              src: "/assets/diagrams/CYD-Controller-Wiring-Diagram.svg",
              alt: "Wiring diagram for the original CYD prototype",
              caption:
                "Wiring for the original prototype. The buttons and the encoder go through the MCP23017 expander on one I²C bus (SDA GPIO27, SCL GPIO22, interrupt GPIO35), with 4.7 kΩ pull-up resistors to 3.3 V.",
              diagram: true,
            },
          ],
        },
        {
          kind: "gallery",
          images: [
            {
              src: "/assets/photos/home-controller/cyd-cad-assembly.jpg",
              alt: "SolidWorks assembly of the original prototype enclosure, with the CYD screen, two knobs and protoboards",
              caption:
                "Enclosure assembly in SolidWorks. The CYD screen sits at the top, with two encoder knobs to its right and the button protoboards below.",
            },
            {
              src: "/assets/photos/home-controller/cyd-cad-protoboards.jpg",
              alt: "CAD close-up of the CYD board, two green protoboards with buttons and the MCP23017 chip",
              caption:
                "Inside the CAD model: the CYD board and two 30 × 70 mm protoboards that carry the buttons and the MCP23017 input expander.",
            },
            {
              src: "/assets/photos/home-controller/cyd-prototype-bench.jpg",
              alt: "The printed grey enclosure on a cutting mat, open, with wiring, Wago connectors and the CYD screen",
              caption:
                "The printed enclosure on the bench during assembly, with the wiring still exposed.",
            },
          ],
        },
        {
          kind: "table",
          heading: "Controls",
          head: ["Input", "Album browser", "Now playing"],
          rows: [
            ["Button 1", "Previous album", "Previous track"],
            ["Button 2", "Select album", "Play or pause"],
            ["Button 3", "Next album", "Next track"],
            ["Button 4", "Change view", "Change view or shuffle"],
            ["Encoder", "Scroll", "Volume"],
            ["Encoder press", "Select album", "Mute"],
          ],
        },
        {
          kind: "checklist",
          heading: "Bring-up checkpoints, all passed on hardware",
          items: [
            { text: "Backlight and serial output", status: "done" },
            { text: "Display colour test and LVGL graphics", status: "done" },
            { text: "Touchscreen", status: "done" },
            { text: "Wi-Fi and Spotify sign-in", status: "done" },
            { text: "Album art and embedded thumbnails", status: "done" },
            { text: "Album carousel and selection", status: "done" },
            { text: "Input expander, encoder, buttons, volume and mute", status: "done" },
            { text: "Status indicators and on-screen messages", status: "done" },
          ],
        },
        {
          kind: "problems",
          items: [
            {
              problem: "Mechanical switches bounce, so one press can read as several.",
              fix: "The input driver uses a 30 ms debounce and a state machine for the encoder.",
            },
            {
              problem: "The display's tearing signal is not connected on this board, so fast scrolling can tear.",
              fix: "Noted as a hardware limit of the CYD. The new display does not have this problem.",
            },
          ],
        },
      ],
    },

    {
      id: "platform",
      label: "New platform",
      title: "Moving to the ESP32-P4",
      status: "done",
      blocks: [
        {
          kind: "text",
          text: "The redesign is built on a Waveshare ESP32-P4 board with a 4.3-inch 800 × 480 touchscreen. It has much more memory than the CYD, a dedicated Wi-Fi chip and an audio codec with a speaker output.",
        },
        {
          kind: "table",
          heading: "Main board",
          head: ["Part", "Detail"],
          rows: [
            ["Processor", "ESP32-P4, dual-core RISC-V"],
            ["Memory", "32 MB flash, 32 MB PSRAM"],
            ["Display", "4.3-inch ST7701 MIPI-DSI, used as 800 × 480 landscape"],
            ["Touch", "GT911 capacitive controller"],
            ["Wi-Fi", "ESP32-C6, connected over SDIO"],
            ["Audio", "ES8311 codec"],
          ],
        },
        {
          kind: "decisions",
          items: [
            {
              choice: "Home Assistant as the main backend",
              reason:
                "Home Assistant and Music Assistant reduce dependence on one service's API. The same connection also gives control of lights and other devices.",
              alternatives: "A direct Spotify and Sonos build. It still exists and is also tested on hardware.",
            },
            {
              choice: "Shared code for both backends",
              reason:
                "The interface, album data and fonts live in one shared component, so a change reaches both builds at once.",
            },
            {
              choice: "A separate RP2040 for the knob",
              reason:
                "Motor control needs a fast, steady loop. Putting it on its own chip keeps it away from the network and graphics work on the main processor.",
            },
          ],
        },
      ],
    },

    {
      id: "firmware",
      label: "Firmware",
      title: "Firmware architecture and reliability",
      status: "current",
      blocks: [
        {
          kind: "text",
          text: "The Home Assistant build is the one I use every day. Most of the work at this stage has been making it stay reliable for long periods.\n\nThe limiting resource is not total memory. It is the small amount of fast internal memory that the Wi-Fi link and the display hardware need. When that runs out, the network connection fails.",
        },
        {
          kind: "list",
          heading: "Rules the firmware follows",
          items: [
            "Network requests never run in the screen or input code, so the interface stays responsive.",
            "Only one task at a time can change the screen.",
            "Large buffers go in the external PSRAM. Internal memory is kept for the parts that must have it.",
            "A fixed 64 KB of internal memory is held back for the Wi-Fi and display hardware.",
            "A check script runs before and after each build to catch memory regressions.",
          ],
        },
        {
          kind: "problems",
          items: [
            {
              problem: "Starting the speaker audio stream at the same time as the first Home Assistant data load put too much pressure on the Wi-Fi receive buffers.",
              fix: "The audio stream now starts only after the first data load is complete.",
            },
          ],
        },
        {
          kind: "checklist",
          heading: "Status",
          items: [
            { text: "Daily Home Assistant build, tested on hardware", status: "done" },
            { text: "Direct Spotify and Sonos build, tested on hardware", status: "done" },
            { text: "Over-the-air updates and crash reports: written, hardware test pending", status: "current" },
            { text: "60-minute interactive test and 8-hour playback test", status: "planned" },
            { text: "Confirm an over-the-air update keeps all settings", status: "planned" },
          ],
        },
      ],
    },

    {
      id: "interface",
      label: "Interface",
      title: "Touchscreen interface",
      status: "current",
      blocks: [
        {
          kind: "text",
          text: "The interface is built with LVGL. Albums are browsed in a Cover Flow view, with Carousel and Focus views for moving faster through a large library. The display hardware's graphics accelerator (PPA) helps draw the album art smoothly.\n\nThere are six visual themes, each with a dark and a light version. To tune them without rebuilding each time, I added a Developer tab with 65 live controls, and a browser page that gives an approximate preview of each theme.",
        },
        {
          kind: "gallery",
          images: [
            {
              src: "/assets/photos/home-controller/p4-cover-flow-colour.jpg",
              alt: "Cover Flow album browser on the 4.3-inch screen, showing L.A. Woman by The Doors in colour",
              caption: "The Cover Flow album browser with full-colour album art.",
            },
            {
              src: "/assets/photos/home-controller/p4-cover-flow.jpg",
              alt: "Cover Flow album browser in a dithered black-and-white theme, showing Dogrel by Fontaines D.C.",
              caption: "The same browser in a dithered black-and-white theme. The frame rate shows at the top left during development.",
            },
            {
              src: "/assets/photos/home-controller/p4-now-playing.jpg",
              alt: "Now playing screen with album art, track progress and play, pause and skip buttons",
              caption: "The now-playing screen: track progress, transport controls and the output and level controls.",
            },
          ],
        },
        {
          kind: "table",
          heading: "Themes",
          head: ["Theme", "Reference"],
          rows: [
            ["BASIC", "Restrained, functional design"],
            ["GLYPH", "Dot-matrix instrument"],
            ["PIXEL", "Low-resolution computer"],
            ["PAPER", "Printed technical instrument"],
            ["BOLD", "Geometric sans-serif display"],
            ["HIFI", "Broadcast console"],
          ],
        },
        {
          kind: "problems",
          heading: "Problems found on the hardware",
          items: [
            {
              problem: "Matrix drawing produced invalid coordinates and crashed the processor.",
              fix: "Matrix drawing is turned off.",
            },
            {
              problem: "Drawing fonts at run time caused memory corruption.",
              fix: "All fonts are now compiled into the firmware.",
            },
            {
              problem: "Two graphics draw units conflicted with the graphics accelerator.",
              fix: "The firmware uses one draw unit.",
            },
            {
              problem: "Scaling or fading a whole album card created a hidden layer that the display did not draw correctly.",
              fix: "Effects are applied to the image inside the card instead.",
            },
          ],
        },
        {
          kind: "checklist",
          heading: "Status",
          items: [
            { text: "Album browser, now playing and light controls", status: "done" },
            { text: "Queue changes and song search: written, hardware test pending", status: "current" },
            { text: "BASIC, GLYPH, PIXEL and PAPER themes", status: "done" },
            { text: "BOLD and HIFI themes: written, not yet tested on hardware", status: "current" },
            { text: "Remove, reorder and repair albums on the device", status: "planned" },
          ],
        },
      ],
    },

    {
      id: "knob",
      label: "Electronics",
      title: "Haptic knob electronics",
      status: "current",
      blocks: [
        {
          kind: "text",
          text: "The knob is driven by a small brushless motor. A magnetic sensor measures its angle, and the motor pushes back to create clicks, stops and resistance. An RP2040 on a separate daughterboard runs the motor, reads the sensors and buttons, and drives the lights. It talks to the main board over a serial link.",
        },
        {
          kind: "table",
          heading: "Daughterboard",
          head: ["Block", "Part", "Job"],
          rows: [
            ["Controller", "RP2040", "Motor control, sensors, buttons and LEDs"],
            ["Motor driver", "TMC6300", "Drives the three motor phases"],
            ["Angle sensor", "MT6701QT", "Measures the knob position"],
            ["Press sensing", "4 × BF350 strain gauges, HX711", "Detects a press on the knob"],
            ["Lighting", "SK6812 RGBW, SN74AHCT1G125", "Light ring and button lights, with a level shifter per chain"],
            ["Sensors", "VEML7700, MAX17048", "Ambient light and battery level"],
          ],
        },
        {
          kind: "decisions",
          items: [
            {
              choice: "Four strain gauges in a full bridge",
              reason:
                "Two gauges stretch and two compress when the knob is pressed. Together they give a stronger, more stable signal than one gauge.",
            },
            {
              choice: "A checked serial protocol between the boards",
              reason:
                "Each message carries a checksum and gets an acknowledgement. The main board resends a command every 250 ms until the RP2040 confirms it.",
            },
            {
              choice: "A level shifter for each LED chain",
              reason: "The LEDs run from 5 V but the RP2040 outputs 3.3 V, which is not always enough for a reliable signal.",
            },
            {
              choice: "Prototype on a Pico-style module first",
              reason:
                "A ready-made module already has the crystal, flash, regulator and USB connector. The final board will use a bare RP2040.",
            },
          ],
        },
        {
          kind: "problems",
          items: [
            {
              problem: "The first serial pins on the RP2040 clashed with the motor's PWM outputs.",
              fix: "The serial link moved to a second UART on GPIO8 and GPIO9.",
            },
            {
              problem: "The knob angle jumped when it passed through zero degrees.",
              fix: "The firmware now tracks full turns, so the angle stays continuous.",
            },
            {
              problem: "The angle sensor's data frame was read with the wrong length.",
              fix: "Corrected to the 25-bit frame in the datasheet.",
            },
            {
              problem: "The SmartKnob reference design uses a different package of the angle sensor.",
              fix: "Its symbol is not reused. The part comes from the standard KiCad library instead.",
            },
          ],
        },
      ],
    },

    {
      id: "testing",
      label: "Testing",
      title: "Knob bring-up and testing",
      when: "Jul 2026 onwards",
      status: "current",
      blocks: [
        {
          kind: "text",
          text: "I am testing the knob hardware one risk at a time, on prototype hardware, before any custom PCB is made.",
        },
        {
          kind: "gallery",
          images: [
            {
              src: "/assets/photos/home-controller/knob-parts-front.jpg",
              alt: "An RP2040 board, an MT6701 magnetic angle sensor breakout, a small magnet and a pin header on a cutting mat",
              caption:
                "Bring-up parts: an RP2040 board, an MT6701 angle sensor breakout and the small magnet it reads.",
            },
          ],
        },
        {
          kind: "checklist",
          items: [
            { text: "Checkpoint 1: RP2040 boots and sends data over USB", status: "done" },
            { text: "Checkpoint 2: angle sensor read 1,000 times a second, with no read errors", status: "done" },
            { text: "Checkpoint 3: fail-safe motor test firmware written and built", status: "done" },
            { text: "Run the motor test on the hardware", status: "current" },
            { text: "Find the motor's pole-pair count", status: "planned" },
            { text: "Test strain sensing, buttons and LEDs", status: "planned" },
            { text: "Connect the knob to the main board and test each menu's feel", status: "planned" },
          ],
        },
        {
          kind: "list",
          heading: "Motor test safety limits",
          items: [
            "The motor driver starts switched off.",
            "The test must be armed over USB, and the arm command expires after 10 seconds.",
            "The motor runs at 12 percent power and stops after 2.4 seconds.",
            "A fault signal from the driver stops the motor at once.",
          ],
        },
        {
          kind: "problems",
          items: [
            {
              problem: "The RP2040 clone board did not power up with a USB-C to USB-C cable.",
              fix: "Its USB-C socket lacks the two pull-down resistors the standard needs. A USB-A to USB-C cable works. The final board will include two 5.1 kΩ resistors.",
            },
          ],
        },
        {
          kind: "text",
          text: "Measured so far: each pair of motor phases reads 7.8 Ω, and no phase is connected to the motor's metal body.",
        },
      ],
    },

    {
      id: "mechanical",
      label: "Mechanical",
      title: "Enclosure and mechanical design",
      status: "current",
      blocks: [
        {
          kind: "text",
          text: "The interactive model at the top of this page shows the enclosure and, with Show inside, the internal components.",
        },
        {
          kind: "list",
          heading: "Mechanical decisions so far",
          items: [
            "Four MX hot-swap sockets, so the switches can be changed without soldering.",
            "The strain gauges sit on flexure beams cut into the PCB, so the board bends slightly when the knob is pressed.",
            "The motor connector (a three-pin JST or a screw terminal) will be chosen once the motor leads are inspected.",
          ],
        },
        {
          kind: "checklist",
          heading: "Status",
          items: [
            { text: "Enclosure CAD", status: "current" },
            { text: "Check the magnet position under the final knob fixture", status: "planned" },
          ],
        },
      ],
    },

    {
      id: "custom-hardware",
      label: "Next",
      title: "Custom PCB and remaining work",
      status: "planned",
      blocks: [
        {
          kind: "text",
          text: "The final step is one custom daughterboard with a bare RP2040, designed in KiCad. I will not start the final PCB until the prototype has given real measured values for each item below.",
        },
        {
          kind: "checklist",
          heading: "Values needed before the final PCB",
          items: [
            { text: "Motor current", status: "planned" },
            { text: "Motor pole-pair count", status: "planned" },
            { text: "Magnet geometry", status: "planned" },
            { text: "Motor driver temperature", status: "planned" },
            { text: "Strain-sensor circuit", status: "planned" },
            { text: "Battery and charging design", status: "planned" },
            { text: "Connector pinout", status: "planned" },
          ],
        },
        {
          kind: "list",
          heading: "Open decisions",
          items: [
            "Motion sensor (current candidate: BMI270).",
            "Hall sensor (current candidate: DRV5032).",
            "Power switch.",
            "The 5 V supply and the current it can provide.",
            "The 3.3 V regulator for the bare RP2040.",
          ],
        },
      ],
    },
  ],
};
