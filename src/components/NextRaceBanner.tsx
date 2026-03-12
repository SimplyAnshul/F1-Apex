import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Flag, MapPin, Clock } from "lucide-react";

const NEXT_RACE = {
  name: "Australian Grand Prix",
  circuit: "Albert Park Circuit",
  location: "Melbourne, Australia",
  date: new Date("2026-03-15T05:00:00Z"),
  round: 1,
  totalRounds: 24,
  flagEmoji: "🇦🇺",
};

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const getTimeLeft = (target: Date): TimeLeft => {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
};

const CountdownUnit = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center">
    <div className="relative w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-md border border-primary/30 bg-background/60 backdrop-blur-sm">
      <motion.span
        key={value}
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="font-display text-xl md:text-2xl font-black text-primary"
      >
        {String(value).padStart(2, "0")}
      </motion.span>
      <div className="absolute inset-0 rounded-md opacity-20" style={{
        background: "linear-gradient(180deg, hsl(var(--primary) / 0.15) 0%, transparent 50%)",
      }} />
    </div>
    <span className="mt-1.5 font-display text-[9px] tracking-[0.2em] text-muted-foreground/60 uppercase">
      {label}
    </span>
  </div>
);

const NextRaceBanner = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft(NEXT_RACE.date));

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(getTimeLeft(NEXT_RACE.date)), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 3.4, duration: 0.8, ease: "easeOut" }}
      className="hero-race-banner mt-10 w-full max-w-xl"
    >
      <div className="relative rounded-xl border border-primary/20 bg-background/40 backdrop-blur-md p-5 overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Flag className="w-3.5 h-3.5 text-primary" />
            <span className="font-display text-[10px] tracking-[0.3em] text-primary/80 uppercase">
              Next Race — Round {NEXT_RACE.round}/{NEXT_RACE.totalRounds}
            </span>
          </div>
          <span className="text-lg">{NEXT_RACE.flagEmoji}</span>
        </div>

        {/* Race name */}
        <h3 className="font-display text-base md:text-lg font-bold text-foreground tracking-wide mb-1">
          {NEXT_RACE.name}
        </h3>
        <div className="flex items-center gap-3 mb-5 text-muted-foreground/70">
          <span className="flex items-center gap-1 text-xs">
            <MapPin className="w-3 h-3" /> {NEXT_RACE.location}
          </span>
          <span className="flex items-center gap-1 text-xs">
            <Clock className="w-3 h-3" /> {NEXT_RACE.date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </span>
        </div>

        {/* Countdown */}
        <div className="flex items-center justify-center gap-3">
          <CountdownUnit value={timeLeft.days} label="Days" />
          <span className="text-primary/40 font-display text-xl mt-[-16px]">:</span>
          <CountdownUnit value={timeLeft.hours} label="Hours" />
          <span className="text-primary/40 font-display text-xl mt-[-16px]">:</span>
          <CountdownUnit value={timeLeft.minutes} label="Min" />
          <span className="text-primary/40 font-display text-xl mt-[-16px]">:</span>
          <CountdownUnit value={timeLeft.seconds} label="Sec" />
        </div>
      </div>
    </motion.div>
  );
};

export default NextRaceBanner;
