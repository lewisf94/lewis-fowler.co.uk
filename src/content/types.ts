/** Placement tweaks for one project's 3D model. Applies to the card and the project page. */
export interface ModelDisplay {
  /** Model size in the project card. Default 2.0. */
  cardScale?: number;
  /** Model size on the project page. Default 1.8. */
  studyScale?: number;
  /** Vertical shift in the card (+ moves up). Default 0. */
  cardY?: number;
  /** Vertical shift on the project page (+ moves up). Default 0. */
  studyY?: number;
  /** Camera distance (lower is closer). Default 3.2. */
  cameraZ?: number;
  /** Spin-axis offset from the bounding-box centre. Default 0. */
  rotCenterY?: number;
  /** Viewer height in the card, px. null uses the CSS default. */
  cardViewerH?: number | null;
  /** Viewer height on the project page, px. null uses the CSS default. */
  studyViewerH?: number | null;
  /** Extra rotation in degrees, applied after the Z-up to Y-up base turn. */
  orientX?: number;
  orientY?: number;
  orientZ?: number;
}

export interface Spec {
  label: string;
  value: string;
}

/** A titled bullet list in the specification, for example "Hardware". */
export interface SpecGroup {
  heading: string;
  items: string[];
}

export interface Diagram {
  label: string;
  path: string;
}

export interface ProjectLinks {
  github?: string;
  demo?: string;
  video?: string;
}

export type ProjectStatus = "active" | "planned";

export interface Project {
  id: string;
  status: ProjectStatus;
  statusLabel?: string;
  /** Show the Home Controller system schematic figure. */
  schematic?: boolean;
  display?: ModelDisplay;
  title: string;
  short: string;
  tags: string[];
  model?: { path: string; internalsPath?: string };
  /** Project-page introduction. Defaults to the homepage description. */
  lede?: string;
  intro: string;
  tech: string;
  math?: string;
  challenges: string;
  results: string | null;
  specs: Spec[];
  /** Bullet-list specification. Shown instead of specs when set. */
  specGroups?: SpecGroup[];
  timeline: { date: string; text: string }[] | null;
  images: string[] | null;
  links: ProjectLinks | null;
  diagrams?: Diagram[];
}

export interface Experience {
  id: number;
  slug: string;
  title: string;
  place: string;
  date: string;
  /** "flow" gives the page the wind-tunnel header (thermal and aero roles). */
  sim: "flow" | null;
  focus: string[];
  desc: string;
  detail: string;
}

export type SkillCategory =
  | "Product Development"
  | "Mechanical Design"
  | "Simulation"
  | "Manufacturing"
  | "Testing"
  | "Electronics & Embedded Systems"
  | "Digital Product Design";

export interface Skill {
  name: string;
  cat: SkillCategory;
}

export interface Profile {
  name: string;
  role: string;
  bio: string;
  current: string;
  location: string;
  email: string;
  linkedin: string;
  github: string;
}
