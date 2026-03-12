import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LIGHT_COUNT = 5;
const LIGHT_INTERVAL = 800;
const GREEN_DELAY = 1200;
const CAR_LAUNCH_DURATION = 1500;
const TOTAL_DURATION = LIGHT_COUNT * LIGHT_INTERVAL + GREEN_DELAY + CAR_LAUNCH_DURATION + 600;

interface RaceStartIntroProps {
  onComplete: () => void;
}

const RaceStartIntro = ({ onComplete }: RaceStartIntroProps) => {
  const [activeLights, setActiveLights] = useState(0);
  const [isGreen, setIsGreen] = useState(false);
  const [carLaunched, setCarLaunched] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const runSequence = useCallback(() => {
    // Sequential red lights
    for (let i = 1; i <= LIGHT_COUNT; i++) {
      setTimeout(() => setActiveLights(i), i * LIGHT_INTERVAL);
    }

    // Lights out (green)
    const greenTime = LIGHT_COUNT * LIGHT_INTERVAL + GREEN_DELAY;
    setTimeout(() => {
      setIsGreen(true);
      setActiveLights(0);
    }, greenTime);

    // Car launch
    setTimeout(() => setCarLaunched(true), greenTime + 200);

    // Fade out
    setTimeout(() => setFadeOut(true), TOTAL_DURATION - 600);

    // Complete
    setTimeout(onComplete, TOTAL_DURATION);
  }, [onComplete]);

  useEffect(() => {
    runSequence();
  }, [runSequence]);

  return (
    <AnimatePresence>
      {!fadeOut ? (
        <motion.div
          ref={containerRef}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Ambient particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  background: isGreen
                    ? `hsla(120, 100%, 50%, ${Math.random() * 0.4})`
                    : `hsla(0, 100%, 50%, ${Math.random() * 0.3})`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.2, 0.6, 0.2],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {/* Race start text */}
          <motion.p
            className="font-display text-[10px] tracking-[0.5em] text-muted-foreground/50 uppercase mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Formation Lap Complete
          </motion.p>

          {/* Start Lights */}
          <div className="flex items-center gap-4 md:gap-6 mb-16">
            {[...Array(LIGHT_COUNT)].map((_, i) => {
              const isLit = !isGreen && activeLights > i;
              const isGreenLit = isGreen;

              return (
                <div key={i} className="flex flex-col items-center gap-3">
                  {/* Light housing */}
                  <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-muted/30 flex items-center justify-center"
                    style={{
                      background: "hsl(var(--card))",
                      boxShadow: isLit
                        ? "0 0 40px hsl(0 100% 50% / 0.6), 0 0 80px hsl(0 100% 50% / 0.3), inset 0 0 20px hsl(0 100% 50% / 0.2)"
                        : isGreenLit
                          ? "0 0 40px hsl(120 100% 40% / 0.6), 0 0 80px hsl(120 100% 40% / 0.3), inset 0 0 20px hsl(120 100% 40% / 0.2)"
                          : "inset 0 0 10px hsl(0 0% 0% / 0.5)",
                    }}
                  >
                    <motion.div
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full"
                      animate={{
                        background: isLit
                          ? "radial-gradient(circle, hsl(0 100% 55%), hsl(0 100% 35%))"
                          : isGreenLit
                            ? "radial-gradient(circle, hsl(120 100% 50%), hsl(120 100% 30%))"
                            : "radial-gradient(circle, hsl(0 0% 15%), hsl(0 0% 8%))",
                        scale: isLit || isGreenLit ? 1 : 0.85,
                      }}
                      transition={{ duration: 0.15 }}
                    />

                    {/* Reflection glare */}
                    <div
                      className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-2 rounded-full opacity-20"
                      style={{ background: "linear-gradient(180deg, white, transparent)" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Status text */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {!isGreen && activeLights === 0 && (
              <p className="font-display text-xs tracking-[0.3em] text-muted-foreground/40">
                WAITING...
              </p>
            )}
            {!isGreen && activeLights > 0 && (
              <p className="font-display text-sm tracking-[0.3em] text-primary">
                {activeLights} / {LIGHT_COUNT}
              </p>
            )}
            {isGreen && !carLaunched && (
              <motion.p
                className="font-display text-2xl md:text-4xl tracking-[0.2em] font-black"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{ color: "hsl(120 100% 45%)" }}
              >
                LIGHTS OUT!
              </motion.p>
            )}
          </motion.div>

          {/* Car launch animation */}
          <AnimatePresence>
            {carLaunched && (
              <motion.div
                className="absolute bottom-[30%] left-[10%]"
                initial={{ x: 0, opacity: 1 }}
                animate={{ x: "120vw", opacity: [1, 1, 0.8] }}
                transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
              >
                {/* Stylized car silhouette */}
                <div className="relative">
                  {/* Car body */}
                  <div className="w-32 h-8 md:w-48 md:h-10 relative">
                    <div
                      className="absolute inset-0 rounded-r-full rounded-l-sm"
                      style={{
                        background: "linear-gradient(90deg, hsl(0 0% 20%), hsl(0 100% 45%), hsl(0 100% 35%))",
                        clipPath: "polygon(0% 60%, 5% 30%, 15% 10%, 30% 0%, 70% 0%, 85% 15%, 100% 40%, 100% 80%, 90% 100%, 10% 100%, 0% 90%)",
                      }}
                    />
                    {/* Wheels */}
                    <div className="absolute -bottom-2 left-[12%] w-5 h-5 rounded-full border-2 border-muted-foreground/50 bg-background" />
                    <div className="absolute -bottom-2 right-[10%] w-5 h-5 rounded-full border-2 border-muted-foreground/50 bg-background" />
                  </div>

                  {/* Exhaust fire */}
                  <motion.div
                    className="absolute left-[-30px] top-1/2 -translate-y-1/2 w-10 h-4"
                    animate={{ scaleX: [0.5, 1.5, 0.8], opacity: [0.8, 1, 0.6] }}
                    transition={{ duration: 0.15, repeat: Infinity }}
                    style={{
                      background: "linear-gradient(90deg, hsl(30 100% 60%), hsl(15 100% 50%), transparent)",
                      borderRadius: "50%",
                      filter: "blur(3px)",
                    }}
                  />

                  {/* Motion blur lines */}
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute h-px"
                      style={{
                        left: `${-40 - i * 25}px`,
                        top: `${4 + i * 4}px`,
                        width: `${30 + Math.random() * 40}px`,
                        background: `linear-gradient(90deg, transparent, hsl(0 0% 50% / ${0.3 - i * 0.03}))`,
                      }}
                      animate={{ opacity: [0.3, 0.7, 0.3] }}
                      transition={{ duration: 0.2, repeat: Infinity, delay: i * 0.05 }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Ground line */}
          {carLaunched && (
            <motion.div
              className="absolute bottom-[28%] left-0 right-0 h-px"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              style={{ background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.3), transparent)" }}
            />
          )}

          {/* Skip button */}
          <motion.button
            className="absolute bottom-8 right-8 font-display text-[10px] tracking-[0.3em] text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            onClick={onComplete}
          >
            Skip →
          </motion.button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default RaceStartIntro;
