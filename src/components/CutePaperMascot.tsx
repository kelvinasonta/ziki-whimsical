'use client';

import React from 'react';
import { motion } from 'framer-motion';

export type MascotMood = 'happy' | 'working' | 'celebrating' | 'greeting';

interface CutePaperMascotProps {
  mood?: MascotMood;
  showFeet?: boolean;
  showPlanTag?: boolean;
  showSparkles?: boolean;
  className?: string;
  size?: number; // width in px, height scales accordingly
  onClick?: () => void;
}

export function CutePaperMascot({
  mood = 'greeting',
  showFeet = false,
  showPlanTag = false,
  showSparkles = true,
  className = '',
  size = 80,
  onClick,
}: CutePaperMascotProps) {
  const isHappy = mood === 'happy' || mood === 'greeting';
  const isCelebrating = mood === 'celebrating';
  const isWorking = mood === 'working';

  // Paper sheet dimensions (viewBox is 100 wide x 120 high when feet included, or 100 x 95 without)
  const vbHeight = showFeet ? 120 : 96;

  return (
    <div
      onClick={onClick}
      className={`relative inline-block select-none ${className} ${onClick ? 'cursor-pointer' : ''}`}
      style={{ width: size, height: (size * vbHeight) / 100 }}
    >
      {/* Floating Sparkles around the mascot */}
      {showSparkles && (
        <>
          {/* Sparkle Top-Left */}
          <motion.div
            animate={{
              scale: [0.8, 1.25, 0.8],
              opacity: [0.6, 1, 0.6],
              rotate: [0, 45, 0],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="pointer-events-none absolute -left-4 -top-3 z-10"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"
                fill="#3978F6"
              />
            </svg>
          </motion.div>

          {/* Sparkle Top-Right */}
          <motion.div
            animate={{
              scale: [1.2, 0.7, 1.2],
              opacity: [1, 0.5, 1],
              rotate: [45, 0, 45],
            }}
            transition={{
              duration: 2.6,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.5,
            }}
            className="pointer-events-none absolute -right-3 -top-2 z-10"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"
                fill="#8FC9FF"
              />
            </svg>
          </motion.div>
        </>
      )}

      {/* PLAN ~30 min Tag (as seen in Video 1) */}
      {showPlanTag && (
        <motion.div
          initial={{ opacity: 0, y: 6, scale: 0.9 }}
          animate={{
            opacity: 1,
            y: [0, -3, 0],
            scale: 1,
          }}
          transition={{
            y: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
            opacity: { duration: 0.3 },
          }}
          className="pointer-events-none absolute -top-8 -left-12 z-20 whitespace-nowrap rounded-lg border-[1.5px] border-[#3978F6] bg-white px-2 py-1 shadow-[0_4px_12px_rgba(57,120,246,0.18)]"
        >
          <div className="font-mono text-[9px] font-bold uppercase tracking-wider text-[#62708D]">
            Plan
          </div>
          <div className="font-sans text-[11px] font-extrabold text-[#0B1733]">
            ~30 min
          </div>
          {/* Connector stick to mascot hand */}
          <span className="absolute -bottom-2 right-2.5 h-2 w-[1.5px] bg-[#3978F6]" />
        </motion.div>
      )}

      {/* Mascot Body SVG */}
      <motion.svg
        viewBox={`0 0 100 ${vbHeight}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full overflow-visible"
        animate={
          isCelebrating
            ? {
                y: [0, -10, 0],
                rotate: [0, -3, 3, 0],
              }
            : isWorking
            ? {
                y: [0, -2, 0],
                rotate: [0, 1, -1, 0],
              }
            : {
                y: [0, -4, 0],
              }
        }
        transition={{
          duration: isCelebrating ? 0.8 : isWorking ? 1.2 : 2.8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Drop Shadow for body */}
        <defs>
          <filter id="paperShadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow
              dx="0"
              dy="4"
              stdDeviation="5"
              floodColor="#2B4E99"
              floodOpacity="0.16"
            />
          </filter>
        </defs>

        {/* Feet / Boots (when showFeet is true, like in Video 2) */}
        {showFeet && (
          <g className="feet-group">
            {/* Left Foot */}
            <motion.path
              d="M38 90 V105 H30"
              stroke="#0B1733"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={
                isWorking
                  ? { y: [0, -3, 0] }
                  : isCelebrating
                  ? { y: [0, -5, 0] }
                  : {}
              }
              transition={{
                duration: 0.6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            {/* Right Foot */}
            <motion.path
              d="M62 90 V105 H70"
              stroke="#0B1733"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={
                isWorking
                  ? { y: [-3, 0, -3] }
                  : isCelebrating
                  ? { y: [0, -5, 0] }
                  : {}
              }
              transition={{
                duration: 0.6,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.3,
              }}
            />
          </g>
        )}

        {/* Paper Sheet Body:
            Width: 70 (from x: 15 to 85)
            Height: 88 (from y: 6 to 94)
            Cut top-right corner from (70, 6) to (85, 21)
        */}
        <path
          d="M 27 6
             H 70
             L 85 21
             V 82
             Q 85 94 73 94
             H 27
             Q 15 94 15 82
             V 18
             Q 15 6 27 6
             Z"
          fill="#FFFFFF"
          stroke="#2563EB"
          strokeWidth="3.2"
          strokeLinejoin="round"
          filter="url(#paperShadow)"
        />

        {/* Folded Top-Right Corner Triangle */}
        <path
          d="M 70 6
             V 21
             H 85
             Z"
          fill="#EFF4FF"
          stroke="#2563EB"
          strokeWidth="3.2"
          strokeLinejoin="round"
        />

        {/* Bottom-left Hash Symbol '#' */}
        <text
          x="23"
          y="84"
          fill="#3978F6"
          fontSize="15"
          fontWeight="bold"
          fontFamily="system-ui, sans-serif"
          className="select-none"
        >
          #
        </text>

        {/* Eyes & Mouth Expressions */}
        {isWorking ? (
          /* Focused working face: bead eyes, determined mouth */
          <g>
            <circle cx="39" cy="46" r="3.2" fill="#0B1733" />
            <circle cx="61" cy="46" r="3.2" fill="#0B1733" />
            <path
              d="M 46 56 H 54"
              stroke="#0B1733"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </g>
        ) : (
          /* Happy / Celebrating / Greeting face: curved laughing eyes & wide smile */
          <g>
            {/* Left curved eye ^ */}
            <path
              d="M 34 47 Q 39 40 44 47"
              stroke="#0B1733"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            {/* Right curved eye ^ */}
            <path
              d="M 56 47 Q 61 40 66 47"
              stroke="#0B1733"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            {/* Cute mouth */}
            {isCelebrating ? (
              <path
                d="M 45 54 Q 50 63 55 54"
                stroke="#0B1733"
                strokeWidth="2.8"
                strokeLinecap="round"
                fill="#FF6B8B"
              />
            ) : (
              <path
                d="M 46 54 Q 50 59 54 54"
                stroke="#0B1733"
                strokeWidth="2.6"
                strokeLinecap="round"
                fill="none"
              />
            )}
          </g>
        )}

        {/* Arms / Hands */}
        {isWorking ? (
          /* Working arms: left hand gesturing or holding, right hand moving */
          <g>
            {/* Left arm bent */}
            <motion.path
              d="M 15 54 Q 5 56 6 48"
              stroke="#0B1733"
              strokeWidth="3.6"
              strokeLinecap="round"
              fill="none"
              animate={{ rotate: [-2, 3, -2] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* Right arm holding / reaching */}
            <motion.path
              d="M 85 54 Q 94 56 95 48"
              stroke="#0B1733"
              strokeWidth="3.6"
              strokeLinecap="round"
              fill="none"
              animate={{ rotate: [3, -2, 3] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </g>
        ) : (
          /* Arms raised up in joy (Video 1 & Video 2 celebration) */
          <g>
            {/* Left arm raised up */}
            <motion.path
              d="M 15 50 Q 8 38 7 24"
              stroke="#0B1733"
              strokeWidth="3.8"
              strokeLinecap="round"
              fill="none"
              animate={
                isCelebrating
                  ? { d: ['M 15 50 Q 6 36 6 18', 'M 15 50 Q 10 38 8 26', 'M 15 50 Q 6 36 6 18'] }
                  : { d: ['M 15 50 Q 8 38 7 24', 'M 15 50 Q 10 40 8 28', 'M 15 50 Q 8 38 7 24'] }
              }
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            {/* Right arm raised up */}
            <motion.path
              d="M 85 50 Q 92 38 93 24"
              stroke="#0B1733"
              strokeWidth="3.8"
              strokeLinecap="round"
              fill="none"
              animate={
                isCelebrating
                  ? { d: ['M 85 50 Q 94 36 94 18', 'M 85 50 Q 90 38 92 26', 'M 85 50 Q 94 36 94 18'] }
                  : { d: ['M 85 50 Q 92 38 93 24', 'M 85 50 Q 90 40 92 28', 'M 85 50 Q 92 38 93 24'] }
              }
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.1,
              }}
            />
          </g>
        )}
      </motion.svg>
    </div>
  );
}
