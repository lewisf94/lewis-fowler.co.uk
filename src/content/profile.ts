import type { Profile, Skill, SkillCategory } from "./types";

// Copied unchanged from the previous site. The content refresh replaces this text.
export const profile: Profile = {
  name: "Lewis Fowler",
  role: "Design Engineer",
  bio: "Mechanical design engineer with three years of experience. I take products from first idea to tested prototype. In my own time I build electronics, robots and software.",
  current: "Design Engineer",
  location: "Fort William",
  email: "lewis@lewis-fowler.co.uk",
  linkedin: "https://linkedin.com/in/lewisfowler",
  github: "https://github.com/lewisf94",
};

export const education = "MEng Mechanical Engineering, First-Class Honours · University of Glasgow · 2023";

export const skillCategories: SkillCategory[] = [
  "Product Development",
  "Mechanical Design",
  "Simulation",
  "Manufacturing",
  "Testing",
  "Electronics & Embedded Systems",
  "Digital Product Design",
];

export const skills: Skill[] = [
  { name: "Research", cat: "Product Development" },
  { name: "Concept development", cat: "Product Development" },
  { name: "Prototyping", cat: "Product Development" },
  { name: "Costing", cat: "Product Development" },
  { name: "Procurement", cat: "Product Development" },
  { name: "Project management", cat: "Product Development" },
  { name: "SolidWorks", cat: "Mechanical Design" },
  { name: "Fusion 360", cat: "Mechanical Design" },
  { name: "Technical drawings", cat: "Mechanical Design" },
  { name: "Geometric Dimensioning and Tolerancing (GD&T)", cat: "Mechanical Design" },
  { name: "Computational Fluid Dynamics (CFD)", cat: "Simulation" },
  { name: "Ansys Fluent", cat: "Simulation" },
  { name: "STAR-CCM+", cat: "Simulation" },
  { name: "Flotherm", cat: "Simulation" },
  { name: "Design for Manufacture (DFM)", cat: "Manufacturing" },
  { name: "Design for CNC machining, brazing and welding", cat: "Manufacturing" },
  { name: "3D printing", cat: "Manufacturing" },
  { name: "Flow and pressure testing", cat: "Testing" },
  { name: "Test-rig design", cat: "Testing" },
  { name: "Microcontrollers", cat: "Electronics & Embedded Systems" },
  { name: "Arduino", cat: "Electronics & Embedded Systems" },
  { name: "ESP32", cat: "Electronics & Embedded Systems" },
  { name: "Electronic integration", cat: "Electronics & Embedded Systems" },
  { name: "C++ programming", cat: "Electronics & Embedded Systems" },
  { name: "User experience (UX)", cat: "Digital Product Design" },
  { name: "User interface (UI) design", cat: "Digital Product Design" },
  { name: "Feature planning", cat: "Digital Product Design" },
  { name: "User feedback", cat: "Digital Product Design" },
  { name: "Iterative improvement", cat: "Digital Product Design" },
];
