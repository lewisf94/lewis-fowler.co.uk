import type { Guide } from "../caseStudyTypes";
import { homeControllerCydGuide } from "./homeControllerCyd";
import { homeControllerP4Guide } from "./homeControllerP4";

/*
 * How guides are published
 *
 * PUBLISHED: guides Lewis has approved. They appear on the live site and their
 * project page shows a "Build it yourself" link. Each must have published: true.
 *
 * DRAFTS: only shown by `npm run dev` (draft preview). The production build
 * leaves them out completely, so their pages and text are not on the live site.
 *
 * To publish a guide after approval: set published: true and move it from
 * DRAFTS to PUBLISHED.
 */
const PUBLISHED: Guide[] = [];

const DRAFTS: Guide[] = import.meta.env.DEV ? [homeControllerCydGuide, homeControllerP4Guide] : [];

export const guides: Guide[] = [...PUBLISHED.filter((g) => g.published), ...DRAFTS];

export const isDraftPreview = import.meta.env.DEV;

export const guidesFor = (projectId: string) => guides.filter((g) => g.projectId === projectId);
