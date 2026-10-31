'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, PartyPopper } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FloatingHeroObjectsProps {
  isDark: boolean;
  turboSwitch: boolean;
  activeFilter: string;
  burstKey: number;
  onTriggerBurst: (label: string) => void;
  onToggleTurbo?: () => void;
  onAwardBonus?: (pts: number, label: string) => void;
}

function playWhimsicalSound(type: 'blip' | 'chord') {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    if (type === 'blip') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } else {
      // Ascending celebratory arpeggio: C5, E5, G5, C6
      const freqs = [523.25, 659.25, 783.99, 1046.5];
      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.05);
        gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.05 + 0.32);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.05);
        osc.stop(ctx.currentTime + i * 0.05 + 0.32);
      });
    }
  } catch {
    // Fail silently
  }
}

function fireConfetti(originX = 0.5, originY = 0.5) {
  try {
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { x: originX, y: originY },
      colors: ['#1A73E8', '#1E8E3E', '#F9AB00', '#8430CE', '#FF6097', '#00D4FF'],
      disableForReducedMotion: true,
      zIndex: 9999,
    });
  } catch {
    // Fail gracefully
  }
}

const BURST_PARTICLES = Array.from({ length: 12 }, (_, i) => {
  const angle = (i / 12) * Math.PI * 2;
  const distance = 96 + (i % 3) * 36;
  return {
    id: i,
    dx: Math.cos(angle) * distance,
    dy: Math.sin(angle) * distance,
    // Google Flagship Spectrum: Blue, Emerald, Amber, Violet
    color:
      i % 4 === 0
        ? '#1A73E8'
        : i % 4 === 1
          ? '#1E8E3E'
          : i % 4 === 2
            ? '#F9AB00'
            : '#8430CE',
    kind: i % 2 === 0 ? 'diamond' : 'ring',
  };
});

export function FloatingHeroObjects({
  isDark,
  turboSwitch,
  activeFilter,
  burstKey,
  onTriggerBurst,
  onToggleTurbo,
  onAwardBonus,
}: FloatingHeroObjectsProps) {
  const dimAgents = activeFilter !== 'all' && activeFilter !== 'agents';
  const dimOwners = activeFilter !== 'all' && activeFilter !== 'owners';
  const dimLedger = activeFilter !== 'all' && activeFilter !== 'ledger';

  const cardSurface = isDark
    ? 'border-[#223559] bg-[#0D182E]/90 text-[#F1F5F9] shadow-[0_16px_40px_-12px_rgba(0,0,0,0.55)]'
    : 'border-[#E2E8F0] bg-white/92 text-[#0F172A] shadow-[0_12px_32px_-8px_rgba(15,23,42,0.08),0_2px_6px_rgba(15,23,42,0.03)]';

  return (
    <>
      {/* 1. PRECISION GEOMETRIC PULSE BURST */}
      <AnimatePresence mode="popLayout">
        {burstKey > 0 && (
          <div
            key={burstKey}
            className="pointer-events-none absolute left-1/2 top-[42%] z-30 -translate-x-1/2 -translate-y-1/2"
          >
            <motion.div
              initial={{ scale: 0.4, opacity: 0.55 }}
              animate={{ scale: 2.3, opacity: 0 }}
              transition={{ duration: 0.75, ease: 'easeOut' }}
              className="absolute -left-12 -top-12 h-24 w-24 rounded-full border border-[#1A73E8]/40"
            />
            {BURST_PARTICLES.map((p) => (
              <motion.div
                key={p.id}
                initial={{ x: 0, y: 0, scale: 0.3, opacity: 1 }}
                animate={{
                  x: p.dx,
                  y: p.dy,
                  scale: [0.5, 1.1, 0],
                  opacity: [1, 0.9, 0],
                }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="absolute -left-1.5 -top-1.5"
              >
                {p.kind === 'diamond' ? (
                  <div
                    className="h-2.5 w-2.5 rotate-45 rounded-[2px]"
                    style={{ backgroundColor: p.color }}
                  />
                ) : (
                  <div
                    className="h-3 w-3 rounded-full border-2"
                    style={{ borderColor: p.color }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* 2. ARCHITECTURAL ORBITAL CALIBRATION RINGS (Background Corner Geometry) */}
      <div className="pointer-events-none absolute -left-16 -top-16 hidden opacity-45 lg:block">
        <svg
          className={`h-56 w-56 ${turboSwitch ? 'gear-spin-fast' : 'gear-spin'}`}
          viewBox="0 0 200 200"
          fill="none"
        >
          <circle
            cx="100"
            cy="100"
            r="84"
            stroke={isDark ? '#4285F4' : '#1A73E8'}
            strokeOpacity="0.18"
            strokeWidth="1.25"
            strokeDasharray="6 8"
          />
          <circle
            cx="100"
            cy="100"
            r="60"
            stroke={isDark ? '#34A853' : '#1E8E3E'}
            strokeOpacity="0.16"
            strokeWidth="1.25"
          />
          <circle cx="100" cy="16" r="3.5" fill="#1A73E8" />
          <circle cx="160" cy="100" r="3" fill="#1E8E3E" />
        </svg>
      </div>

      <div className="pointer-events-none absolute -bottom-20 -right-16 hidden opacity-45 lg:block">
        <svg
          className="gear-spin-reverse h-60 w-60"
          viewBox="0 0 200 200"
          fill="none"
        >
          <circle
            cx="100"
            cy="100"
            r="86"
            stroke={isDark ? '#F9AB00' : '#E37400'}
            strokeOpacity="0.18"
            strokeWidth="1.25"
            strokeDasharray="10 8"
          />
          <circle
            cx="100"
            cy="100"
            r="58"
            stroke={isDark ? '#8AB4F8' : '#1A73E8'}
            strokeOpacity="0.16"
            strokeWidth="1.25"
          />
          <circle cx="100" cy="14" r="3.5" fill="#F9AB00" />
          <circle cx="42" cy="100" r="3" fill="#1A73E8" />
        </svg>
      </div>

      {/* 3. SATELLITE 01: DISCOVERY TELEMETRY NODE (Top-Left) */}
      <motion.div
        drag
        dragConstraints={{ left: -24, right: 48, top: -20, bottom: 48 }}
        whileHover={{ y: -3, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onTriggerBurst('Step 01 · Issue Discovery Signal Verified')}
        title="Drag or click to inspect Step 01 telemetry"
        className={`bot-float absolute left-[2.5%] top-[7%] z-20 hidden cursor-grab items-center gap-3 rounded-2xl border p-3 pr-4 backdrop-blur-xl transition-opacity active:cursor-grabbing xl:flex ${
          dimAgents ? 'opacity-25' : 'opacity-100'
        } ${cardSurface}`}
      >
        {/* Precision Radar Sweep SVG */}
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E8F0FE] text-[#1A73E8]">
          <svg className="h-6 w-6" viewBox="0 0 32 32" fill="none">
            <circle
              cx="16"
              cy="16"
              r="12"
              stroke="#1A73E8"
              strokeOpacity="0.28"
              strokeWidth="1.75"
            />
            <circle
              cx="16"
              cy="16"
              r="7"
              stroke="#1A73E8"
              strokeOpacity="0.45"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />
            <g
              style={{
                transformOrigin: '16px 16px',
                animation: turboSwitch
                  ? 'spinGear 2.5s linear infinite'
                  : 'spinGear 7s linear infinite',
              }}
            >
              <line
                x1="16"
                y1="16"
                x2="25"
                y2="9"
                stroke="#1A73E8"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </g>
            <circle cx="16" cy="16" r="2.5" fill="#1A73E8" />
          </svg>
        </div>

        <div>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#1A73E8]" />
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#1A73E8]">
              01 · issue.created
            </span>
          </div>
          <p className="font-display text-xs font-bold tracking-tight">
            Autonomous Discovery
          </p>
          <span className="font-mono text-[10px] text-[#64748B]">
            SSE stream · 14ms latency
          </span>
        </div>
      </motion.div>

      {/* 4. SATELLITE 02: LEASE CHRONOMETER (Mid-Left) */}
      <motion.div
        drag
        dragConstraints={{ left: -24, right: 56, top: -36, bottom: 36 }}
        whileHover={{ y: -3, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onTriggerBurst('Step 03 · 60s Exclusive Offer Lease Active')}
        title="Drag or click to inspect the 60s Offer Chronometer"
        className={`orbit-object absolute left-[2%] top-[44%] z-20 hidden cursor-grab items-center gap-3 rounded-2xl border p-3 pr-4 backdrop-blur-xl transition-opacity active:cursor-grabbing xl:flex ${
          dimOwners ? 'opacity-25' : 'opacity-100'
        } ${cardSurface}`}
      >
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FEF7E0] text-[#E37400]">
          <svg className="h-6 w-6" viewBox="0 0 32 32" fill="none">
            <circle
              cx="16"
              cy="17"
              r="11"
              stroke="#E37400"
              strokeOpacity="0.3"
              strokeWidth="1.75"
            />
            <path
              d="M16 6C22.075 6 27 10.925 27 17"
              stroke="#F9AB00"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <line
              x1="13"
              y1="3"
              x2="19"
              y2="3"
              stroke="#E37400"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <g
              style={{
                transformOrigin: '16px 17px',
                animation: turboSwitch
                  ? 'spinGear 2s linear infinite'
                  : 'spinGear 8s linear infinite',
              }}
            >
              <line
                x1="16"
                y1="17"
                x2="16"
                y2="10"
                stroke="#E37400"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </g>
            <circle cx="16" cy="17" r="2" fill="#E37400" />
          </svg>
        </div>

        <div>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#F9AB00]" />
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#E37400]">
              03 · claim.offered
            </span>
          </div>
          <p className="font-display text-xs font-bold tracking-tight">
            {turboSwitch ? '00:59 Priority Lease' : '60s Offer Lease Lock'}
          </p>
          <span className="font-mono text-[10px] text-[#64748B]">
            Deterministic queue handoff
          </span>
        </div>
      </motion.div>

      {/* 5. SATELLITE 03: QUORUM CONSENSUS RING (Top-Right) */}
      <motion.div
        drag
        dragConstraints={{ left: -56, right: 24, top: -20, bottom: 48 }}
        whileHover={{ y: -3, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() =>
          onTriggerBurst('Step 02 · Quorum Reached (2 Reviewers + 1 Triager)')
        }
        title="Drag or click to verify multi-actor quorum"
        className={`bot-float-delayed absolute right-[2.5%] top-[7%] z-20 hidden cursor-grab items-center gap-3 rounded-2xl border p-3 pr-4 backdrop-blur-xl transition-opacity active:cursor-grabbing xl:flex ${
          dimAgents ? 'opacity-25' : 'opacity-100'
        } ${cardSurface}`}
      >
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F3E8FD] text-[#8430CE]">
          <svg className="h-6 w-6" viewBox="0 0 32 32" fill="none">
            <polygon
              points="16,6 26,23 6,23"
              stroke="#8430CE"
              strokeOpacity="0.35"
              strokeWidth="1.6"
              fill="none"
            />
            <circle cx="16" cy="6" r="3" fill="#8430CE" />
            <circle cx="26" cy="23" r="3" fill="#1A73E8" />
            <circle cx="6" cy="23" r="3" fill="#1E8E3E" />
          </svg>
        </div>

        <div>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#8430CE]" />
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#8430CE]">
              02 · issue.confirmed
            </span>
          </div>
          <p className="font-display text-xs font-bold tracking-tight">
            2 Reviewers + 1 Triager
          </p>
          <span className="font-mono text-[10px] text-[#64748B]">
            3 independent actors verified
          </span>
        </div>
      </motion.div>

      {/* 6. SATELLITE 04: VERIFIED LEDGER SETTLEMENT (Mid-Right) */}
      <motion.div
        drag
        dragConstraints={{ left: -56, right: 24, top: -36, bottom: 36 }}
        whileHover={{ y: -3, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onTriggerBurst('Step 06 · +1,200 Verified Ledger Points Minted')}
        title="Drag or click to test ledger point settlement"
        className={`coin-float absolute right-[2%] top-[44%] z-20 hidden cursor-grab items-center gap-3 rounded-2xl border p-3 pr-4 backdrop-blur-xl transition-opacity active:cursor-grabbing xl:flex ${
          dimLedger ? 'opacity-25' : 'opacity-100'
        } ${cardSurface}`}
      >
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E6F4EA] text-[#1E8E3E]">
          <svg className="h-6 w-6" viewBox="0 0 32 32" fill="none">
            <rect
              x="6"
              y="6"
              width="20"
              height="20"
              rx="6"
              stroke="#1E8E3E"
              strokeWidth="1.8"
            />
            <path
              d="M11.5 16.2L14.6 19.3L20.8 13"
              stroke="#1E8E3E"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#1E8E3E]" />
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#1E8E3E]">
              06 · issue.accepted
            </span>
          </div>
          <p className="font-display text-xs font-bold tracking-tight">
            +1,200 Pts Settlement
          </p>
          <span className="font-mono text-[10px] text-[#64748B]">
            COI guard · Zero self-dealing
          </span>
        </div>
      </motion.div>

      {/* 7. WHIMSICAL FLOATING BUTTON 01 (Left Animation Side - Turbo Warp) */}
      <motion.button
        type="button"
        drag
        dragConstraints={{ left: -20, right: 40, top: -24, bottom: 24 }}
        whileHover={{ y: -4, scale: 1.05 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => {
          playWhimsicalSound('blip');
          fireConfetti(0.18, 0.72);
          if (onToggleTurbo) {
            onToggleTurbo();
          }
          if (onAwardBonus) {
            onAwardBonus(50, '⚡ Turbo Warp Activated');
          } else {
            onTriggerBurst('⚡ Turbo Warp Activated · Left Orbits Hyper-Charged (+50 pts)');
          }
        }}
        title="Whimsical Left: Click or drag to activate Turbo Warp (+50 pts)"
        aria-label="Activate Turbo Warp on left animation side"
        className={`bot-float absolute left-[2%] top-[72%] z-30 flex cursor-grab items-center gap-2.5 sm:gap-3 rounded-2xl border p-2.5 sm:p-3 sm:pr-4 backdrop-blur-xl transition-all active:cursor-grabbing ${
          dimAgents ? 'opacity-35' : 'opacity-100'
        } ${
          isDark
            ? 'border-[#388BFD]/50 bg-[#0B1A3A]/90 text-white shadow-[0_12px_36px_rgba(26,115,232,0.35),0_0_20px_rgba(56,139,253,0.2)] hover:border-[#58A6FF]'
            : 'border-[#1A73E8]/40 bg-white/95 text-[#0F172A] shadow-[0_12px_32px_rgba(26,115,232,0.2),0_2px_8px_rgba(26,115,232,0.1)] hover:border-[#1A73E8]'
        }`}
      >
        <div className="relative flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#1A73E8] to-[#4285F4] text-white shadow-md">
          <Zap className="h-4 w-4 sm:h-5 sm:w-5 fill-current text-white animate-pulse" />
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 sm:h-3 sm:w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-emerald-500"></span>
          </span>
        </div>

        <div className="text-left">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#1A73E8]" />
            <span className="font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#1A73E8] dark:text-[#8AB4F8]">
              Whimsical Left · 01
            </span>
            <span className="rounded-full bg-[#1A73E8]/10 px-1.5 py-0.2 font-mono text-[9px] font-bold text-[#1A73E8] dark:bg-[#1A73E8]/30 dark:text-[#8AB4F8]">
              +50 pts
            </span>
          </div>
          <p className="font-display text-xs sm:text-sm font-extrabold tracking-tight">
            ⚡ Turbo Warp
          </p>
          <span className="hidden sm:inline-block font-mono text-[9.5px] text-[#64748B] dark:text-[#94A3B8]">
            Accelerate left orbits & gears
          </span>
        </div>
      </motion.button>

      {/* 8. WHIMSICAL FLOATING BUTTON 02 (Right Animation Side - Quorum Fiesta) */}
      <motion.button
        type="button"
        drag
        dragConstraints={{ left: -40, right: 20, top: -24, bottom: 24 }}
        whileHover={{ y: -4, scale: 1.05 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => {
          playWhimsicalSound('chord');
          fireConfetti(0.82, 0.72);
          if (onAwardBonus) {
            onAwardBonus(100, '🎉 Quorum Fiesta Celebration');
          }
          onTriggerBurst('🎉 Quorum Fiesta! Confetti Cannon Fired (+100 pts)');
        }}
        title="Whimsical Right: Click or drag to launch Quorum Fiesta Confetti (+100 pts)"
        aria-label="Launch Quorum Fiesta confetti on right animation side"
        className={`coin-float absolute right-[2%] top-[72%] z-30 flex cursor-grab items-center gap-2.5 sm:gap-3 rounded-2xl border p-2.5 sm:p-3 sm:pr-4 backdrop-blur-xl transition-all active:cursor-grabbing ${
          dimLedger ? 'opacity-35' : 'opacity-100'
        } ${
          isDark
            ? 'border-[#A142F4]/50 bg-[#1A0B2E]/90 text-white shadow-[0_12px_36px_rgba(132,48,206,0.35),0_0_20px_rgba(161,66,244,0.2)] hover:border-[#C58AF9]'
            : 'border-[#8430CE]/40 bg-white/95 text-[#0F172A] shadow-[0_12px_32px_rgba(132,48,206,0.2),0_2px_8px_rgba(132,48,206,0.1)] hover:border-[#8430CE]'
        }`}
      >
        <div className="relative flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#8430CE] to-[#F9AB00] text-white shadow-md">
          <PartyPopper className="h-4 w-4 sm:h-5 sm:w-5 text-white animate-bounce" />
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 sm:h-3 sm:w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-amber-500"></span>
          </span>
        </div>

        <div className="text-left">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#8430CE]" />
            <span className="font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#8430CE] dark:text-[#C58AF9]">
              Whimsical Right · 02
            </span>
            <span className="rounded-full bg-[#8430CE]/10 px-1.5 py-0.2 font-mono text-[9px] font-bold text-[#8430CE] dark:bg-[#8430CE]/30 dark:text-[#C58AF9]">
              +100 pts
            </span>
          </div>
          <p className="font-display text-xs sm:text-sm font-extrabold tracking-tight">
            🎉 Quorum Fiesta
          </p>
          <span className="hidden sm:inline-block font-mono text-[9.5px] text-[#64748B] dark:text-[#94A3B8]">
            Fire dazzling confetti shower
          </span>
        </div>
      </motion.button>
    </>
  );
}
