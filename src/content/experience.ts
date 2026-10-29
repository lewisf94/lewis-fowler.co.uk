import type { Experience } from "./types";

// Copied unchanged from the previous site. The content refresh replaces this text.
export const experience: Experience[] = [
  { id:1, slug:"boyd", title:"Design Engineer", place:"Boyd", date:"Jan 2025 – Present", sim:"flow",
    focus:["Cold Plates","Thermal Management","CFD Analysis","3D CAD","DFM"],
    desc:"Designing bespoke cold plate solutions for thermal management in automotive and space sectors. Managing projects from concept to delivery via 3D CAD, CFD analysis, and DFM.",
    detail:"At Boyd I design bespoke liquid cold plates and thermal-management assemblies for demanding automotive and aerospace applications. The work runs the full cycle: translating a customer's heat load and packaging constraints into a 3D CAD design, validating it with CFD to predict flow distribution and thermal resistance, then iterating toward a manufacturable part with DFM front of mind. It sits right at the intersection of fluid dynamics, mechanical design, and real-world production.",
    highlights:["Liquid cold-plate & thermal assembly design","CFD-driven validation of flow and thermal resistance","Ownership from concept through DFM to delivery"] },
  { id:2, slug:"rosen", title:"Data Engineer", place:"ROSEN (UK)", date:"Sep 2023 – Dec 2024", sim:null,
    focus:["In-Line Inspection","Technical Reporting","Engineering Calculations","Industry Standards"],
    desc:"Authored technical reports and analysed In-Line Inspection data. Liaised with engineering disciplines on technical calculations and industry standards.",
    detail:"At ROSEN I worked with In-Line Inspection data from pipeline-integrity runs — authoring technical reports and supporting engineering calculations against industry standards. It sharpened my data-analysis instincts and taught me how much rigour sits behind a single reported figure.",
    highlights:["In-Line Inspection data analysis","Technical report authoring","Cross-discipline engineering calculations"] },
  { id:3, slug:"rolls-royce", title:"External Placement", place:"Rolls-Royce", date:"May 2022 – Jan 2023", sim:"flow",
    focus:["Heat Exchangers","Aircraft Systems","Risk Assessment","Technical Presentations"],
    desc:"Designed novel high-performance heat exchangers to improve aircraft system efficiency. Conducted risk assessments and delivered regular technical presentations.",
    detail:"During my placement year at Rolls-Royce I worked on novel high-performance heat exchangers aimed at improving aircraft system efficiency. Alongside the design work I carried out risk assessments and presented progress regularly to senior engineers — an early lesson in communicating technical trade-offs clearly to a room.",
    highlights:["Novel high-performance heat-exchanger design","Risk assessment & compliance","Regular technical presentations to senior engineers"] },
  { id:4, slug:"glasgow", title:"MEng Mechanical Engineering", place:"University of Glasgow", date:"2018 – 2023", sim:"flow",
    focus:["Formula Student","Aerodynamics (CFD)","Control Systems","Heat Exchanger Design"],
    desc:"Formula Student: Aerodynamics (CFD) & Control Teams. Final year project at Rolls-Royce designing high-performance heat exchangers.",
    detail:"My MEng at Glasgow is where the mechatronics bug bit. On Formula Student I split time between the Aerodynamics team — running CFD to shape bodywork and manage downforce — and the Control team on the systems side. My final-year project, carried out with Rolls-Royce, focused on high-performance heat-exchanger design.",
    highlights:["Formula Student — Aerodynamics (CFD)","Formula Student — Control systems","MEng · final-year Rolls-Royce heat-exchanger project"] },
];
