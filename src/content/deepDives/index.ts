import type { DeepDive } from "../caseStudyTypes";
import { cineclubDeepDive } from "./cineclub";
import { homeControllerDeepDive } from "./homeController";
import { selfBalancingRobotDeepDive } from "./selfBalancingRobot";

/** Projects with an engineering deep dive. Add a new project's file here. */
export const deepDives: Record<string, DeepDive> = {
  [homeControllerDeepDive.projectId]: homeControllerDeepDive,
  [cineclubDeepDive.projectId]: cineclubDeepDive,
  [selfBalancingRobotDeepDive.projectId]: selfBalancingRobotDeepDive,
};
