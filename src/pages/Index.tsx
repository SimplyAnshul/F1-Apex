import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import RaceStartIntro from "@/components/RaceStartIntro";
import HeroSection from "@/components/HeroSection";
import WhatIsF1Section from "@/components/WhatIsF1Section";
import EvolutionSection from "@/components/EvolutionSection";
import DriversSection from "@/components/DriversSection";
import CircuitsSection from "@/components/CircuitsSection";
import CarViewerSection from "@/components/CarViewerSection";
import EngineeringViewer from "@/components/EngineeringViewer";
import RaceSimulation from "@/components/RaceSimulation";
import GarageSimulator from "@/components/GarageSimulator";
import F1Footer from "@/components/F1Footer";
import { useAudioManager } from "@/hooks/useAudioManager";

gsap.registerPlugin(ScrollTrigger);

const Index = () => {
  const mainRef = useRef<HTMLDivElement>(null);
  const [introComplete, setIntroComplete] = useState(false);
  const audio = useAudioManager();

  const handleIntroComplete = useCallback(() => {
    // Initialize audio on first user interaction (intro counts)
    audio.init();
    audio.playEngineRev(1.5);
    setIntroComplete(true);
  }, [audio]);

  useEffect(() => {
    if (!introComplete) return;

    const ctx = gsap.context(() => {
      // Hero fade-out + scale on scroll
      gsap.to(".hero-content", {
        opacity: 0,
        y: -150,
        scale: 0.9,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "60% top",
          scrub: true,
        },
      });

      gsap.to(".hero-bg", {
        scale: 1.3,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Hero car flies off on scroll
      gsap.to(".hero-car", {
        x: -300,
        opacity: 0,
        rotateY: -30,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-section",
          start: "10% top",
          end: "50% top",
          scrub: true,
        },
      });

      // Parallax backgrounds
      gsap.utils.toArray<HTMLElement>(".parallax-bg").forEach((bg) => {
        gsap.to(bg, {
          yPercent: -20,
          ease: "none",
          scrollTrigger: {
            trigger: bg.parentElement,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      // Section reveals with stagger
      gsap.utils.toArray<HTMLElement>(".gsap-section").forEach((section) => {
        const heading = section.querySelector(".gsap-heading");
        const content = section.querySelector(".gsap-content");
        const label = section.querySelector(".gsap-label");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "top 30%",
            scrub: 0.5,
          },
        });

        if (label) {
          tl.from(label, { opacity: 0, x: -30, duration: 0.3 }, 0);
        }
        if (heading) {
          tl.from(heading, { opacity: 0, y: 60, duration: 0.5 }, 0.1);
        }
        if (content) {
          tl.from(content, { opacity: 0, y: 80, duration: 0.6 }, 0.2);
        }
      });

      // Timeline items stagger
      gsap.utils.toArray<HTMLElement>(".timeline-item").forEach((item, i) => {
        gsap.from(item, {
          opacity: 0,
          x: i % 2 === 0 ? -80 : 80,
          duration: 0.8,
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
            end: "top 55%",
            scrub: 0.5,
          },
        });
      });

      // Timeline line grow
      gsap.from(".timeline-line", {
        scaleY: 0,
        transformOrigin: "top",
        ease: "none",
        scrollTrigger: {
          trigger: ".timeline-container",
          start: "top 70%",
          end: "bottom 50%",
          scrub: true,
        },
      });

      // Stats counter reveal
      gsap.utils.toArray<HTMLElement>(".stat-card").forEach((card, i) => {
        gsap.from(card, {
          opacity: 0,
          scale: 0.8,
          y: 40,
          duration: 0.5,
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            toggleActions: "play none none none",
          },
          delay: i * 0.1,
        });
      });

      // Circuit rows slide in
      gsap.utils.toArray<HTMLElement>(".circuit-row").forEach((row, i) => {
        gsap.from(row, {
          opacity: 0,
          x: -60,
          duration: 0.6,
          scrollTrigger: {
            trigger: row,
            start: "top 90%",
            toggleActions: "play none none none",
          },
          delay: i * 0.08,
        });
      });

      // Car viewer parallax on the car image
      gsap.to(".car-viewer-img", {
        y: -30,
        ease: "none",
        scrollTrigger: {
          trigger: ".car-viewer-section",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      // Horizontal speed lines in hero
      gsap.utils.toArray<HTMLElement>(".speed-line-gsap").forEach((line, i) => {
        gsap.fromTo(
          line,
          { x: "-100%" },
          {
            x: "100vw",
            duration: 2 + i * 0.5,
            repeat: -1,
            ease: "none",
            delay: i * 0.4,
          }
        );
      });

      // Section dividers glow pulse
      gsap.utils.toArray<HTMLElement>(".section-divider").forEach((div) => {
        gsap.fromTo(
          div,
          { opacity: 0, scaleX: 0 },
          {
            opacity: 1,
            scaleX: 1,
            duration: 0.8,
            scrollTrigger: {
              trigger: div,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    }, mainRef);

    return () => ctx.revert();
  }, [introComplete]);

  return (
    <>
      {!introComplete && <RaceStartIntro onComplete={handleIntroComplete} />}
      <div ref={mainRef} className="min-h-screen bg-background overflow-x-hidden">
        {introComplete && (
          <>
            <HeroSection />
            <div className="section-divider" />
            <WhatIsF1Section />
            <div className="section-divider" />
            <EvolutionSection />
            <div className="section-divider" />
            <DriversSection />
            <div className="section-divider" />
            <CircuitsSection />
            <div className="section-divider" />
            <CarViewerSection />
            <div className="section-divider" />
            <EngineeringViewer />
            <div className="section-divider" />
            <RaceSimulation />
            <div className="section-divider" />
            <GarageSimulator />
            <F1Footer />
          </>
        )}
      </div>
    </>
  );
};

export default Index;
