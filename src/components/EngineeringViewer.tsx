import { useState, useCallback, useMemo, Suspense, lazy } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import { X, Expand, RotateCcw, Layers, ChevronRight, Cpu, Wind, Cog, CircleDot } from "lucide-react";
import { CAR_COMPONENTS, CATEGORIES, type CarComponent } from "@/data/carComponents";
import F1CarModel from "@/components/3d/F1CarModel";

const CATEGORY_ICONS: Record<string, typeof Cpu> = {
  aero: Wind,
  chassis: Layers,
  powertrain: Cpu,
  suspension: Cog,
};

const EngineeringViewer = () => {
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  const [isExploded, setIsExploded] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const componentMap = useMemo(() => {
    const map: Record<string, CarComponent & { color: string; highlightColor: string; position: [number, number, number]; explodedOffset: [number, number, number] }> = {};
    CAR_COMPONENTS.forEach((c) => { map[c.id] = c; });
    return map;
  }, []);

  const filteredComponents = useMemo(() =>
    activeCategory === "all"
      ? CAR_COMPONENTS
      : CAR_COMPONENTS.filter((c) => c.category === activeCategory),
    [activeCategory]
  );

  const selectedComponent = useMemo(() =>
    selectedPart ? componentMap[selectedPart] : null,
    [selectedPart, componentMap]
  );

  const handlePartClick = useCallback((id: string) => {
    setSelectedPart((prev) => (prev === id ? null : id));
  }, []);

  const handlePartHover = useCallback((id: string) => setHoveredPart(id), []);
  const handlePartLeave = useCallback(() => setHoveredPart(null), []);

  return (
    <section id="engineering" className="gsap-section relative py-24 md:py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="gsap-label font-display text-[10px] tracking-[0.5em] text-primary/70 uppercase mb-4">
            Technical Analysis
          </p>
          <h2 className="gsap-heading font-display text-3xl md:text-5xl font-black text-foreground tracking-tight">
            ENGINEERING <span className="text-primary text-glow">INSPECTION</span>
          </h2>
          <p className="gsap-content mt-4 text-muted-foreground/60 max-w-lg mx-auto text-sm">
            Click any component to explore the engineering behind a modern Formula 1 car.
          </p>
        </div>

        <div className="gsap-content grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          {/* 3D Viewport */}
          <div className="relative rounded-xl border border-border/30 overflow-hidden bg-background/60 backdrop-blur-sm" style={{ minHeight: "500px" }}>
            {/* Toolbar */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
              <button
                onClick={() => setIsExploded(!isExploded)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-display tracking-wider transition-all ${
                  isExploded
                    ? "border-primary/50 bg-primary/10 text-primary"
                    : "border-border/30 bg-background/60 text-muted-foreground/60 hover:text-foreground"
                }`}
              >
                <Expand className="w-3.5 h-3.5" />
                EXPLODED
              </button>
              {selectedPart && (
                <button
                  onClick={() => setSelectedPart(null)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border/30 bg-background/60 text-muted-foreground/60 hover:text-foreground text-xs font-display tracking-wider transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  RESET
                </button>
              )}
            </div>

            {/* Category filter chips */}
            <div className="absolute top-4 right-4 z-10 flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-md text-[9px] font-display tracking-wider uppercase transition-all border ${
                    activeCategory === cat.id
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-border/20 text-muted-foreground/40 hover:text-muted-foreground/70"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Hovered part label */}
            <AnimatePresence>
              {hoveredPart && !selectedPart && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 px-4 py-2 rounded-lg border border-primary/30 bg-background/80 backdrop-blur-sm"
                >
                  <span className="font-display text-xs tracking-wider text-primary">
                    {componentMap[hoveredPart]?.name}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Canvas */}
            <Canvas
              camera={{ position: [4, 3, 5], fov: 45 }}
              shadows
              dpr={[1, 1.5]}
              gl={{ antialias: true, alpha: true }}
            >
              <ambientLight intensity={0.3} />
              <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
              <directionalLight position={[-3, 5, -5]} intensity={0.4} color="hsl(0 100% 70%)" />
              <pointLight position={[0, 2, 0]} intensity={0.5} color="hsl(0 100% 50%)" />

              <Suspense fallback={null}>
                <F1CarModel
                  selectedPart={selectedPart}
                  hoveredPart={hoveredPart}
                  isExploded={isExploded}
                  onPartClick={handlePartClick}
                  onPartHover={handlePartHover}
                  onPartLeave={handlePartLeave}
                  componentData={componentMap}
                />
                <ContactShadows position={[0, -0.5, 0]} opacity={0.4} scale={12} blur={2.5} />
              </Suspense>

              <OrbitControls
                enablePan={false}
                minDistance={3}
                maxDistance={12}
                minPolarAngle={0.3}
                maxPolarAngle={Math.PI / 2 - 0.1}
                autoRotate={!selectedPart}
                autoRotateSpeed={0.5}
              />
            </Canvas>
          </div>

          {/* Side Panel */}
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
            {/* Component list */}
            {filteredComponents.map((comp) => {
              const isActive = selectedPart === comp.id;
              const isHovered = hoveredPart === comp.id;
              const IconComp = CATEGORY_ICONS[comp.category] || CircleDot;

              return (
                <motion.button
                  key={comp.id}
                  onClick={() => handlePartClick(comp.id)}
                  onMouseEnter={() => setHoveredPart(comp.id)}
                  onMouseLeave={() => setHoveredPart(null)}
                  className={`w-full text-left rounded-lg border p-3 transition-all ${
                    isActive
                      ? "border-primary/50 bg-primary/5"
                      : isHovered
                        ? "border-border/50 bg-muted/10"
                        : "border-border/20 bg-transparent hover:border-border/40"
                  }`}
                  layout
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-md flex items-center justify-center border"
                      style={{
                        borderColor: `hsl(${comp.highlightColor} / ${isActive ? 0.6 : 0.2})`,
                        background: `hsl(${comp.highlightColor} / ${isActive ? 0.15 : 0.05})`,
                      }}
                    >
                      <IconComp className="w-3.5 h-3.5" style={{ color: `hsl(${comp.highlightColor})` }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-xs tracking-wider text-foreground/90">{comp.name}</p>
                      <p className="text-[10px] text-muted-foreground/40 capitalize">{comp.category}</p>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 text-muted-foreground/30 transition-transform ${isActive ? "rotate-90 text-primary" : ""}`} />
                  </div>

                  {/* Expanded detail */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-3 mt-3 border-t border-border/20 space-y-3">
                          <p className="text-xs text-muted-foreground/70 leading-relaxed">
                            {comp.description}
                          </p>
                          <div className="space-y-1.5">
                            {comp.specs.map((spec, i) => (
                              <div key={i} className="flex items-start gap-2">
                                <div
                                  className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0"
                                  style={{ background: `hsl(${comp.highlightColor})` }}
                                />
                                <span className="text-[11px] text-muted-foreground/60">{spec}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EngineeringViewer;
