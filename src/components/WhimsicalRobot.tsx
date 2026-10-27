'use client';

import React from 'react';

export type BotAccessory =
  | 'none'
  | 'crown'
  | 'propeller'
  | 'hardhat'
  | 'antenna_star';
export type BotMood = 'happy' | 'working' | 'celebrating' | 'curious';

interface WhimsicalRobotProps {
  color?: 'orange' | 'blue' | 'emerald' | 'violet';
  mood?: BotMood;
  accessory?: BotAccessory;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const PALETTES = {
  blue: {
    surface: '#E8F0FE',
    border: '#AECBFA',
    primary: '#1A73E8',
    secondary: '#4285F4',
    accent: '#8AB4F8',
    core: '#174EA6',
  },
  emerald: {
    surface: '#E6F4EA',
    border: '#A8DAB5',
    primary: '#1E8E3E',
    secondary: '#34A853',
    accent: '#81C995',
    core: '#0D652D',
  },
  orange: {
    surface: '#FEF7E0',
    border: '#FDE293',
    primary: '#E37400',
    secondary: '#F9AB00',
    accent: '#FDD663',
    core: '#B06000',
  },
  violet: {
    surface: '#F3E8FD',
    border: '#D7AEFB',
    primary: '#8430CE',
    secondary: '#A142F4',
    accent: '#C58AF9',
    core: '#5B1D99',
  },
};

export function WhimsicalRobot({
  color = 'blue',
  mood = 'happy',
  accessory = 'none',
  size = 'md',
  className = '',
}: WhimsicalRobotProps) {
  const p = PALETTES[color];
  const dims =
    size === 'sm' ? 'h-10 w-10' : size === 'lg' ? 'h-16 w-16' : 'h-12 w-12';

  return (
    <div
      className={`relative inline-flex shrink-0 items-center justify-center rounded-2xl border transition-transform duration-300 ${dims} ${className}`}
      style={{
        backgroundColor: p.surface,
        borderColor: p.border,
        boxShadow: `0 6px 18px -4px ${p.primary}26, inset 0 1px 0 0 rgba(255,255,255,0.85)`,
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 64 64"
        fill="none"
        className="h-full w-full p-1.5"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Precision Orbital Track */}
        <circle
          cx="32"
          cy="32"
          r="25"
          stroke={p.primary}
          strokeOpacity="0.24"
          strokeWidth="1.5"
          strokeDasharray={mood === 'working' ? '4 4' : '8 4'}
          className="gear-spin"
          style={{ transformOrigin: '32px 32px' }}
        />

        {/* Secondary Counter-Rotating Ring */}
        <circle
          cx="32"
          cy="32"
          r="20"
          stroke={p.secondary}
          strokeOpacity="0.35"
          strokeWidth="1.25"
          strokeDasharray="14 8"
          className="gear-spin-reverse"
          style={{ transformOrigin: '32px 32px' }}
        />

        {/* Sculpted Geometric Agent Core */}
        <rect
          x="16"
          y="16"
          width="32"
          height="32"
          rx="10"
          fill={p.primary}
          stroke="white"
          strokeWidth="1.5"
        />

        {/* Inner Glass Visor */}
        <rect
          x="20"
          y="22"
          width="24"
          height="16"
          rx="5"
          fill={p.core}
        />

        {/* Expressive Telemetry Eyes / Signal Wave */}
        {mood === 'celebrating' ? (
          <>
            <path
              d="M24 29L26.5 26.5L29 29"
              stroke="white"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M35 29L37.5 26.5L40 29"
              stroke="white"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M28 33.5C29.3 35 34.7 35 36 33.5"
              stroke={p.accent}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </>
        ) : mood === 'working' ? (
          <>
            <circle cx="26.5" cy="29.5" r="2.3" fill="white" />
            <circle cx="37.5" cy="29.5" r="2.3" fill="white" />
            <line
              x1="25"
              y1="34"
              x2="39"
              y2="34"
              stroke={p.accent}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </>
        ) : mood === 'curious' ? (
          <>
            <circle cx="26.5" cy="29.5" r="2.6" fill="white" />
            <circle cx="37.5" cy="28.5" r="2" fill="white" />
            <circle cx="32" cy="34" r="1.6" fill={p.accent} />
          </>
        ) : (
          <>
            <circle cx="26.5" cy="29.5" r="2.3" fill="white" />
            <circle cx="37.5" cy="29.5" r="2.3" fill="white" />
            <path
              d="M28.5 33.5C29.8 34.8 34.2 34.8 35.5 33.5"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </>
        )}

        {/* Role Specialization Micro-Badge */}
        {accessory === 'crown' && (
          <path
            d="M24 14L27.5 10L32 13.5L36.5 10L40 14H24Z"
            fill="#F9AB00"
            stroke="white"
            strokeWidth="1"
          />
        )}
        {accessory === 'propeller' && (
          <g>
            <circle cx="32" cy="11" r="2.5" fill={p.secondary} />
            <path
              d="M23 11H41"
              stroke={p.primary}
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </g>
        )}
        {accessory === 'hardhat' && (
          <path
            d="M23 15C23 11.2 27 9 32 9C37 9 41 11.2 41 15H23Z"
            fill="#1E8E3E"
          />
        )}
        {accessory === 'antenna_star' && (
          <circle
            cx="32"
            cy="10"
            r="3.2"
            fill="#F9AB00"
            stroke="white"
            strokeWidth="1.2"
          />
        )}

        {/* Orbital Node Satellite Dot */}
        <circle cx="53" cy="19" r="3" fill={p.secondary} />
      </svg>
    </div>
  );
}
