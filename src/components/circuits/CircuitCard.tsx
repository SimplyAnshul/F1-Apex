import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ruler, Clock, MapPin, Flag, RotateCcw, Gauge, X, ChevronUp } from "lucide-react";
import type { Circuit } from "@/data/circuits";

interface CircuitCardProps {
  circuit: Circuit;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}

const CircuitCard = ({ circuit, isSelected, onClick, index }: CircuitCardProps) => {
  const isCurrent = circuit.type.includes("current");
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSelected && cardRef.current) {
      setTimeout(() => {
        cardRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 150);
    }
  }, [isSelected]);

  return (
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04, ease: "easeOut" }}
      className={`rounded-xl border transition-colors duration-300 overflow-hidden ${
        isSelected
          ? "neon-border bg-card col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4"
          : "border-border/30 bg-card/80 hover:bg-card hover:border-primary/30"
      }`}
    >
      {/* Collapsed card - clickable */}
      <motion.button
        onClick={onClick}
        layout="position"
        className={`w-full text-left group ${isSelected ? "border-b border-border/30" : ""}`}
      >
        <div className="flex items-center justify-center py-5 px-4 bg-secondary/30 group-hover:bg-secondary/50 transition-colors relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
          <img
            src={circuit.trackImage}
            alt={`${circuit.name} track layout`}
            className="w-[120px] h-[120px] object-contain opacity-80 group-hover:opacity-100 transition-opacity invert dark:invert-0"
            loading="lazy"
          />
          <div className="absolute top-3 right-3">
            {isCurrent ? (
              <span className="block w-2.5 h-2.5 rounded-full bg-primary animate-pulse-glow" />
            ) : (
              <span className="block w-2.5 h-2.5 rounded-full bg-muted-foreground/40" />
            )}
          </div>
          {isSelected && (
            <div className="absolute top-3 left-3">
              <ChevronUp size={16} className="text-primary" />
            </div>
          )}
        </div>

        <div className="p-4">
          <p className="font-display text-xs font-bold tracking-wide truncate group-hover:text-primary transition-colors">
            {circuit.name}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {circuit.city}, {circuit.country}
          </p>

          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border/20">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Ruler size={10} />
              <span className="text-[10px] font-display tracking-wider">{circuit.length}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock size={10} />
              <span className="text-[10px] font-display tracking-wider">{circuit.lapRecord}</span>
            </div>
          </div>
        </div>
      </motion.button>

      {/* Expanded detail view */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="p-6 md:p-8">
              {/* Close button row */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {circuit.type.map((t) => (
                      <span
                        key={t}
                        className={`font-display text-[10px] tracking-widest px-3 py-1 rounded-full border ${
                          t === "current"
                            ? "border-primary/50 text-primary bg-primary/10"
                            : t === "street"
                            ? "border-yellow-500/50 text-yellow-400 bg-yellow-500/10"
                            : t === "historic"
                            ? "border-muted-foreground/50 text-muted-foreground bg-muted/30"
                            : "border-emerald-500/50 text-emerald-400 bg-emerald-500/10"
                        }`}
                      >
                        {t.toUpperCase()}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-display text-xl md:text-2xl font-bold leading-tight">
                    {circuit.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{circuit.officialName}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClick();
                  }}
                  className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-secondary/50 flex-shrink-0"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Track image large */}
                <motion.div
                  className="flex flex-col items-center justify-center"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
                >
                  <img
                    src={circuit.trackImage}
                    alt={`${circuit.name} track layout`}
                    className="w-full max-w-[320px] h-auto object-contain invert dark:invert-0"
                  />
                </motion.div>

                {/* Info panel */}
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
                >
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: MapPin, label: "Location", value: `${circuit.city}, ${circuit.country}` },
                      { icon: Ruler, label: "Track Length", value: circuit.length },
                      { icon: RotateCcw, label: "Laps", value: String(circuit.laps) },
                      { icon: Flag, label: "First GP", value: String(circuit.firstGP) },
                      { icon: Gauge, label: "Top Speed", value: `${circuit.topSpeed} km/h` },
                    ].map(({ icon: Icon, label, value }) => (
                      <div key={label} className="bg-secondary/50 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <Icon size={12} />
                          <span className="text-[10px] font-display tracking-wider">{label}</span>
                        </div>
                        <p className="text-sm font-semibold">{value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Lap record */}
                  <div className="neon-border rounded-lg p-4">
                    <div className="flex items-center gap-2 text-primary mb-1">
                      <Clock size={12} />
                      <span className="text-[10px] font-display tracking-wider">LAP RECORD</span>
                    </div>
                    <p className="font-display text-2xl font-bold text-primary text-glow-sm">
                      {circuit.lapRecord}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{circuit.lapRecordHolder}</p>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">{circuit.description}</p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CircuitCard;
