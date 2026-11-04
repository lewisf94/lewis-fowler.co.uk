/**
 * Content types for the engineering deep dives and the build guides.
 *
 * Both are made of the same small "blocks", so a new project can reuse the
 * renderer and choose only the blocks it needs. Nothing here forces every
 * project into the same sections.
 */

/** Where a piece of work stands. Shown as a small badge. */
export type WorkStatus = "done" | "current" | "planned";

/** One image. `src` must be a real file under public/ (the build checks this). */
export interface CaseImage {
  src: string;
  /** Short description for screen readers. */
  alt: string;
  /** What the image shows and why it matters. Shown under the image. */
  caption: string;
  /** Diagrams and drawings get a white backing so dark lines stay visible. */
  diagram?: boolean;
  /** Phone screenshots are shown whole, with rounded iPhone-style corners. */
  phone?: boolean;
}

/** One downloadable file. `href` must be a real file under public/ or a full URL. */
export interface DownloadFile {
  label: string;
  href: string;
  /** For example "v1.0" or a commit. Required for release files. */
  version?: string;
  note?: string;
}

/** One row of a bill of materials. Only list what is confirmed. */
export interface BomItem {
  part: string;
  partNumber?: string;
  qty: number | string;
  purpose?: string;
  supplier?: { label: string; href: string };
  alternatives?: string;
}

export type Block =
  | { kind: "text"; heading?: string; text: string }
  | { kind: "list"; heading?: string; items: string[] }
  /** Numbered steps, each with optional images. */
  | { kind: "steps"; heading?: string; items: { text: string; images?: CaseImage[] }[] }
  /** A choice that was made, with the reason, and what else was considered. */
  | { kind: "decisions"; heading?: string; items: { choice: string; reason: string; alternatives?: string }[] }
  /** Something that went wrong and what was done about it. */
  | { kind: "problems"; heading?: string; items: { problem: string; fix: string }[] }
  | { kind: "checklist"; heading?: string; items: { text: string; status: WorkStatus }[] }
  | { kind: "table"; heading?: string; head: string[]; rows: string[][] }
  | { kind: "gallery"; images: CaseImage[] }
  | { kind: "warning"; heading: string; items: string[] }
  | { kind: "bom"; heading?: string; items: BomItem[]; /** File name for the CSV download. */ csvName: string }
  | { kind: "downloads"; heading?: string; files: DownloadFile[] }
  | { kind: "code"; text: string };

/** One stage of the development story, in date order. */
export interface Stage {
  id: string;
  /** Short mono label, such as "Research". */
  label: string;
  title: string;
  /** Free text, for example "Jun 2026" or "2025 to 2026". Leave out if unknown. */
  when?: string;
  status: WorkStatus;
  blocks: Block[];
}

export interface DeepDive {
  /** Heading for Part 2. Defaults to "Engineering deep dive". */
  title?: string;
  projectId: string;
  /** One or two sentences under the "Engineering deep dive" heading. */
  intro: string;
  stages: Stage[];
}

/** One numbered section of a build guide. */
export interface GuideSection {
  id: string;
  title: string;
  /** "missing" sections show a notice in draft preview and block publishing. */
  status: "ready" | "missing";
  blocks: Block[];
}

export interface Guide {
  /** Used in the URL: #build/<id> */
  id: string;
  projectId: string;
  title: string;
  /** The exact hardware revision this guide is for. */
  hardwareVersion: string;
  /** True only when every step was tested on this revision. */
  verified: boolean;
  /** False keeps the guide out of the public site. Lewis must approve. */
  published: boolean;
  /** Short summary of what is still needed before publishing. */
  draftNotes?: string[];
  sections: GuideSection[];
}
