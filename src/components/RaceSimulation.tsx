import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";

interface DriverState {
  name: string;
  color: string;
  position: number;
  speed: number;
  lap: number;
}

const initialDrivers: DriverState[] = [
  { name: "VER", color: "hsl(220, 80%, 55%)", position: 0, speed: 0, lap: 0 },
  { name: "HAM", color: "hsl(170, 60%, 45%)", position: 0, speed: 0, lap: 0 },
  { name: "LEC", color: "hsl(0, 100%, 50%)", position: 0, speed: 0, lap: 0 },
  { name: "NOR", color: "hsl(25, 100%, 50%)", position: 0, speed: 0, lap: 0 },
  { name: "ALO", color: "hsl(150, 80%, 40%)", position: 0, speed: 0, lap: 0 },
];

const TOTAL_LAPS = 5;
const TRACK_LENGTH = 100;

const RaceSimulation = () => {
  const [drivers, setDrivers] = useState<DriverState[]>(initialDrivers);
  const [racing, setRacing] = useState(false);
  const [finished, setFinished] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const startRace = () => {
    setDrivers(initialDrivers.map((d) => ({ ...d, position: 0, speed: 0, lap: 0 })));
    setFinished(false);
    setRacing(true);
  };

  useEffect(() => {
    if (!racing) return;
    intervalRef.current = window.setInterval(() => {
      setDrivers((prev) => {
        const updated = prev.map((d) => {
          if (d.lap >= TOTAL_LAPS) return d;
          const accel = 0.8 + Math.random() * 1.2;
          const newSpeed = Math.min(d.speed + accel, 3 + Math.random() * 2);
          let newPos = d.position + newSpeed;
          let newLap = d.lap;
          if (newPos >= TRACK_LENGTH) { newPos -= TRACK_LENGTH; newLap++; }
          return { ...d, position: newPos, speed: newSpeed, lap: newLap };
        });
        if (updated.every((d) => d.lap >= TOTAL_LAPS)) { setRacing(false); setFinished(true); }
        return updated;
      });
    }, 50);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [racing]);

  const sorted = [...drivers].sort((a, b) => b.lap !== a.lap ? b.lap - a.lap : b.position - a.position);

  return (
    <AnimatedSection className="py-32 px-6 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <p className="gsap-label font-display text-xs tracking-[0.3em] text-primary mb-4 text-glow-sm">
          06 — SIMULATION
        </p>
        <h2 className="gsap-heading font-display text-3xl md:text-5xl lg:text-6xl font-bold mb-16 leading-tight">
          Race <span className="text-primary text-glow-sm">Simulation</span>
        </h2>

        <div className="gsap-content">
          <div className="glass-panel rounded-2xl p-6 md:p-10 mb-8">
            <div className="space-y-6">
              {drivers.map((driver) => (
                <div key={driver.name} className="flex items-center gap-4">
                  <span className="font-display text-sm font-bold w-12" style={{ color: driver.color }}>{driver.name}</span>
                  <div className="flex-1 relative h-8 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      className="absolute top-0 left-0 h-full rounded-full flex items-center justify-end pr-2"
                      style={{ backgroundColor: driver.color }}
                      animate={{ width: `${(driver.position / TRACK_LENGTH) * 100}%` }}
                      transition={{ duration: 0.05, ease: "linear" }}
                    >
                      <span className="text-[10px] font-display font-bold text-primary-foreground">
                        L{Math.min(driver.lap + 1, TOTAL_LAPS)}/{TOTAL_LAPS}
                      </span>
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={startRace}
              disabled={racing}
              className={`font-display text-sm tracking-widest px-8 py-4 rounded-lg transition-all duration-300 ${
                racing ? "bg-muted text-muted-foreground cursor-not-allowed" : "gradient-red neon-border text-primary-foreground hover:scale-105"
              }`}
            >
              {racing ? "RACING..." : finished ? "RESTART" : "START RACE"}
            </button>

            {finished && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-4">
                <span className="font-display text-sm text-muted-foreground">RESULTS:</span>
                {sorted.slice(0, 3).map((d, i) => (
                  <span key={d.name} className="font-display text-sm font-bold" style={{ color: d.color }}>P{i + 1} {d.name}</span>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};

export default RaceSimulation;
