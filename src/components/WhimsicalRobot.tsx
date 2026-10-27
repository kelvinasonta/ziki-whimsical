'use client';

import React from 'react';

export type BotAccessory = 'none' | 'crown' | 'propeller' | 'hardhat' | 'antenna_star';
export type BotMood = 'happy' | 'working' | 'celebrating' | 'curious';

interface WhimsicalRobotProps {
  color?: 'orange' | 'blue' | 'emerald' | 'violet';
  mood?: BotMood;
  accessory?: BotAccessory;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const PALETTES = {
  orange: {
    bg: '#FFEDD5',
    body: '#F97316',
    dark: '#C2410C',
    cheek: '#FB7185',
    screen: '#FFF7ED',
  },
  blue: {
    bg: '#DBEAFE',
    body: '#2563EB',
    dark: '#1E40AF',
    cheek: '#60A5FA',
    screen: '#EFF6FF',
  },
  emerald: {
    bg: '#D1FAE5',
    body: '#10B981',
    dark: '#047857',
    cheek: '#34D399',
    screen: '#ECFDF5',
  },
  violet: {
    bg: '#EDE9FE',
    body: '#7C3AED',
    dark: '#5B21B6',
    cheek: '#F472B6',
    screen: '#F5F3FF',
  },
};

export function WhimsicalRobot({
  color = 'orange',
  mood = 'happy',
  accessory = 'none',
  size = 'md',
  className = '',
}: WhimsicalRobotProps) {
  const p = PALETTES[color];
  const dims =
    size === 'sm' ? 'h-11 w-11' : size === 'lg' ? 'h-20 w-20' : 'h-14 w-14';

  return (
    <div
      className={`relative inline-flex shrink-0 items-center justify-center rounded-2xl ${dims} ${className}`}
      style={{ backgroundColor: p.bg }}
    >
      <svg
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full p-1"
      >
        {/* Antenna */}
        <g className="antenna-wiggle">
          <line
            x1="40"
            y1="22"
            x2="40"
            y2="10"
            stroke={p.dark}
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx="40" cy="9" r="5" fill={p.body} stroke="#0F172A" strokeWidth="2.5" />
          {mood === 'celebrating' && (
            <>
              <circle cx="28" cy="8" r="2" fill="#FACC15" />
              <circle cx="52" cy="8" r="2" fill="#FACC15" />
            </>
          )}
        </g>

        {/* Optional Whimsical Hat / Accessory */}
        {accessory === 'crown' && (
          <path
            d="M27 22L30 11L36 17L40 9L44 17L50 11L53 22H27Z"
            fill="#FACC15"
            stroke="#0F172A"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
        )}
        {accessory === 'hardhat' && (
          <path
            d="M24 23C24 15 31 11 40 11C49 11 56 15 56 23H24Z"
            fill="#FBBF24"
            stroke="#0F172A"
            strokeWidth="2.2"
          />
        )}
        {accessory === 'propeller' && (
          <g>
            <ellipse
              cx="40"
              cy="9"
              rx="13"
              ry="3.5"
              fill="#38BDF8"
              stroke="#0F172A"
              strokeWidth="2"
            />
            <circle cx="40" cy="9" r="3" fill="#F43F5E" />
          </g>
        )}

        {/* Side Ears / Bolts */}
        <rect
          x="12"
          y="36"
          width="6"
          height="14"
          rx="3"
          fill={p.dark}
          stroke="#0F172A"
          strokeWidth="2.5"
        />
        <rect
          x="62"
          y="36"
          width="6"
          height="14"
          rx="3"
          fill={p.dark}
          stroke="#0F172A"
          strokeWidth="2.5"
        />

        {/* Robot Head Capsule */}
        <rect
          x="17"
          y="22"
          width="46"
          height="40"
          rx="14"
          fill={p.body}
          stroke="#0F172A"
          strokeWidth="3"
        />

        {/* Inner Face Visor */}
        <rect
          x="23"
          y="28"
          width="34"
          height="26"
          rx="9"
          fill={p.screen}
          stroke="#0F172A"
          strokeWidth="2.2"
        />

        {/* Rosy Cheeks */}
        <circle cx="28" cy="46" r="3" fill={p.cheek} opacity="0.65" />
        <circle cx="52" cy="46" r="3" fill={p.cheek} opacity="0.65" />

        {/* Expressive Eyes */}
        {mood === 'celebrating' ? (
          <>
            <path
              d="M29 39C30.5 36 33.5 36 35 39"
              stroke="#0F172A"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            <path
              d="M45 39C46.5 36 49.5 36 51 39"
              stroke="#0F172A"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
          </>
        ) : mood === 'working' ? (
          <>
            <rect x="28" y="36" width="7" height="4" rx="2" fill="#0F172A" />
            <rect x="45" y="36" width="7" height="4" rx="2" fill="#0F172A" />
          </>
        ) : (
          <>
            <circle cx="32" cy="38" r="3.5" fill="#0F172A" />
            <circle cx="33" cy="36.8" r="1.1" fill="#FFFFFF" />
            <circle cx="48" cy="38" r="3.5" fill="#0F172A" />
            <circle cx="49" cy="36.8" r="1.1" fill="#FFFFFF" />
          </>
        )}

        {/* Mouth */}
        {mood === 'curious' ? (
          <circle cx="40" cy="47" r="2.8" fill="#0F172A" />
        ) : (
          <path
            d="M35 46C36.8 49 43.2 49 45 46"
            stroke="#0F172A"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        )}
      </svg>
    </div>
  );
}
