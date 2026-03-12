import { useRef, useCallback, useEffect, useState } from "react";

/**
 * Lightweight audio manager for F1 Apex.
 * Generates engine-like sounds using Web Audio API oscillators — no external files needed.
 * All sounds are non-intrusive and user-initiated (respects autoplay policies).
 */

interface AudioManagerOptions {
  masterVolume?: number;
}

export const useAudioManager = (opts: AudioManagerOptions = {}) => {
  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const activeRef = useRef<Map<string, OscillatorNode[]>>(new Map());
  const [isReady, setIsReady] = useState(false);

  const init = useCallback(() => {
    if (ctxRef.current) return;
    const ctx = new AudioContext();
    const gain = ctx.createGain();
    gain.gain.value = opts.masterVolume ?? 0.08;
    gain.connect(ctx.destination);
    ctxRef.current = ctx;
    gainRef.current = gain;
    setIsReady(true);
  }, [opts.masterVolume]);

  // Engine rev burst (race start)
  const playEngineRev = useCallback((duration = 1.5) => {
    const ctx = ctxRef.current;
    const gain = gainRef.current;
    if (!ctx || !gain) return;

    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(80, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + duration * 0.6);
    osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + duration);
    oscGain.gain.setValueAtTime(0, ctx.currentTime);
    oscGain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.1);
    oscGain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + duration * 0.7);
    oscGain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);
    osc.connect(oscGain).connect(gain);
    osc.start();
    osc.stop(ctx.currentTime + duration);

    // Harmonic
    const osc2 = ctx.createOscillator();
    const osc2Gain = ctx.createGain();
    osc2.type = "square";
    osc2.frequency.setValueAtTime(160, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + duration * 0.6);
    osc2.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + duration);
    osc2Gain.gain.setValueAtTime(0, ctx.currentTime);
    osc2Gain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 0.1);
    osc2Gain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);
    osc2.connect(osc2Gain).connect(gain);
    osc2.start();
    osc2.stop(ctx.currentTime + duration);
  }, []);

  // Ambient idle (low rumble loop)
  const startIdle = useCallback((key = "idle") => {
    const ctx = ctxRef.current;
    const gain = gainRef.current;
    if (!ctx || !gain || activeRef.current.has(key)) return;

    const oscs: OscillatorNode[] = [];

    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.value = 55;
    oscGain.gain.value = 0.04;
    osc.connect(oscGain).connect(gain);
    osc.start();
    oscs.push(osc);

    const osc2 = ctx.createOscillator();
    const osc2Gain = ctx.createGain();
    osc2.type = "triangle";
    osc2.frequency.value = 110;
    osc2Gain.gain.value = 0.02;
    osc2.connect(osc2Gain).connect(gain);
    osc2.start();
    oscs.push(osc2);

    activeRef.current.set(key, oscs);
  }, []);

  const stopSound = useCallback((key: string) => {
    const oscs = activeRef.current.get(key);
    if (oscs) {
      oscs.forEach((o) => {
        try { o.stop(); } catch {}
      });
      activeRef.current.delete(key);
    }
  }, []);

  const stopAll = useCallback(() => {
    activeRef.current.forEach((oscs) => oscs.forEach((o) => { try { o.stop(); } catch {} }));
    activeRef.current.clear();
  }, []);

  useEffect(() => {
    return () => stopAll();
  }, [stopAll]);

  return { init, isReady, playEngineRev, startIdle, stopSound, stopAll };
};
