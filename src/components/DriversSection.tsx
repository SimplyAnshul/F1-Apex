import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Flag, Gauge, Timer, Hash, MapPin } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import { legendaryDrivers, type Driver } from "@/data/drivers";

type Era = "all" | "golden" | "modern" | "current";

const eraLabels: { id: Era; label: string }[] = [
  { id: "all", label: "ALL ERAS" },
  { id: "golden", label: "GOLDEN ERA" },
  { id: "modern", label: "MODERN ERA" },
  { id: "current", label: "CURRENT" },
];

const StatBar = ({ label, value, max, delay }: { label: string; value: number; max: number; delay: number }) => (
  <div className="space-y-1">
    <div className="flex justify-between items-center">
      <span className="text-[10px] font-display tracking-wider text-muted-foreground">{label}</span>
      <span className="text-xs font-display font-bold">{value}</span>
    </div>
    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
      <motion.div
        className="h-full rounded-full bg-primary"
        initial={{ width: 0 }}
        animate={{ width: `${Math.min((value / max) * 100, 100)}%` }}
        transition={{ duration: 0.8, delay, ease: "easeOut" }}
      />
    </div>
  </div>
);

const DriverCard = ({ driver, isActive, onClick, index }: { driver: Driver; isActive: boolean; onClick: () => void; index: number }) => (
  <motion.button
    onClick={onClick}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: index * 0.05 }}
    whileHover={{ y: -4, transition: { duration: 0.2 } }}
    whileTap={{ scale: 0.97 }}
    className={`group relative text-left rounded-xl border overflow-hidden transition-all duration-300 ${
      isActive
        ? "border-primary/60 bg-card shadow-[0_0_20px_hsl(var(--primary)/0.15)]"
        : "border-border/30 bg-card/60 hover:border-primary/30 hover:bg-card"
    }`}
  >
    {/* Team color accent bar */}
    <div
      className="h-1 w-full transition-all duration-300"
      style={{
        background: isActive
          ? `linear-gradient(90deg, hsl(${driver.teamColor}), hsl(${driver.teamColor} / 0.4))`
          : `linear-gradient(90deg, hsl(${driver.teamColor} / 0.4), transparent)`,
      }}
    />

    <div className="p-4">
      {/* Number + Name */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-display text-xs font-bold tracking-wide truncate group-hover:text-primary transition-colors">
            {driver.name}
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">{driver.nationality}</p>
        </div>
        {driver.number && (
          <span
            className="font-display text-2xl font-black leading-none opacity-20 group-hover:opacity-40 transition-opacity"
            style={{ color: `hsl(${driver.teamColor})` }}
          >
            {driver.number}
          </span>
        )}
      </div>

      {/* Quick stats */}
      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border/20">
        <div className="flex items-center gap-1">
          <Trophy size={10} className="text-yellow-500" />
          <span className="text-[10px] font-display font-bold">{driver.titles}</span>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <Flag size={10} />
          <span className="text-[10px] font-display">{driver.wins}</span>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <span className="text-[10px] font-display">{driver.years.split("–")[0]}–</span>
        </div>
      </div>
    </div>
  </motion.button>
);

const DriversSection = () => {
  const [active, setActive] = useState(0);
  const [era, setEra] = useState<Era>("all");

  const filtered = era === "all" ? legendaryDrivers : legendaryDrivers.filter((d) => d.era === era);
  const activeDriver = filtered[active] || filtered[0];

  const handleEraChange = (newEra: Era) => {
    setEra(newEra);
    setActive(0);
  };

  return (
    <AnimatedSection className="py-32 px-6 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <p className="gsap-label font-display text-xs tracking-[0.3em] text-primary mb-4 text-glow-sm">
          03 — LEGENDS
        </p>
        <h2 className="gsap-heading font-display text-3xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
          Legendary <span className="text-primary text-glow-sm">Drivers</span>
        </h2>

        <div className="gsap-content">
          {/* Era filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            {eraLabels.map((e) => (
              <button
                key={e.id}
                onClick={() => handleEraChange(e.id)}
                className={`font-display text-[10px] tracking-widest px-4 py-2.5 rounded-lg border transition-all duration-300 ${
                  era === e.id
                    ? "neon-border bg-primary/10 text-primary"
                    : "border-border/50 bg-card/50 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                }`}
              >
                {e.label}
              </button>
            ))}
          </div>

          {/* Driver cards grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
            {filtered.map((driver, i) => (
              <DriverCard
                key={driver.id}
                driver={driver}
                isActive={i === active}
                onClick={() => setActive(i)}
                index={i}
              />
            ))}
          </div>

          {/* Detail panel */}
          <AnimatePresence mode="wait">
            {activeDriver && (
              <motion.div
                key={activeDriver.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="glass-panel rounded-2xl overflow-hidden"
              >
                {/* Team color header bar */}
                <div
                  className="h-1.5"
                  style={{
                    background: `linear-gradient(90deg, hsl(${activeDriver.teamColor}), hsl(${activeDriver.teamColor} / 0.3), transparent)`,
                  }}
                />

                <div className="p-6 md:p-10">
                  <div className="grid md:grid-cols-3 gap-8">
                    {/* Left: Driver info */}
                    <div className="md:col-span-1 space-y-6">
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center font-display font-black text-sm"
                            style={{
                              background: `hsl(${activeDriver.teamColor} / 0.15)`,
                              color: `hsl(${activeDriver.teamColor})`,
                              border: `1px solid hsl(${activeDriver.teamColor} / 0.3)`,
                            }}
                          >
                            {activeDriver.number || "—"}
                          </div>
                          <div>
                            <p className="text-[10px] font-display tracking-wider text-muted-foreground">
                              {activeDriver.nationality}
                            </p>
                            <p className="text-[10px] text-muted-foreground">{activeDriver.born}</p>
                          </div>
                        </div>

                        <h3 className="font-display text-2xl md:text-3xl font-black leading-tight">
                          {activeDriver.name}
                        </h3>

                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {activeDriver.teams.map((team) => (
                            <span
                              key={team}
                              className="text-[9px] font-display tracking-wider px-2 py-1 rounded border border-border/30 bg-secondary/50 text-muted-foreground"
                            >
                              {team}
                            </span>
                          ))}
                        </div>
                      </div>

                      <blockquote className="text-base md:text-lg italic text-foreground/80 border-l-2 pl-4" style={{ borderColor: `hsl(${activeDriver.teamColor})` }}>
                        "{activeDriver.quote}"
                      </blockquote>

                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {activeDriver.bio}
                      </p>
                    </div>

                    {/* Center: Championship count + visual */}
                    <div className="md:col-span-1 flex flex-col items-center justify-center">
                      <motion.div
                        className="relative"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2, ease: "backOut" }}
                      >
                        {/* Glowing ring */}
                        <div
                          className="absolute inset-0 rounded-full"
                          style={{
                            background: `radial-gradient(circle, hsl(${activeDriver.teamColor} / 0.1) 0%, transparent 70%)`,
                            filter: "blur(30px)",
                            transform: "scale(2)",
                          }}
                        />
                        <div className="relative flex flex-col items-center">
                          <span
                            className="font-display text-[8rem] md:text-[10rem] font-black leading-none select-none"
                            style={{ color: `hsl(${activeDriver.teamColor} / 0.12)` }}
                          >
                            {activeDriver.titles}
                          </span>
                          <p className="font-display text-xs tracking-[0.3em] text-muted-foreground -mt-4">
                            WORLD TITLES
                          </p>
                        </div>
                      </motion.div>

                      {/* Trophy row */}
                      <div className="flex gap-1.5 mt-6">
                        {Array.from({ length: activeDriver.titles }).map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + i * 0.1 }}
                          >
                            <Trophy size={18} className="text-yellow-500" />
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Right: Career stats */}
                    <div className="md:col-span-1 space-y-4">
                      <p className="font-display text-[10px] tracking-[0.2em] text-muted-foreground mb-4">
                        CAREER STATISTICS
                      </p>

                      {/* Key stats grid */}
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        {[
                          { icon: Flag, label: "WINS", value: activeDriver.wins },
                          { icon: Trophy, label: "PODIUMS", value: activeDriver.podiums },
                          { icon: Gauge, label: "POLES", value: activeDriver.poles },
                          { icon: Timer, label: "FASTEST LAPS", value: activeDriver.fastestLaps },
                          { icon: Hash, label: "RACES", value: activeDriver.races },
                          { icon: MapPin, label: "YEARS", value: activeDriver.years },
                        ].map(({ icon: Icon, label, value }) => (
                          <motion.div
                            key={label}
                            className="bg-secondary/40 rounded-lg p-3"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                          >
                            <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                              <Icon size={10} />
                              <span className="text-[9px] font-display tracking-wider">{label}</span>
                            </div>
                            <p className="text-sm font-display font-bold">{value}</p>
                          </motion.div>
                        ))}
                      </div>

                      {/* Stat bars */}
                      <div className="space-y-3">
                        <StatBar label="WINS" value={activeDriver.wins} max={105} delay={0.3} />
                        <StatBar label="PODIUMS" value={activeDriver.podiums} max={202} delay={0.4} />
                        <StatBar label="POLE POSITIONS" value={activeDriver.poles} max={104} delay={0.5} />
                        <StatBar label="FASTEST LAPS" value={activeDriver.fastestLaps} max={77} delay={0.6} />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AnimatedSection>
  );
};

export default DriversSection;
