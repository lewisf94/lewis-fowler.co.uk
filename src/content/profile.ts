import type { Profile, Skill } from "./types";

// Copied unchanged from the previous site. The content refresh replaces this text.
export const profile: Profile = {
  name: "Lewis Fowler",
  role: "Design Engineer",
  bio: "Building mechatronic hardware — embedded electronics, motor control, and robotics. By day, designing thermal management solutions for automotive and space at Boyd. Based in Newcastle upon Tyne.",
  current: "Design Engineer @ Boyd",
  location: "Newcastle upon Tyne",
  email: "lewis@lewis-fowler.co.uk",
  linkedin: "https://linkedin.com/in/lewisfowler",
  github: "https://github.com/lewisf94",
};

export const education = "MEng, University of Glasgow";

export const skills: Skill[] = [
  { name: "SolidWorks",   cat: "Software"   },
  { name: "Fusion 360",   cat: "Software"   },
  { name: "CFD / Fluent", cat: "Software"   },
  { name: "MATLAB",       cat: "Software"   },
  { name: "Python",       cat: "Software"   },
  { name: "C++",          cat: "Embedded"   },
  { name: "Fabrication",  cat: "Mechanical" },
  { name: "3D Printing",  cat: "Mechanical" },
  { name: "Arduino",      cat: "Embedded"   },
  { name: "ROS 2",        cat: "Embedded"   },
];
