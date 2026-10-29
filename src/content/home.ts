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
  musiccontroller: { plain: "A handheld music remote with a touchscreen and a motor-driven knob that clicks however you want it to." },
  selfbalancingrobot: { plain: "A two-wheeled robot that stays upright by correcting its own tilt many times a second." },
  cineclub: { plain: "A web app for film clubs. A wheel picks the film, and everyone's review stays hidden until the whole club has watched it." },
  eatme: { plain: "A home food tracker that shows what to eat first, on your phone or on a small e-paper screen in the kitchen." },
  arm: { plain: "A 3D-printed robot arm that you drive from a web page hosted on the arm itself." },
  convoy: { plain: "Imagine a walkie-talkie for your car dashboard, but with a screen that shows where the other cars in your convoy are." },
};

export const contact = {
  heading: "Say hello",
  text: "I am happy to talk about engineering roles, collaborations or any of these projects.",
};
