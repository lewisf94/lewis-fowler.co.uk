import type { Profile, Skill } from "./types";

// Copied unchanged from the previous site. The content refresh replaces this text.
export const profile: Profile = {
  name: "Lewis Fowler",
  role: "Mechanical Design Engineer",
  bio: "Mechanical design engineer with three years of experience. I take products from first idea to tested prototype. In my own time I build electronics, robots and software.",
  current: "Mechanical Design Engineer",
  location: "Fort William",
  email: "lewis@lewis-fowler.co.uk",
  linkedin: "https://linkedin.com/in/lewisfowler",
  github: "https://github.com/lewisf94",
};

export const education = "MEng Mechanical Engineering, First-Class Honours · University of Glasgow · 2023";

export const skills: Skill[] = [
  { name: "SolidWorks",       cat: "Design"   },
  { name: "Fusion 360",       cat: "Design"   },
  { name: "GD&T",             cat: "Design"   },
  { name: "Ansys Fluent",     cat: "Analysis" },
  { name: "STAR-CCM+",        cat: "Analysis" },
  { name: "Flow and pressure testing", cat: "Analysis" },
  { name: "DFM",              cat: "Making"   },
  { name: "CNC machining",    cat: "Making"   },
  { name: "3D printing",      cat: "Making"   },
  { name: "C++",              cat: "Code"     },
  { name: "Python",           cat: "Code"     },
  { name: "JavaScript",       cat: "Code"     },
  { name: "TypeScript",       cat: "Code"     },
  { name: "React",            cat: "Code"     },
  { name: "ROS 2",            cat: "Code"     },
];
