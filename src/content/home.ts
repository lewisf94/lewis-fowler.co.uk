// Plain-language text for the home page. Technical detail stays on each project page.

export const hero = {
  heading: ["Design engineer.", "I make hardware", "people enjoy using."],
  bio: "I take products from first idea to tested prototype. I have designed cooling hardware for cars and aerospace, and I build my own electronics and robots.",
};

export const profileRows = [
  { label: "Based in", value: "Newcastle upon Tyne" },
  { label: "Role", value: "Mechanical Design Engineer" },
  { label: "Experience", value: "3 years" },
  { label: "Studied", value: "MEng, Glasgow, First" },
  { label: "Focus", value: "Product design · CFD · Embedded" },
];

/** One plain sentence per project, keyed by project id. */
export const projectSummary: Record<string, { plain: string }> = {
  musiccontroller: { plain: "A handheld music remote with a touchscreen and a motor-driven knob that clicks however you want it to." },
  selfbalancingrobot: { plain: "A two-wheeled robot that stays upright by correcting its own tilt many times a second." },
  cineclub: { plain: "A web app for film clubs. A wheel picks the film, and everyone's review stays hidden until the whole club has watched it." },
  eatme: { plain: "A home food tracker that shows what to eat first, on your phone or on a small e-paper screen in the kitchen." },
  arm: { plain: "A 3D-printed robot arm that you drive from a web page hosted on the arm itself." },
  convoy: { plain: "Dashboard units that show where every car in a convoy is, and let you talk, with no phone signal." },
};

export const contact = {
  heading: "Say hello",
  text: "I am happy to talk about engineering roles, collaborations or any of these projects.",
};
