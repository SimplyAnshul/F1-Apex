import { useState } from "react";
import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import carImg from "@/assets/f1-car-top.jpg";

const parts = [
  { id: "engine", label: "Power Unit", x: 50, y: 55, detail: "1.6L V6 Turbo Hybrid producing 1000+ BHP. Energy Recovery Systems harvest kinetic and heat energy." },
  { id: "wing-front", label: "Front Wing", x: 50, y: 90, detail: "Generates 30% of total downforce. Complex multi-element design with endplates to manage airflow." },
  { id: "wing-rear", label: "Rear Wing", x: 50, y: 12, detail: "Adjustable via DRS for overtaking. Creates massive downforce at the cost of drag." },
  { id: "tires", label: "Pirelli Tires", x: 15, y: 25, detail: "Five compounds from C1 (hardest) to C5 (softest). Teams must use at least two different compounds per race." },
  { id: "halo", label: "Halo Device", x: 50, y: 42, detail: "Titanium safety structure protecting the driver's head. Can withstand the weight of a London double-decker bus." },
];

const CarViewerSection = () => {
  const [activePart, setActivePart] = useState<string | null>(null);
  const selectedPart = parts.find((p) => p.id === activePart);

  return (
    <AnimatedSection className="car-viewer-section py-32 px-6 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <p className="gsap-label font-display text-xs tracking-[0.3em] text-primary mb-4 text-glow-sm">
          05 — TECHNOLOGY
        </p>
        <h2 className="gsap-heading font-display text-3xl md:text-5xl lg:text-6xl font-bold mb-16 leading-tight">
          Interactive <span className="text-primary text-glow-sm">Car Viewer</span>
        </h2>

        <div className="gsap-content grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-1 flex lg:flex-col gap-2">
            {parts.map((part) => (
              <button
                key={part.id}
                onClick={() => setActivePart(activePart === part.id ? null : part.id)}
                className={`text-left px-4 py-3 rounded-lg font-display text-xs tracking-wider transition-all duration-300 ${
                  activePart === part.id ? "neon-border bg-secondary" : "border border-border/30 bg-card/50 hover:border-primary/30"
                }`}
              >
                {part.label}
              </button>
            ))}
          </div>

          <div className="lg:col-span-3 relative">
            <div className="glass-panel rounded-2xl p-4 relative overflow-hidden">
              <img src={carImg} alt="F1 car top view" className="car-viewer-img w-full rounded-xl will-change-transform" />
              {parts.map((part) => (
                <motion.button
                  key={part.id}
                  onClick={() => setActivePart(activePart === part.id ? null : part.id)}
                  className={`absolute w-5 h-5 rounded-full transition-all duration-300 ${
                    activePart === part.id ? "scale-150" : "animate-pulse-glow"
                  }`}
                  style={{ left: `${part.x}%`, top: `${part.y}%`, transform: "translate(-50%, -50%)" }}
                  whileHover={{ scale: 1.5 }}
                >
                  <span className="block w-full h-full rounded-full gradient-red neon-border" />
                </motion.button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1 flex items-center">
            {selectedPart ? (
              <motion.div
                key={selectedPart.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-panel rounded-xl p-6"
              >
                <h3 className="font-display text-lg font-bold text-primary text-glow-sm">{selectedPart.label}</h3>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{selectedPart.detail}</p>
              </motion.div>
            ) : (
              <p className="text-sm text-muted-foreground font-display tracking-wide">← Select a component to explore</p>
            )}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};

export default CarViewerSection;
