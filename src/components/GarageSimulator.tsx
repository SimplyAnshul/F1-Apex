import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Gauge, Wind, RotateCcw, Zap, Timer, ChevronDown } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────
interface SetupParams {
  tyreCompound: "soft" | "medium" | "hard" | "intermediate" | "wet";
  frontWing: number; // 1-11
  rearWing: number; // 1-11
  aeroBalance: number; // -5 to +5 (front-biased to rear-biased)
}

interface Performance {
  topSpeed: number;
  downforce: number;
  cornering: number;
  lapTime: string;
}

// ─── Tyre data ───────────────────────────────────────────────────
const TYRE_DATA = {
  soft: { label: "Soft", color: "0 100% 50%", grip: 1.0, degradation: "High", speed: -2 },
  medium: { label: "Medium", color: "45 100% 50%", grip: 0.92, degradation: "Medium", speed: 0 },
  hard: { label: "Hard", color: "0 0% 70%", grip: 0.85, degradation: "Low", speed: 2 },
  intermediate: { label: "Inter", color: "120 60% 45%", grip: 0.88, degradation: "Medium", speed: -5 },
  wet: { label: "Wet", color: "210 80% 55%", grip: 0.80, degradation: "Low", speed: -12 },
} as const;

// ─── Performance calculator ──────────────────────────────────────
const calcPerformance = (setup: SetupParams): Performance => {
  const tyre = TYRE_DATA[setup.tyreCompound];
  const avgWing = (setup.frontWing + setup.rearWing) / 2;

  // Higher wing = more downforce but less top speed
  const baseSpeed = 340;
  const topSpeed = Math.round(baseSpeed - avgWing * 3.2 + tyre.speed);
  const downforce = Math.round(30 + avgWing * 6.2);
  const cornering = Math.round(40 + avgWing * 4.5 * tyre.grip + (5 - Math.abs(setup.aeroBalance)) * 1.2);

  // Lap time
  const baseLap = 78.5;
  const wingPenalty = Math.abs(setup.frontWing - setup.rearWing) * 0.08;
  const balancePenalty = Math.abs(setup.aeroBalance) * 0.12;
  const tyreFactor = (1 - tyre.grip) * 3.5;
  const lapSeconds = baseLap + wingPenalty + balancePenalty + tyreFactor - avgWing * 0.15;
  const mins = Math.floor(lapSeconds / 60);
  const secs = (lapSeconds % 60).toFixed(3);

  return {
    topSpeed: Math.max(280, Math.min(360, topSpeed)),
    downforce: Math.max(10, Math.min(100, downforce)),
    cornering: Math.max(20, Math.min(100, cornering)),
    lapTime: `${mins}:${parseFloat(secs) < 10 ? "0" : ""}${secs}`,
  };
};

// ─── Sub-components ──────────────────────────────────────────────
const StatBar = ({ label, value, max, icon: Icon, unit }: {
  label: string; value: number; max: number; icon: typeof Gauge; unit: string;
}) => {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-3.5 h-3.5 text-primary/70" />
          <span className="font-display text-[10px] tracking-[0.15em] text-muted-foreground/70 uppercase">{label}</span>
        </div>
        <span className="font-display text-sm font-bold text-foreground">{value}<span className="text-muted-foreground/50 text-xs ml-0.5">{unit}</span></span>
      </div>
      <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, hsl(var(--primary) / 0.6), hsl(var(--primary)))`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

const SliderControl = ({ label, value, min, max, onChange, displayFn }: {
  label: string; value: number; min: number; max: number;
  onChange: (v: number) => void; displayFn?: (v: number) => string;
}) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <span className="font-display text-[10px] tracking-[0.15em] text-muted-foreground/60 uppercase">{label}</span>
      <span className="font-display text-xs font-bold text-foreground">{displayFn ? displayFn(value) : value}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={1}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-muted/30
        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
        [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary
        [&::-webkit-slider-thumb]:shadow-[0_0_10px_hsl(var(--primary)/0.5)]
        [&::-webkit-slider-thumb]:cursor-pointer"
    />
    <div className="flex justify-between text-[9px] text-muted-foreground/30 font-display">
      <span>{min}</span>
      <span>{max}</span>
    </div>
  </div>
);

// ─── Main component ──────────────────────────────────────────────
const GarageSimulator = () => {
  const [setup, setSetup] = useState<SetupParams>({
    tyreCompound: "medium",
    frontWing: 6,
    rearWing: 6,
    aeroBalance: 0,
  });

  const performance = useMemo(() => calcPerformance(setup), [setup]);

  const updateSetup = useCallback(<K extends keyof SetupParams>(key: K, value: SetupParams[K]) => {
    setSetup((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetSetup = useCallback(() => {
    setSetup({ tyreCompound: "medium", frontWing: 6, rearWing: 6, aeroBalance: 0 });
  }, []);

  return (
    <section id="garage" className="gsap-section relative py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="gsap-label font-display text-[10px] tracking-[0.5em] text-primary/70 uppercase mb-4">
            Engineering Bay
          </p>
          <h2 className="gsap-heading font-display text-3xl md:text-5xl font-black text-foreground tracking-tight">
            GARAGE <span className="text-primary text-glow">SIMULATOR</span>
          </h2>
          <p className="gsap-content mt-4 text-muted-foreground/60 max-w-lg mx-auto text-sm">
            Fine-tune your car setup and watch how each adjustment affects lap performance.
          </p>
        </div>

        <div className="gsap-content grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT — Setup controls */}
          <div className="space-y-6">
            {/* Tyre Compound */}
            <div className="glass-panel rounded-xl p-6 space-y-4">
              <h3 className="font-display text-xs tracking-[0.2em] text-muted-foreground/50 uppercase">Tyre Compound</h3>
              <div className="grid grid-cols-5 gap-2">
                {(Object.entries(TYRE_DATA) as [keyof typeof TYRE_DATA, typeof TYRE_DATA[keyof typeof TYRE_DATA]][]).map(
                  ([key, data]) => {
                    const isActive = setup.tyreCompound === key;
                    return (
                      <button
                        key={key}
                        onClick={() => updateSetup("tyreCompound", key)}
                        className={`relative flex flex-col items-center gap-1.5 py-3 px-1 rounded-lg border transition-all ${
                          isActive
                            ? "border-primary/50 bg-primary/10"
                            : "border-border/30 hover:border-border/60 bg-transparent"
                        }`}
                      >
                        {/* Tyre circle */}
                        <div
                          className="w-8 h-8 rounded-full border-[3px]"
                          style={{
                            borderColor: `hsl(${data.color})`,
                            background: isActive ? `hsl(${data.color} / 0.15)` : "transparent",
                          }}
                        />
                        <span className="font-display text-[9px] tracking-wider text-muted-foreground/70">{data.label}</span>
                      </button>
                    );
                  }
                )}
              </div>
              <div className="flex items-center gap-4 text-[10px] text-muted-foreground/40 font-display">
                <span>Grip: <strong className="text-foreground/70">{(TYRE_DATA[setup.tyreCompound].grip * 100).toFixed(0)}%</strong></span>
                <span>Degradation: <strong className="text-foreground/70">{TYRE_DATA[setup.tyreCompound].degradation}</strong></span>
              </div>
            </div>

            {/* Wing & Aero */}
            <div className="glass-panel rounded-xl p-6 space-y-5">
              <h3 className="font-display text-xs tracking-[0.2em] text-muted-foreground/50 uppercase">Aerodynamics</h3>
              <SliderControl
                label="Front Wing Angle"
                value={setup.frontWing}
                min={1}
                max={11}
                onChange={(v) => updateSetup("frontWing", v)}
                displayFn={(v) => `Level ${v}`}
              />
              <SliderControl
                label="Rear Wing Angle"
                value={setup.rearWing}
                min={1}
                max={11}
                onChange={(v) => updateSetup("rearWing", v)}
                displayFn={(v) => `Level ${v}`}
              />
              <SliderControl
                label="Aero Balance"
                value={setup.aeroBalance}
                min={-5}
                max={5}
                onChange={(v) => updateSetup("aeroBalance", v)}
                displayFn={(v) => (v < 0 ? `Front ${Math.abs(v)}` : v > 0 ? `Rear +${v}` : "Neutral")}
              />
            </div>

            <button
              onClick={resetSetup}
              className="flex items-center gap-2 font-display text-[10px] tracking-[0.2em] text-muted-foreground/40 hover:text-primary transition-colors uppercase"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset to Default
            </button>
          </div>

          {/* RIGHT — Performance readout */}
          <div className="space-y-6">
            {/* Lap time hero */}
            <div className="glass-panel rounded-xl p-8 text-center relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
              <Timer className="w-5 h-5 text-primary/50 mx-auto mb-3" />
              <p className="font-display text-[10px] tracking-[0.3em] text-muted-foreground/40 uppercase mb-2">
                Estimated Lap Time
              </p>
              <motion.p
                key={performance.lapTime}
                initial={{ scale: 0.95, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                className="font-display text-4xl md:text-5xl font-black text-foreground tracking-tight"
              >
                {performance.lapTime}
              </motion.p>
              <p className="font-display text-[9px] text-muted-foreground/30 mt-2 tracking-wider">
                BAHRAIN INTERNATIONAL CIRCUIT
              </p>
            </div>

            {/* Performance bars */}
            <div className="glass-panel rounded-xl p-6 space-y-5">
              <h3 className="font-display text-xs tracking-[0.2em] text-muted-foreground/50 uppercase">Performance</h3>
              <StatBar label="Top Speed" value={performance.topSpeed} max={370} icon={Gauge} unit="km/h" />
              <StatBar label="Downforce" value={performance.downforce} max={100} icon={Wind} unit="%" />
              <StatBar label="Cornering" value={performance.cornering} max={100} icon={Zap} unit="%" />
            </div>

            {/* Setup summary */}
            <div className="glass-panel rounded-xl p-5">
              <h3 className="font-display text-xs tracking-[0.2em] text-muted-foreground/50 uppercase mb-3">Setup Summary</h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground/50">Tyre</span>
                  <span className="font-display text-foreground/80" style={{ color: `hsl(${TYRE_DATA[setup.tyreCompound].color})` }}>
                    {TYRE_DATA[setup.tyreCompound].label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground/50">Front Wing</span>
                  <span className="font-display text-foreground/80">{setup.frontWing}/11</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground/50">Rear Wing</span>
                  <span className="font-display text-foreground/80">{setup.rearWing}/11</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground/50">Balance</span>
                  <span className="font-display text-foreground/80">
                    {setup.aeroBalance < 0 ? `F${Math.abs(setup.aeroBalance)}` : setup.aeroBalance > 0 ? `R+${setup.aeroBalance}` : "N"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GarageSimulator;
