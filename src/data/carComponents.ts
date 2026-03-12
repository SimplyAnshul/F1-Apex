// Component data for the F1 car engineering viewer
export interface CarComponent {
  id: string;
  name: string;
  category: "aero" | "chassis" | "powertrain" | "suspension";
  description: string;
  specs: string[];
  color: string; // HSL
  highlightColor: string;
  // Position offsets for geometry
  position: [number, number, number];
  // Exploded view offset
  explodedOffset: [number, number, number];
}

export const CAR_COMPONENTS: CarComponent[] = [
  {
    id: "front-wing",
    name: "Front Wing",
    category: "aero",
    description:
      "The front wing is the first aerodynamic element to interact with airflow. It generates approximately 30% of the car's total downforce and directs airflow around the front tyres.",
    specs: [
      "Width: 2000mm (regulated)",
      "Generates ~30% total downforce",
      "Multiple element design with endplates",
      "Adjustable flap angle for balance tuning",
    ],
    color: "0 80% 45%",
    highlightColor: "0 100% 55%",
    position: [0, -0.15, 2.4],
    explodedOffset: [0, 0.5, 1.5],
  },
  {
    id: "rear-wing",
    name: "Rear Wing",
    category: "aero",
    description:
      "The rear wing provides significant downforce at the cost of drag. It features a DRS (Drag Reduction System) flap that opens on straights to reduce drag by approximately 10-15%.",
    specs: [
      "DRS activation above 1 second gap",
      "Generates ~35% total downforce",
      "Main plane + adjustable flap",
      "Endplate vortex generators",
    ],
    color: "0 80% 45%",
    highlightColor: "0 100% 55%",
    position: [0, 0.7, -2.5],
    explodedOffset: [0, 1.2, -1.5],
  },
  {
    id: "halo",
    name: "Halo",
    category: "chassis",
    description:
      "The titanium halo device protects the driver's head from large debris and impacts. It can withstand a force equivalent to the weight of a London double-decker bus (12 tonnes).",
    specs: [
      "Grade 5 titanium construction",
      "Withstands 12 tonnes of force",
      "Weight: ~9 kg",
      "Mandatory since 2018 season",
    ],
    color: "220 10% 50%",
    highlightColor: "220 30% 65%",
    position: [0, 0.55, 0.6],
    explodedOffset: [0, 1.5, 0],
  },
  {
    id: "sidepods",
    name: "Sidepods",
    category: "aero",
    description:
      "Sidepods house the radiators for engine and ERS cooling. Their shape is critical for managing airflow to the rear of the car and generating the 'undercut' venturi effect.",
    specs: [
      "Houses engine & ERS radiators",
      "Zero-pod designs (2022+ regulations)",
      "Internal flow management baffles",
      "Cooling inlet sizing varies per circuit",
    ],
    color: "0 70% 40%",
    highlightColor: "0 100% 55%",
    position: [0, 0.1, -0.2],
    explodedOffset: [1.8, 0.3, 0],
  },
  {
    id: "diffuser",
    name: "Diffuser",
    category: "aero",
    description:
      "The rear diffuser accelerates airflow exiting from under the car, creating a low-pressure zone that generates massive downforce with minimal drag penalty — the most efficient aero device.",
    specs: [
      "Generates ground effect downforce",
      "Venturi tunnel design",
      "Regulated height & expansion ratio",
      "Works with floor edge wing elements",
    ],
    color: "30 60% 40%",
    highlightColor: "30 100% 55%",
    position: [0, -0.35, -2.2],
    explodedOffset: [0, -1.0, -1.2],
  },
  {
    id: "floor",
    name: "Floor",
    category: "aero",
    description:
      "The floor is the largest and most important aerodynamic surface. Since 2022, ground effect tunnels carved into the floor generate the majority of the car's downforce.",
    specs: [
      "Ground effect venturi tunnels",
      "Generates ~50% total downforce",
      "Flexible floor edge regulations",
      "Plank wear limit: 1mm per race",
    ],
    color: "200 20% 35%",
    highlightColor: "200 60% 55%",
    position: [0, -0.4, 0],
    explodedOffset: [0, -1.5, 0],
  },
  {
    id: "suspension",
    name: "Suspension",
    category: "suspension",
    description:
      "F1 suspension uses push-rod (front) and pull-rod (rear) configurations with torsion bars and inerters. It manages ride height, pitch sensitivity, and tyre contact patch optimization.",
    specs: [
      "Push-rod front / Pull-rod rear",
      "Carbon fibre wishbones",
      "Heave spring & inerter dampers",
      "Active suspension banned (since 1994)",
    ],
    color: "45 70% 45%",
    highlightColor: "45 100% 60%",
    position: [0, -0.2, 1.4],
    explodedOffset: [1.5, -0.5, 0.5],
  },
  {
    id: "tyres",
    name: "Tyres",
    category: "suspension",
    description:
      "Pirelli supplies five dry-weather compounds (C1-C5) plus intermediates and full wets. Tyre management is one of the most critical strategic elements in modern F1.",
    specs: [
      "18-inch wheel diameter (since 2022)",
      "Operating window: 80-110°C",
      "5 dry compounds (C1 hardest–C5 softest)",
      "Tyre blanket pre-heat: 70°C",
    ],
    color: "0 0% 25%",
    highlightColor: "0 0% 50%",
    position: [0, -0.35, 1.6],
    explodedOffset: [2.0, -0.3, 1.0],
  },
  {
    id: "engine",
    name: "Power Unit",
    category: "powertrain",
    description:
      "The 1.6L V6 turbo-hybrid power unit produces over 1000 bhp combined. It consists of the ICE, turbocharger, MGU-K (kinetic), and MGU-H (heat) energy recovery systems.",
    specs: [
      "1.6L V6 turbo-hybrid",
      "RPM limit: 15,000",
      "Combined output: ~1000+ bhp",
      "Thermal efficiency: >50%",
    ],
    color: "120 50% 35%",
    highlightColor: "120 80% 50%",
    position: [0, 0.05, -0.8],
    explodedOffset: [0, 0.8, -0.5],
  },
  {
    id: "ers",
    name: "ERS System",
    category: "powertrain",
    description:
      "The Energy Recovery System harvests kinetic energy (MGU-K) under braking and thermal energy (MGU-H) from exhaust gases, storing it in a battery for deployment — adding ~160 bhp.",
    specs: [
      "MGU-K: 120kW (161 bhp) max",
      "Battery capacity: 4 MJ per lap",
      "MGU-H: unlimited energy harvest",
      "Deployment via steering wheel controls",
    ],
    color: "280 60% 45%",
    highlightColor: "280 80% 60%",
    position: [0, -0.1, -1.2],
    explodedOffset: [-1.5, 0.5, -0.8],
  },
];

export const CATEGORIES = [
  { id: "all", label: "All Systems", color: "0 0% 70%" },
  { id: "aero", label: "Aerodynamics", color: "0 100% 50%" },
  { id: "chassis", label: "Chassis", color: "220 30% 65%" },
  { id: "powertrain", label: "Powertrain", color: "120 80% 50%" },
  { id: "suspension", label: "Suspension", color: "45 100% 60%" },
] as const;
