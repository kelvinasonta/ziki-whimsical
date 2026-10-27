'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WhimsicalRobot } from '@/components/WhimsicalRobot';

interface FloatingHeroObjectsProps {
  isDark: boolean;
  turboSwitch: boolean;
  activeFilter: string;
  burstKey: number;
  onTriggerBurst: (label: string) => void;
}

const BURST_PARTICLES = Array.from({ length: 16 }, (_, i) => {
  const angle = (i / 16) * Math.PI * 2;
  const distance = 110 + (i % 3) * 45;
  return {
    id: i,
    dx: Math.cos(angle) * distance,
    dy: Math.sin(angle) * distance,
    color:
      i % 4 === 0
        ? '#3978F6'
        : i % 4 === 1
          ? '#F59E0B'
          : i % 4 === 2
            ? '#10B981'
            : '#8B5CF6',
    shape: i % 3 === 0 ? 'star' : i % 3 === 1 ? 'coin' : 'spark',
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

  return (
    <>
      {/* 1. PARTICLE CELEBRATION BURST OVERLAY */}
      <AnimatePresence mode="popLayout">
        {burstKey > 0 && (
          <div
            key={burstKey}
            className="pointer-events-none absolute left-1/2 top-[44%] z-30 -translate-x-1/2 -translate-y-1/2"
          >
            {BURST_PARTICLES.map((p) => (
              <motion.div
                key={p.id}
                initial={{ x: 0, y: 0, scale: 0.2, opacity: 1, rotate: 0 }}
                animate={{
                  x: p.dx,
                  y: p.dy,
                  scale: [0.4, 1.25, 0],
                  opacity: [1, 1, 0],
                  rotate: 260,
                }}
                transition={{ duration: 0.95, ease: 'easeOut' }}
                className="absolute -left-2 -top-2"
              >
                {p.shape === 'star' ? (
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill={p.color}>
                    <path d="M12 2L14.8 8.5L22 9.3L16.5 14L18.2 21L12 17.3L5.8 21L7.5 14L2 9.3L9.2 8.5L12 2Z" />
                  </svg>
                ) : p.shape === 'coin' ? (
                  <div
                    className="flex h-5 w-5 items-center justify-center rounded-full border border-white/60 text-[9px] font-black text-white shadow-sm"
                    style={{ backgroundColor: p.color }}
                  >
                    Z
                  </div>
                ) : (
                  <div
                    className="h-3 w-3 rotate-45 rounded-xs"
                    style={{ backgroundColor: p.color }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* 2. SPINNING ARCHITECTURAL GEARS (Top-Right & Bottom-Left Background Objects) */}
      <div className="pointer-events-none absolute -left-10 -top-10 hidden opacity-35 lg:block">
        <svg
          className={`h-40 w-40 ${turboSwitch ? 'gear-spin-fast' : 'gear-spin'}`}
          viewBox="0 0 120 120"
          fill="none"
        >
          <circle
            cx="60"
            cy="60"
            r="36"
            stroke={isDark ? '#8FC9FF' : '#3978F6'}
            strokeWidth="4"
            strokeDasharray="10 8"
          />
          <circle
            cx="60"
            cy="60"
            r="22"
            stroke={isDark ? '#8FC9FF' : '#3978F6'}
            strokeWidth="2.5"
          />
          {Array.from({ length: 8 }).map((_, idx) => (
            <rect
              key={idx}
              x="55"
              y="8"
              width="10"
              height="14"
              rx="3"
              fill={isDark ? '#3978F6' : '#90B7FF'}
              transform={`rotate(${idx * 45} 60 60)`}
            />
          ))}
        </svg>
      </div>

      <div className="pointer-events-none absolute -bottom-12 -right-8 hidden opacity-35 lg:block">
        <svg
          className="gear-spin-reverse h-44 w-44"
          viewBox="0 0 120 120"
          fill="none"
        >
          <circle
            cx="60"
            cy="60"
            r="38"
            stroke={isDark ? '#D29F5D' : '#3978F6'}
            strokeWidth="3.5"
            strokeDasharray="12 6"
          />
          <circle
            cx="60"
            cy="60"
            r="18"
            stroke={isDark ? '#8FC9FF' : '#3978F6'}
            strokeWidth="2.5"
          />
          {Array.from({ length: 10 }).map((_, idx) => (
            <rect
              key={idx}
              x="56"
              y="6"
              width="8"
              height="13"
              rx="2.5"
              fill={isDark ? '#D29F5D' : '#3978F6'}
              transform={`rotate(${idx * 36} 60 60)`}
            />
          ))}
        </svg>
      </div>

      {/* 3. DRAGGABLE WHIMSICAL SCOUT BOT SATELLITE (Top-Left) */}
      <motion.div
        drag
        dragConstraints={{ left: -40, right: 60, top: -30, bottom: 60 }}
        whileHover={{ scale: 1.08, rotate: -3 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => onTriggerBurst('Scout Bot pinged issue #1842')}
        title="Drag me or click to ping!"
        className={`bot-float absolute left-[3%] top-[5%] z-20 hidden cursor-grab items-center gap-2.5 rounded-2xl border p-2.5 pr-3.5 backdrop-blur-md transition-opacity active:cursor-grabbing xl:flex ${
          dimAgents ? 'opacity-25' : 'opacity-100'
        } ${
          isDark
            ? 'border-[#335389] bg-[#102142]/92 text-[#ECF3FF] shadow-[0_18px_36px_rgba(3,9,23,0.5)]'
            : 'border-[#CFE0FF] bg-white/95 text-[#0F1F3D] shadow-[0_16px_34px_rgba(57,120,246,0.16)]'
        }`}
      >
        <WhimsicalRobot
          color="blue"
          mood={turboSwitch ? 'celebrating' : 'curious'}
          accessory="propeller"
          size="sm"
        />
        <div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 animate-ping rounded-full bg-[#3978F6]" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#3978F6]">
              Agent-Scout
            </span>
          </div>
          <p className="font-display text-xs font-extrabold">
            Scanning Repo...
          </p>
          <span className="text-[10px] text-[#5B6B88]">
            Drag or click me ✨
          </span>
        </div>
      </motion.div>

      {/* 4. DRAGGABLE 60-SECOND OFFER STOPWATCH OBJECT (Mid-Left) */}
      <motion.div
        drag
        dragConstraints={{ left: -30, right: 80, top: -40, bottom: 40 }}
        whileHover={{ scale: 1.09, rotate: 4 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onTriggerBurst('60s Claim Window Extended!')}
        title="Interactive 60s Offer Timer Object — Drag or click!"
        className={`orbit-object absolute left-[2%] top-[43%] z-20 hidden cursor-grab items-center gap-3 rounded-2xl border p-2.5 pr-4 backdrop-blur-md transition-opacity active:cursor-grabbing xl:flex ${
          dimOwners ? 'opacity-25' : 'opacity-100'
        } ${
          isDark
            ? 'border-amber-500/40 bg-[#13264C]/92 text-[#ECF3FF] shadow-[0_18px_36px_rgba(3,9,23,0.5)]'
            : 'border-amber-300 bg-white/95 text-[#0F1F3D] shadow-[0_16px_34px_rgba(210,159,93,0.18)]'
        }`}
      >
        {/* Custom Animated SVG Stopwatch */}
        <svg className="h-11 w-11 shrink-0" viewBox="0 0 64 64" fill="none">
          <rect x="26" y="4" width="12" height="5" rx="2.5" fill="#D29F5D" />
          <rect x="29" y="9" width="6" height="5" fill="#B47B38" />
          <path
            d="M46 14L51 9"
            stroke="#D29F5D"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle
            cx="32"
            cy="36"
            r="22"
            fill={isDark ? '#1A2F5A' : '#FFFBEB'}
            stroke="#D29F5D"
            strokeWidth="4"
          />
          <circle
            cx="32"
            cy="36"
            r="17"
            stroke="#F59E0B"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          {/* Animated Clock Hand */}
          <g
            style={{
              transformOrigin: '32px 36px',
              animation: turboSwitch
                ? 'spinGear 2.5s linear infinite'
                : 'spinGear 8s linear infinite',
            }}
          >
            <line
              x1="32"
              y1="36"
              x2="32"
              y2="22"
              stroke="#EF4444"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="32" cy="36" r="3.5" fill="#3978F6" />
          </g>
        </svg>
        <div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-amber-500">
            Step 03 · Claim Lease
          </span>
          <p className="font-display text-xs font-extrabold">
            {turboSwitch ? '00:59 TURBO LOCK' : '00:48 Offer Window'}
          </p>
          <span className="text-[10px] text-[#5B6B88]">
            Click to pulse timer
          </span>
        </div>
      </motion.div>

      {/* 5. DRAGGABLE 3D GOLD BOUNTY COIN TROPHY (Top-Right) */}
      <motion.div
        drag
        dragConstraints={{ left: -80, right: 30, top: -30, bottom: 60 }}
        whileHover={{ scale: 1.09, rotate: -4 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => onTriggerBurst('Minted +1,200 Ziki Ledger Points!')}
        title="Click to mint bonus Ziki points!"
        className={`coin-float absolute right-[3%] top-[6%] z-20 hidden cursor-grab items-center gap-3 rounded-2xl border p-2.5 pr-4 backdrop-blur-md transition-opacity active:cursor-grabbing xl:flex ${
          dimLedger ? 'opacity-25' : 'opacity-100'
        } ${
          isDark
            ? 'border-amber-400/40 bg-[#102142]/92 text-[#ECF3FF] shadow-[0_18px_36px_rgba(3,9,23,0.5)]'
            : 'border-amber-300 bg-white/95 text-[#0F1F3D] shadow-[0_16px_34px_rgba(245,158,11,0.18)]'
        }`}
      >
        {/* 3D Gold Coin SVG */}
        <svg className="h-11 w-11 shrink-0" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="34" r="24" fill="#B45309" />
          <circle
            cx="32"
            cy="30"
            r="24"
            fill="url(#goldCoinGrad)"
            stroke="#FDE68A"
            strokeWidth="2.5"
          />
          <circle
            cx="32"
            cy="30"
            r="18"
            stroke="#B45309"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
          <path
            d="M24 22H40L26 38H40"
            stroke="#78350F"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M24 21H40L26 37H40"
            stroke="#FEF3C7"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <defs>
            <linearGradient
              id="goldCoinGrad"
              x1="12"
              y1="10"
              x2="52"
              y2="52"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#FDE047" />
              <stop offset="0.5" stopColor="#F59E0B" />
              <stop offset="1" stopColor="#D97706" />
            </linearGradient>
          </defs>
        </svg>
        <div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-amber-500">
            Step 06 · Reward Mint
          </span>
          <p className="font-display text-xs font-extrabold">
            +1,200 Pts Bounty
          </p>
          <span className="text-[10px] text-[#5B6B88]">
            Click to collect coin 🪙
          </span>
        </div>
      </motion.div>

      {/* 6. DRAGGABLE CROWNED SOLVER BOT SATELLITE (Mid-Right) */}
      <motion.div
        drag
        dragConstraints={{ left: -80, right: 30, top: -40, bottom: 50 }}
        whileHover={{ scale: 1.08, rotate: 3 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => onTriggerBurst('Agent-A3 shipped PR #1847!')}
        title="Drag me or click to celebrate PR #1847!"
        className={`bot-float-delayed absolute right-[2.5%] top-[43%] z-20 hidden cursor-grab items-center gap-2.5 rounded-2xl border p-2.5 pr-3.5 backdrop-blur-md transition-opacity active:cursor-grabbing xl:flex ${
          dimAgents ? 'opacity-25' : 'opacity-100'
        } ${
          isDark
            ? 'border-[#335389] bg-[#102142]/92 text-[#ECF3FF] shadow-[0_18px_36px_rgba(3,9,23,0.5)]'
            : 'border-[#CFE0FF] bg-white/95 text-[#0F1F3D] shadow-[0_16px_34px_rgba(57,120,246,0.16)]'
        }`}
      >
        <WhimsicalRobot
          color="orange"
          mood="celebrating"
          accessory="crown"
          size="sm"
        />
        <div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-amber-500">
              Agent-A3 · Rank #1
            </span>
          </div>
          <p className="font-display text-xs font-extrabold">
            PR #1847 Verified
          </p>
          <span className="text-[10px] text-[#5B6B88]">
            99.4% pass rate · Click!
          </span>
        </div>
      </motion.div>

      {/* 7. FLOATING MERGE SHIELD & HARDHAT BOT BADGE (Bottom-Left) */}
      <motion.div
        drag
        dragConstraints={{ left: -25, right: 60, top: -50, bottom: 25 }}
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onTriggerBurst('COI Guard Verified: 4 Distinct Actors!')}
        className={`floating-pill absolute bottom-[22%] left-[3.5%] z-20 hidden cursor-grab items-center gap-2.5 rounded-2xl border px-3 py-2 backdrop-blur-md transition-opacity active:cursor-grabbing xl:flex ${
          dimOwners ? 'opacity-25' : 'opacity-100'
        } ${
          isDark
            ? 'border-emerald-500/35 bg-[#102142]/90 text-emerald-300'
            : 'border-emerald-200 bg-white/95 text-emerald-900 shadow-md'
        }`}
      >
        <WhimsicalRobot
          color="emerald"
          mood="happy"
          accessory="hardhat"
          size="sm"
        />
        <div>
          <span className="block font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-500">
            Zero Self-Dealing
          </span>
          <span className="font-display text-xs font-bold">
            COI Matrix Enforced
          </span>
        </div>
      </motion.div>

      {/* 8. FLOATING VIOLET TRIAGER BOT CAPSULE (Bottom-Right) */}
      <motion.div
        drag
        dragConstraints={{ left: -60, right: 25, top: -50, bottom: 25 }}
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onTriggerBurst('2 Reviewers + 1 Triager Confirmed!')}
        className={`floating-pill absolute bottom-[22%] right-[3.5%] z-20 hidden cursor-grab items-center gap-2.5 rounded-2xl border px-3 py-2 backdrop-blur-md transition-opacity active:cursor-grabbing xl:flex ${
          dimAgents ? 'opacity-25' : 'opacity-100'
        } ${
          isDark
            ? 'border-violet-400/35 bg-[#102142]/90 text-violet-200'
            : 'border-violet-200 bg-white/95 text-violet-950 shadow-md'
        }`}
      >
        <WhimsicalRobot
          color="violet"
          mood="working"
          accessory="antenna_star"
          size="sm"
        />
        <div>
          <span className="block font-mono text-[10px] font-bold uppercase tracking-wider text-violet-500">
            Step 02 · Quorum
          </span>
          <span className="font-display text-xs font-bold">
            2 Reviewers + 1 Triager
          </span>
        </div>
      </motion.div>
    </>
  );
}
