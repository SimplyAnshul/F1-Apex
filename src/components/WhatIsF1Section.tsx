import AnimatedSection from "./AnimatedSection";

const stats = [
  { value: "200+", label: "MPH TOP SPEED" },
  { value: "1000", label: "HORSEPOWER" },
  { value: "5G", label: "CORNERING FORCE" },
  { value: "24", label: "RACES PER SEASON" },
];

const WhatIsF1Section = () => {
  return (
    <AnimatedSection id="what-is-f1" className="py-32 px-6 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <p className="gsap-label font-display text-xs tracking-[0.3em] text-primary mb-4 text-glow-sm">
          01 — INTRODUCTION
        </p>
        <h2 className="gsap-heading font-display text-3xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
          What is <span className="text-primary text-glow-sm">Formula 1</span>?
        </h2>

        <div className="gsap-content grid md:grid-cols-2 gap-16 mt-12">
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Formula 1 is the highest class of international racing for open-wheel
              single-seater formula racing cars. It is the most prestigious and
              technologically advanced motorsport in the world.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Since its inaugural season in 1950, F1 has been a crucible of innovation —
              pushing the boundaries of aerodynamics, materials science, and hybrid
              power units that shape the future of automotive engineering.
            </p>
            <div className="section-divider w-24 mt-8" />
          </div>

          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="stat-card glass-panel rounded-lg p-6 text-center"
              >
                <p className="font-display text-3xl md:text-4xl font-bold text-primary text-glow-sm">
                  {stat.value}
                </p>
                <p className="text-xs tracking-[0.15em] text-muted-foreground mt-2 font-display">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};

export default WhatIsF1Section;
