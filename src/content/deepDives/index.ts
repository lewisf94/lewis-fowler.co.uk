import type { DeepDive } from "../caseStudyTypes";
import { homeControllerDeepDive } from "./homeController";

/** Projects with an engineering deep dive. Add a new project's file here. */
export const deepDives: Record<string, DeepDive> = {
  [homeControllerDeepDive.projectId]: homeControllerDeepDive,
};
