import AnimatedSection from "./AnimatedSection";
import evolutionImg from "@/assets/f1-evolution.jpg";

const eras = [
  { year: "1950s", title: "The Origins", desc: "Front-engined roadsters with minimal safety. Raw speed, pure courage." },
  { year: "1970s", title: "The Ground Effect", desc: "Lotus revolutionized aerodynamics. Cars became glued to the tarmac." },
  { year: "1990s", title: "The Tech Era", desc: "Active suspension, traction control, and telemetry transformed racing." },
  { year: "2020s", title: "The Hybrid Age", desc: "1000hp hybrid power units with ground-effect aerodynamics return." },
];

const EvolutionSection = () => {
  return (
    <AnimatedSection className="py-32 px-6 md:px-16 lg:px-24 relative overflow-hidden">
      {/* Parallax background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="parallax-bg absolute inset-[-20%] opacity-20">
          <img src={evolutionImg} alt="F1 car evolution" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-background/80" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <p className="gsap-label font-display text-xs tracking-[0.3em] text-primary mb-4 text-glow-sm">
          02 — HISTORY
        </p>
        <h2 className="gsap-heading font-display text-3xl md:text-5xl lg:text-6xl font-bold mb-16 leading-tight">
          Evolution of <span className="text-primary text-glow-sm">F1 Cars</span>
        </h2>

        <div className="timeline-container relative">
          {/* Timeline line - grows via GSAP */}
          <div className="timeline-line absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-primary/20 to-transparent" />

          <div className="gsap-content space-y-16">
            {eras.map((era, i) => (
              <div
                key={era.year}
                className={`timeline-item flex items-center gap-8 ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } flex-row`}
              >
                <div className={`flex-1 ${i % 2 === 0 ? "md:text-right" : "md:text-left"} text-left pl-12 md:pl-0`}>
                  <p className="font-display text-4xl md:text-5xl font-black text-primary/20">{era.year}</p>
                  <h3 className="font-display text-xl md:text-2xl font-bold mt-2">{era.title}</h3>
                  <p className="text-muted-foreground mt-2 max-w-md inline-block">{era.desc}</p>
                </div>
                <div className="relative flex-shrink-0 hidden md:block">
                  <div className="w-4 h-4 rounded-full gradient-red neon-border" />
                </div>
                <div className="flex-1 hidden md:block" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};

export default EvolutionSection;
