import type { DeepDive } from "../caseStudyTypes";

/*
 * Self-Balancing Robot engineering deep dive.
 *
 * Facts come from the Self-Balancing-Robot repository (README.md,
 * docs/build-log.md, docs/hardware.md, docs/architecture.md and
 * docs/simulation.md), checked on 4 November 2026. Photos are Lewis's own.
 */
const P = "/assets/photos/self-balancing-robot/";

export const selfBalancingRobotDeepDive: DeepDive = {
  projectId: "selfbalancingrobot",
  intro:
    "How the robot was built up one part at a time, from the first microcontroller test to the control software. Half of this project was electronics and power debugging, not control theory.",
  stages: [
    {
      id: "first-test",
      label: "First test",
      title: "Testing the microcontroller",
      status: "done",
      blocks: [
        {
          kind: "text",
          text: "Before any robot parts were connected, I checked that the ESP32 board could read an input and drive an output: a push button and an LED on a breadboard.",
        },
        {
          kind: "gallery",
          images: [
            {
              src: `${P}button-test-on.jpg`,
              alt: "ESP32 board wired to a breadboard. A finger presses a push button and a red LED is lit",
              caption: "Button pressed: the ESP32 reads the input and switches the LED on.",
            },
            {
              src: `${P}button-test-off.jpg`,
              alt: "The same breadboard circuit with the button released and the LED off",
              caption: "Button released: the LED goes off.",
            },
          ],
        },
        {
          kind: "problems",
          items: [
            {
              problem: "The computer did not detect the ESP32.",
              fix: "Two of three USB cables were power-only. The third cable worked at once.",
            },
          ],
        },
      ],
    },

    {
      id: "parts",
      label: "Parts",
      title: "Choosing the parts",
      status: "done",
      blocks: [
        {
          kind: "text",
          text: "The parts changed as I learned what the robot needed. The photos below are in the order they were taken.",
        },
        {
          kind: "gallery",
          images: [
            {
              src: `${P}early-parts-mega.jpg`,
              alt: "An Elegoo Mega 2560 board, an MPU-6050 sensor board, a red dual motor driver board and two yellow TT gearmotors with wheels on a cork mat",
              caption: "An early set of parts: an Elegoo Mega 2560, an MPU-6050 tilt sensor, a small dual motor driver and two TT gearmotors with wheels.",
            },
            {
              src: `${P}early-parts-esp32.jpg`,
              alt: "Parts on a wooden desk: a white 10,000 mAh power bank, an ESP32 board, an MPU-6050, a red motor driver, a 4 × AA battery box, two breadboards, two TT gearmotors with wheels, a USB cable and jumper leads",
              caption: "The next set moved to an ESP32 board, with a 10,000 mAh power bank and a 4 × AA battery box for power.",
            },
            {
              src: `${P}parts-layout.jpg`,
              alt: "Robot parts laid out on a blue mat: two yellow TT gearmotors, two wheels, a red motor driver, an IMU board, a switch, a capacitor, an ESP32 board, an OLED display, a LiPo battery, a breadboard and a PowerBoost board",
              caption:
                "The current parts: two TT gearmotors and wheels, motor driver, MPU-6050 IMU, ESP32, 0.96-inch OLED, PowerBoost 1000C, LiPo battery, rocker switch and capacitor.",
            },
          ],
        },
        {
          kind: "table",
          heading: "Main parts",
          head: ["Job", "Part", "Notes"],
          rows: [
            ["Controller", "ESP32 (ESP32-S3 planned for the final build)", "Runs the balance loop"],
            ["Tilt sensor", "MPU-6050 (GY-521)", "Accelerometer and gyroscope over I²C"],
            ["Motors", "2 × DC TT gearmotor", "No encoders, so balance uses the IMU only"],
            ["Motor driver", "TB6612FNG", "Drives both motors"],
            ["Power", "Adafruit PowerBoost 1000C", "Boosts one LiPo cell to 5 V and charges it"],
            ["Battery", "2,000 mAh 3.7 V LiPo", "Enough for these motors"],
            ["Display", "0.96-inch SSD1306 OLED", "Live read-out for debugging"],
          ],
        },
        {
          kind: "decisions",
          items: [
            {
              choice: "TB6612FNG motor driver",
              reason:
                "It loses about 0.5 V instead of about 2 V, so the motors get more torque and the driver makes less heat. It also accepts 3.3 V logic and has thermal protection.",
              alternatives: "L298N and MX1508. The MX1508 also put spikes on the power line when the motors reversed.",
            },
            {
              choice: "TT gearmotors without encoders",
              reason:
                "They are cheap and simple. Without wheel feedback the robot balances on tilt only, so it drifts and cannot hold an exact position.",
              alternatives: "Stepper motors are a possible later upgrade.",
            },
          ],
        },
      ],
    },

    {
      id: "power",
      label: "Power",
      title: "Power and motor tests",
      status: "done",
      blocks: [
        {
          kind: "text",
          text: "I tested the power supply first, with no load, then added the motor driver and one motor to check that the supply survives a motor stall.",
        },
        {
          kind: "gallery",
          images: [
            {
              src: `${P}power-test.jpg`,
              alt: "PowerBoost 1000C board with a blue LED lit, wired to a rocker switch and a 2,000 mAh LiPo battery",
              caption: "Power test: the PowerBoost 1000C, the rocker switch and the 2,000 mAh LiPo battery.",
            },
          ],
        },
        {
          kind: "problems",
          items: [
            {
              problem: "The boost board switched on for a moment, then off again, over and over.",
              fix: "Its enable pin was connected to its own 5 V output, which does not exist until the board is on. The enable pin now goes to the battery through the switch, with a 10 kΩ resistor that keeps it off by default.",
            },
            {
              problem: "The low-battery light came on at 3.9 V, well above its 3.2 V threshold.",
              fix: "Flux left after soldering connected two pads. Cleaning with isopropyl alcohol fixed it.",
            },
            {
              problem: "When a motor was loaded, the 5 V rail dipped and reset the display.",
              fix: "A 100 µF capacitor across the motor supply absorbs the current surge.",
            },
          ],
        },
        {
          kind: "text",
          text: "Result: 5.18 V at 200 mA, with less than 80 mV of drop on the rail.",
        },
      ],
    },

    {
      id: "sensing",
      label: "Sensing",
      title: "Tilt sensor and display",
      status: "done",
      blocks: [
        {
          kind: "gallery",
          images: [
            {
              src: `${P}oled-pitch-roll.jpg`,
              alt: "Small OLED display held in a hand, showing pitch and roll values in yellow and blue text",
              caption: "The OLED showing live pitch and roll from the MPU-6050.",
            },
          ],
        },
        {
          kind: "decisions",
          items: [
            {
              choice: "Two separate I²C buses",
              reason:
                "The IMU is read about 100 times a second and the display updates about 10 times a second. Separate buses stop the slow display from delaying the sensor.",
            },
            {
              choice: "Balance on pitch only",
              reason: "The robot only needs its tilt in the direction it drives, so the sensor is mounted flat with one forward axis.",
            },
          ],
        },
        {
          kind: "problems",
          items: [
            {
              problem: "The display stayed blank.",
              fix: "The I²C bus must be started before the display.",
            },
          ],
        },
      ],
    },

    {
      id: "control",
      label: "Control",
      title: "First balance controller",
      status: "current",
      blocks: [
        {
          kind: "text",
          text: "The first controller uses proportional control only: the motor output is the tilt angle multiplied by a gain, limited to the full motor range.",
        },
        {
          kind: "gallery",
          images: [
            {
              src: `${P}first-wiring.jpg`,
              alt: "Both motors with wheels, the battery, the motor driver and the controller wired together with jumper leads on a blue mat",
              caption: "Everything wired together on the bench for the first control tests.",
            },
          ],
        },
        {
          kind: "list",
          heading: "What I found",
          items: [
            "A gain of about 5 gave a gentle response with no overshoot. A gain of about 15 was aggressive.",
            "The default 1 kHz motor PWM made a loud whine. Moving to 20 kHz made the motors silent.",
            "Zeroing the angle when the robot starts is only safe if it is upright, so manual calibration is planned.",
          ],
        },
      ],
    },

    {
      id: "software",
      label: "Software",
      title: "ROS 2 software and simulation",
      status: "done",
      blocks: [
        {
          kind: "text",
          text: "To tune the controller without risking the real robot, I built a ROS 2 workspace and a Gazebo simulation. The balance logic is a plain C++ class with no ROS code, so the same controller can run in the simulation, on a Raspberry Pi or on the ESP32-S3.",
        },
        {
          kind: "checklist",
          items: [
            { text: "ROS 2 workspace and portable control core", status: "done" },
            { text: "Gazebo simulation for tuning the gains", status: "done" },
            { text: "ESP32-S3 firmware with micro-ROS", status: "planned" },
          ],
        },
      ],
    },

    {
      id: "next",
      label: "Next",
      title: "Remaining work",
      status: "planned",
      blocks: [
        {
          kind: "checklist",
          items: [
            { text: "Add the derivative and integral terms to make a full PID controller", status: "planned" },
            { text: "Cut the motors when the robot falls past about 45° or the battery is low", status: "planned" },
            { text: "Live gain tuning from a phone or a laptop", status: "planned" },
            { text: "Final chassis and cable management", status: "planned" },
          ],
        },
      ],
    },
  ],
};
