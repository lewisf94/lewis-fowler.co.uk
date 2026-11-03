// Plain-language text for the home page. Technical detail stays on each project page.

export const hero = {
  heading: ["Design engineer.", "I make satisfying", "hardware & software."],
  bio: "I have taken a professional design project through its full product development life cycle from design to manufacture, testing, and shipping. I also design and build my own hardware and electronics, including custom enclosures, microcontroller-based systems, and the software that controls them.",
};

export const profileRows = [
  { label: "Based in", value: "Fort William" },
  { label: "Role", value: "Mechanical Design Engineer" },
  { label: "Professional Experience", value: "3 years" },
  { label: "Studied", value: "MEng, University of Glasgow, First Class Honours" },
  { label: "Focus", value: "Product design · Microcontrollers · Software" },
];

/** One plain sentence per project, keyed by project id. */
export const projectSummary: Record<string, { plain: string }> = {
  musiccontroller: { plain: "A handheld controller for music, lights and other home devices, designed around tactile controls and a more satisfying experience than using a phone." },
  selfbalancingrobot: { plain: "A two-wheeled robot that balances itself using feedback control." },
  cineclub: { plain: "A film club app where members add films to a wheel, spin for the next watch, then rate and review before everything is revealed at the deadline." },
  eatme: { plain: "A food tracker with an e-ink display to help you reduce food waste." },
  convoy: { plain: "Imagine a walkie-talkie for your car dashboard, but with a screen that shows where the other cars in your convoy are." },
};

export const contact = {
  heading: "Say hello",
  text: "I am happy to talk about engineering roles, collaborations or any of these projects.",
};
