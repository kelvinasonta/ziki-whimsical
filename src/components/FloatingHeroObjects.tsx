'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingHeroObjectsProps {
  isDark: boolean;
  turboSwitch: boolean;
  activeFilter: string;
  burstKey: number;
  onTriggerBurst: (label: string) => void;
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
    </>
  );
}
