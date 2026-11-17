import React, { useEffect, useRef, useState, useCallback } from 'react';

export interface KineticIntroProps {
  /** Callback fired when the intro sequence finishes or is skipped */
  onComplete?: () => void;
  /** Automatically trigger animation on mount (defaults to true) */
  autoStart?: boolean;
  /** Optional container class name */
  className?: string;
}

// Cinematic Audio Engine (Studio Recorded Assets + Web Audio Spatial Mastering)
class CinematicAudioEngine {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;
  private masterGain: GainNode | null = null;
  private initialized: boolean = false;

  // Real Studio-Recorded Audio Elements
  private chargeAudio: HTMLAudioElement | null = null;
  private explosionAudio: HTMLAudioElement | null = null;
  private explosionPunchAudio: HTMLAudioElement | null = null;
  private thumpAudio: HTMLAudioElement | null = null;
  private fireballAudio: HTMLAudioElement | null = null;

  public init() {
    if (this.initialized) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.85, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }

      // Preload Studio Sound Assets
      this.chargeAudio = new Audio('/audio/machine_charge.mp3');
      this.chargeAudio.preload = 'auto';
      this.chargeAudio.volume = this.isMuted ? 0 : 0.65;

      this.explosionAudio = new Audio('/audio/explosion_reverb.mp3');
      this.explosionAudio.preload = 'auto';
      this.explosionAudio.volume = this.isMuted ? 0 : 1.0;

      this.explosionPunchAudio = new Audio('/audio/explosion.mp3');
      this.explosionPunchAudio.preload = 'auto';
      this.explosionPunchAudio.volume = this.isMuted ? 0 : 0.85;

      this.thumpAudio = new Audio('/audio/thump.mp3');
      this.thumpAudio.preload = 'auto';
      this.thumpAudio.volume = this.isMuted ? 0 : 0.45;

      this.fireballAudio = new Audio('/audio/fireball.mp3');
      this.fireballAudio.preload = 'auto';
      this.fireballAudio.volume = this.isMuted ? 0 : 0.6;

      this.initialized = true;
    } catch {
      // AudioContext waiting on user gesture
    }
  }

  public resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.85, this.ctx.currentTime);
    }
    const volMult = this.isMuted ? 0 : 1;
    if (this.chargeAudio) this.chargeAudio.volume = 0.65 * volMult;
    if (this.explosionAudio) this.explosionAudio.volume = 1.0 * volMult;
    if (this.explosionPunchAudio) this.explosionPunchAudio.volume = 0.85 * volMult;
    if (this.thumpAudio) this.thumpAudio.volume = 0.45 * volMult;
    if (this.fireballAudio) this.fireballAudio.volume = 0.6 * volMult;
    return this.isMuted;
  }

  public playMechanicalTick(pitch: number = 1300) {
    if (this.isMuted) return;
    this.resume();

    // Play subtle mechanical pulse using studio thump
    if (this.thumpAudio) {
      const thumpClone = this.thumpAudio.cloneNode() as HTMLAudioElement;
      thumpClone.volume = this.isMuted ? 0 : 0.35;
      thumpClone.playbackRate = 1.2 + (Math.random() - 0.5) * 0.4;
      thumpClone.play().catch(() => {});
    }

    // High frequency precision click in Web Audio
    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(pitch, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.04);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(3200, now);
      filter.Q.value = 6;

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.045);
    }
  }

  public playArcPulse() {
    if (this.isMuted) return;
    this.resume();

    if (this.fireballAudio && Math.random() > 0.5) {
      const fireClone = this.fireballAudio.cloneNode() as HTMLAudioElement;
      fireClone.volume = this.isMuted ? 0 : 0.25;
      fireClone.currentTime = 0.2;
      fireClone.play().catch(() => {});
      setTimeout(() => {
        try { fireClone.pause(); } catch {}
      }, 350);
    }

    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320 + Math.random() * 500, now);
      osc.frequency.linearRampToValueAtTime(80, now + 0.08);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.08);
    }
  }

  public startReactorDrone() {
    if (this.isMuted) return;
    this.resume();

    // Start deep real mechanical charge
    if (this.chargeAudio) {
      this.chargeAudio.currentTime = 0;
      this.chargeAudio.volume = this.isMuted ? 0 : 0.45;
      this.chargeAudio.play().catch(() => {});
    }
  }

  public stopReactorDrone() {
    if (this.chargeAudio) {
      try {
        // Fade out smoothly
        const fadeInterval = setInterval(() => {
          if (!this.chargeAudio || this.chargeAudio.volume <= 0.05) {
            clearInterval(fadeInterval);
            if (this.chargeAudio) {
              this.chargeAudio.pause();
              this.chargeAudio.currentTime = 0;
            }
          } else {
            this.chargeAudio.volume = Math.max(0, this.chargeAudio.volume - 0.1);
          }
        }, 50);
      } catch {}
    }
  }

  public startChargeWhine(duration: number = 1.3) {
    if (this.isMuted) return;
    this.resume();

    if (this.chargeAudio) {
      this.chargeAudio.volume = this.isMuted ? 0 : 0.85;
    }

    if (this.fireballAudio) {
      this.fireballAudio.currentTime = 0.1;
      this.fireballAudio.volume = this.isMuted ? 0 : 0.55;
      this.fireballAudio.play().catch(() => {});
    }

    // Layered cinematic riser
    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime;
      const chargeOsc = this.ctx.createOscillator();
      const chargeGain = this.ctx.createGain();

      chargeOsc.type = 'sawtooth';
      chargeOsc.frequency.setValueAtTime(140, now);
      chargeOsc.frequency.exponentialRampToValueAtTime(2400, now + duration);

      chargeGain.gain.setValueAtTime(0.01, now);
      chargeGain.gain.linearRampToValueAtTime(0.2, now + duration * 0.85);
      chargeGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, now);
      filter.frequency.linearRampToValueAtTime(3800, now + duration);

      chargeOsc.connect(filter);
      filter.connect(chargeGain);
      chargeGain.connect(this.masterGain);

      chargeOsc.start(now);
      chargeOsc.stop(now + duration);
    }
  }

  public playShockwaveExplosion() {
    if (this.isMuted) return;
    this.resume();
    this.stopReactorDrone();

    // 1. Trigger Real Cinema Reverb Explosion
    if (this.explosionAudio) {
      this.explosionAudio.currentTime = 0;
      this.explosionAudio.volume = this.isMuted ? 0 : 1.0;
      this.explosionAudio.play().catch(() => {});
    }

    // 2. Layer Instant Sharp Punch Attack
    if (this.explosionPunchAudio) {
      this.explosionPunchAudio.currentTime = 0;
      this.explosionPunchAudio.volume = this.isMuted ? 0 : 0.85;
      this.explosionPunchAudio.play().catch(() => {});
    }

    // 3. Cinema Sub-Bass Pressure Pulse (Web Audio 20-50 Hz)
    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime;
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();

      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(95, now);
      subOsc.frequency.exponentialRampToValueAtTime(18, now + 2.2);

      subGain.gain.setValueAtTime(1.0, now);
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);

      subOsc.connect(subGain);
      subGain.connect(this.masterGain);
      subOsc.start(now);
      subOsc.stop(now + 2.4);
    }
  }

  public destroy() {
    this.stopReactorDrone();
    if (this.chargeAudio) { try { this.chargeAudio.pause(); } catch {} }
    if (this.explosionAudio) { try { this.explosionAudio.pause(); } catch {} }
    if (this.explosionPunchAudio) { try { this.explosionPunchAudio.pause(); } catch {} }
    if (this.thumpAudio) { try { this.thumpAudio.pause(); } catch {} }
    if (this.fireballAudio) { try { this.fireballAudio.pause(); } catch {} }
    if (this.ctx) {
      try { this.ctx.close(); } catch {}
      this.ctx = null;
    }
  }
}

// Particle Class
class IntroParticle {
  x: number = 0;
  y: number = 0;
  z: number = 0;
  vx: number = 0;
  vy: number = 0;
  vz: number = 0;
  size: number = 1.5;
  alpha: number = 0.8;
  type: 'shard' | 'spark' | 'ring' = 'shard';
  color: string = '#00f2fe';
  rot: number = 0;
  vRot: number = 0;
  targetX: number = 0;
  targetY: number = 0;

  constructor(w: number, h: number) {
    this.reset(w, h);
  }

  reset(w: number, h: number) {
    this.x = (Math.random() - 0.5) * w;
    this.y = (Math.random() - 0.5) * h;
    this.z = Math.random() * 800 - 400;
    this.vx = 0;
    this.vy = 0;
    this.vz = 0;
    this.size = Math.random() * 2.5 + 0.8;
    this.alpha = Math.random() * 0.7 + 0.3;
    this.type = Math.random() > 0.4 ? 'shard' : (Math.random() > 0.5 ? 'spark' : 'ring');
    this.color = Math.random() > 0.3 ? '#00f2fe' : (Math.random() > 0.5 ? '#38bdf8' : '#ffffff');
    this.rot = Math.random() * Math.PI * 2;
    this.vRot = (Math.random() - 0.5) * 0.15;
  }

  explode(cx: number, cy: number, intensity: number = 1.0) {
    const angle = Math.random() * Math.PI * 2;
    const elevation = (Math.random() - 0.5) * Math.PI;
    const speed = (Math.random() * 1400 + 400) * intensity;

    this.x = cx + Math.cos(angle) * (Math.random() * 25);
    this.y = cy + Math.sin(angle) * (Math.random() * 25);
    this.z = (Math.random() - 0.5) * 80;

    this.vx = Math.cos(angle) * Math.cos(elevation) * speed;
    this.vy = Math.sin(angle) * Math.cos(elevation) * speed;
    this.vz = Math.sin(elevation) * speed;
  }
}

// 3D Polyhedron vertices for quantum singularity
const POLY_VERTICES = [
  [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
  [-1, -1, 1],  [1, -1, 1],  [1, 1, 1],  [-1, 1, 1],
  [0, -1.6, 0], [0, 1.6, 0], [-1.6, 0, 0], [1.6, 0, 0]
];
const POLY_EDGES = [
  [0, 1], [1, 2], [2, 3], [3, 0],
  [4, 5], [5, 6], [6, 7], [7, 4],
  [0, 4], [1, 5], [2, 6], [3, 7],
  [8, 0], [8, 1], [8, 4], [8, 5],
  [9, 2], [9, 3], [9, 6], [9, 7],
  [10, 0], [10, 3], [10, 4], [10, 7],
  [11, 1], [11, 2], [11, 5], [11, 6]
];

export const KineticIntro: React.FC<KineticIntroProps> = ({
  onComplete,
  autoStart = true,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<CinematicAudioEngine | null>(null);

  const [isMuted, setIsMuted] = useState(false);
  const [stageName, setStageName] = useState('STAGE 1 // MACHINE ASSEMBLY');
  const [progressPercent, setProgressPercent] = useState(0);
  const [telemetryLines, setTelemetryLines] = useState<string[]>([
    'INITIATING QUANTUM DISPATCH ENGINE...',
    'CORE_ALIGNMENT // 8760H DISPATCH ENGINE'
  ]);
  const [isVisible, setIsVisible] = useState(true);

  const animIdRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const isRunningRef = useRef<boolean>(false);
  const particlesRef = useRef<IntroParticle[]>([]);
  const arcsRef = useRef<{ x: number; y: number }[][]>([]);

  // Stage Timings
  const T_STAGE1 = 3.2;
  const T_STAGE2 = 4.5;
  const T_STAGE3 = 5.5;
  const T_TOTAL  = 6.5;

  const handleFinish = useCallback(() => {
    if (!isRunningRef.current) return;
    isRunningRef.current = false;
    if (animIdRef.current) cancelAnimationFrame(animIdRef.current);

    if (audioRef.current) {
      audioRef.current.stopReactorDrone();
    }

    setIsVisible(false);
    if (onComplete) {
      onComplete();
    }
  }, [onComplete]);

  // Handle Mute Toggle
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.init();
      const muted = audioRef.current.toggleMute();
      setIsMuted(muted);
    }
  };

  // Keyboard shortcut (Space to skip)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && isRunningRef.current) {
        e.preventDefault();
        handleFinish();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFinish]);

  // Main Canvas & Animation Lifecycle
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    audioRef.current = new CinematicAudioEngine();

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = window.devicePixelRatio || 1;
    let cx = width / 2;
    let cy = height / 2;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      cx = width / 2;
      cy = height / 2;

      // Assign constellation grid targets
      const cols = 40;
      const rows = 25;
      const stepX = width / cols;
      const stepY = height / rows;

      particlesRef.current.forEach((p, idx) => {
        const c = idx % cols;
        const r = Math.floor(idx / cols) % rows;
        p.targetX = (c + 0.5) * stepX + (Math.random() - 0.5) * 8;
        p.targetY = (r + 0.5) * stepY + (Math.random() - 0.5) * 8;
      });
    };

    // Initialize 1,600 Particles
    particlesRef.current = [];
    for (let i = 0; i < 1600; i++) {
      particlesRef.current.push(new IntroParticle(width, height));
    }
    resize();
    window.addEventListener('resize', resize);

    // Audio cue states
    let droneStarted = false;
    let chargeStarted = false;
    let explosionTriggered = false;
    let lastTickTime = 0;
    let lastFrameTime = 0;

    const generateArcs = (c_x: number, c_y: number, count: number = 3, maxR: number = 140) => {
      const arcs: { x: number; y: number }[][] = [];
      for (let i = 0; i < count; i++) {
        const startAngle = (Math.PI * 2 / count) * i + Math.random() * 0.5;
        const startX = c_x + Math.cos(startAngle) * maxR;
        const startY = c_y + Math.sin(startAngle) * maxR;
        const points = [{ x: startX, y: startY }];
        const steps = 7;
        for (let s = 1; s <= steps; s++) {
          const ratio = s / steps;
          const targetX = c_x + (startX - c_x) * (1 - ratio);
          const targetY = c_y + (startY - c_y) * (1 - ratio);
          const jitter = (1 - ratio) * 26;
          points.push({
            x: targetX + (Math.random() - 0.5) * jitter,
            y: targetY + (Math.random() - 0.5) * jitter
          });
        }
        arcs.push(points);
      }
      arcsRef.current = arcs;
    };

    // Render Loop
    const render = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = (timestamp - startTimeRef.current) / 1000;
      const dt = lastFrameTime ? Math.min(0.05, (timestamp - lastFrameTime) / 1000) : 0.016;
      lastFrameTime = timestamp;

      // Update HUD progress bar
      const progress = Math.min(100, (elapsed / T_TOTAL) * 100);
      setProgressPercent(progress);

      let shakeX = 0;
      let shakeY = 0;

      // Stage Logic
      if (elapsed < T_STAGE1) {
        const p1 = elapsed / T_STAGE1;
        setStageName(`STAGE 1 // CORE_ASSEMBLY [${Math.floor(p1 * 100)}%]`);

        if (!droneStarted && audioRef.current) {
          audioRef.current.startReactorDrone();
          droneStarted = true;
        }

        if (elapsed - lastTickTime > 0.45 && elapsed < 2.8) {
          if (audioRef.current) audioRef.current.playMechanicalTick(1000 + Math.random() * 800);
          lastTickTime = elapsed;
          generateArcs(cx, cy, 3, 140);
        }

        if (elapsed > 0.8 && elapsed < 1.6) {
          setTelemetryLines([
            'GRID_TOPOLOGY_MATRIX // CEN_CHILE_SEN',
            'CORE_ALIGNMENT // 8760H DISPATCH ENGINE [OK]'
          ]);
        } else if (elapsed >= 1.6 && elapsed < 2.5) {
          setTelemetryLines([
            'COUPLING QUANTUM SOLVER // LP_MILP_v4.2',
            'POLPAICO-CHARRÚA 500kV SYNCHRONIZED'
          ]);
        } else if (elapsed >= 2.5) {
          setTelemetryLines([
            'CALIBRATING BESS CAPABILITY FIRMERS...',
            'POWER ACCUMULATION // 99.8% READY'
          ]);
        }
      } else if (elapsed < T_STAGE2) {
        const p2 = (elapsed - T_STAGE1) / (T_STAGE2 - T_STAGE1);
        setStageName(`STAGE 2 // RESONANCE_SURGE [${Math.floor(p2 * 100)}%]`);

        if (!chargeStarted && audioRef.current) {
          audioRef.current.startChargeWhine(T_STAGE2 - T_STAGE1);
          chargeStarted = true;
        }

        const shakeMag = Math.pow(p2, 3) * 16;
        shakeX = (Math.random() - 0.5) * shakeMag;
        shakeY = (Math.random() - 0.5) * shakeMag;

        if (Math.random() > 0.3) {
          generateArcs(cx, cy, 4, 160 * (1 - p2 * 0.7));
          if (Math.random() > 0.6 && audioRef.current) audioRef.current.playArcPulse();
        }

        setTelemetryLines([
          'WARNING: FLUX SATURATION THRESHOLD EXCEEDED',
          `CRITICAL RESONANCE PEAK: ${(p2 * 100).toFixed(1)}%`
        ]);
      } else if (elapsed < T_STAGE3) {
        const p3 = (elapsed - T_STAGE2) / (T_STAGE3 - T_STAGE2);
        setStageName(`STAGE 3 // QUANTUM_IGNITION [${Math.floor(p3 * 100)}%]`);

        if (!explosionTriggered) {
          if (audioRef.current) audioRef.current.playShockwaveExplosion();
          explosionTriggered = true;
          particlesRef.current.forEach(p => p.explode(cx, cy, 1.2));
        }

        const residualShake = (1 - p3) * 10;
        shakeX = (Math.random() - 0.5) * residualShake;
        shakeY = (Math.random() - 0.5) * residualShake;

        setTelemetryLines([
          'IGNITION SEQUENCE EXECUTED // MATRIX EXPANDED',
          'DISPATCH COUPLER ENGAGED: 8,760 HOURS SOLVED IN 1.4s'
        ]);
      } else {
        const p4 = (elapsed - T_STAGE3) / (T_TOTAL - T_STAGE3);
        setStageName('STAGE 4 // MATRIX_STABILIZED');

        setTelemetryLines([
          'VOLTIA ENERGY OS ONLINE',
          'WELCOME, OPERATOR. SYSTEM OPERATIONAL.'
        ]);

        if (p4 > 0.4 && containerRef.current) {
          const fadeRatio = (p4 - 0.4) / 0.6;
          containerRef.current.style.opacity = `${Math.max(0, 1 - fadeRatio)}`;
        }

        if (elapsed >= T_TOTAL) {
          handleFinish();
          return;
        }
      }

      // Drawing routine
      ctx.save();
      ctx.translate(shakeX, shakeY);

      // Background trail clear
      ctx.fillStyle = elapsed < T_STAGE3 ? 'rgba(5, 8, 17, 0.4)' : 'rgba(5, 8, 17, 0.25)';
      ctx.fillRect(0, 0, width, height);

      // 1. Blueprint Grid & Scanner
      if (elapsed < T_STAGE3) {
        const gridSize = 48;
        const alpha = Math.min(0.25, elapsed * 0.12);
        ctx.strokeStyle = `rgba(0, 242, 254, ${alpha * 0.4})`;
        ctx.lineWidth = 1;

        ctx.beginPath();
        for (let x = 0; x < width; x += gridSize) {
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
        }
        for (let y = 0; y < height; y += gridSize) {
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
        }
        ctx.stroke();

        // Laser scan beam
        const scanY = (elapsed * 240) % height;
        const scanGrad = ctx.createLinearGradient(0, scanY - 20, 0, scanY + 20);
        scanGrad.addColorStop(0, 'rgba(0, 242, 254, 0)');
        scanGrad.addColorStop(0.5, `rgba(0, 242, 254, ${alpha * 0.8})`);
        scanGrad.addColorStop(1, 'rgba(0, 242, 254, 0)');
        ctx.fillStyle = scanGrad;
        ctx.fillRect(0, scanY - 20, width, 40);

        // Reticle brackets
        const bSize = 36;
        const pad = 28;
        ctx.strokeStyle = `rgba(0, 242, 254, ${alpha * 1.4})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(pad, pad + bSize); ctx.lineTo(pad, pad); ctx.lineTo(pad + bSize, pad);
        ctx.moveTo(width - pad - bSize, pad); ctx.lineTo(width - pad, pad); ctx.lineTo(width - pad, pad + bSize);
        ctx.moveTo(pad, height - pad - bSize); ctx.lineTo(pad, height - pad); ctx.lineTo(pad + bSize, height - pad);
        ctx.moveTo(width - pad - bSize, height - pad); ctx.lineTo(width - pad, height - pad); ctx.lineTo(width - pad, height - pad - bSize);
        ctx.stroke();
      }

      // 2. Mechanical Reactor Assembly
      if (elapsed < T_STAGE2 + 0.1) {
        const p1 = Math.min(1, elapsed / T_STAGE1);
        const isSurge = elapsed >= T_STAGE1;
        const surgeRatio = isSurge ? (elapsed - T_STAGE1) / (T_STAGE2 - T_STAGE1) : 0;
        const speedMult = 1 + surgeRatio * 7;
        const t = elapsed * speedMult;

        ctx.save();
        ctx.translate(cx, cy);

        // Outer Gear Ring
        const outerR = 210 * Math.min(1, p1 * 1.2);
        ctx.strokeStyle = 'rgba(0, 242, 254, 0.25)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(0, 0, outerR, 0, Math.PI * 2);
        ctx.stroke();

        const totalTicks = 60;
        const visibleTicks = Math.floor(totalTicks * Math.min(1, p1 * 1.5));
        ctx.save();
        ctx.rotate(t * 0.15);
        ctx.strokeStyle = '#00f2fe';
        ctx.lineWidth = 1.5;
        for (let i = 0; i < visibleTicks; i++) {
          const ang = (Math.PI * 2 / totalTicks) * i;
          const tickLen = i % 5 === 0 ? 12 : 6;
          ctx.beginPath();
          ctx.moveTo(Math.cos(ang) * (outerR - tickLen), Math.sin(ang) * (outerR - tickLen));
          ctx.lineTo(Math.cos(ang) * outerR, Math.sin(ang) * outerR);
          ctx.stroke();
        }
        ctx.restore();

        // Caliper arms
        if (p1 > 0.4) {
          const caliperProgress = Math.min(1, (p1 - 0.4) / 0.6);
          const caliperDist = 280 - caliperProgress * 70;
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.8)';
          ctx.lineWidth = 2;
          for (let k = 0; k < 4; k++) {
            ctx.save();
            ctx.rotate(k * Math.PI / 2);
            ctx.beginPath();
            ctx.moveTo(caliperDist, -14);
            ctx.lineTo(caliperDist - 18, 0);
            ctx.lineTo(caliperDist, 14);
            ctx.stroke();
            ctx.fillStyle = '#00f2fe';
            ctx.beginPath();
            ctx.arc(caliperDist - 18, 0, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }

        // Stator Coils
        const midR = 145 * Math.min(1, p1 * 1.4);
        ctx.save();
        ctx.rotate(-t * 0.25);
        const coils = 12;
        for (let c = 0; c < coils; c++) {
          const cAng = (Math.PI * 2 / coils) * c;
          const isLit = (Math.floor(elapsed * 8) % coils) === c || isSurge;
          ctx.fillStyle = isLit ? 'rgba(0, 242, 254, 0.9)' : 'rgba(0, 242, 254, 0.2)';
          ctx.shadowColor = isLit ? '#00f2fe' : 'transparent';
          ctx.shadowBlur = isLit ? 16 : 0;
          const coilX = Math.cos(cAng) * midR;
          const coilY = Math.sin(cAng) * midR;
          ctx.beginPath();
          ctx.arc(coilX, coilY, 6, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = 'rgba(0, 242, 254, 0.35)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(0, 0, midR, cAng - 0.14, cAng + 0.14);
          ctx.stroke();
        }
        ctx.restore();
        ctx.shadowBlur = 0;

        // Inner Ring
        const innerR = 80 * Math.min(1, p1 * 1.8);
        ctx.save();
        ctx.rotate(t * 0.4);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
        ctx.setLineDash([12, 8]);
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, innerR, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();

        // 3D Polyhedron Wireframe
        const polyScale = (24 + Math.sin(elapsed * 6) * 4 + surgeRatio * 35) * Math.min(1, p1 * 2);
        const rotAngleX = elapsed * 1.8;
        const rotAngleY = elapsed * 2.4;

        const projected = POLY_VERTICES.map(v => {
          const x1 = v[0] * Math.cos(rotAngleY) + v[2] * Math.sin(rotAngleY);
          const z1 = -v[0] * Math.sin(rotAngleY) + v[2] * Math.cos(rotAngleY);
          const y2 = v[1] * Math.cos(rotAngleX) - z1 * Math.sin(rotAngleX);
          const z2 = v[1] * Math.sin(rotAngleX) + z1 * Math.cos(rotAngleX);
          const fov = 400;
          const scale = fov / (fov + z2 * polyScale);
          return { x: x1 * polyScale * scale, y: y2 * polyScale * scale };
        });

        ctx.strokeStyle = isSurge ? '#ffffff' : '#00f2fe';
        ctx.shadowColor = '#00f2fe';
        ctx.shadowBlur = isSurge ? 25 : 10;
        ctx.lineWidth = isSurge ? 2.5 : 1.5;
        ctx.beginPath();
        POLY_EDGES.forEach(([i, j]) => {
          ctx.moveTo(projected[i].x, projected[i].y);
          ctx.lineTo(projected[j].x, projected[j].y);
        });
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Core Radial Glow
        const glowR = (30 + surgeRatio * 180) * Math.min(1, p1 * 2);
        const coreGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, glowR);
        coreGrad.addColorStop(0, '#ffffff');
        coreGrad.addColorStop(0.3, isSurge ? '#4facfe' : '#00f2fe');
        coreGrad.addColorStop(1, 'rgba(0, 242, 254, 0)');
        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(0, 0, glowR, 0, Math.PI * 2);
        ctx.fill();

        // Tachometer Needle in Surge
        if (isSurge) {
          const needleAngle = Math.PI * 0.8 + surgeRatio * Math.PI * 1.4;
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(needleAngle) * (innerR + 25), Math.sin(needleAngle) * (innerR + 25));
          ctx.stroke();
        }

        ctx.restore();
      }

      // 3. Arcs
      if (elapsed < T_STAGE2 && arcsRef.current.length > 0) {
        ctx.save();
        ctx.strokeStyle = '#38bdf8';
        ctx.shadowColor = '#00f2fe';
        ctx.shadowBlur = 12;
        ctx.lineWidth = 2;
        arcsRef.current.forEach(points => {
          if (points.length < 2) return;
          ctx.beginPath();
          ctx.moveTo(points[0].x, points[0].y);
          for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
          }
          ctx.stroke();
        });
        ctx.restore();
      }

      // 4. Shockwaves (Stage 3)
      if (elapsed >= T_STAGE2 && elapsed < T_STAGE3) {
        const p = (elapsed - T_STAGE2) / (T_STAGE3 - T_STAGE2);
        if (p < 0.35) {
          const flashAlpha = Math.max(0, 1 - p / 0.35);
          ctx.fillStyle = `rgba(255, 255, 255, ${flashAlpha * 0.95})`;
          ctx.fillRect(0, 0, width, height);
          ctx.fillStyle = `rgba(0, 242, 254, ${flashAlpha * 0.6})`;
          ctx.fillRect(0, 0, width, height);
        }

        const maxR = Math.sqrt(width * width + height * height) * 0.85;
        const shockR = Math.pow(p, 0.65) * maxR;

        ctx.save();
        ctx.strokeStyle = `rgba(0, 242, 254, ${Math.max(0, 1 - p)})`;
        ctx.shadowColor = '#00f2fe';
        ctx.shadowBlur = 24 * (1 - p);
        ctx.lineWidth = Math.max(1, (1 - p) * 14);
        ctx.beginPath();
        ctx.arc(cx, cy, shockR, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // 5. Particles Update & Render
      const isStage2 = elapsed >= T_STAGE1 && elapsed < T_STAGE2;
      const isExplosion = elapsed >= T_STAGE2;
      const isStage4 = elapsed >= T_STAGE3;
      const friction = isExplosion ? 0.965 : 0.98;

      particlesRef.current.forEach(p => {
        if (elapsed < T_STAGE1) {
          const dist = Math.hypot(p.x - cx, p.y - cy) || 1;
          const ang = Math.atan2(p.y - cy, p.x - cx) + 0.008;
          p.x = cx + Math.cos(ang) * dist;
          p.y = cy + Math.sin(ang) * dist;
        } else if (isStage2) {
          const dx = cx - p.x;
          const dy = cy - p.y;
          const dist = Math.hypot(dx, dy) || 1;
          const pull = (1400 / (dist + 30)) * dt * 60;
          p.vx += (dx / dist) * pull - (dy / dist) * 3.5;
          p.vy += (dy / dist) * pull + (dx / dist) * 3.5;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.vx *= 0.92;
          p.vy *= 0.92;
        } else if (isExplosion) {
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.z += p.vz * dt;
          p.vx *= friction;
          p.vy *= friction;
          p.vz *= friction;
          p.rot += p.vRot;

          if (isStage4) {
            const p4Progress = Math.min(1, (elapsed - T_STAGE3) / 0.8);
            p.x += (p.targetX - p.x) * (0.05 * p4Progress);
            p.y += (p.targetY - p.y) * (0.05 * p4Progress);
          }
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        const fov = 500;
        const scale = Math.max(0.2, fov / (fov + p.z));
        ctx.scale(scale, scale);
        ctx.fillStyle = p.color;
        ctx.strokeStyle = p.color;
        ctx.globalAlpha = p.alpha;

        if (p.type === 'shard') {
          ctx.beginPath();
          ctx.moveTo(0, -p.size * 2);
          ctx.lineTo(p.size, 0);
          ctx.lineTo(0, p.size * 2);
          ctx.lineTo(-p.size, 0);
          ctx.closePath();
          ctx.fill();
        } else if (p.type === 'spark') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 1.5, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      });

      // Stage 4: Constellation lines & Hologram Logo
      if (isStage4) {
        const linkAlpha = Math.min(0.25, (elapsed - T_STAGE3) * 0.4);
        ctx.strokeStyle = `rgba(0, 242, 254, ${linkAlpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i < 300; i += 3) {
          const pA = particlesRef.current[i];
          const pB = particlesRef.current[(i + 1) % particlesRef.current.length];
          const d = Math.hypot(pA.x - pB.x, pA.y - pB.y);
          if (d < 110) {
            ctx.moveTo(pA.x, pA.y);
            ctx.lineTo(pB.x, pB.y);
          }
        }
        ctx.stroke();

        // Hologram Logo
        const alpha = Math.min(1, (elapsed - T_STAGE3) / 0.5);
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '800 48px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.shadowColor = '#00f2fe';
        ctx.shadowBlur = 24 * alpha;
        ctx.fillText('V O L T I A', cx, cy - 18);

        ctx.font = '600 13px "JetBrains Mono", monospace';
        ctx.fillStyle = `rgba(0, 242, 254, ${alpha * 0.9})`;
        ctx.shadowBlur = 10 * alpha;
        ctx.fillText('ENERGY OS // QUANTUM POWER DISPATCH', cx, cy + 32);
        ctx.restore();
      }

      ctx.restore();

      animIdRef.current = requestAnimationFrame(render);
    };

    if (autoStart) {
      isRunningRef.current = true;
      startTimeRef.current = null;
      lastFrameTime = 0;
      audioRef.current.init();
      animIdRef.current = requestAnimationFrame(render);
    }

    // Window click gesture to unblock audio autoplay
    const unlockAudio = () => {
      if (audioRef.current) {
        audioRef.current.init();
        audioRef.current.resume();
      }
    };
    window.addEventListener('click', unlockAudio, { once: true });

    return () => {
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('click', unlockAudio);
      if (audioRef.current) audioRef.current.destroy();
    };
  }, [autoStart, handleFinish]);

  if (!isVisible) return null;

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-50 overflow-hidden bg-[#050811] text-slate-200 transition-opacity duration-700 select-none ${className}`}
      style={{
        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif"
      }}
    >
      {/* HTML5 Canvas */}
      <canvas ref={canvasRef} className="block w-full h-full" />

      {/* Sci-Fi HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8 font-mono">
        {/* Top Bar */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1 text-[11px] tracking-wider text-slate-400 bg-[#060b17]/70 border border-cyan-500/20 px-3.5 py-2.5 rounded backdrop-blur-md">
            <div><strong className="text-cyan-400">CORE_ENGINE:</strong> VOLTIA QUANTUM MILP v4.2</div>
            <div><strong className="text-cyan-400">INTERCONNECTION:</strong> CEN_CHILE_SEN // 500kV CORRIDOR</div>
            <div><strong className="text-cyan-400">LATENCY:</strong> 1.4ms REALTIME DISPATCH SYNC</div>
          </div>

          <div className="flex items-center gap-3 pointer-events-auto">
            {/* Audio Toggle */}
            <button
              onClick={toggleMute}
              className={`flex items-center gap-2 px-3.5 py-2 rounded text-xs font-mono border backdrop-blur-md transition-all duration-200 ${
                isMuted
                  ? 'bg-[#060b17]/70 border-slate-700 text-slate-400 hover:text-white'
                  : 'bg-cyan-950/40 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(0,242,254,0.3)]'
              }`}
              title="Toggle Kinetic Audio"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                {!isMuted && <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />}
              </svg>
              <span>{isMuted ? 'SOUND: OFF' : 'SOUND: ON'}</span>
            </button>

            {/* Skip Button */}
            <button
              onClick={handleFinish}
              className="flex items-center gap-2 px-4 py-2 rounded text-xs font-mono font-semibold tracking-wide bg-[#060b17]/80 border border-cyan-500/40 text-slate-200 hover:text-white hover:border-cyan-400 hover:bg-cyan-500/20 hover:shadow-[0_0_14px_rgba(0,242,254,0.4)] backdrop-blur-md transition-all duration-200"
              title="Skip Kinetic Intro"
            >
              SKIP INTRO
              <span className="px-1.5 py-0.5 text-[10px] bg-white/10 border border-white/20 rounded">
                SPACE
              </span>
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex justify-between items-end">
          {/* Stage & Progress Tracker */}
          <div className="flex flex-col gap-1.5 bg-[#060b17]/70 border border-cyan-500/20 px-4 py-2.5 rounded backdrop-blur-md text-[11px]">
            <div className="text-slate-400">
              SEQUENCE: <span className="text-cyan-400 font-bold">{stageName}</span>
            </div>
            <div className="w-60 h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-sky-400 shadow-[0_0_8px_#00f2fe] transition-[width] duration-75"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Live Telemetry Feed */}
          <div className="text-right text-[11px] text-slate-400 bg-[#060b17]/70 border border-cyan-500/20 px-4 py-2.5 rounded backdrop-blur-md max-w-sm">
            <div>{telemetryLines[0]}</div>
            <div className="text-cyan-400 font-semibold">{telemetryLines[1]}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KineticIntro;
