import type { Experience } from "./types";

// From Lewis's CV, 29 October 2026. Kept short on purpose.
export const experience: Experience[] = [
  { id:1, slug:"eaton", title:"Design Engineer", place:"Eaton (formerly Boyd)", date:"Jan 2025 – Aug 2026", sim:"flow",
    focus:["Cold plates","CFD","SolidWorks","DFM"],
    desc:"Designed bespoke liquid cold plates, including managing a project from initial research and design through manufacture, testing and customer delivery.",
    detail:"I designed bespoke liquid cold plates for a range of clients, using SolidWorks and CFD to optimise heat transfer, pressure drop and manufacturability. I produced manufacturing drawings with GD&T and worked directly with customers and manufacturing teams.\n\nI also managed a project from initial requirements through design, costing, procurement, prototyping, testing and delivery. The successful delivery led to repeat orders from the customer.", },
  { id:2, slug:"rosen", title:"Engineer", place:"ROSEN (UK)", date:"Sep 2023 – Dec 2024", sim:null,
    focus:["Pipeline integrity","In-Line Inspection","ASME B31G","API 579"],
    desc:"Assessed whether damaged pipelines were safe to keep running.",
    detail:"I analysed in-line inspection data to assess pipeline damage, including corrosion, metal loss, deformation and cracking. I produced fitness-for-service reports using industry standards and presented findings and recommendations directly to clients.", },
  { id:3, slug:"rolls-royce", title:"External Placement", place:"Rolls-Royce", date:"May 2022 – Jan 2023", sim:"flow",
    focus:["Heat exchangers","CFD","Design of Experiments","Additive manufacturing"],
    desc:"Developed an improved heat exchanger concept for aerospace.",
    detail:"During my eight-month placement at Rolls-Royce, I worked on optimising liquid-cooled cold plates using computational fluid dynamics (CFD) and design of experiments. I investigated different cooling-channel geometries to improve thermal performance while considering pressure drop and manufacturing constraints. The final design achieved improved performance compared with previous designs.", },
  { id:4, slug:"formula-student", title:"Formula Student", place:"University of Glasgow", date:"Sep 2021 – 2023", sim:"flow",
    focus:["Aerodynamics","CFD","PID control","Kalman filters","ROS 2"],
    desc:"Aerodynamics for the internal-combustion car and motion control for the electric driverless car.",
    detail:"I worked on the Aerodynamics team for the internal-combustion Formula Student car, using computational fluid dynamics (CFD) to evaluate and improve designs through individual component and full-car simulations.\n\nI also worked on the Motion and Control team for the electric driverless car, helping improve its control system, including implementing an Extended Kalman Filter.", },
];
