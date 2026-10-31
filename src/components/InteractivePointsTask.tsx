'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CutePaperMascot } from './CutePaperMascot';

interface InteractivePointsTaskProps {
  onValidated?: () => void;
  className?: string;
}

export function InteractivePointsTask({
  onValidated,
  className = '',
}: InteractivePointsTaskProps) {
  const [progress, setProgress] = useState(0);
  const [isValidated, setIsValidated] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-play progress simulation loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    let timeout: NodeJS.Timeout;

    const startCycle = () => {
      setProgress(0);
      setIsValidated(false);

      const stepTime = 40;
      const totalSteps = 60; // 2.4s to complete
      let currentStep = 0;

      interval = setInterval(() => {
        currentStep++;
        const pct = Math.min(100, Math.round((currentStep / totalSteps) * 100));
        setProgress(pct);

        if (pct >= 100) {
          clearInterval(interval);
          setIsValidated(true);
          if (onValidated) onValidated();

          // Celebration confetti
          try {
            confetti({
              particleCount: 45,
              spread: 60,
              origin: { x: 0.35, y: 0.82 },
              colors: ['#3978F6', '#8FC9FF', '#22C55E', '#F59E0B'],
              disableForReducedMotion: true,
              zIndex: 9999,
            });
          } catch {
            // ignore
          }

          // Restart loop after 4 seconds
          timeout = setTimeout(() => {
            startCycle();
          }, 4500);
        }
      }, stepTime);
    };

    startCycle();

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onValidated]);

  const restart = () => {
    setProgress(0);
    setIsValidated(false);
    setTimeout(() => {
      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep += 2;
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsValidated(true);
            return 100;
          }
          return Math.min(100, prev + 2);
        });
      }, 35);
    }, 100);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden rounded-[24px] border border-white/15 bg-gradient-to-br from-[#0E1E42]/95 via-[#0B1733]/90 to-[#070F24]/95 p-6 text-white shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur-md transition-all hover:border-[#3978F6]/40 ${className}`}
    >
      {/* Top Header Row: TASK on left, SOLVER pts on right */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="font-mono text-[10px] font-extrabold uppercase tracking-widest text-[#8FC9FF]">
            Task
          </span>
          <h4 className="font-display mt-0.5 text-base sm:text-lg font-bold text-white tracking-tight">
            Fix authentication timeout
          </h4>
        </div>

        {/* Solver Points Badge */}
        <motion.div
          animate={
            isValidated
              ? { scale: [1, 1.12, 1], borderColor: '#3978F6' }
              : { scale: 1 }
          }
          transition={{ duration: 0.4 }}
          className="rounded-2xl border border-white/20 bg-white px-4 py-2 text-center text-[#0B1733] shadow-md"
        >
          <span className="block font-mono text-[10px] font-extrabold uppercase tracking-wider text-[#62708D]">
            Solver
          </span>
          <span
            className={`font-display text-base sm:text-lg font-extrabold tracking-tight transition-colors duration-300 ${
              isValidated ? 'text-[#3978F6]' : 'text-[#0B1733]'
            }`}
          >
            {isValidated ? '+1000 pts' : '0 pts'}
          </span>
        </motion.div>
      </div>

      {/* Progress Bar Container */}
      <div className="mt-5 space-y-2">
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-[#182C56]">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#3978F6] to-[#8FC9FF]"
            style={{ width: `${progress}%` }}
            transition={{ ease: 'linear' }}
          />
        </div>

        <div className="flex items-center justify-between text-xs font-medium">
          <span
            className={`font-mono text-[11px] font-bold transition-colors ${
              isValidated ? 'text-[#8FC9FF]' : 'text-slate-400'
            }`}
          >
            {isValidated ? 'Validated' : 'Working...'}
          </span>

          <span className="font-mono text-[11px] text-slate-400">
            {progress}%
          </span>
        </div>
      </div>

      {/* Mascot Area at Bottom */}
      <div className="relative mt-4 flex items-end justify-end pt-2">
        {/* Floating Checkmark Badge when Validated */}
        <AnimatePresence>
          {isValidated && (
            <motion.div
              initial={{ scale: 0, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', damping: 12, stiffness: 200 }}
              className="absolute right-[84px] bottom-14 z-20 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#3978F6] text-white shadow-lg"
            >
              <Check className="h-4 w-4 stroke-[3]" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cute Mascot */}
        <CutePaperMascot
          mood={isValidated ? 'celebrating' : 'working'}
          showFeet={true}
          showSparkles={isValidated}
          size={78}
          onClick={restart}
        />
      </div>

      {/* Quick Replay button on hover */}
      <button
        type="button"
        onClick={restart}
        title="Replay validation animation"
        aria-label="Replay validation animation"
        className="absolute bottom-3 left-4 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold text-slate-300 transition hover:bg-white/15 hover:text-white"
      >
        <RotateCcw className="h-3 w-3" />
        <span>Replay</span>
      </button>
    </div>
  );
}
