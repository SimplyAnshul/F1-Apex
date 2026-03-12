import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import { circuits, circuitFilters, type Circuit, type CircuitFilter } from "@/data/circuits";
import CircuitCard from "./circuits/CircuitCard";

const CircuitsSection = () => {
  const [selectedCircuit, setSelectedCircuit] = useState<Circuit | null>(null);
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<Set<CircuitFilter>>(new Set());

  const toggleFilter = useCallback((f: CircuitFilter) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(f)) next.delete(f);
      else next.add(f);
      return next;
    });
  }, []);

  const filteredCircuits = useMemo(() => {
    let result = circuits;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.country.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q) ||
          c.officialName.toLowerCase().includes(q)
      );
    }
    if (activeFilters.size > 0) {
      result = result.filter((c) =>
        Array.from(activeFilters).some((f) => c.type.includes(f))
      );
    }
    return result;
  }, [search, activeFilters]);

  const handleSelect = useCallback((circuit: Circuit) => {
    setSelectedCircuit((prev) => (prev?.id === circuit.id ? null : circuit));
  }, []);

  const handleClose = useCallback(() => {
    setSelectedCircuit(null);
  }, []);

  return (
    <AnimatedSection className="py-32 px-6 md:px-16 lg:px-24 relative" id="circuits">
      <div className="max-w-7xl mx-auto relative z-10">
        <p className="gsap-label font-display text-xs tracking-[0.3em] text-primary mb-4 text-glow-sm">
          04 — CIRCUITS
        </p>
        <h2 className="gsap-heading font-display text-3xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
          Circuit <span className="text-primary text-glow-sm">Explorer</span>
        </h2>

        <div className="gsap-content">
          {/* Search + Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search circuits by name, country, or city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-secondary/50 border border-border/50 rounded-lg pl-11 pr-4 py-3 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all font-body"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {circuitFilters.map((f) => (
                <button
                  key={f.id}
                  onClick={() => toggleFilter(f.id)}
                  className={`font-display text-[10px] tracking-widest px-4 py-3 rounded-lg border transition-all duration-300 ${
                    activeFilters.has(f.id)
                      ? "neon-border bg-primary/10 text-primary"
                      : "border-border/50 bg-card/50 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                  }`}
                >
                  {f.label.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Results count */}
          <p className="text-xs text-muted-foreground mb-6 font-display tracking-wider">
            {filteredCircuits.length} CIRCUIT{filteredCircuits.length !== 1 ? "S" : ""} FOUND
          </p>

          {/* Circuit cards grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCircuits.map((circuit, i) => (
              <CircuitCard
                key={circuit.id}
                circuit={circuit}
                isSelected={selectedCircuit?.id === circuit.id}
                onClick={() => handleSelect(circuit)}
                index={i}
              />
            ))}
          </div>

          {filteredCircuits.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground font-display text-sm tracking-wider">
                NO CIRCUITS MATCH YOUR SEARCH
              </p>
            </div>
          )}
        </div>
      </div>
    </AnimatedSection>
  );
};

export default CircuitsSection;
