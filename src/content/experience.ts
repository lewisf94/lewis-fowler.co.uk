import type { Experience } from "./types";

// From Lewis's CV, 29 October 2026. Kept short on purpose.
export const experience: Experience[] = [
  { id:1, slug:"eaton", title:"Design Engineer", place:"Eaton (formerly Boyd)", date:"Jan 2025 – Aug 2026", sim:"flow",
    focus:["Cold plates","CFD","SolidWorks","DFM"],
    desc:"Designed liquid cold plates for cars and high-performance cooling, from concept to tested prototype.",
    detail:"I designed bespoke liquid cold plates and owned each one from concept to tested prototype. I used CFD to balance cooling against pressure drop, and worked directly with customers and machinists.",
    highlights:[
      "Owned designs from concept through testing to manufacturing release",
      "Made parts quicker to machine by removing operations and set-ups",
      "Led design reviews with customers",
    ] },
  { id:2, slug:"rosen", title:"Engineer", place:"ROSEN (UK)", date:"Sep 2023 – Dec 2024", sim:null,
    focus:["Pipeline integrity","In-Line Inspection","ASME B31G","API 579"],
    desc:"Assessed whether damaged pipelines were safe to keep running.",
    detail:"I assessed pipeline damage from inspection data against ASME B31G and API 579, and recommended repairs to operators around the world.",
    highlights:[
      "Fitness-for-service assessments for operators worldwide",
      "Repair and monitoring recommendations",
    ] },
  { id:3, slug:"rolls-royce", title:"External Placement", place:"Rolls-Royce", date:"May 2022 – Jan 2023", sim:"flow",
    focus:["Heat exchangers","CFD","Design of Experiments","Additive manufacturing"],
    desc:"Developed an improved heat exchanger concept for aerospace.",
    detail:"I developed an improved heat exchanger concept for aerospace, using CFD and a Design of Experiments to find the best geometry. I proposed metal 3D printing to make it.",
    highlights:[
      "CFD optimisation within tight mass and volume limits",
      "Proposed metal 3D printing as the manufacturing route",
    ] },
  { id:4, slug:"formula-student", title:"Formula Student", place:"University of Glasgow", date:"Sep 2021 – 2023", sim:"flow",
    focus:["Aerodynamics","CFD","PID control","Kalman filters","ROS 2"],
    desc:"Aerodynamics and control for an electric, driverless race car.",
    detail:"I worked on the aerodynamics and the control system of an electric, driverless race car. This is where I started with ROS 2.",
    highlights:[
      "CFD for aerodynamic development",
      "PID control and Extended Kalman Filters",
    ] },
];
