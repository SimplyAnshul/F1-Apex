import { useEffect, useRef, useCallback, useState } from "react";
import { gsap } from "gsap";
import heroImg from "@/assets/hero-f1.jpg";
import carSide from "@/assets/f1-car-side.png";
import NextRaceBanner from "@/components/NextRaceBanner";

const PARTICLE_COUNT = 50;

const TAGLINES = [
  "75 years of speed, innovation, and human ambition.",
  "From the streets of Monaco to the circuits of the future.",
  "Where engineering meets the edge of possibility.",
  "The fastest show on Earth.",
];

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const carRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<{ x: number; y: number; vx: number; vy: number; r: number; alpha: number; hue: number }[]>([]);
  const animFrameRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  // Typewriter effect for dynamic taglines
  useEffect(() => {
    const currentTagline = TAGLINES[taglineIndex];
    let charIndex = 0;
    let timeout: ReturnType<typeof setTimeout>;

    if (isTyping) {
      const type = () => {
        if (charIndex <= currentTagline.length) {
          setDisplayedText(currentTagline.slice(0, charIndex));
          charIndex++;
          timeout = setTimeout(type, 35 + Math.random() * 25);
        } else {
          // Pause before erasing
          timeout = setTimeout(() => setIsTyping(false), 3000);
        }
      };
      type();
    } else {
      // Erase
      let eraseIndex = currentTagline.length;
      const erase = () => {
        if (eraseIndex >= 0) {
          setDisplayedText(currentTagline.slice(0, eraseIndex));
          eraseIndex--;
          timeout = setTimeout(erase, 20);
        } else {
          setTaglineIndex((prev) => (prev + 1) % TAGLINES.length);
          setIsTyping(true);
        }
      };
      erase();
    }

    return () => clearTimeout(timeout);
  }, [taglineIndex, isTyping]);

  // Mouse parallax handler
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Mouse-driven parallax animation loop
  useEffect(() => {
    let raf: number;
    const layers = {
      bg: { el: null as HTMLElement | null, strength: 15 },
      car: { el: null as HTMLElement | null, strength: 25 },
      title: { el: null as HTMLElement | null, strength: 8 },
    };

    const section = sectionRef.current;
    if (section) {
      layers.bg.el = section.querySelector(".hero-bg");
      layers.car.el = section.querySelector(".hero-car");
      layers.title.el = section.querySelector(".hero-title-block");
    }

    const animate = () => {
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      Object.values(layers).forEach(({ el, strength }) => {
        if (el) {
          gsap.to(el, {
            x: mx * strength,
            y: my * strength * 0.5,
            duration: 1.2,
            ease: "power2.out",
            overwrite: "auto",
          });
        }
      });
      raf = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(raf);
  }, []);

  // Particle system
  const initParticles = useCallback((w: number, h: number) => {
    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 3 + 1,
      alpha: Math.random() * 0.5 + 0.1,
      hue: Math.random() > 0.6 ? 30 : 0,
    }));
  }, []);

  const drawParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    particlesRef.current.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 8);
      gradient.addColorStop(0, `hsla(${p.hue}, 100%, 55%, ${p.alpha})`);
      gradient.addColorStop(0.4, `hsla(${p.hue}, 100%, 50%, ${p.alpha * 0.3})`);
      gradient.addColorStop(1, `hsla(${p.hue}, 100%, 50%, 0)`);

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 8, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${p.alpha})`;
      ctx.fill();
    });

    animFrameRef.current = requestAnimationFrame(drawParticles);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);
    drawParticles();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [initParticles, drawParticles]);

  // GSAP entrance timeline
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Cinematic letterbox bars
      tl.to(".letterbox-top", { height: 0, duration: 1.5, ease: "power2.inOut" }, 0.8)
        .to(".letterbox-bottom", { height: 0, duration: 1.5, ease: "power2.inOut" }, 0.8);

      // Background zoom
      tl.from(".hero-bg", { scale: 1.5, duration: 3, ease: "power2.out" }, 0);

      // RPM counter flash
      tl.from(".rpm-line", { scaleX: 0, transformOrigin: "left", duration: 0.6, stagger: 0.08, ease: "power2.out" }, 0.5);

      // Car entrance: rocket in from right with motion blur feeling
      tl.from(".hero-car", {
        x: "100vw",
        opacity: 0,
        duration: 1.8,
        ease: "power4.out",
      }, 0.4);

      // Title: dramatic staggered reveal with clip-path
      tl.from(".hero-subtitle", { opacity: 0, y: 40, duration: 0.8 }, 1.2)
        .from(".hero-title-the", { opacity: 0, y: 80, rotateX: -40, duration: 0.7 }, 1.4)
        .from(".hero-title-evolution", { opacity: 0, y: 100, rotateX: -40, duration: 0.9, ease: "back.out(1.2)" }, 1.5)
        .from(".hero-title-of", { opacity: 0, y: 80, rotateX: -40, duration: 0.7 }, 1.7)
        .from(".hero-title-f1", { opacity: 0, y: 120, scale: 0.7, rotateX: -30, duration: 1.2, ease: "back.out(1.4)" }, 1.8)
        .from(".hero-tagline", { opacity: 0, y: 30, duration: 0.8 }, 2.6)
        .from(".hero-cta", { opacity: 0, y: 20, duration: 0.6 }, 2.9)
        .from(".hero-scroll-hint", { opacity: 0, y: -20, duration: 0.6 }, 3.2);

      // Continuous car float
      gsap.to(".hero-car", {
        rotateY: 8,
        rotateX: -2,
        y: -15,
        duration: 3,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // Background drift
      gsap.to(".hero-bg-inner", {
        x: -30,
        y: -15,
        duration: 10,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // Car glow pulse
      gsap.to(".car-glow", {
        opacity: 0.5,
        scale: 1.15,
        duration: 2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // Scroll indicator bounce
      gsap.to(".scroll-arrow", {
        y: 8,
        duration: 1,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="hero-section relative min-h-screen overflow-visible">
      {/* Cinematic letterbox bars */}
      <div className="letterbox-top absolute top-0 left-0 right-0 h-[15vh] bg-background z-[20]" />
      <div className="letterbox-bottom absolute bottom-0 left-0 right-0 h-[15vh] bg-background z-[20]" />

      {/* Background with parallax */}
      <div className="hero-bg absolute inset-0 overflow-hidden will-change-transform">
        <div className="hero-bg-inner absolute inset-[-8%]">
          <img
            src={heroImg}
            alt="Formula 1 racing at night"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/30 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-background/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent" />
        {/* Vignette overlay */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at center, transparent 50%, hsl(var(--background)) 100%)",
        }} />
      </div>

      {/* Particles */}
      <canvas ref={canvasRef} className="absolute inset-0 z-[2] pointer-events-none" />

      {/* RPM-style accent lines */}
      <div className="absolute left-0 top-[20%] z-[3] flex flex-col gap-1.5 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="rpm-line h-[2px]"
            style={{
              width: `${60 + i * 30}px`,
              background: `linear-gradient(90deg, hsl(${i * 6} 100% 50% / ${0.6 - i * 0.08}), transparent)`,
            }}
          />
        ))}
      </div>

      {/* Speed Lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[3]">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="speed-line-gsap absolute h-px"
            style={{
              top: `${8 + i * 9}%`,
              width: `${120 + Math.random() * 250}px`,
              background: `linear-gradient(90deg, transparent, hsla(0, 100%, 50%, ${0.1 + Math.random() * 0.15}), transparent)`,
            }}
          />
        ))}
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 z-[1] pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(0 0% 50% / 0.3) 1px, transparent 1px),
            linear-gradient(90deg, hsl(0 0% 50% / 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Main Content */}
      <div className="hero-content relative z-10 flex h-screen flex-col items-center justify-center text-center px-6 will-change-transform" style={{ perspective: "1200px" }}>
        {/* F1 Car */}
        <div
          ref={carRef}
          className="hero-car relative mb-2 will-change-transform"
          style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
        >
          <div className="car-glow absolute -bottom-8 left-1/2 -translate-x-1/2 w-[80%] h-20 rounded-full opacity-30"
            style={{
              background: "radial-gradient(ellipse, hsl(0 100% 50% / 0.7) 0%, transparent 70%)",
              filter: "blur(25px)",
            }}
          />
          <img
            src={carSide}
            alt="Formula 1 car"
            className="w-[300px] md:w-[450px] lg:w-[550px] h-auto drop-shadow-2xl"
            style={{ filter: "drop-shadow(0 0 40px hsl(0 100% 50% / 0.35))" }}
          />
        </div>

        {/* Title block with mouse parallax */}
        <div className="hero-title-block" style={{ transformStyle: "preserve-3d" }}>
          {/* Subtitle */}
          <p className="hero-subtitle font-display text-[10px] md:text-xs tracking-[0.5em] text-primary/80 mb-3 text-glow-sm">
            THE PINNACLE OF MOTORSPORT
          </p>

          <h1 className="font-display font-black leading-[0.85] tracking-tight">
            <span className="hero-title-the block text-lg md:text-xl lg:text-2xl text-muted-foreground/50 mb-1">THE</span>
            <span className="hero-title-evolution block text-3xl md:text-5xl lg:text-7xl text-foreground">
              EVOLUTION
            </span>
            <span className="hero-title-of block text-lg md:text-xl lg:text-2xl text-muted-foreground/50 my-1">OF</span>
            <span className="hero-title-f1 block text-4xl md:text-6xl lg:text-[8rem] text-primary text-glow leading-none">
              FORMULA 1
            </span>
          </h1>

          {/* Dynamic tagline with typewriter */}
          <div className="hero-tagline mt-4 h-12 flex items-center justify-center">
            <p className="max-w-xl text-sm md:text-base text-muted-foreground font-light leading-relaxed">
              {displayedText}
              <span className="inline-block w-[2px] h-5 bg-primary ml-1 align-middle animate-pulse" />
            </p>
          </div>
        </div>

        {/* CTA + Countdown row */}
        <div className="hero-cta mt-4 flex flex-col items-center gap-4">
          <a
            href="#what-is-f1"
            className="inline-flex items-center gap-3 font-display text-xs tracking-[0.2em] text-primary hover:text-primary-foreground transition-all group border border-primary/40 px-8 py-3 rounded-full hover:bg-primary/90 hover:border-primary hover:shadow-[0_0_30px_hsl(0_100%_50%/0.4)]"
          >
            EXPLORE THE JOURNEY
            <span className="inline-block transition-transform group-hover:translate-y-1">↓</span>
          </a>
        </div>

        {/* Next Race Countdown */}
        <NextRaceBanner />

        {/* Scroll hint */}
        <div className="hero-scroll-hint mt-6 flex flex-col items-center gap-2">
          <span className="font-display text-[9px] tracking-[0.3em] text-muted-foreground/50">SCROLL</span>
          <div className="scroll-arrow w-5 h-5 border-b-2 border-r-2 border-primary/40 rotate-45" />
        </div>
      </div>

      {/* Bottom vignette */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-background via-background/80 to-transparent z-[5]" />
      {/* Top vignette */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background/50 to-transparent z-[5]" />
    </section>
  );
};

export default HeroSection;
