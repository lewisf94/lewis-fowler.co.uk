import type { DeepDive } from "../caseStudyTypes";

/*
 * Home Controller engineering deep dive.
 *
 * Every fact here comes from the Home-Controller repository (CLAUDE.md,
 * docs/ROADMAP.md, docs/PENDING.md, docs/DESIGN_NOTES.md, docs/KNOB-PARTS.md,
 * cyd/esp-idf/README.md and the commit history), checked on 4 November 2026.
 * Haptic, link and test details also come from docs/KNOB-NOTES.md,
 * docs/TESTING.md, docs/KICAD-GUIDE.md, rp2040/bringup/README.md and
 * rp2040/src/motor_task.cpp. Design reasons in the first person are Lewis's
 * own words (4 November 2026), with minor edits only.
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
      id: "controls",
      label: "Controls",
      title: "Rethinking the controls",
      status: "done",
      blocks: [
        {
          kind: "text",
          heading: "From two knobs to one",
          text: "The main focus of this project has always been making something satisfying to use. It needed to feel better than controlling everything through a phone, otherwise there would be little reason to use it.\n\nMy original design had two conventional knobs. Only one of them was wired up and tested in the prototype. It worked, but there was nothing particularly interesting about using it. It felt like any other knob.\n\nWhen I came across Scott Bezek's SmartKnob, it immediately looked like something I would want to play around with. It was playful and satisfying, but also practical.\n\nThe motor-driven feedback meant that one knob could adapt to different functions, with its physical behaviour controlled through software. It could create different levels of resistance, clicks or limits, depending on what you were controlling.\n\nThis also made the overall design cleaner and more flexible. Instead of having two knobs with fixed functions, I could have one that changes how it behaves depending on what I need it to do.",
        },
        {
          kind: "text",
          heading: "Why physical buttons?",
          text: "The buttons do not really need to be there. I could just use the touchscreen, but that goes against the whole point of the project.\n\nI am trying to move away from phones and touchscreens and towards more dedicated, physical interactions. There is just something satisfying about pressing a button and feeling it click. You know you have pressed it. You know it has worked.\n\nWith a touchscreen, every tap feels the same. We are so used to it now that it is boring. I wanted the controller to have that tactile feedback that you just do not get from tapping a screen.",
        },
        {
          kind: "text",
          heading: "Why a touchscreen?",
          text: "To be honest, there were a few reasons for this. A lot of the smaller screens I was looking at already came with touchscreens and built-in microcontrollers, so it was quite an easy option.\n\nIt also made developing the software much easier while the hardware was still being designed. I could test things like playing and pausing music just by tapping the screen and seeing how the interface responded, without needing the whole controller built first.\n\nBut there are also things where a touchscreen just makes more sense. For example, trying to type something using a knob would be an absolute pain. Having a keyboard pop up on the screen is much easier. The same goes for changing settings or adjusting things that you would not normally need physical controls for.\n\nI still want things like browsing music to be possible using the knob and buttons. The touchscreen is there for the things where physical controls would just make life more difficult.",
        },
        {
          kind: "text",
          heading: "Why hot-swappable switches?",
          text: "I have been designing the controller with the idea that other people might want to build and use it too. I could just choose the switches that I personally like, but someone else might prefer something completely different.\n\nUsing hot-swappable switches means people can choose whichever switches feel best to them, without needing to solder anything.",
        },
        {
          kind: "text",
          heading: "Why four buttons?",
          text: "I played around with different numbers of buttons and how they would fit into the overall design. Four seemed like a good balance between the number of functions I wanted to control and how the controller looked.",
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
          kind: "gallery",
          images: [
            {
              src: "/assets/diagrams/home-controller-system.svg",
              alt: "Block diagram: Raspberry Pi 5 over Wi-Fi to the ESP32-P4 board, a UART link to the RP2040, and the RP2040 connected to the motor driver, angle sensor, strain gauges, switches, LEDs and I2C sensors, with the battery and dock below",
              caption:
                "The hardware architecture of the redesign. Solid boxes are tested on hardware. Dashed boxes are designed or have firmware written, but are not yet tested. Dotted boxes are proposed or still open.",
              diagram: true,
            },
          ],
        },
        {
          kind: "table",
          heading: "Why each part, and where it stands",
          head: ["Part", "Why it was chosen", "Status"],
          rows: [
            ["ESP32-P4 board", "Enough memory and a fast display interface for album art, with Wi-Fi and audio on the same board", "Tested, in daily use"],
            ["RP2040", "Two cores, so one core can run only the motor loop. Its PWM slices suit a six-input motor driver, and SimpleFOC runs on it", "Boots and reads the angle sensor on a Pico-style module. Full knob firmware compiles, not tested"],
            ["TMC6300", "Three-phase driver for small gimbal motors. Its 2 to 11 V supply range lets it run directly from one LiPo cell", "Fail-safe test firmware built, not yet run"],
            ["MT6701QT", "14-bit contactless magnetic angle sensor with a fast SSI read", "Tested on the bench over I²C"],
            ["4 × BF350, HX711", "Detects a press on the knob itself, with no switch under it", "Designed, firmware written"],
            ["SK6812, SN74AHCT1G125", "Individually addressable RGBW lights. The level shifter makes the 3.3 V signal reliable at 5 V", "Designed, firmware written"],
            ["VEML7700", "Sets the screen brightness from the room light", "Designed, firmware written"],
            ["MAX17048", "Reports the charge of a single cell", "Proposed, not yet ordered"],
          ],
        },
        {
          kind: "text",
          heading: "The link between the boards",
          text: "The P4 and the RP2040 share one UART at 921,600 baud. Each message is a small protobuf message with a CRC32 checksum, framed with COBS so a zero byte always marks the end of a frame. If a frame is damaged, the receiver drops it and finds the start of the next one.\n\nAt 10 bits per byte, the link carries about 92,000 bytes a second, or about 11 µs per byte. The RP2040 cannot make 921,600 baud exactly from its 125 MHz clock. Its fractional divider gives about 920,635 baud, an error of about 0.1 %, which is well inside what a UART tolerates.\n\nWhile the knob turns, the RP2040 sends its state about every 5 ms. Commands from the P4 carry a nonce, and the P4 resends each one every 250 ms until the RP2040 returns the same nonce. Both sides compute the same CRC32 for a standard test string, and both firmware builds compile with the link turned on. The link has not yet run between the two boards.",
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
      id: "haptics",
      label: "Haptics",
      title: "How the haptic feel works",
      status: "current",
      blocks: [
        {
          kind: "text",
          text: "The feel of the knob comes from firmware on the RP2040. Everything in this stage is written and compiles, but none of it has driven the motor yet.",
        },
        {
          kind: "text",
          heading: "Measuring the angle",
          text: "A diametric magnet on the knob shaft sits above the MT6701 sensor. The sensor gives a 14-bit reading, so one turn is 16,384 counts, or about 0.022° per count. One SSI read takes about 25 µs.\n\nThe sensor's angle wraps from 360° back to 0°. The first version of the firmware took the difference between the raw reading and a fixed reference, so the angle jumped by a full turn at the wrap point and the motor got a sudden kick. The fix keeps a continuous angle: each loop tick adds only the small change since the last tick. That change is always far less than half a turn, so wrapping it is never ambiguous.",
        },
        {
          kind: "code",
          text: "Every tick (5 kHz target, 200 µs):\n\nΔ = wrap(raw − raw_last)\nθ = θ + Δ\np = (θ − θ_ref) / w\nn = clamp(round(p), n_min, n_max)\ne = θ − (θ_ref + n·w)\nif |e| > snap · w/2:  n = n ± 1\nτ = −k_detent · e\nτ = −k_end · e   (at an end stop)",
        },
        {
          kind: "list",
          heading: "What each line does",
          items: [
            "Δ is the change since the last tick, wrapped to within ±180°. Adding it to θ gives a continuous knob angle.",
            "p is the position in detents, where w is the detent width and θ_ref is where the knob started.",
            "n is the nearest detent, clamped to the menu's first and last position. e is the distance from that detent's centre.",
            "Past the snap point, the target moves on to the next detent.",
            "τ is the torque command: a spring back to the detent centre, and a stiffer spring past an end stop.",
          ],
        },
        {
          kind: "text",
          text: "Each detent is a spring. Near a detent centre the motor pushes the knob back towards it, which you feel as a click when you push past it to the next one. At the first and last position a stiffer spring makes an end stop. The P4 sends a new detent width, strength and range for each menu, so the same knob can feel different on each screen. The firmware limits the motor voltage to 4.0 V.",
        },
        {
          kind: "table",
          heading: "Detent profiles in the firmware",
          head: ["Menu", "Detent width", "Sensor counts per detent"],
          rows: [
            ["Volume", "3.6° (0 to 100 in one turn)", "About 164"],
            ["Now playing", "5°", "About 228"],
            ["Albums", "10°", "About 455"],
          ],
        },
        {
          kind: "text",
          heading: "Motor drive",
          text: "The TMC6300 switches the three motor phases from six PWM signals, one high and one low input for each phase. On the RP2040, each high and low pair must share one PWM slice, so the motor uses GPIO0 to GPIO5 and the serial link moved to UART1. SimpleFOC runs field-oriented control with space-vector PWM in torque mode. The loop runs on core 1, and its code is placed in RAM so that flash reads cannot delay it.",
        },
        {
          kind: "text",
          heading: "Reference design and my hardware",
          text: "The detent approach follows the open-source SmartKnob firmware, which has shown it works on SmartKnob's own hardware. On my hardware, the loop has not driven the motor yet. The pole-pair count is assumed to be 7 and is not confirmed. The 5 kHz loop rate is a target, not a measurement.",
        },
        {
          kind: "checklist",
          heading: "Status",
          items: [
            { text: "Continuous angle tracking and detent maths: written and compiled", status: "done" },
            { text: "Run the loop on the motor and measure the real loop rate", status: "planned" },
            { text: "Confirm the pole-pair count and calibrate the motor", status: "planned" },
            { text: "Tune detent strength for each menu by feel", status: "planned" },
            { text: "Set the knob-press threshold (the current value is a placeholder)", status: "planned" },
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
        {
          kind: "text",
          heading: "Checkpoint 2 in detail",
          text: "For the sensor test, the MT6701 breakout connected to the RP2040 over I²C, with a diametric magnet centred above the chip and held with non-magnetic material. The bring-up notes call for an air gap of 0.5 to 2.0 mm. The test read the angle 1,000 times a second with no read errors, and the angle followed the magnet when I turned it by hand.\n\nThe final firmware reads the sensor over SSI instead, which is faster. That connection is not yet tested on hardware.",
        },
        {
          kind: "text",
          heading: "Expected motor current (a calculation, not a measurement)",
          text: "With the 4.0 V firmware limit across one 7.8 Ω phase pair, a stalled motor would draw at most about 4.0 ÷ 7.8 ≈ 0.51 A. The real current depends on the modulation and on the motor's speed, so I will measure it during the motor test. The bench supply's current limit is close to the motor's locked-phase current, which is one reason the first test runs at low power for only 2.4 seconds.",
        },
        {
          kind: "table",
          heading: "How far each part has been tested",
          head: ["Level", "What is at this level"],
          rows: [
            ["Verified on hardware", "Original CYD prototype with one encoder and four buttons. Both P4 builds. RP2040 boot and USB serial. MT6701 reads over I²C. Motor phase resistance"],
            ["Firmware written, not tested on hardware", "Full RP2040 knob firmware (it compiles, using 4.6 % of RAM and 4.6 % of flash). The P4 side of the knob link. The fail-safe motor test. Over-the-air updates and crash reports. BOLD and HIFI themes"],
            ["Prototype hardware in development", "Daughterboard schematic in KiCad. Enclosure CAD. Strain-gauge flexures"],
            ["Planned", "Custom PCB. Battery, charging and dock. Thermal and long-run tests of the knob"],
          ],
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
          text: "The interactive model at the top of this page shows the enclosure and, with Show inside, the internal components. The mechanical design is the least finished part of the project. The CAD is in progress, and nothing below has been checked with a printed or assembled part yet.",
        },
        {
          kind: "table",
          heading: "Packaging constraints",
          head: ["Constraint", "Why", "Where it stands"],
          rows: [
            ["The MT6701 sits on the knob axis, directly under the magnet", "The sensor reads the direction of the magnet's field, so the magnet must be centred and at a small air gap", "To be checked with the final knob fixture"],
            ["The TMC6300, the motor connector and the battery pads sit close together", "The motor phase traces carry the most current on the board", "Layout rule for the PCB"],
            ["The RP2040, its crystal and its flash sit close together", "They share short, fast signals", "Layout rule for the PCB"],
            ["The strain gauges sit on flexure beams cut into the PCB, two in tension and two in compression", "The board must bend a measurable amount when the knob is pressed", "SmartKnob's slots are a reference only. My own beam shape is not designed yet"],
            ["Four MX hot-swap sockets on the PCB, one under each switch", "Switches can be changed without soldering", "Socket footprint chosen"],
            ["Motor connector: a three-pin JST or a screw terminal", "Depends on the motor's leads", "Open"],
          ],
        },
        {
          kind: "text",
          heading: "What the first prototype taught me",
          text: "In the first enclosure, the buttons and the input expander sat on two 30 × 70 mm protoboards, joined with loose wiring and lever connectors. It was quick to change, but it meant a lot of loose wiring inside the case. The redesign puts the buttons, sensors and lights on one daughterboard instead.",
        },
        {
          kind: "checklist",
          heading: "Status",
          items: [
            { text: "Enclosure CAD", status: "current" },
            { text: "Flexure beam shape for the strain gauges", status: "planned" },
            { text: "Check the magnet position under the final knob fixture", status: "planned" },
            { text: "Print and assemble a test enclosure", status: "planned" },
          ],
        },
      ],
    },

    {
      id: "power",
      label: "Power",
      title: "Battery and charging dock",
      status: "planned",
      blocks: [
        {
          kind: "text",
          heading: "Why a charging dock?",
          text: "Originally, I wanted the controller to be completely portable, more like a phone that you just charge occasionally rather than something that needs to sit on charge all the time.\n\nThe batteries I initially found easily available for the Waveshare board were around 2,000 mAh. I considered using two cells in parallel to increase the capacity, but that started adding more complexity to an already fairly complicated project.\n\nI decided it made more sense to keep things simple and have the controller be portable for shorter periods instead.\n\nThe more I thought about it, the more a charging dock made sense anyway. The controller would probably spend most of its time in the same place in the house, so why not have somewhere it can sit and charge when it is not being used?\n\nIt seems like a good compromise. I can still pick it up and use it wherever I want, but I do not need to worry as much about keeping it charged.",
        },
        {
          kind: "decisions",
          items: [
            {
              choice: "One LiPo cell",
              reason:
                "Keeps the power design simpler. The TMC6300 runs directly from one cell, and one fuel gauge (MAX17048) can report its charge.",
              alternatives: "Two cells in parallel for more capacity. Not chosen because of the extra complexity.",
            },
          ],
        },
        {
          kind: "text",
          text: "The LEDs need 5 V, so the board also needs a 5 V rail from the cell. The charger, the power switch and the 5 V rail are still open decisions. They must be designed and tested before the controller runs on battery, because a lithium cell needs correct charging and protection. I have not measured the current draw or the battery life yet, so this page gives no runtime figure.",
        },
        {
          kind: "checklist",
          heading: "Status",
          items: [
            { text: "Choose the charger, power switch and 5 V rail", status: "planned" },
            { text: "Design the dock", status: "planned" },
            { text: "Order the battery fuel gauge", status: "planned" },
            { text: "Measure current draw and battery life", status: "planned" },
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
